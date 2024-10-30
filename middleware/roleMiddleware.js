// const Employee = require('../models/Employee');

// const checkRole = (requiredRole) => async (req, res, next) => {
//     try {
//         const employee = await Employee.findById(req.employee._id).populate('role');
//         if (employee.role.name === requiredRole) {
//             next();
//         } else {
//             res.status(403).json({ message: 'Forbidden: You do not have the required role' });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// module.exports = { checkRole };
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const checkRole = (role) => async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.employee = await Employee.findById(decoded.id).populate('role');

            if (req.employee.role.name !== role) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
};

module.exports = { checkRole };

