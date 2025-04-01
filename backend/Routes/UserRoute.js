const express = require("express");
const {
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
} = require("../Controllers/userController");
const { checkUserExist } = require("../Middlewares/checkingHandler");
const validateToken = require("../Middlewares/validateTokenHandler");
const { ValidationErrorItem } = require("sequelize");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", validateToken, logout);
router.post("/refresh", refreshToken);
router.post("/changePassword", validateToken, checkUserExist, changePassword);
router.get("/verify", validateToken, verifyToken);

router.get("/", getUsers);

router
  .route("/me")
  .get(validateToken, checkUserExist, getUser)
  .delete(validateToken, checkUserExist, deleteUser)
  .put(validateToken, checkUserExist, updateUser);

module.exports = router;
