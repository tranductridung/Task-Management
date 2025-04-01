const { Op } = require("sequelize");
const cron = require("node-cron");
const Task = require("../Models/TaskModel");
const { sendEmail } = require("../Config/emailService");
const User = require("../Models/UserModel");

// Chạy cron job mỗi phút để kiểm tra task hết hạn
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

      console.log(`;;;;;;;;;;;;;;;;;;;${taskTitle};;;;;;;;;;;;;;;;;;;`);
      users.map((user, index) => {
        to, subject, text;
        const email = user.dataValues.email;
        sendEmail(email, `Task expired`, `The task ${taskTitle} is expired!`);
      });

      await task.update({ isExpired: true });
    });
  } catch (error) {
    console.error("❌ Lỗi khi chạy cron job:", error);
  }
});
