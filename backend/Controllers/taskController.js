const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Task = require("../Models/TaskModel");
const User = require("../Models/UserModel");
const UserTask = require("../Models/UserTaskModel");
const Tag = require("../Models/TagModel");
const Comment = require("../Models/CommentModel");

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.findAll();
  return res.status(200).json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
  console.log("dsfhlaskdfj");
  const { title, description, expiration, priority, status } = req.body;
  const ownerId = req.userInfo.id;

  if (!title) {
    res.status(401);
    throw new Error("Please provide title of task");
  }

  const task = await Task.create({
    title: title,
    description: description,
    expiration: expiration,
    priority: priority,
    status: status,
  });

  const userTask = await UserTask.create({
    userId: ownerId,
    taskId: task.id,
    role: "owner",
  });

  return res.status(200).json(task);
});

// Get tasks of user
const getTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.userInfo.id;

  // const task = await getTaskById(req, res, userId, taskId);

  const task = await Task.findOne({
    include: [
      {
        model: User,
        attributes: ["id", "email", "userName", "lastName", "firstName"],
        through: {
          attributes: ["role"],
        },
      },
      {
        model: Tag,
        attributes: {
          exclude: ["taskId", "createdAt", "updatedAt"],
        },
      },
    ],
    required: true,
    where: {
      id: taskId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (!task) {
    console.log(task);
    res.status(404);
    throw new Error("Task not found");
  }

  return res.json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, expiration, priority } = req.body;
  const task = req.task;

  await task.update({
    title: title || task.title,
    description: description || task.description,
    status: status || task.status,
    expiration: expiration || task.expiration,
    priority: priority || task.priority,
  });

  return res.json(task);
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

  return res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = req.task;

  await task.destroy();
  return res.json("Delete task successfully!");
});

// Add user to task
const addUser = asyncHandler(async (req, res) => {
  // const userId = req.params.userId;
  const taskId = req.params.taskId;
  const { role, email } = req.body;
  const validRole = ["owner", "member"];

  if (!validRole.includes(role)) {
    res.status(400);
    throw new Error("Role just owner or member");
  }

  const user = await User.findOne({
    where: {
      email: email,
    },
    attributes: {
      exclude: ["password"],
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
    role: role || "member",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return res.status(200).json(userTask);
});

const getUsersInTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const users = await User.findAll({
    include: {
      model: Task,
      where: {
        id: taskId,
      },
      attributes: [],
    },
    attributes: ["email", "userName", "firstName", "lastName"],
    required: true,
  });

  return res.json(users);
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
    required: true,
  });

  return res.json({ tasks: tasks });
});

const removeUser = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.params.userId;
  const ownerId = req.userInfo.id;

  if (userId == ownerId) {
    res.status(401);
    throw new Error("Cannot remove yourself!");
  }

  await UserTask.destroy({
    where: {
      userId: userId,
      taskId: taskId,
    },
  });

  return res.status(200).json("Remove user successfully!");
});

const changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const userId = req.params.userId;
  const taskId = req.params.taskId;
  const ownerId = req.userInfo.id;

  if (userId == ownerId) {
    res.status(400);
    throw new Error("Cannot change role by yourself");
  }

  if (!role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //Check if role value is valid
  const validRole = ["owner", "member"];

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

  return res.status(200).json("Change role successfully!");
});

const getTasksByPriority = asyncHandler(async (req, res) => {
  const priority = req.params.priority;
  const userId = req.userInfo.id;

  if (!priority || !["High", "Medium", "Low"].includes(priority)) {
    res.status(400);
    throw new Error("");
  }

  const tasks = await Task.findAll({
    include: {
      model: User,
      where: {
        id: userId,
      },
      attributes: [],
    },
    where: {
      priority: priority,
    },
  });
  res.json({ tasks: tasks });
});

const getTasksByStatus = asyncHandler(async (req, res) => {
  const status = req.params.status;
  const userId = req.userInfo.id;
  const validStatus = [
    "Pending",
    "InProgress",
    "Completed",
    "OnHold",
    "Cancelled",
    "Failed",
    "Scheduled",
    "Delayed",
  ];

  if (!status || !validStatus.includes(status)) {
    res.status(400);
    throw new Error("");
  }

  const tasks = await Task.findAll({
    include: {
      model: User,
      where: {
        id: userId,
      },
      attributes: [],
    },
    where: {
      status: status,
    },
  });
  res.json({ tasks: tasks });
});

const getTasksByStatusAndPriority = asyncHandler(async (req, res) => {
  const status = req.params.status;
  const priority = req.params.priority;
  const userId = req.userInfo.id;

  const validStatus = [
    "All",
    "Pending",
    "InProgress",
    "Completed",
    "OnHold",
    "Cancelled",
    "Failed",
    "Scheduled",
    "Delayed",
  ];

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

  // return res.json(whereCondition);

  const tasks = await Task.findAll({
    include: {
      model: User,
      where: {
        id: userId,
      },
      attributes: [],
    },
    where: whereCondition,
  });
  res.json({ tasks: tasks });
});

module.exports = {
  getTasks,
  getTasksByPriority,
  getTasksByStatusAndPriority,
  getTasksByStatus,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  addUser,
  getUsersInTask,
  getTasksOfUser,
  removeUser,
  changeRole,
  updateStatus,
};
