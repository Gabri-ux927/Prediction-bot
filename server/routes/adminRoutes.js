const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/admin');

router.post('/password/new', adminMiddleware, adminController.generateNewPassword);
router.get('/requests', adminMiddleware, adminController.getPendingRequests);
router.post('/requests/:requestId/approve', adminMiddleware, adminController.approveRequest);

module.exports = router;