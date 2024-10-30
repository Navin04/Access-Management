const Project = require('../models/Project');

const addProject = async (req, res) => {
    console.log('Request Body:', req.body);
    const { name, permissions } = req.body;
    const newProject = new Project({ name, permissions });
    console.log('New Project:', newProject);

    try {
        await newProject.save();
        console.log('Project saved');
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(400).json({ message: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (project) {
            await Project.deleteOne({ _id: id });
            res.status(200).json({ message: 'Project deleted' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addProject, getProjects, deleteProject};
