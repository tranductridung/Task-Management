const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../Config/db')
const Comment = require('./CommentModel')
const { FOREIGNKEYS } = require('sequelize/lib/query-types')

const CommentHistory = sequelize.define('CommentHistory', {
    newContent: DataTypes.TEXT,
    editedBy: DataTypes.STRING
}, { timestamps: true })

Comment.hasMany(CommentHistory, {
    foreignKey: 'commentId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
CommentHistory.belongsTo(Comment, {
    foreignKey: 'commentId',
})


module.exports = CommentHistory