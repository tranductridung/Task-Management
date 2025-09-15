const { Op } = require("sequelize");
const cron = require("node-cron");
const Task = require("../Models/TaskModel");
const sendEmail = require("../Config/emailService");
const User = require("../Models/UserModel");

// Run cron job every 5 minutes to check for expired tasks
cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    const expiredTasks = await Task.findAll({
      where: {
        isExpired: false,
        dueDate: { [Op.lte]: now },
      },
      include: {
        model: User,
        attributes: ["email"],
        through: {
          attributes: [],
        },
      },
      required: true,
      attributes: ["id", "title", "isExpired"],
    });

    const taskData = expiredTasks.forEach(async (task) => {
      const taskTitle = task.dataValues.title;
      const users = task.dataValues.Users;

      users.map((user, index) => {
        const email = user.dataValues.email;
        sendEmail(email, `Task expired`, `The task ${taskTitle} is expired!`);
      });

      await task.update({ isExpired: true });
    });
  } catch (error) {
    console.error("❌ Cron job error:", error);
  }
});
