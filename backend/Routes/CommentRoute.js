const express = require('express')
const router = express.Router()
const validateToken = require('../Middlewares/validateTokenHandler')

const { getComments,
    createComment,
    editComment,
    deleteComment,
    getCommentsOfTask,
    getCommentHistory } = require('../Controllers/commentController')

router.route('/')
    .get(getComments)
router.route('/:commentId')
    .get(validateToken, getCommentHistory)
    .put(validateToken, editComment)
    .delete(validateToken, deleteComment)
router.route('/tasks/:taskId')
    .get(validateToken, getCommentsOfTask)
    .post(validateToken, createComment)

module.exports = router