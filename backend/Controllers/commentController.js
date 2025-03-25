const expressAsyncHandler = require("express-async-handler");
const CommentHistory = require("../Models/CommentHistoryModel");
const Comment = require("../Models/CommentModel");
const User = require("../Models/UserModel");

const getComments = expressAsyncHandler(async (req, res) => {
  const comments = await Comment.findAll();
  return res.json(comments);
});

const createComment = expressAsyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const { content } = req.body;
  const taskId = parseInt(req.params.taskId);
  const { userName, lastName, firstName } = req.userInfo;

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
    id: comment.id,
    content: comment.content,
    User: {
      userName: userName,
      firstName: firstName,
      lastName: lastName,
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
    return res.status(200).json("Comment is not modified");
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
    comment: comment,
    commentHistory: commentHistory,
  });
});

const deleteComment = expressAsyncHandler(async (req, res) => {
  const userId = req.userInfo.id;
  const comment = req.comment;

  if (comment.userId !== userId) {
    res.status(403);
    throw new Error("Just the user who create comment can edit");
  }

  await comment.destroy();

  return res.status(200).json("Delete comment successfully!");
});

const getCommentsOfTask = expressAsyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const comments = await Comment.findAll({
    include: {
      model: User,
      attributes: ["userName", "firstName", "lastName"],
    },
    where: {
      taskId: taskId,
    },
    attributes: ["content", "id"],
  });

  return res.status(200).json(comments);
});

const getCommentHistory = expressAsyncHandler(async (req, res) => {
  const commentId = req.params.commentId;

  const commentHitories = await CommentHistory.findAll({
    where: {
      commentId: commentId,
    },
  });

  return res.json(commentHitories);
});

module.exports = {
  getComments,
  createComment,
  editComment,
  deleteComment,
  getCommentsOfTask,
  getCommentHistory,
};
