const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, sort } = req.query;

    const filter = { userId: req.userId };
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let sortOption = { createdAt: -1 };
    if (sort === 'deadline') sortOption = { deadline: 1 };
    else if (sort === 'createdAt') sortOption = { createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortOption);

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, priority, status, deadline } = req.body;

    // Verify the project belongs to this user
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet introuvable ou ne vous appartient pas',
      });
    }

    const task = await Task.create({
      projectId,
      userId: req.userId,
      title,
      description,
      priority,
      status,
      deadline: deadline || undefined,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable',
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, projectId, priority, status, deadline } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable',
      });
    }

    // If projectId is being updated, verify the new project belongs to this user
    if (projectId && projectId.toString() !== task.projectId.toString()) {
      const project = await Project.findOne({ _id: projectId, userId: req.userId });
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Projet introuvable ou ne vous appartient pas',
        });
      }
      task.projectId = projectId;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline || null;

    await task.save();

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Le statut est obligatoire',
      });
    }

    const validStatuses = ['todo', 'inprogress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Le statut doit être à faire, en cours ou terminé',
      });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable',
      });
    }

    task.status = status;
    await task.save();

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable',
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Tâche supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, getTask, updateTask, updateTaskStatus, deleteTask };
