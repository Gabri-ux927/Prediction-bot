const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  value: { type: String, required: true },
  date: { type: Date, default: Date.now, index: true, expires: '26h' } // 26h to cover IST timezone
});

module.exports = mongoose.model('Password', passwordSchema);