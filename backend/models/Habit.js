const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    completions: { type: [String], default: [] }, // array of ISO date strings
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
