const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    category: {
      type: String,
      enum: ['Feedback', 'Complaint', 'Bug', 'Feature request'],
      default: 'Feedback',
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    adminReply: { type: String, default: null },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
