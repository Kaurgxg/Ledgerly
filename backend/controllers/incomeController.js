const Income = require('../models/Income');

async function getIncome(req, res, next) {
  try {
    const records = await Income.find({ user: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (err) { next(err); }
}

async function addIncome(req, res, next) {
  try {
    const { source, amount, date } = req.body;
    if (!source || amount == null || !date) {
      return res.status(400).json({ message: 'Source, amount, and date are required.' });
    }
    const record = await Income.create({ user: req.user._id, source, amount, date });
    res.status(201).json(record);
  } catch (err) { next(err); }
}

async function deleteIncome(req, res, next) {
  try {
    const record = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getIncome, addIncome, deleteIncome };
