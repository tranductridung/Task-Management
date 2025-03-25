const cron = require("node-cron");
const Task = require("./models/Task");
const sendEmail = require("./mailer");

// Chạy mỗi 1 giờ
cron.schedule("0 * * * *", async () => {
  console.log("🔍 Checking for due tasks...");

  try {
    const tasks = await Task.findAll({
      where: {
        due_date: {
          [require("sequelize").Op.lte]: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ),
        },
        status: "pending",
      },
    });

    tasks.forEach((task) => {
      const message = `Task "${task.title}" is due soon! Please complete it before ${task.due_date}.`;
      sendEmail(task.assigned_to, "Task Reminder", message);
    });
  } catch (error) {
    console.error("Database error:", error);
  }
});
