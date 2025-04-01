const sequelize = require("../Config/db");
const { DataTypes } = require("sequelize");
const User = require("./UserModel");
const Task = require("./TaskModel");

const UserTask = sequelize.define(
  "UserTask",
  {
    role: {
      type: DataTypes.ENUM("Owner", "Member"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.belongsToMany(Task, { through: UserTask, foreignKey: "userId" });
Task.belongsToMany(User, { through: UserTask, foreignKey: "taskId" });

module.exports = UserTask;
