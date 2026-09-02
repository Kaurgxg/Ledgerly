import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import { fmt, todayISO, EXPENSE_CATEGORIES } from '../../utils/format';

export default function Expenses() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [incForm, setIncForm] = useState({ source: '', amount: '', date: todayISO() });
  const [expForm, setExpForm] = useState({ category: EXPENSE_CATEGORIES[0], amount: '', date: todayISO() });

  const load = useCallback(async () => {
    const [inc, exp] = await Promise.all([
      api.get('/income').then((r) => r.data),
      api.get('/expenses').then((r) => r.data),
    ]);
    setIncome(inc);
    setExpenses(exp);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addIncome(e) {
    e.preventDefault();
    await api.post('/income', { ...incForm, amount: Number(incForm.amount) });
    setIncForm({ source: '', amount: '', date: todayISO() });
    load();
  }
  async function addExpense(e) {
    e.preventDefault();
    await api.post('/expenses', { ...expForm, amount: Number(expForm.amount) });
    setExpForm({ category: EXPENSE_CATEGORIES[0], amount: '', date: todayISO() });
    load();
  }
  async function deleteTxn(type, id) {
    await api.delete(`/${type === 'income' ? 'income' : 'expenses'}/${id}`);
    load();
  }
  async function downloadReport() {
    const res = await api.get('/reports/monthly', { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledgerly-monthly-report-${todayISO().slice(0, 7)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  const rows = [
    ...income.map((r) => ({ ...r, type: 'income', label: r.source })),
    ...expenses.map((r) => ({ ...r, type: 'expense', label: r.category })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentMonth = todayISO().slice(0, 7);
  const catTotals = {};
  expenses.filter((e) => e.date.slice(0, 7) === currentMonth).forEach((e) => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const catMax = Math.max(1, ...catEntries.map((e) => e[1]));
  const colors = ['#A9832B', '#3D6B52', '#B14B34', '#5B7BA8', '#8A6BAE', '#C79A3C', '#4A8A73', '#B0674F'];

  return (
    <div>
      <PageHead eyebrow="Money in, money out" title="Income & expense tracker" />
      <div className="grid md:grid-cols-2 gap-4.5 items-start">
        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Add income</div>
          <div className="text-[12.5px] text-inksoft mb-3">Log a new income source</div>
          <form onSubmit={addIncome} className="flex flex-wrap gap-2.5 items-end mb-5">
            <TextField label="Source" value={incForm.source} onChange={(v) => setIncForm((f) => ({ ...f, source: v }))} placeholder="Salary, freelance…" />
            <NumField label="Amount" value={incForm.amount} onChange={(v) => setIncForm((f) => ({ ...f, amount: v }))} />
            <DateField label="Date" value={incForm.date} onChange={(v) => setIncForm((f) => ({ ...f, date: v }))} />
            <button className="bg-brass hover:bg-[#95721F] text-white font-bold text-[13.5px] px-4.5 py-2.5 rounded-lg whitespace-nowrap">Add income</button>
          </form>

          <div className="font-bold text-[15.5px]">Add expense</div>
          <div className="text-[12.5px] text-inksoft mb-3">Log daily spending</div>
          <form onSubmit={addExpense} className="flex flex-wrap gap-2.5 items-end">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Category</label>
              <select value={expForm.category} onChange={(e) => setExpForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]">
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <NumField label="Amount" value={expForm.amount} onChange={(v) => setExpForm((f) => ({ ...f, amount: v }))} />
            <DateField label="Date" value={expForm.date} onChange={(v) => setExpForm((f) => ({ ...f, date: v }))} />
            <button className="bg-brass hover:bg-[#95721F] text-white font-bold text-[13.5px] px-4.5 py-2.5 rounded-lg whitespace-nowrap">Add expense</button>
          </form>
        </div>

        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
            <div>
              <div className="font-bold text-[15.5px]">Spending by category</div>
              <div className="text-[12.5px] text-inksoft">This month</div>
            </div>
            <button onClick={downloadReport} className="border border-line hover:border-brass hover:text-brass rounded-lg px-3.5 py-2 text-[12.5px] font-semibold">
              ⬇ Monthly report
            </button>
          </div>
          {catEntries.length ? catEntries.map(([cat, val], i) => (
            <div key={cat} className="mb-2.5 mt-3">
              <div className="flex justify-between text-[12.5px] mb-1">
                <span>{cat}</span><span className="font-mono">{fmt(val)}</span>
              </div>
              <div className="h-2.5 bg-[#EFEBE0] rounded-md overflow-hidden">
                <div className="h-full rounded-md" style={{ width: `${(val / catMax) * 100}%`, background: colors[i % colors.length] }} />
              </div>
            </div>
          )) : <div className="text-center text-inksoft text-[13.5px] py-8">No expenses logged this month yet.</div>}
        </div>
      </div>

      <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm mt-4.5">
        <div className="font-bold text-[15.5px]">All transactions</div>
        <div className="text-[12.5px] text-inksoft mb-3">{rows.length} total</div>
        {rows.length ? (
          <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full min-w-[620px] text-[13.5px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-inksoft font-bold border-b-[1.5px] border-line">
                <th className="py-2 pr-2">Type</th><th className="pr-2">Detail</th><th className="pr-2">Date</th><th className="pr-2 text-right">Amount</th><th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-b border-[#EFEBE0] last:border-none">
                  <td className="py-2.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${r.type === 'income' ? 'bg-sagesoft text-sage' : 'bg-rustsoft text-rust'}`}>
                      {r.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td>{r.label}{r.note && <span className="text-inksoft text-xs"> — {r.note}</span>}</td>
                  <td className="font-mono">{r.date}</td>
                  <td className="font-mono text-right">{r.type === 'income' ? '+' : '-'}{fmt(r.amount)}</td>
                  <td className="text-right">
                    <button onClick={() => deleteTxn(r.type, r._id)} className="text-[#B0A98F] hover:text-rust">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : <div className="text-center text-inksoft text-[13.5px] py-8">No transactions yet.</div>}
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div className="flex-1 min-w-[120px]">
      <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">{label}</label>
      <input required value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
    </div>
  );
}
function NumField({ label, value, onChange }) {
  return (
    <div className="flex-1 min-w-[100px]">
      <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">{label}</label>
      <input required type="number" min="0" step="0.01" value={value} placeholder="0.00" onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
    </div>
  );
}
function DateField({ label, value, onChange }) {
  return (
    <div className="flex-1 min-w-[130px]">
      <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">{label}</label>
      <input required type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
    </div>
  );
}
