import { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import KpiCard from '../../components/KpiCard';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleRole(id) {
    await api.patch(`/admin/users/${id}/role`);
    load();
  }
  async function removeUser(id, username) {
    if (!confirm(`Remove user "${username}" and all their data? This cannot be undone.`)) return;
    await api.delete(`/admin/users/${id}`);
    load();
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.name + ' ' + u.username).toLowerCase().includes(q));
  }, [users, search]);

  if (loading) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  const totalTxns = users.reduce((s, u) => s + u.txnCount, 0);
  const totalHabits = users.reduce((s, u) => s + u.habitCount, 0);
  const totalGoals = users.reduce((s, u) => s + u.goalCount, 0);

  return (
    <div>
      <PageHead eyebrow="Manage users" title="Registered accounts" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5 mb-4.5">
        <KpiCard label="Total Users" value={users.length} />
        <KpiCard label="Total Transactions" value={totalTxns} />
        <KpiCard label="Active Habits" value={totalHabits} />
        <KpiCard label="Savings Goals" value={totalGoals} />
      </div>

      <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-2.5 mb-2">
          <div>
            <div className="font-bold text-[15.5px]">Users</div>
            <div className="text-[12.5px] text-inksoft">Manage registered accounts, roles, and access</div>
          </div>
          <input
            type="text" placeholder="Search name or username…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border-[1.5px] border-line rounded-lg text-[13px] w-full sm:w-[220px]"
          />
        </div>

        {filtered.map((u) => (
          <div key={u.id} className="flex flex-col items-start gap-3 py-3.5 border-b border-[#EFEBE0] last:border-none sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-[14px]">
                {u.name}{' '}
                {u.role === 'admin' && <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sagesoft text-sage ml-1">Admin</span>}
              </div>
              <div className="text-[11.5px] text-inksoft break-words">@{u.username} · {u.email} · joined {new Date(u.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex gap-4.5 font-mono text-[12.5px]">
              <Stat label="Txns" value={u.txnCount} />
              <Stat label="Habits" value={u.habitCount} />
              <Stat label="Goals" value={u.goalCount} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:ml-3.5">
              {u.username !== 'admin' && (
                <button onClick={() => toggleRole(u.id)} className="border border-line hover:border-brass hover:text-brass rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold">
                  {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                </button>
              )}
              {u.username !== 'admin' ? (
                <button onClick={() => removeUser(u.id, u.username)} className="text-[#B0A98F] hover:text-rust text-[15px]">✕</button>
              ) : <span className="w-[15px] inline-block" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-right">
      <small className="block text-inksoft font-semibold uppercase text-[9.5px] tracking-wide">{label}</small>
      {value}
    </div>
  );
}
