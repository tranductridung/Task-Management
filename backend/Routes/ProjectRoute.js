const express = require('express')
const router = express.Router()
const checkRoleOwner = require('../Middlewares/checkRoleOwner')

const { getProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    addUser,
    getUsersInProject,
    getProjectsOfUser,
    removeUser,
    changeRole } = require('../Controllers/projectController')
const validateToken = require('../Middlewares/validateTokenHandler')

router.route('/')
    .get(getProjects)
    .post(validateToken, createProject)

router.get('/users', validateToken, getProjectsOfUser)
router.get('/:projectId/users', validateToken, getUsersInProject)

router.route('/:projectId/users/:userId')
    .post(validateToken, checkRoleOwner, addUser)
    .delete(validateToken, checkRoleOwner, removeUser)
    .put(validateToken, checkRoleOwner, changeRole)

router.route('/:projectId')
    .get(validateToken, getProject)
    .put(validateToken, checkRoleOwner, updateProject)
    .delete(validateToken, checkRoleOwner, deleteProject)

module.exports = router