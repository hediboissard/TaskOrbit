const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { taskRules, taskUpdateRules, validate } = require('../utils/validation');

// All routes require authentication
router.use(auth);

// GET /api/tasks
router.get('/', getTasks);

// POST /api/tasks
router.post('/', taskRules, validate, createTask);

// GET /api/tasks/:id
router.get('/:id', getTask);

// PUT /api/tasks/:id
router.put('/:id', taskUpdateRules, validate, updateTask);

// PATCH /api/tasks/:id/status
router.patch('/:id/status', updateTaskStatus);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
