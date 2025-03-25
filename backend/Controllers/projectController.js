const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Project = require("../Models/ProjectModel");
const User = require("../Models/UserModel");
const UserProject = require("../Models/UserProjectModel");
const getProjectById = require("../Utils/getTaskById");

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.findAll();
  res.status(200).json(projects);
});

const createProject = asyncHandler(async (req, res) => {
  const { projectName, description } = req.body;
  const ownerId = req.user.id;

  if (!projectName || !description) {
    res.status(401);
    throw new Error("All fields are mandatory");
  }

  const project = await Project.create({
    projectName: projectName,
    description: description,
    createdAt: new Date(),
  });

  const userProject = await UserProject.create({
    userId: ownerId,
    projectId: project.id,
    role: "owner",
  });

  res.status(200).json(userProject);
});

// Get projects of user
const getProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user.id;

  const project = await getProjectById(userId, projectId);

  res.json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectName, description } = req.body;

  const project = req.project;

  await project.update({
    projectName: projectName || project.projectName,
    description: description || project.description,
    updateAt: new Date(),
  });

  res.json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = req.project;

  await project.destroy();
  res.json("Delete project successfully!");
});

// Add user to project
const addUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const { role } = req.body;

  if (role !== "owner" && role !== "member") {
    res.status(400);
    throw new Error("Role just owner or member");
  }

  const user = await User.findOne({
    where: {
      id: userId,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isUserExistInProject = await UserProject.findOne({
    where: {
      userId: userId,
      projectId: projectId,
    },
  });

  if (isUserExistInProject) {
    res.status(400);
    throw new Error("User already add to project");
  }

  const userProject = await UserProject.create({
    userId: userId,
    projectId: projectId,
    role: role || "member",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res.status(200).json(userProject);
});

const getUsersInProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;

  const project = await Project.findOne({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const users = await User.findAll({
    include: {
      model: Project,
      where: {
        id: projectId,
      },
      // attributes: [],
    },
    attributes: ["email", "userName", "firstName", "lastName"],
    required: true,
  });

  res.json(users);
});

const getProjectsOfUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const project = await Project.findAll({
    include: {
      model: User,
      where: {
        id: userId,
      },
      attributes: [],
    },
    required: true,
  });

  res.json(project);
});

const removeUser = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.params.userId;
  const ownerId = req.user.id;

  if (userId === ownerId) {
    res.status(401);
    throw new Error("Cannot remove yourself!");
  }

  await UserProject.destroy({
    where: {
      userId: userId,
      projectId: projectId,
    },
  });
  res.status(200).json("Remove user successfully!");
});

const changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const ownerId = req.user.id;

  if (userId === ownerId) {
    res.status(400);
    throw new Error("Cannot change role by yourself");
  }

  if (!role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  if (role !== "owner" && role !== "member") {
    res.status(400);
    throw new Error("Role is invalid");
  }

  const userProject = await UserProject.findOne({
    where: {
      userId: userId,
      projectId: projectId,
    },
  });

  if (!userProject) {
    res.status(404);
    throw new Error("User is not member of project");
  }

  await userProject.update({
    role: role,
  });

  res.status(200).json("Change role successfully!");
});

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addUser,
  getUsersInProject,
  getProjectsOfUser,
  removeUser,
  changeRole,
};
