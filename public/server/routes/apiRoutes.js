const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signalController');
const authMiddleware = require('../middlewares/auth');

router.get('/signals', authMiddleware, signalController.getSignals);

module.exports = router;