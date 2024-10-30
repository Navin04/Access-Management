const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    name: { type: String, required: true },
    permissions: [String]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

