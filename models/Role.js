const mongoose = require('mongoose');
const roleSchema = mongoose.Schema({
    name: { type: String, required: true },
    permissions: [String]
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
