const sequelize = require("../Config/db");
const { DataTypes } = require("sequelize");

const Task = sequelize.define(
  "Task",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("Pending", "InProgress", "Completed", "OnHold"),
      allowNull: false,
      defaultValue: "Pending",
    },
    dueDate: {
      type: DataTypes.DATE,
      validate: {
        isAfter: new Date().toISOString(),
      },
    },
    priority: {
      type: DataTypes.ENUM("High", "Medium", "Low"),
      allowNull: false,
      defaultValue: "Low",
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = Task;
