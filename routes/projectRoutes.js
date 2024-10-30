const express = require('express');
const router = express.Router();
const { addProject, getProjects, deleteProject } = require('../controllers/projectController');

router.post('/add', addProject);
router.get('/', getProjects);
router.delete('/:id', deleteProject);

module.exports = router;
