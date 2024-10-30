const mongoose = require('mongoose');

const accessRequestSchema = mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    tool: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

const AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);
module.exports = AccessRequest;
