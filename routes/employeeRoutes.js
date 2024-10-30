const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, getEmployeeById, authEmployee, updateEmployeeStatus, revokeAccess, reassignAccess, createInitialAdmin } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/:id', protect, getEmployeeById);
router.post('/add', protect, checkRole('Admin'), addEmployee);
router.get('/', protect, checkRole('Admin'), getEmployees);
router.post('/login', authEmployee);

router.put('/update-status', protect, checkRole('Admin'), updateEmployeeStatus);
router.put('/revoke-access', protect, checkRole('Admin'), revokeAccess);
router.put('/reassign-access', protect, checkRole('Admin'), reassignAccess);

//router.post('/create-initial-admin', createInitialAdmin);

module.exports = router;
