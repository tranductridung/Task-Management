require("dotenv").config();
const sequelize = require("./Config/db");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./Middlewares/ErrorHandler");
const cookieParser = require("cookie-parser");

const CommentHistory = require("./Models/CommentHistoryModel.js");
const User = require("./Models/UserModel.js");
const Comment = require("./Models/CommentModel");
const Task = require("./Models/TaskModel");
const UserTask = require("./Models/UserTaskModel");
const Tag = require("./Models/TagModel");
const Token = require("./Models/TokenModel");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("/api/users", require("./Routes/UserRoute.js"));
app.use("/api/tasks", require("./Routes/TaskRoute.js"));

// sequelize.sync({ force: true });

app.use(errorHandler);
app.listen(process.env.PORT);
