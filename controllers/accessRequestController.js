const AccessRequest = require('../models/AccessRequest');
const Employee = require('../models/Employee');

const getAccessRequests = async (req, res) => {
    try {
        const requests = await AccessRequest.find().populate('employee');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitAccessRequest = async (req, res) => {
    const { employeeId, tool } = req.body;
    try {
        const employee = await Employee.findById(employeeId);
        if (employee) {
            const newRequest = new AccessRequest({ employee: employeeId, tool });
            await newRequest.save();
            res.status(201).json(newRequest);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateAccessRequestStatus = async (req, res) => {
    const { requestId, status } = req.body;
    try {
        const request = await AccessRequest.findById(requestId).populate('employee');
        if (request) {
            request.status = status;
            if (status === 'Approved') {
                request.employee.access.push(request.tool);
                await request.employee.save();
            } else if (status === 'Rejected') {
                // Remove the tool from the employee's access list
                request.employee.access = request.employee.access.filter(item => item !== request.tool);
                await request.employee.save();
            }
            await request.save();
            res.status(200).json(request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAccessRequests, submitAccessRequest, updateAccessRequestStatus };
