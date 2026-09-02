import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import { isDoneInCurrentPeriod, calcStreak } from '../../utils/format';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const load = useCallback(async () => {
    const { data } = await api.get('/habits');
    setHabits(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addHabit(e) {
    e.preventDefault();
    await api.post('/habits', { name, frequency });
    setName('');
    setFrequency('daily');
    load();
  }
  async function toggle(id) {
    await api.patch(`/habits/${id}/toggle`);
    load();
  }
  async function remove(id) {
    await api.delete(`/habits/${id}`);
    load();
  }

  if (loading) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  return (
    <div>
      <PageHead eyebrow="Discipline, daily" title="Financial habit tracker" />

      <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm mb-4.5">
        <div className="font-bold text-[15.5px]">Add a habit</div>
        <div className="text-[12.5px] text-inksoft mb-3">e.g. "Save ₹500/day", "Log every expense", "Review budget"</div>
        <form onSubmit={addHabit} className="flex flex-wrap gap-2.5 items-end">
          <div className="flex-[2] min-w-[160px]">
            <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Habit name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Save daily"
              className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
              className="px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button className="bg-brass hover:bg-[#95721F] text-white font-bold text-[13.5px] px-4.5 py-2.5 rounded-lg">Add habit</button>
        </form>
      </div>

      <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
        <div className="font-bold text-[15.5px]">Your habits</div>
        <div className="text-[12.5px] text-inksoft mb-1">Mark complete for this period to build your streak</div>
        {habits.length ? habits.map((h) => {
          const done = isDoneInCurrentPeriod(h);
          const streak = calcStreak(h);
          return (
            <div key={h._id} className="flex items-center gap-3.5 py-3.5 border-b border-[#EFEBE0] last:border-none">
              <button
                onClick={() => toggle(h._id)}
                className={`w-[38px] h-[38px] rounded-lg border-2 flex items-center justify-center text-base flex-shrink-0
                  ${done ? 'bg-sage border-sage text-white' : 'bg-white border-line'}`}
              >
                {done ? '✓' : ''}
              </button>
              <div className="flex-1">
                <div className="font-semibold text-[14.5px]">{h.name}</div>
                <div className="text-[11.5px] text-inksoft capitalize">{h.frequency}</div>
              </div>
              <div className="font-mono text-[13px] font-semibold bg-brasssoft text-brass px-2.5 py-1.5 rounded-md">🔥 {streak}</div>
              <button onClick={() => remove(h._id)} className="text-[#B0A98F] hover:text-rust text-[15px] p-1">✕</button>
            </div>
          );
        }) : <div className="text-center text-inksoft text-[13.5px] py-8">No habits yet — add one above to start your streak.</div>}
      </div>
    </div>
  );
}
