import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import KpiCard from '../../components/KpiCard';
import { fmt, isDoneInCurrentPeriod, lastNMonths } from '../../utils/format';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [income, expenses, habits, goals] = await Promise.all([
      api.get('/income').then((r) => r.data),
      api.get('/expenses').then((r) => r.data),
      api.get('/habits').then((r) => r.data),
      api.get('/goals').then((r) => r.data),
    ]);
    setData({ income, expenses, habits, goals });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markDone(id) {
    await api.patch(`/habits/${id}/toggle`);
    load();
  }

  if (loading || !data) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  const { income, expenses, habits, goals } = data;
  const totalIncome = income.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
  const cashSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (cashSavings / totalIncome) * 100 : 0;

  const pendingHabits = habits.filter((h) => !isDoneInCurrentPeriod(h));
  const recent = [...income.map((r) => ({ ...r, type: 'income' })), ...expenses.map((r) => ({ ...r, type: 'expense', source: r.category }))]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const months = lastNMonths(6);
  const chartData = months.map((m) => {
    const inc = income.filter((r) => r.date.slice(0, 7) === m.key).reduce((s, r) => s + r.amount, 0);
    const exp = expenses.filter((r) => r.date.slice(0, 7) === m.key).reduce((s, r) => s + r.amount, 0);
    return { label: m.label, net: inc - exp };
  });

  return (
    <div>
      <PageHead eyebrow="Overview" title="Your financial dashboard" />

      {pendingHabits.length > 0 && (
        <div className="border border-brass rounded-[22px] p-5 mb-5 bg-brasssoft shadow-[0_18px_45px_rgba(255,106,0,.08)] reveal-up">
          <div className="font-bold text-[15.5px] mb-0.5">🔔 Habit reminders</div>
          <div className="text-[12.5px] text-inksoft mb-2.5">
            {pendingHabits.length} habit{pendingHabits.length === 1 ? '' : 's'} still due this period — keep the streak alive
          </div>
          <div className="flex flex-wrap gap-2.5">
            {pendingHabits.map((h) => (
              <div key={h._id} className="flex items-center gap-2.5 bg-white border border-line rounded-lg px-3 py-2">
                <span className="text-[13px] font-semibold">{h.name}</span>
                <span className="text-[11px] text-inksoft capitalize">({h.frequency})</span>
                <button onClick={() => markDone(h._id)} className="bg-brass hover:bg-[#95721F] text-white text-[11.5px] font-bold px-3 py-1.5 rounded-md">
                  Mark done
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4.5 mb-5">
        <KpiCard label="Total Income" value={fmt(totalIncome)} delta={`${income.length} record${income.length === 1 ? '' : 's'}`} />
        <KpiCard label="Total Expenses" value={fmt(totalExpenses)} delta={`${expenses.length} record${expenses.length === 1 ? '' : 's'}`} deltaTone="down" />
        <KpiCard label="Savings Rate" value={`${savingsRate.toFixed(1)}%`} delta="of income kept" deltaTone={savingsRate >= 0 ? 'up' : 'down'} />
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-4.5">
        <div className="premium-card reveal-up border p-5">
          <div className="font-bold text-[15.5px] mb-0.5">Cash flow — last 6 months</div>
          <div className="text-[12.5px] text-inksoft mb-4">Income minus expenses, by month</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={chartData}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4A5A6B' }} axisLine={{ stroke: '#DCD5C6' }} tickLine={false} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="net" radius={[3, 3, 0, 0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.net >= 0 ? '#3D6B52' : '#B14B34'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="premium-card reveal-up border p-5">
          <div className="font-bold text-[15.5px] mb-0.5">Habits &amp; goals at a glance</div>
          <div className="text-[12.5px] text-inksoft mb-4">Keep the streaks alive</div>
          <div className="flex gap-3.5 mb-4">
            <div className="flex-1 bg-sagesoft rounded-lg p-3.5">
              <div className="font-mono text-[22px] font-semibold text-sage">
                {habits.filter((h) => isDoneInCurrentPeriod(h)).length}/{habits.length}
              </div>
              <div className="text-[11.5px] text-inksoft mt-1">habits on track this period</div>
            </div>
            <div className="flex-1 bg-brasssoft rounded-lg p-3.5">
              <div className="font-mono text-[22px] font-semibold text-brass">
                {goals.length ? Math.round(goals.reduce((s, g) => s + Math.min(100, (g.current / g.target) * 100), 0) / goals.length) : 0}%
              </div>
              <div className="text-[11.5px] text-inksoft mt-1">avg. goal completion</div>
            </div>
          </div>
          <div className="font-bold text-[13px] mb-2">Recent activity</div>
          {recent.length ? (
            <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full min-w-[440px] text-[13.5px]">
              <tbody>
                {recent.map((r) => (
                  <tr key={r._id} className="border-b border-[#EFEBE0] last:border-none">
                    <td className="py-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${r.type === 'income' ? 'bg-sagesoft text-sage' : 'bg-rustsoft text-rust'}`}>
                        {r.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td>{r.source}</td>
                    <td className="font-mono text-right">{r.type === 'income' ? '+' : '-'}{fmt(r.amount)}</td>
                    <td className="font-mono text-[12px] text-inksoft text-right">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <div className="text-center text-inksoft text-[13.5px] py-5">No activity yet — add income or an expense to get started.</div>
          )}
        </div>
      </div>
    </div>
  );
}
