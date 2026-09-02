const Habit = require('../models/Habit');

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function isDoneInCurrentPeriod(habit) {
  if (!habit.completions || habit.completions.length === 0) return false;
  const last = new Date(habit.completions[habit.completions.length - 1]);
  const now = new Date();
  if (habit.frequency === 'daily') return last.toDateString() === now.toDateString();
  const diffDays = (now - last) / 86400000;
  if (habit.frequency === 'weekly') return diffDays < 7;
  return diffDays < 30;
}

async function getHabits(req, res, next) {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) { next(err); }
}

async function addHabit(req, res, next) {
  try {
    const { name, frequency = 'daily' } = req.body;
    if (!name) return res.status(400).json({ message: 'Habit name is required.' });
    const habit = await Habit.create({ user: req.user._id, name, frequency, completions: [] });
    res.status(201).json(habit);
  } catch (err) { next(err); }
}

// @route PATCH /api/habits/:id/toggle
// @desc  Toggle today's/this-period's completion on or off
async function toggleHabit(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found.' });

    if (isDoneInCurrentPeriod(habit)) {
      habit.completions.pop();
    } else {
      habit.completions.push(todayISO());
    }
    await habit.save();
    res.json(habit);
  } catch (err) { next(err); }
}

async function deleteHabit(req, res, next) {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getHabits, addHabit, toggleHabit, deleteHabit, isDoneInCurrentPeriod };
