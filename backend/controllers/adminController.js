const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const Investment = require('../models/Investment');
const Feedback = require('../models/Feedback');

// @route GET /api/admin/users
// @desc  List every user with their record counts
async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    const results = await Promise.all(
      users.map(async (u) => {
        const [incomeCount, expenseCount, habitCount, goalCount] = await Promise.all([
          Income.countDocuments({ user: u._id }),
          Expense.countDocuments({ user: u._id }),
          Habit.countDocuments({ user: u._id }),
          Goal.countDocuments({ user: u._id }),
        ]);
        return {
          id: u._id,
          username: u.username,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          txnCount: incomeCount + expenseCount,
          habitCount,
          goalCount,
        };
      })
    );
    res.json(results);
  } catch (err) { next(err); }
}

// @route PATCH /api/admin/users/:id/role
async function toggleUserRole(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.username === 'admin') {
      return res.status(400).json({ message: "The seed admin account's role can't be changed." });
    }
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) { next(err); }
}

// @route DELETE /api/admin/users/:id
async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.username === 'admin') {
      return res.status(400).json({ message: 'The seed admin account cannot be deleted.' });
    }
    const userId = user._id;
    await Promise.all([
      Income.deleteMany({ user: userId }),
      Expense.deleteMany({ user: userId }),
      Habit.deleteMany({ user: userId }),
      Goal.deleteMany({ user: userId }),
      Investment.deleteMany({ user: userId }),
      Feedback.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);
    res.json({ message: 'User removed.' });
  } catch (err) { next(err); }
}

// @route GET /api/admin/usage
// @desc  Signups per week, daily activity, active users, leaderboard
async function usageStats(req, res, next) {
  try {
    const users = await User.find().lean();
    const now = new Date();

    // signups per week, last 8 weeks
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - i * 7 - now.getDay());
      start.setHours(0, 0, 0, 0);
      weeks.push({ start, label: `${start.getMonth() + 1}/${start.getDate()}`, value: 0 });
    }
    users.forEach((u) => {
      const created = new Date(u.createdAt);
      for (let i = weeks.length - 1; i >= 0; i--) {
        if (created >= weeks[i].start) { weeks[i].value++; break; }
      }
    });

    // daily activity, last 14 days (habit check-ins + transactions + goal contributions)
    const days = [];
    const dayKey = (d) => d.toISOString().slice(0, 10);
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      days.push({ key: dayKey(d), label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), value: 0 });
    }
    const dayMap = Object.fromEntries(days.map((d) => [d.key, d]));

    const [allHabits, allIncome, allExpenses, allGoals] = await Promise.all([
      Habit.find().lean(), Income.find().lean(), Expense.find().lean(), Goal.find().lean(),
    ]);
    allHabits.forEach((h) => (h.completions || []).forEach((c) => { if (dayMap[c]) dayMap[c].value++; }));
    allIncome.forEach((t) => { if (dayMap[t.date]) dayMap[t.date].value++; });
    allExpenses.forEach((t) => { if (dayMap[t.date]) dayMap[t.date].value++; });
    allGoals.forEach((g) => (g.contributions || []).forEach((c) => { if (dayMap[c.date]) dayMap[c.date].value++; }));

    // active users (7d) + leaderboard
    const byUser = {};
    users.forEach((u) => { byUser[u._id.toString()] = { name: u.name, username: u.username, score: 0, lastActive: null }; });

    const track = (uid, dateStr) => {
      const key = uid.toString();
      if (!byUser[key]) return;
      byUser[key].score++;
      const d = new Date(dateStr);
      if (!byUser[key].lastActive || d > byUser[key].lastActive) byUser[key].lastActive = d;
    };
    allHabits.forEach((h) => (h.completions || []).forEach((c) => track(h.user, c)));
    allIncome.forEach((t) => track(t.user, t.date));
    allExpenses.forEach((t) => track(t.user, t.date));
    allGoals.forEach((g) => (g.contributions || []).forEach((c) => track(g.user, c.date)));

    const activeUsers7d = Object.values(byUser).filter(
      (u) => u.lastActive && (now - u.lastActive) / 86400000 <= 7
    ).length;
    const engagementRate = users.length ? Math.round((activeUsers7d / users.length) * 100) : 0;
    const leaderboard = Object.values(byUser).sort((a, b) => b.score - a.score).slice(0, 5);
    const totalHabitCheckins = allHabits.reduce((s, h) => s + (h.completions ? h.completions.length : 0), 0);

    res.json({
      activeUsers7d,
      engagementRate,
      totalHabitCheckins,
      signupsByWeek: weeks.map((w) => ({ label: w.label, value: w.value })),
      dailyActivity: days.map((d) => ({ label: d.label, value: d.value })),
      leaderboard,
    });
  } catch (err) { next(err); }
}

module.exports = { listUsers, toggleUserRole, deleteUser, usageStats };
