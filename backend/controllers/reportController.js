const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const Investment = require('../models/Investment');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

function fmt(n) {
  return '₹' + (Math.round((n || 0) * 100) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// @route GET /api/reports/monthly
// @desc  Current user's monthly spending report as a downloadable .txt
async function monthlyReport(req, res, next) {
  try {
    const month = new Date().toISOString().slice(0, 7);
    const [income, expenses] = await Promise.all([
      Income.find({ user: req.user._id }),
      Expense.find({ user: req.user._id }),
    ]);
    const thisMonthIncome = income.filter((r) => r.date.slice(0, 7) === month);
    const thisMonthExpenses = expenses.filter((r) => r.date.slice(0, 7) === month);
    const totalIncome = thisMonthIncome.reduce((s, r) => s + r.amount, 0);
    const totalExpenses = thisMonthExpenses.reduce((s, r) => s + r.amount, 0);

    const byCategory = {};
    thisMonthExpenses.forEach((e) => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });

    const lines = [];
    lines.push('LEDGERLY — MONTHLY SPENDING REPORT');
    lines.push(`Account: ${req.user.name} (@${req.user.username})`);
    lines.push(`Month: ${month}`);
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push('='.repeat(46));
    lines.push('');
    lines.push(`Total income:    ${fmt(totalIncome)}`);
    lines.push(`Total expenses:  ${fmt(totalExpenses)}`);
    lines.push(`Net cash flow:   ${fmt(totalIncome - totalExpenses)}`);
    lines.push('');
    lines.push('SPENDING BY CATEGORY');
    lines.push('-'.repeat(46));
    Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, val]) => {
      lines.push(`${cat.padEnd(20)} ${fmt(val)}`);
    });
    lines.push('');
    lines.push('INCOME RECORDS');
    lines.push('-'.repeat(46));
    thisMonthIncome.forEach((r) => lines.push(`${r.date}  ${r.source.padEnd(20)} ${fmt(r.amount)}`));
    lines.push('');
    lines.push('EXPENSE RECORDS');
    lines.push('-'.repeat(46));
    thisMonthExpenses.forEach((r) => lines.push(`${r.date}  ${r.category.padEnd(20)} ${fmt(r.amount)}`));

    const text = lines.join('\n');
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="ledgerly-monthly-report-${month}.txt"`);
    res.send(text);
  } catch (err) { next(err); }
}

// @route GET /api/reports/platform (admin only)
async function platformReport(req, res, next) {
  try {
    const users = await User.find().lean();
    const lines = [];
    let totalIncome = 0, totalExpense = 0, totalGoalCurrent = 0, totalHabitCk = 0;

    lines.push('LEDGERLY — PLATFORM ANALYTICS REPORT');
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push('='.repeat(50));
    lines.push('');

    const feedback = await Feedback.find().lean();
    const openFb = feedback.filter((f) => f.status === 'open').length;

    const perUserLines = [];
    for (const u of users) {
      const [income, expenses, habits, goals] = await Promise.all([
        Income.find({ user: u._id }).lean(),
        Expense.find({ user: u._id }).lean(),
        Habit.find({ user: u._id }).lean(),
        Goal.find({ user: u._id }).lean(),
      ]);
      const inc = income.reduce((s, r) => s + r.amount, 0);
      const exp = expenses.reduce((s, r) => s + r.amount, 0);
      totalIncome += inc;
      totalExpense += exp;
      totalGoalCurrent += goals.reduce((s, g) => s + (g.current || 0), 0);
      totalHabitCk += habits.reduce((s, h) => s + (h.completions ? h.completions.length : 0), 0);

      perUserLines.push(`@${u.username} (${u.name})${u.role === 'admin' ? ' [admin]' : ''}`);
      perUserLines.push(`  Joined: ${new Date(u.createdAt).toLocaleDateString()}`);
      perUserLines.push(`  Income: ${fmt(inc)}  |  Expenses: ${fmt(exp)}  |  Net: ${fmt(inc - exp)}`);
      perUserLines.push(`  Habits: ${habits.length}  |  Goals: ${goals.length}`);
      perUserLines.push('');
    }

    lines.push('PLATFORM TOTALS');
    lines.push(`Users: ${users.length}`);
    lines.push(`Total income logged: ${fmt(totalIncome)}`);
    lines.push(`Total expenses logged: ${fmt(totalExpense)}`);
    lines.push(`Total saved toward goals: ${fmt(totalGoalCurrent)}`);
    lines.push(`Total habit check-ins: ${totalHabitCk}`);
    lines.push(`Feedback submissions: ${feedback.length} (${openFb} open)`);
    lines.push('');
    lines.push('PER-USER BREAKDOWN');
    lines.push('-'.repeat(50));
    lines.push(...perUserLines);

    const text = lines.join('\n');
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="ledgerly-platform-report-${new Date().toISOString().slice(0,10)}.txt"`);
    res.send(text);
  } catch (err) { next(err); }
}

module.exports = { monthlyReport, platformReport };
