const asyncHandler = require("express-async-handler");
const Task = require("../Models/TaskModel");
const User = require("../Models/UserModel");
const UserTask = require("../Models/UserTaskModel");

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.findAll();
  return res.status(200).json({
    success: "true",
    message: "List of all tasks",
    data: {
      Tasks: tasks,
    },
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  const ownerId = req.userInfo.id;
  const utcDueDate = dueDate ? new Date(dueDate).toISOString() : null;

  if (!title) {
    res.status(401);
    throw new Error("Please provide title of task");
  }

  const task = await Task.create({
    title: title,
    description: description,
    dueDate: utcDueDate,
    priority: priority,
    status: status,
  });

  await UserTask.create({
    userId: ownerId,
    taskId: task.id,
    role: "Owner",
  });

  return res.status(200).json({
    success: "true",
    message: "Create task successfully!",
    data: {
      Task: {
        id: task.id,
        title: title,
        description: description,
        dueDate: utcDueDate,
        priority: priority,
        status: status,
      },
    },
  });
});

// Get task of user
const getTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await Task.findOne({
    include: {
      model: User,
      attributes: ["id", "email", "userName", "fullName"],
      through: {
        attributes: ["role"],
      },
    },
    required: true,
    where: {
      id: taskId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  return res.status(200).json({
    success: "true",
    message: "Tasks retrieved successfully!",
    data: {
      Task: task,
    },
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate, priority } = req.body;
  const task = req.task;
  const now = new Date();
  const utcDueDate = dueDate ? new Date(dueDate).toISOString() : null;

  await task.update({
    title: title || task.title,
    description: description || task.description,
    status: status || task.status,
    dueDate: utcDueDate,
    priority: priority || task.priority,
    isExpired: utcDueDate <= now,
  });

  return res.status(200).json({
    success: "true",
    message: "Tasks updated successfully!",
    data: {
      Task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: utcDueDate,
        priority: task.priority,
      },
    },
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = req.task;

  if (!status) {
    res.json(400);
    throw new Error("Please provide status");
  }

  await task.update({
    status: status || task.status,
  });

  return res.status(200).json({
    success: "true",
    message: "Status changed successfully!",
    data: {
      Task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      },
    },
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = req.task;

  await task.destroy();
  return res.status(200).json({
    success: "true",
    message: "Delete task successfully!",
    data: {},
  });
});

// Add user to task
const addUser = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const { role, email } = req.body;
  const validRole = ["Owner", "Member"];

  if (!validRole.includes(role)) {
    res.status(400);
    throw new Error("Role just owner or member");
  }

  // user is information of user will be add
  const user = await User.findOne({
    where: {
      email: email,
    },
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isUserExistInTask = await UserTask.findOne({
    where: {
      userId: user.id,
      taskId: taskId,
    },
  });

  if (isUserExistInTask) {
    res.status(400);
    throw new Error("User already add to task");
  }

  const userTask = await UserTask.create({
    userId: user.id,
    taskId: taskId,
    role: role || "Member",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return res.status(200).json({
    success: "true",
    message: "Add user to project successfully!",
    data: {
      UserTask: {
        userId: user.id,
        taskId: taskId,
        role: role || "Member",
      },
    },
  });
});

const getUsersOfTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const users = await User.findAll({
    include: {
      model: Task,
      where: {
        id: taskId,
      },
      attributes: [],
    },
    attributes: ["email", "userName", "fullName"],
    required: true,
  });

  return res.json({
    success: "true",
    message: "User of task retrived successfully!",
    data: {
      Users: users,
    },
  });
});

const getTasksOfUser = asyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const tasks = await Task.findAll({
    include: {
      model: User,
      where: {
        id: userId,
      },
      attributes: [],
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    required: true,
  });

  return res.json({
    success: "true",
    message: "Task of user retrived successfully!",
    data: {
      Tasks: tasks,
    },
  });
});

const removeUser = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.params.userId;
  const ownerId = req.userInfo.id;

  if (userId == ownerId) {
    res.status(400);
    throw new Error("Cannot remove yourself!");
  }

  await UserTask.destroy({
    where: {
      userId: userId,
      taskId: taskId,
    },
  });

  return res.status(200).json({
    success: "true",
    message: "Remove user successfully!",
    data: {},
  });
});

const changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const userId = req.params.userId;
  const taskId = req.params.taskId;
  const ownerId = req.userInfo.id;

  if (!role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  if (userId == ownerId) {
    res.status(400);
    throw new Error("Cannot change your role!");
  }

  //Check if role value is valid
  const validRole = ["Owner", "Member"];

  if (!validRole.includes(role)) {
    res.status(400);
    throw new Error("Role is invalid");
  }

  const userTask = await UserTask.findOne({
    where: {
      userId: userId,
      taskId: taskId,
    },
  });

  if (!userTask) {
    res.status(404);
    throw new Error("User is not member of task");
  }

  await userTask.update({
    role: role,
  });

  return res.status(200).json({
    success: "true",
    message: "Change role successfully!",
    data: {},
  });
});

const getTasksByStatusAndPriority = asyncHandler(async (req, res) => {
  const status = req.params.status;
  const priority = req.params.priority;
  const userId = req.userInfo.id;

  const validStatus = ["All", "Pending", "InProgress", "Completed", "OnHold"];

  const validPriority = ["All", "High", "Low", "Medium"];

  if (!status || !validStatus.includes(status)) {
    res.status(400);
    throw new Error("Please provide valid status");
  }

  if (!priority || !validPriority.includes(priority)) {
    res.status(400);
    throw new Error("Please provide valid priority");
  }

  const whereCondition = {};

  if (status !== "All") whereCondition.status = status;
  if (priority !== "All") whereCondition.priority = priority;

  const tasks = await Task.findAll({
    include: {
      model: User,
      where: {
        id: userId,
      },
      attributes: [],
    },
    where: whereCondition,
    attributes: ["id", "title", "description", "status", "dueDate", "priority"],
  });

  return res.status(200).json({
    success: "true",
    message: "Task retrieved successfully!",
    data: {
      Tasks: tasks,
    },
  });
});

module.exports = {
  getTasks,
  getTasksByStatusAndPriority,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  addUser,
  getUsersOfTask,
  getTasksOfUser,
  removeUser,
  changeRole,
  updateStatus,
};
