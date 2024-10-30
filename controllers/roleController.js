const Role = require('../models/Role');

const addRole = async (req, res) => {
    const { name } = req.body;
    try {
        const newRole = new Role({ name });
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.status(200).json(roles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const role = await Role.findById(id);
        if (role) {
            await Role.deleteOne({ _id: id });
            res.status(200).json({ message: 'Role deleted' });
        } else {
            res.status(404).json({ message: 'Role not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addRole, getRoles, deleteRole };
