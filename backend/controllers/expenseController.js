const Expense = require('../models/Expense');
const { EXPENSE_CATEGORIES } = require('../models/Expense');

async function getExpenses(req, res, next) {
  try {
    const records = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (err) { next(err); }
}

async function addExpense(req, res, next) {
  try {
    const { category, amount, date, note } = req.body;
    if (!category || amount == null || !date) {
      return res.status(400).json({ message: 'Category, amount, and date are required.' });
    }
    if (!EXPENSE_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category.' });
    }
    const record = await Expense.create({ user: req.user._id, category, amount, date, note });
    res.status(201).json(record);
  } catch (err) { next(err); }
}

async function deleteExpense(req, res, next) {
  try {
    const record = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getExpenses, addExpense, deleteExpense, EXPENSE_CATEGORIES };
