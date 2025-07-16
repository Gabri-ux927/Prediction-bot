const { adminId } = require('../config/telegram');

module.exports = (req, res, next) => {
  const userId = req.body.userId || req.query.userId;
  
  if (userId !== adminId) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};