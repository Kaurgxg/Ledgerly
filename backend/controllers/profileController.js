const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const Investment = require('../models/Investment');
const Feedback = require('../models/Feedback');

// @route PUT /api/profile
async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// @route PUT /api/profile/password
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match.' });
    }

    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword; // pre-save hook re-hashes
    await user.save();
    res.json({ message: 'Password updated.' });
  } catch (err) {
    next(err);
  }
}

// @route DELETE /api/profile
async function deleteOwnAccount(req, res, next) {
  try {
    const userId = req.user._id;
    await Promise.all([
      Income.deleteMany({ user: userId }),
      Expense.deleteMany({ user: userId }),
      Habit.deleteMany({ user: userId }),
      Goal.deleteMany({ user: userId }),
      Investment.deleteMany({ user: userId }),
      Feedback.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);
    res.json({ message: 'Account deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { updateProfile, changePassword, deleteOwnAccount };
