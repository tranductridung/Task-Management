const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    userName: DataTypes.STRING,
    fullName: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { timestamps: true }
);

module.exports = User;
