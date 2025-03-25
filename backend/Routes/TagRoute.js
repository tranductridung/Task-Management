const express = require('express')
const router = express.Router()
const validateToken = require('../Middlewares/validateTokenHandler')
const { checkUserAndTaskExist, checkMember, checkOwner } = require('../Middlewares/checkingHandler')

const { getTags,
    createTag,
    editTag,
    deleteTag,
    getTagsOfTask
} = require('../Controllers/tagController')

router.route('/')
    .get(getTags)
router.route('/:tagId/tasks/:taskId')
    .put(validateToken,
        checkUserAndTaskExist,
        checkOwner,
        editTag)
    .delete(validateToken,
        checkUserAndTaskExist,
        checkOwner,
        deleteTag)
router.route('/tasks/:taskId')
    .get(validateToken,
        checkUserAndTaskExist,
        checkMember,
        getTagsOfTask)
    .post(validateToken,
        checkUserAndTaskExist,
        checkOwner,
        createTag)

module.exports = router