const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    source: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true }, // ISO date string, e.g. 2026-08-16
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
