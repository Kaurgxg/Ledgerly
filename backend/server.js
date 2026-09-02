// Project-local configuration should be used when a shell/IDE has unrelated variables set.
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config({ override: true });

const express = require('express');
const mongoose = require('mongoose');
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

/*
 * Health endpoint.
 * This intentionally does not require MongoDB so we can still
 * check whether the Vercel server itself is alive.
 */
app.get('/api/health', async (req, res) => {
  try {
    await ensureDB();

    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      database: 'connected',
    });
  } catch (err) {
    console.error(`Health check MongoDB connection failed: ${err.message}`);

    res.status(503).json({
      status: 'error',
      time: new Date().toISOString(),
      database: 'disconnected',
      error: err.message,
    });
  }
});

/*
 * Cached MongoDB connection for Vercel/serverless.
 *
 * Vercel can reuse the same serverless instance for multiple requests,
 * so we reuse an existing connection instead of opening a new one
 * for every request.
 */
let dbPromise = null;

async function ensureDB() {
  // Already connected.
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // A connection attempt is already in progress.
  if (dbPromise) {
    await dbPromise;
    return;
  }

  // Start a new connection attempt.
  dbPromise = connectDB()
    .catch((err) => {
      // Allow the next request to retry if this connection failed.
      dbPromise = null;
      throw err;
    });

  await dbPromise;
}

/*
 * All database-backed API routes pass through this middleware.
 * This makes sure MongoDB is connected before controllers call
 * User.findOne(), User.find(), etc.
 */
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);

    res.status(503).json({
      message: 'Database connection failed.',
    });
  }
});

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

/*
 * Create the default admin account if it doesn't exist.
 */
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

  console.log(
    `Seed admin created — username: ${process.env.SEED_ADMIN_USERNAME || 'admin'}`
  );
}

const PORT = process.env.PORT || 5000;

/*
 * Local development only.
 *
 * Vercel imports/export the Express app directly, so we don't
 * call app.listen() when the file is being loaded as a module.
 */
if (require.main === module) {
  async function start() {
    try {
      await ensureDB();
      await seedAdmin();

      app.listen(PORT, () => {
        console.log(`Ledgerly API running on port ${PORT}`);
      });
    } catch (err) {
      console.error(`Unable to start Ledgerly API: ${err.message}`);
      process.exitCode = 1;
    }
  }

  start();
}

/*
 * Vercel needs the Express application exported.
 */
module.exports = app;
