const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Stocks', 'Mutual Fund', 'Crypto', 'Real Estate', 'Retirement Account', 'Other'],
      default: 'Other',
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', investmentSchema);
