const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
  },
  { _id: false }
);

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    target: { type: Number, required: true, min: 1 },
    current: { type: Number, default: 0, min: 0 },
    deadline: { type: String, default: null },
    contributions: { type: [contributionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
