// Project-local configuration should be used when a shell/IDE has unrelated variables set.
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const habitRoutes = require('./routes/habitRoutes');
const goalRoutes = require('./routes/goalRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header (health checks, curl, server-to-server) are safe.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS.'));
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function seedAdmin() {
  const existing = await User.findOne({ role: 'admin' });
  if (existing) return;
  await User.create({
    username: (process.env.SEED_ADMIN_USERNAME || 'admin').toLowerCase(),
    password: process.env.SEED_ADMIN_PASSWORD || 'admin123',
    name: 'Platform Admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@ledgerly.demo',
    role: 'admin',
  });
  console.log(`Seed admin created — username: ${process.env.SEED_ADMIN_USERNAME || 'admin'}`);
}

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => console.log(`Ledgerly API running on port ${PORT}`));
  } catch (err) {
    console.error(`Unable to start Ledgerly API: ${err.message}`);
    process.exitCode = 1;
  }
}

start();
