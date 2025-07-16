const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  isPremium: { type: Boolean, default: false },
  lastAccess: Date
});

module.exports = mongoose.model('User', userSchema);