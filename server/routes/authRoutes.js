const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

router.get('/password', authController.getCurrentPassword);
router.post('/request', authController.requestPassword);

module.exports = router;