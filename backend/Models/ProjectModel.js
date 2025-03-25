const sequelize = require('../Config/db')
const { DataTypes } = require('sequelize')
const User = require('./UserModel')

const Project = sequelize.define('Project', {
    projectName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
})

module.exports = Project