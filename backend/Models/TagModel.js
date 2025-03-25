const sequelize = require('../Config/db')
const { DataTypes } = require('sequelize')
const Task = require('./TaskModel')

const Tag = sequelize.define('Tag', {
    tagName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: '#FFFFFF'
    },
})

Task.hasMany(Tag, {
    foreignKey: 'taskId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Tag.belongsTo(Task, {
    foreignKey: 'taskId'
})

module.exports = Tag