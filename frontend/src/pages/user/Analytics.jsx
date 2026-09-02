import { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import KpiCard from '../../components/KpiCard';
import { fmt, lastNMonths } from '../../utils/format';

const COLORS = ['#A9832B', '#3D6B52', '#B14B34', '#5B7BA8', '#8A6BAE'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [income, expenses, goals] = await Promise.all([
      api.get('/income').then((r) => r.data),
      api.get('/expenses').then((r) => r.data),
      api.get('/goals').then((r) => r.data),
    ]);
    setData({ income, expenses, goals });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  const { income, expenses, goals } = data;
  const totalIncome = income.reduce((sum, record) => sum + record.amount, 0);
  const totalExpenses = expenses.reduce((sum, record) => sum + record.amount, 0);
  const savings = totalIncome - totalExpenses;
  const goalSavings = goals.reduce((sum, goal) => sum + (goal.current || 0), 0);

  const monthlyData = lastNMonths(6).map((month) => {
    const monthlyIncome = income.filter((record) => record.date.slice(0, 7) === month.key).reduce((sum, record) => sum + record.amount, 0);
    const monthlyExpenses = expenses.filter((record) => record.date.slice(0, 7) === month.key).reduce((sum, record) => sum + record.amount, 0);
    return { label: month.label, income: monthlyIncome, expenses: monthlyExpenses };
  });
  const goalData = goals.filter((goal) => goal.current > 0).map((goal) => ({ name: goal.name, value: goal.current }));

  return (
    <div>
      <PageHead eyebrow="Your money, clearly" title="Income & expense analytics" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5 mb-4.5">
        <KpiCard label="Total Income" value={fmt(totalIncome)} />
        <KpiCard label="Total Expenses" value={fmt(totalExpenses)} deltaTone="down" />
        <KpiCard label="Savings" value={fmt(savings)} delta={savings >= 0 ? 'Income after expenses' : 'Expenses exceed income'} deltaTone={savings >= 0 ? 'up' : 'down'} />
        <KpiCard label="Saved for Goals" value={fmt(goalSavings)} />
      </div>

      <div className="grid md:grid-cols-2 gap-4.5">
        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Monthly income &amp; expenses</div>
          <div className="text-[12.5px] text-inksoft mb-3">Your money in and out over the last six months</div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4A5A6B' }} axisLine={{ stroke: '#DCD5C6' }} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(value) => fmt(value)} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#3D6B52" strokeWidth={2.2} dot={false} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#B14B34" strokeWidth={2.2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Savings by goal</div>
          <div className="text-[12.5px] text-inksoft mb-3">How your saved money is allocated</div>
          {goalData.length ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={goalData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                  {goalData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => fmt(value)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-inksoft text-[13.5px] py-10">Add a contribution to a savings goal to see it here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
