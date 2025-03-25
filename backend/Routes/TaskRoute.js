const express = require("express");
const router = express.Router();
// Middleware
const {
  checkTagExist,
  checkTaskExist,
  checkUserAndTaskExist,
  checkOwner,
  checkMember,
  checkUserExist,
  checkCommentExist,
} = require("../Middlewares/checkingHandler");
const validateToken = require("../Middlewares/validateTokenHandler");

// Task Controller
const {
  getTasks,
  getTasksByStatusAndPriority,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  addUser,
  getUsersInTask,
  getTasksOfUser,
  removeUser,
  updateStatus,
  changeRole,
} = require("../Controllers/taskController");

//Tag Controller
const {
  getTags,
  createTag,
  editTag,
  deleteTag,
  getTagsOfTask,
} = require("../Controllers/tagController");

// Comment Controller
const {
  getComments,
  createComment,
  editComment,
  deleteComment,
  getCommentsOfTask,
  getCommentHistory,
} = require("../Controllers/commentController");

// ============================ ROUTES WITH NO ID ============================ //

router.route("/").get(getTasks).post(validateToken, createTask);

router.route("/comments").get(getComments);
router.route("/tags").get(getTags);

router.get("/users", validateToken, getTasksOfUser);

// ============================ ROUTES WITH ID ============================ //

//Task Route
router.get(
  "/priority/:priority/status/:status",
  validateToken,
  checkUserExist,
  getTasksByStatusAndPriority
);

router.patch(
  "/:taskId/updateStatus",
  validateToken,
  checkTaskExist,
  checkMember,
  updateStatus
);

router
  .route("/:taskId/users")
  .get(validateToken, checkTaskExist, checkMember, getUsersInTask)
  .post(validateToken, checkUserAndTaskExist, checkOwner, addUser);

router
  .route("/:taskId/users/:userId")
  .delete(validateToken, checkUserAndTaskExist, checkOwner, removeUser)
  .put(validateToken, checkUserAndTaskExist, checkOwner, changeRole);
router
  .route("/:taskId")
  .get(validateToken, checkMember, getTask)
  .put(validateToken, checkUserAndTaskExist, checkOwner, updateTask)
  .delete(validateToken, checkUserAndTaskExist, checkOwner, deleteTask);
// Comment Route
router
  .route("/:taskId/comments/:commentId")
  .get(validateToken, checkUserExist, checkCommentExist, getCommentHistory)
  .put(validateToken, checkUserExist, checkCommentExist, editComment)
  .delete(validateToken, checkUserExist, checkCommentExist, deleteComment);
router
  .route("/:taskId/comments")
  .get(validateToken, checkMember, getCommentsOfTask)
  .post(validateToken, checkMember, createComment);
//Tag Route
router
  .route("/:taskId/tags/:tagId")
  .put(validateToken, checkUserAndTaskExist, checkTagExist, checkOwner, editTag)
  .delete(
    validateToken,
    checkUserAndTaskExist,
    checkTagExist,
    checkOwner,
    deleteTag
  );
router
  .route("/:taskId/tags")
  .get(validateToken, checkUserAndTaskExist, checkMember, getTagsOfTask)
  .post(validateToken, checkUserAndTaskExist, checkOwner, createTag);

module.exports = router;
