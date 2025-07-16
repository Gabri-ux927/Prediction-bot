const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  username: String,
  chatId: Number,
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);