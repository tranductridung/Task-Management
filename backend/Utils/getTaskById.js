const sequelize = require("../Config/db");
const asyncHandler = require("express-async-handler");
const Task = require("../Models/TaskModel");
const User = require("../Models/UserModel");

// Get task by userId and taskId
const getTaskById = asyncHandler(async (req, res, userId, taskId) => {
  const task = await Task.findOne({
    include: {
      model: User,
      where: {
        id: userId,
      },
      attributes: {
        exclude: ["password"],
      },
    },
    required: true,
    where: {
      id: taskId,
    },
  });

  console.log(task);
  if (!task) {
    console.log(task);
    res.status(404);
    throw new Error("Task not found");
  }

  return task;
});

module.exports = getTaskById;
