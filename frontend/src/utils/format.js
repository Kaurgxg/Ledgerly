export function fmt(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n || 0);
}

export function fmtShort(n) {
  n = n || 0;
  const sign = n < 0 ? '-' : '';
  n = Math.abs(n);
  if (n >= 10000000) return `${sign}₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `${sign}₹${(n / 100000).toFixed(1)} L`;
  if (n >= 1000) return `${sign}₹${(n / 1000).toFixed(1)}k`;
  return `${sign}₹${n.toFixed(0)}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Rent', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Education', 'Other'];

export function isDoneInCurrentPeriod(habit) {
  if (!habit.completions || habit.completions.length === 0) return false;
  const last = new Date(habit.completions[habit.completions.length - 1]);
  const now = new Date();
  if (habit.frequency === 'daily') return last.toDateString() === now.toDateString();
  const diffDays = (now - last) / 86400000;
  if (habit.frequency === 'weekly') return diffDays < 7;
  return diffDays < 30;
}

export function calcStreak(habit) {
  const dates = (habit.completions || []).slice().sort();
  if (dates.length === 0) return 0;
  const unit = habit.frequency === 'daily' ? 1 : habit.frequency === 'weekly' ? 7 : 30;
  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    const diff = (new Date(dates[i]) - new Date(dates[i - 1])) / 86400000;
    if (diff <= unit + 1) streak++; else break;
  }
  return streak;
}

export function lastNMonths(n) {
  const out = [];
  const d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push({ key: dt.toISOString().slice(0, 7), label: dt.toLocaleDateString('en-IN', { month: 'short' }) });
  }
  return out;
}
