const Password = require('../models/Password');
const Request = require('../models/Request');
const User = require('../models/User');
const { botToken } = require('../config/telegram');
const axios = require('axios');

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

exports.getCurrentPassword = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let password = await Password.findOne({ date: { $gte: today } });
    
    if (!password) {
      password = new Password({
        value: generatePassword(),
        date: new Date()
      });
      await password.save();
    }
    
    res.json({ password: password.value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get password' });
  }
};

exports.requestPassword = async (req, res) => {
  try {
    const { userId, username, chatId } = req.body;
    
    const existingRequest = await Request.findOne({ 
      userId, 
      status: 'pending',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (existingRequest) {
      return res.json({ message: 'Request already pending' });
    }
    
    const request = new Request({
      userId,
      username,
      chatId,
      status: 'pending'
    });
    
    await request.save();
    
    // Notify admin via Telegram bot
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: process.env.ADMIN_USER_ID,
      text: `New password request from @${username} (ID: ${userId})`
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request password' });
  }
};