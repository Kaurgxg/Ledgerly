import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import { fmt } from '../../utils/format';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', target: '', deadline: '' });
  const [contribAmounts, setContribAmounts] = useState({});

  const load = useCallback(async () => {
    const { data } = await api.get('/goals');
    setGoals(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addGoal(e) {
    e.preventDefault();
    await api.post('/goals', { name: form.name, target: Number(form.target), deadline: form.deadline || null });
    setForm({ name: '', target: '', deadline: '' });
    load();
  }
  async function contribute(id) {
    const amount = Number(contribAmounts[id]);
    if (!amount || amount <= 0) return;
    await api.post(`/goals/${id}/contribute`, { amount });
    setContribAmounts((c) => ({ ...c, [id]: '' }));
    load();
  }
  async function remove(id) {
    await api.delete(`/goals/${id}`);
    load();
  }

  if (loading) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  return (
    <div>
      <PageHead eyebrow="Aim, then fund" title="Savings goals" />

      <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm mb-4.5">
        <div className="font-bold text-[15.5px]">Set a new goal</div>
        <div className="text-[12.5px] text-inksoft mb-3">Emergency fund, vacation, a big purchase — name your target</div>
        <form onSubmit={addGoal} className="flex flex-wrap gap-2.5 items-end">
          <div className="flex-[2] min-w-[160px]">
            <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Goal name</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Emergency fund"
              className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Target amount</label>
            <input required type="number" min="1" step="0.01" value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
              className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Deadline (optional)</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
          </div>
          <button className="bg-brass hover:bg-[#95721F] text-white font-bold text-[13.5px] px-4.5 py-2.5 rounded-lg">Add goal</button>
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-4.5">
        {goals.length ? goals.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          return (
            <div key={g._id} className="border border-line rounded-lg p-4.5 bg-[#FCFBF8]">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-[15px]">{g.name}</div>
                  {g.deadline && <div className="text-[11.5px] text-inksoft mt-0.5">Target date: {g.deadline}</div>}
                </div>
                <button onClick={() => remove(g._id)} className="text-[#B0A98F] hover:text-rust text-[15px]">✕</button>
              </div>
              <div className="h-[9px] bg-[#EFEBE0] rounded-md overflow-hidden my-2.5">
                <div className="h-full rounded-md" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #A9832B, #3D6B52)' }} />
              </div>
              <div className="flex justify-between font-mono text-[12.5px] text-inksoft">
                <span>{fmt(g.current)} saved</span><span>{pct}% · goal {fmt(g.target)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="number" min="0" step="0.01" placeholder="Amount"
                  value={contribAmounts[g._id] || ''}
                  onChange={(e) => setContribAmounts((c) => ({ ...c, [g._id]: e.target.value }))}
                  className="w-[100px] px-2.5 py-1.5 border-[1.5px] border-line rounded-md text-[12.5px]"
                />
                <button onClick={() => contribute(g._id)} className="border border-line hover:border-brass hover:text-brass rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold">
                  Add contribution
                </button>
              </div>
            </div>
          );
        }) : <div className="md:col-span-3 text-center text-inksoft text-[13.5px] py-8">No savings goals yet — set one above.</div>}
      </div>
    </div>
  );
}
