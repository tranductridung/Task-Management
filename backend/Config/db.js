const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('task_management', 'root', 'tridung', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize