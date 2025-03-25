const sequelize = require('../Config/db');
const { DataTypes } = require('sequelize');
const User = require('./UserModel');
const Project = require('./ProjectModel');

const UserProject = sequelize.define('UserProject', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    projectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('owner', 'member'),
        allowNull: false
    }
}, {
    timestamps: true
});

User.belongsToMany(Project, { through: UserProject, foreignKey: 'userId' });
Project.belongsToMany(User, { through: UserProject, foreignKey: 'projectId' });

module.exports = UserProject;
