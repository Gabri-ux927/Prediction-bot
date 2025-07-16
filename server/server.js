require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/apiRoutes');
const cron = require('node-cron');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Serve static files from public folder
app.use(express.static('public'));

// Schedule password reset at 11:30 AM IST (06:00 UTC)
cron.schedule('0 6 * * *', async () => {
  console.log('Generating new daily password at 11:30 AM IST');
  const Password = require('./models/Password');
  const newPassword = new Password({
    value: generatePassword(),
    date: new Date()
  });
  await newPassword.save();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}