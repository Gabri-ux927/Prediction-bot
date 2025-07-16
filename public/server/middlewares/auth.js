const Password = require('../models/Password');

module.exports = async (req, res, next) => {
  try {
    const { password } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const validPassword = await Password.findOne({ 
      value: password,
      date: { $gte: today }
    });
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};