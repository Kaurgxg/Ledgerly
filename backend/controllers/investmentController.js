const Investment = require('../models/Investment');

async function getInvestments(req, res, next) {
  try {
    const records = await Investment.find({ user: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (err) { next(err); }
}

async function addInvestment(req, res, next) {
  try {
    const { name, type, amount, date } = req.body;
    if (!name || amount == null || !date) {
      return res.status(400).json({ message: 'Name, amount, and date are required.' });
    }
    const record = await Investment.create({ user: req.user._id, name, type, amount, date });
    res.status(201).json(record);
  } catch (err) { next(err); }
}

async function deleteInvestment(req, res, next) {
  try {
    const record = await Investment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getInvestments, addInvestment, deleteInvestment };
