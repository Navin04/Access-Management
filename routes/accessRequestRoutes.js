const express = require('express');
const router = express.Router();
const { getAccessRequests, submitAccessRequest, updateAccessRequestStatus } = require('../controllers/accessRequestController');

router.get('/', getAccessRequests);
router.post('/submit', submitAccessRequest);
router.put('/update-status', updateAccessRequestStatus);

module.exports = router;
