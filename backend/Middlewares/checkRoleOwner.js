const User = require("../Models/UserModel");
const Task = require("../Models/TaskModel");
const expressAsyncHandler = require("express-async-handler");
const UserTask = require("../Models/UserTaskModel");

// Check if user or project is exist
// Check if the user (with id in req.user) is the owner of the project (with id from url)
const checkRoleOwner = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const user = await User.findByPk(userId);
  const task = await Task.findByPk(taskId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!task) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isOwner = await UserTask.findOne({
    where: {
      userId: userId,
      taskId: taskId,
      role: "Owner",
    },
  });

  if (!isOwner) {
    res.status(403);
    throw new Error("User is not owner. Just owner can edit project!");
  }

  req.task = task;

  next();
});

module.exports = checkRoleOwner;
