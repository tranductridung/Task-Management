const expressAsyncHandler = require('express-async-handler')
const Task = require('../Models/TaskModel')
const Comment = require('../Models/CommentModel')
const User = require('../Models/UserModel')
const UserTask = require('../Models/UserTaskModel')
const Tag = require('../Models/TagModel')

const checkTagExist = expressAsyncHandler(async (req, res, next) => {
    const tagId = req.params.tagId
    const tag = await Tag.findByPk(tagId)

    if (!tag) {
        res.status(404)
        throw new Error('Tag not found')
    }
    req.tag = tag
    next()
})

const checkUserExist = expressAsyncHandler(async (req, res, next) => {
    const userId = req.userInfo.id
    const user = await User.findByPk(userId)

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    req.user = user
    next()
})

const checkTaskExist = expressAsyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId
    const task = await Task.findByPk(taskId)

    if (!task) {
        res.status(404)
        throw new Error('Task not found')
    }
    req.task = task
    next()
})

const checkCommentExist = expressAsyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId
    const comment = await Comment.findByPk(commentId)

    if (!comment) {
        res.status(404)
        throw new Error('comment not found')
    }
    req.comment = comment
    next()
})

const checkUserAndTaskExist = expressAsyncHandler(async (req, res, next) => {
    const userId = req.userInfo.id
    const taskId = req.params.taskId

    const task = await Task.findByPk(taskId)
    const user = await User.findByPk(userId)

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!task) {
        res.status(404)
        throw new Error('Task not found')
    }

    req.user = user
    req.task = task
    next()
})


const checkMember = expressAsyncHandler(async (req, res, next) => {
    const userId = req.userInfo.id
    const taskId = req.params.taskId

    const isMember = await UserTask.findOne({
        where: {
            userId: userId,
            taskId: taskId
        }
    })

    if (!isMember) {
        res.status(403)
        throw new Error('User is not member of task')
    }

    next()
})

const checkOwner = expressAsyncHandler(async (req, res, next) => {
    const userId = req.userInfo.id
    const taskId = req.params.taskId
    console.log('sdlkfa;jsdfk')

    const isOwner = await UserTask.findOne({
        where: {
            userId: userId,
            taskId: taskId,
            role: 'owner'
        }
    })

    if (!isOwner) {
        res.status(403)
        throw new Error('User is not owner. Just owner can edit project!')
    }

    next()
})

module.exports = { checkCommentExist, checkUserExist, checkTaskExist, checkUserAndTaskExist, checkMember, checkOwner, checkTagExist }