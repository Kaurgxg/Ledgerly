const Goal = require('../models/Goal');

async function getGoals(req, res, next) {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) { next(err); }
}

async function addGoal(req, res, next) {
  try {
    const { name, target, deadline } = req.body;
    if (!name || !target) return res.status(400).json({ message: 'Name and target amount are required.' });
    const goal = await Goal.create({ user: req.user._id, name, target, current: 0, deadline: deadline || null, contributions: [] });
    res.status(201).json(goal);
  } catch (err) { next(err); }
}

// @route POST /api/goals/:id/contribute
async function contribute(req, res, next) {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'A positive contribution amount is required.' });

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });

    goal.current += Number(amount);
    goal.contributions.push({ amount, date: new Date().toISOString().slice(0, 10) });
    await goal.save();
    res.json(goal);
  } catch (err) { next(err); }
}

async function deleteGoal(req, res, next) {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getGoals, addGoal, contribute, deleteGoal };
