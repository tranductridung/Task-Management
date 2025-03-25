require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const User = require("../Models/UserModel");
const Token = require("../Models/TokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const calculateExpirationTime = require("../Utils/calculateExpirationTime");
const validator = require("validator");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });

  return res.json(users);
});

const getUser = asyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user || user.length === 0) {
    res.status(404);
    throw new Error("User not found");
  }
  return res.status(200).json(user);
});

const register = asyncHandler(async (req, res) => {
  const { email, userName, firstName, lastName, password } = req.body;

  if (!email || !userName || !firstName || !lastName || !password) {
    res.status(401);
    throw new Error("All field are mandatory");
  }

  const isValidEmail = validator.isEmail(email);

  if (!isValidEmail) {
    res.status(400);
    throw new Error("Email is invalid");
  }

  const isEmailExist = await User.findOne({
    where: {
      email: email,
    },
  });

  if (isEmailExist) {
    res.status(401);
    throw new Error("Email has been registered.");
  }

  const user = await User.create({
    email: email,
    userName: userName,
    firstName: firstName,
    lastName: lastName,
    password: await bcrypt.hash(password, 10),
  });

  return res.status(200).json(user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        userID: user.id,
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
      }
    );
    const refreshToken = jwt.sign(
      {
        userID: user.id,
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: process.env.EXPIRED_REFRESH_TOKEN,
      }
    );

    await Token.create({
      UserId: user.id,
      refreshToken: refreshToken,
      expiredAt: calculateExpirationTime().toDate(),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: "Strict",
      maxAge: process.env.MAX_AGE * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken: accessToken,
      id: user.id,
      userName: user.userName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  res.status(401);
  throw new Error("Email or password incorrect");
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = req.userInfo;
  await user.destroy();

  return res.status(200).json("User is deleted");
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const { userName, firstName, lastName } = req.body;
  const user = req.user;

  if (userName) {
    const isUserNameExist = await User.findOne({
      where: {
        userName: userName,
        id: { [Op.ne]: userId },
      },
    });

    if (isUserNameExist) {
      res.status(400);
      throw new Error("Username is exist");
    }
  }

  const updateUser = await user.update({
    userName: userName || user.userName,
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    updateAt: new Date(),
  });

  return res.json({
    userName: updateUser.userName,
    firstName: updateUser.firstName,
    lastName: updateUser.lastName,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Password incorrect");
  }

  user.update({
    password: await bcrypt.hash(newPassword, 10),
  });

  return res.status(200).json({
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Check if token exists
  const refreshTokenExisting = await Token.findOne({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!refreshToken) {
    res.status(401);
    throw new Error("Refresh Token is expired");
  }

  const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

  // Check if user exists
  const userExisting = await User.findOne({
    where: {
      id: user.userID,
    },
  });

  if (!userExisting) {
    res.status(404);
    throw new Error("User not found");
  }

  const accessToken = jwt.sign(
    {
      userID: user.userID,
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: process.env.EXPIRED_ACCESS_TOKEN }
  );

  return res.json({ accessToken: accessToken });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(404);
    throw new Error("Refresh token not found!");
  }

  const token = await Token.destroy({
    where: {
      refreshToken: refreshToken,
    },
  });

  // Delete refresh token in cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json("Logout successfully!");
});

const verifyToken = asyncHandler(async (req, res) => {
  console.log("-------", req.userInfo);
  res.json({
    id: req.userInfo.id,
    email: req.userInfo.email,
    userName: req.userInfo.userName,
    firstName: req.userInfo.firstName,
    lastName: req.userInfo.lastName,
  });
});

module.exports = {
  verifyToken,
  logout,
  changePassword,
  refreshToken,
  getUsers,
  getUser,
  login,
  deleteUser,
  updateUser,
  register,
};
