const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { projectRules, validate } = require('../utils/validation');

// All routes require authentication
router.use(auth);

// GET /api/projects
router.get('/', getProjects);

// POST /api/projects
router.post('/', projectRules, validate, createProject);

// GET /api/projects/:id
router.get('/:id', getProject);

// PUT /api/projects/:id
router.put('/:id', projectRules, validate, updateProject);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

module.exports = router;
