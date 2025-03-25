const sequelize = require('../Config/db')
const { DataTypes } = require('sequelize')
const Task = require('./TaskModel')
const User = require('./UserModel')

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true })

Task.hasMany(Comment, {
    foreignKey: 'taskId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Comment.belongsTo(Task, { foreignKey: 'taskId' })

Comment.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Comment, { foreignKey: 'userId' })

module.exports = Comment
