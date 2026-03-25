const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });

    // Attach task count to each project
    const projectsWithCount = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ projectId: project._id });
        return {
          ...project.toObject(),
          taskCount,
        };
      })
    );

    res.json({
      success: true,
      projects: projectsWithCount,
    });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      userId: req.userId,
      name,
      description,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet introuvable',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet introuvable',
      });
    }

    project.name = name !== undefined ? name : project.name;
    project.description = description !== undefined ? description : project.description;
    await project.save();

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet introuvable',
      });
    }

    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();

    res.json({
      success: true,
      message: 'Le projet et toutes les tâches associées ont été supprimés',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, createProject, getProject, updateProject, deleteProject };
