const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set. Create backend/.env from backend/.env.example and add your MongoDB connection string.');
  }

  const conn = await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || 'ledgerly',
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

module.exports = connectDB;
