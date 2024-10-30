const Employee = require('../models/Employee');
const Role = require('../models/Role');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

// const addEmployee = async (req, res) => {
//     const { name, email, password, role, projects } = req.body;
//     const roleData = await Role.findById(role);
//     const projectData = await Project.find({ _id: { $in: projects } });

//     const access = new Set([...roleData.permissions, ...projectData.flatMap(proj => proj.permissions)]);

//     const newEmployee = new Employee({ name, email, password, role, projects, access: Array.from(access) });
//     try {
//         await newEmployee.save();
//         res.status(201).json(newEmployee);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// const addEmployee = async (req, res) => {
//     const { name, email, password, role, projects } = req.body;
//     try {
//         const roleData = await Role.findOne({ name: role });
//         if (!roleData) {
//             return res.status(404).json({ message: 'Role not found' });
//         }

//         const projectData = await Project.find({ _id: { $in: projects } });
//         const access = new Set([...roleData.permissions, ...projectData.flatMap(proj => proj.permissions)]);

//         const newEmployee = new Employee({
//             name,
//             email,
//             password,
//             role: roleData._id, // Save role ID
//             projects,
//             access: Array.from(access)
//         });

//         await newEmployee.save();
//         res.status(201).json(newEmployee);
//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         res.status(400).json({ message: error.message });
//     }
// };
const addEmployee = async (req, res) => {
    const { name, email, password, role, projects } = req.body;
    try {
        const roleData = await Role.findOne({ name: role });
        if (!roleData) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const projectData = await Project.find({ name: { $in: projects } }); // Find projects by name
        const access = new Set([...roleData.permissions, ...projectData.flatMap(proj => proj.permissions)]);

        const newEmployee = new Employee({
            name,
            email,
            password,
            role: roleData._id, // Save role ID
            projects: projectData.map(proj => proj._id), // Save project IDs
            access: Array.from(access)
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(400).json({ message: error.message });
    }
};


const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}).populate('role projects');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findById(id).populate('role');
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// const authEmployee = async (req, res) => {
//     const { email, password } = req.body;
//     const employee = await Employee.findOne({ email });

//     if (employee && (await employee.matchPassword(password))) {
//         res.json({
//             _id: employee._id,
//             name: employee.name,
//             email: employee.email,
//             role: employee.role,
//             projects: employee.projects,
//             access: employee.access,
//         });
//     } else {
//         res.status(401).json({ message: 'Invalid email or password' });
//     }
// };
const authEmployee = async (req, res) => {
    const { email, password } = req.body;
    try {
        const employee = await Employee.findOne({ email }).populate('role');
        if (employee && (await employee.matchPassword(password))) {
            const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role.name,
                permissions: employee.role.permissions,
                projects: employee.projects,
                access: employee.access,
                token: token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEmployeeStatus = async (req, res) => {
    const { employeeId, status } = req.body;
    try {
        const employee = await Employee.findById(employeeId);
        if (employee) {
            employee.isActive = status;
            await employee.save();
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const revokeAccess = async (req, res) => {
    try {
        const employees = await Employee.find({ isActive: false });
        employees.forEach(async (employee) => {
            employee.access = [];
            await employee.save();
        });
        res.status(200).json({ message: 'Access revoked for inactive employees' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const reassignAccess = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const employee = await Employee.findById(employeeId).populate('role').populate('projects');
        if (employee) {
            if (employee.isActive) {
                const rolePermissions = employee.role.permissions;
                const projectPermissions = employee.projects.flatMap(project => project.permissions);
                const access = new Set([...rolePermissions, ...projectPermissions]);

                employee.access = Array.from(access);
                await employee.save();
                res.status(200).json(employee);
            } else {
                res.status(400).json({ message: 'Employee is not active' });
            }
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createInitialAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const adminRole = await Role.findOne({ name: 'Admin' });
        if (!adminRole) {
            return res.status(400).json({ message: 'Admin role not found' });
        }
        const newAdmin = new Employee({ name, email, password, role: adminRole._id });
        await newAdmin.save();
        res.status(201).json({ message: 'Initial admin user created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addEmployee, getEmployees, getEmployeeById , authEmployee, updateEmployeeStatus, revokeAccess, reassignAccess, createInitialAdmin };