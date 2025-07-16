const Password = require('../models/Password');
const Request = require('../models/Request');
const User = require('../models/User');
const { botToken } = require('../config/telegram');
const axios = require('axios');

exports.generateNewPassword = async (req, res) => {
  try {
    const newPassword = new Password({
      value: generatePassword(),
      date: new Date()
    });
    
    await newPassword.save();
    
    res.json({ password: newPassword.value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate password' });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get requests' });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    const password = await Password.findOne({ 
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    if (!password) {
      return res.status(400).json({ error: 'No password set for today' });
    }
    
    // Send password via Telegram bot
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: request.chatId,
      text: `Today's password: ${password.value}\n\nExpires at 11:30 AM IST tomorrow.`
    });
    
    request.status = 'approved';
    await request.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve request' });
  }
};