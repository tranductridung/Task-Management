const expressAsyncHandler = require("express-async-handler");
const CommentHistory = require("../Models/CommentHistoryModel");
const Comment = require("../Models/CommentModel");
const User = require("../Models/UserModel");

const getComments = expressAsyncHandler(async (req, res) => {
  const comments = await Comment.findAll();
  return res.status(200).json({
    success: "true",
    message: "List of comment retrieved succesfully!",
    data: {
      Comments: comments,
    },
  });
});

const createComment = expressAsyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const { content } = req.body;
  const taskId = parseInt(req.params.taskId);
  const { userName, fullName } = req.userInfo;

  if (!content) {
    res.status(400);
    throw new Error("Please provide comment");
  }

  const comment = await Comment.create({
    content: content,
    userId: userId,
    taskId: taskId,
  });

  const commentHistory = await CommentHistory.create({
    newContent: content,
    editedBy: userName,
    commentId: comment.id,
  });

  return res.json({
    success: "true",
    message: "Create comment successfully!",
    data: {
      Comment: {
        id: comment.id,
        content: comment.content,
        User: {
          userName: userName,
          fullName: fullName,
        },
      },
    },
  });
});

const editComment = expressAsyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const commentId = req.params.commentId;
  const userName = req.userInfo.userName;
  const { newContent } = req.body;
  const comment = req.comment;

  if (comment.userId !== userId) {
    res.status(403);
    throw new Error("Just the user who create comment can edit");
  }

  if (newContent === comment.content) {
    return res.status(304).json({
      success: "true",
      message: "Comment is not modified",
      data: {},
    });
  }

  const commentHistory = await CommentHistory.create({
    newContent: newContent,
    editedBy: userName,
    commentId: commentId,
  });

  await comment.update({
    content: newContent,
  });

  return res.json({
    success: "true",
    message: "Edit comment succeccfully!",
    data: {
      newContent: newContent,
    },
  });
});

const deleteComment = expressAsyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const comment = req.comment;

  if (comment.userId !== userId) {
    res.status(403);
    throw new Error("Just the user who create comment can delete");
  }

  await comment.destroy();

  return res.status(200).json({
    success: "true",
    message: "Delete comment successfully!",
    data: {},
  });
});

const getCommentsOfTask = expressAsyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const comments = await Comment.findAll({
    include: {
      model: User,
      attributes: ["userName", "fullName"],
    },
    where: {
      taskId: taskId,
    },
    attributes: ["content", "id"],
  });

  return res.status(200).json({
    success: "true",
    message: "Comments of task retrieved successfully!",
    data: {
      Comments: comments,
    },
  });
});

const getCommentHistory = expressAsyncHandler(async (req, res) => {
  const commentId = req.params.commentId;

  const commentHitories = await CommentHistory.findAll({
    where: {
      commentId: commentId,
    },
    attributes: { exclude: ["commentId", "createdAt", "updatedAt"] },
  });

  return res.status(200).json({
    success: "true",
    message: "Comment histories of task retrieved successfully!",
    CommentHitories: commentHitories,
  });
});

module.exports = {
  getComments,
  createComment,
  editComment,
  deleteComment,
  getCommentsOfTask,
  getCommentHistory,
};
