const mongoose = require('mongoose');

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Rent', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Education', 'Other'];

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true, enum: EXPENSE_CATEGORIES },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
