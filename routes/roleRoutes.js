const express = require('express');
const router = express.Router();
const { addRole, getRoles, deleteRole } = require('../controllers/roleController');

router.post('/add', addRole);
router.get('/', getRoles); // Route for getting all roles
router.delete('/:id', deleteRole); // Route for deleting a role

module.exports = router;
