const expressAsyncHandler = require("express-async-handler")
const Tag = require('../Models/TagModel')
const Task = require('../Models/TaskModel')
const UserTask = require("../Models/UserTaskModel")

const getTags = expressAsyncHandler(async (req, res) => {
    const tags = await Tag.findAll()
    return res.json(tags)

})

const createTag = expressAsyncHandler(async (req, res) => {
    const taskId = req.params.taskId
    const { tagName, color } = req.body

    if (!tagName) {
        res.status(400)
        throw new Error('Please provide tag name')
    }

    const tag = await Tag.create({
        tagName: tagName,
        color: color,
        taskId: taskId
    })

    return res.json(tag)
})

const editTag = expressAsyncHandler(async (req, res) => {
    const { tagName, color } = req.body
    const tag = req.tag

    await tag.update({
        color: color || tag.color,
        tagName: tagName || tag.tagName
    })

    return res.status(200).json(tag)
})

const deleteTag = expressAsyncHandler(async (req, res) => {
    const tag = req.tag
    tag.destroy()
    tag.save()

    return res.json('Delete tag successfully!')
})

const getTagsOfTask = expressAsyncHandler(async (req, res) => {
    const taskId = req.params.taskId

    const tags = await Tag.findAll({
        where: {
            taskId: taskId
        }
    })
    return res.json(tags)
})

module.exports = {
    getTags,
    createTag,
    editTag,
    deleteTag,
    getTagsOfTask
}