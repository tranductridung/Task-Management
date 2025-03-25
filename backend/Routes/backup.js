const express = require('express')
const router = express.Router()
// Middleware
const { checkTagExist, checkTaskExist, checkUserAndTaskExist, checkOwner, checkMember, checkUserExist, checkCommentExist } = require('../Middlewares/checkingHandler')
const validateToken = require('../Middlewares/validateTokenHandler')

// Task Controller
const { getTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
    addUser,
    getUsersInTask,
    getTasksOfUser,
    removeUser,
    updateStatus,
    changeRole } = require('../Controllers/taskController')

//Tag Controller
const { getTags,
    createTag,
    editTag,
    deleteTag,
    getTagsOfTask
} = require('../Controllers/tagController')

// Comment Controller
const { getComments,
    createComment,
    editComment,
    deleteComment,
    getCommentsOfTask,
    getCommentHistory } = require('../Controllers/commentController')

// ============================ GENERAL TASK ROUTES ============================ //
// ============================ GENERAL COMMENT ROUTES ============================ //
// ============================ GENERAL TAG ROUTES ============================ //

// ============================ TASK ROUTES ============================ //
// ============================ COMMENT ROUTES ============================ //
// ============================ TAG ROUTES ============================ //



// ============================ ROUTES WITH NO ID ============================ //
router.route('/comments')
    .get(getComments)
router.route('/tags')
    .get(getTags)
    router.route('/')
    .get(getTasks)
    .post(validateToken, createTask)
// ============================ ROUTES WITH ID ============================ //



//Task Route

router.put('/:taskId/updateStatus', validateToken,checkTaskExist,checkMember,updateStatus)

router.get('/users', validateToken, getTasksOfUser)
router.get('/:taskId/users', validateToken,checkTaskExist,checkMember,getUsersInTask)
router.route('/:taskId/users/:userId').post(validateToken, checkUserAndTaskExist,checkOwner,addUser)
    .delete(validateToken,checkUserAndTaskExist,checkOwner,removeUser)
    .put(validateToken,checkUserAndTaskExist,checkOwner,changeRole)
router.route('/:taskId')
    .get(validateToken,checkMember,getTask)
    .put(validateToken,checkUserAndTaskExist,checkOwner,updateTask)
    .delete(validateToken,checkUserAndTaskExist,checkOwner,deleteTask)
// Comment Rout
router.route('/comments/:commentId')
    .get(validateToken, checkUserExist, checkCommentExist, getCommentHistory)
    .put(validateToken, checkUserExist, checkCommentExist, editComment)
    .delete(validateToken, checkUserExist, checkCommentExist, deleteComment)
router.route('/:taskId/comments')
    .get(validateToken, checkMember, getCommentsOfTask)
    .post(validateToken, checkMember, createComment)
//Tag Route
router.route('/:taskId/tags/:tagId')
    .put(validateToken,checkUserAndTaskExist,checkTagExist,checkOwner,editTag)
    .delete(validateToken,checkUserAndTaskExist,checkTagExist,checkOwner,deleteTag)
router.route('/:taskId/tags')
    .get(validateToken,checkUserAndTaskExist,checkMember,getTagsOfTask)
    .post(validateToken,checkUserAndTaskExist,checkOwner,createTag)

module.exports = router