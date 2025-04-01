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
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });

  return res.json({
    success: "true",
    message: "List of users retrieved successfully!",
    data: {
      users: users,
    },
  });
});

const getUser = asyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });

  return res.json({
    success: "true",
    message: "User information retrieved successfully!",
    data: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userName: user.userName,
    },
  });
});

const register = asyncHandler(async (req, res) => {
  const { email, userName, fullName, password } = req.body;

  if (!email || !userName || !fullName || !password) {
    res.status(400);
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
    throw new Error("Email has been used.");
  }

  const user = await User.create({
    email: email,
    userName: userName,
    fullName: fullName,
    password: await bcrypt.hash(password, 10),
  });

  return res.status(200).json({
    success: "true",
    message: "Register successfully!",
    data: {
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        fullName: user.fullName,
      },
    },
  });
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
        fullName: user.fullName,
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
        fullName: user.fullName,
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
      secure: false,
      sameSite: "Strict",
      maxAge: process.env.MAX_AGE * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: "true",
      message: "Login successfully!",
      data: {
        accessToken: accessToken,
        User: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          fullName: user.fullName,
        },
      },
    });
  }

  res.status(401);
  throw new Error("Email or password incorrect");
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.userInfo.id;

  await User.destroy({
    where: {
      id: userId,
    },
  });

  return res.status(200).json({
    success: "true",
    message: "User is deleted",
    data: {},
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const { userName, fullName } = req.body;
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
    fullName: fullName || user.fullName,
    updateAt: new Date(),
  });

  return res.json({
    success: "true",
    message: "User information update successfully!",
    data: {
      user: {
        userName: updateUser.userName,
        fullName: updateUser.fullName,
      },
    },
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
    res.status(401);
    throw new Error("Password incorrect");
  }

  user.update({
    password: await bcrypt.hash(newPassword, 10),
  });

  return res.status(200).json({
    success: "true",
    message: "Password change success!",
    data: {},
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("---------", req.cookies);
  // Check if token exists
  const refreshTokenExisting = await Token.findOne({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!refreshToken || !refreshTokenExisting) {
    res.status(404);
    throw new Error("Refresh Token not found!");
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
      fullName: user.fullName,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: process.env.EXPIRED_ACCESS_TOKEN }
  );

  return res.json({
    success: "true",
    message: "Refresh successfully!",
    data: {
      accessToken: accessToken,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Delete refresh token in cookie
  if (refreshToken) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
  }

  const token = await Token.destroy({
    where: {
      refreshToken: refreshToken,
    },
  });

  return res.status(200).json({
    success: "true",
    message: "Logout successfully!",
    data: {},
  });
});

const verifyToken = asyncHandler(async (req, res) => {
  return res.json({
    success: "true",
    message: "User verified!",
    data: {
      User: {
        id: req.userInfo.id,
        email: req.userInfo.email,
        userName: req.userInfo.userName,
        fullName: req.userInfo.fullName,
      },
    },
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
