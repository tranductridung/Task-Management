const sequelize = require("../Config/db");
const { DataTypes } = require("sequelize");
const User = require("./UserModel");

const Token = sequelize.define("Token", {
  refreshToken: DataTypes.TEXT,
  expiredAt: DataTypes.DATE,
});

Token.belongsTo(User);
User.hasOne(Token);

module.exports = Token;
