import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import KpiCard from '../../components/KpiCard';

export default function AdminUsage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await api.get('/admin/usage');
    setData(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  return (
    <div>
      <PageHead eyebrow="Monitor engagement" title="Platform usage" />
      <div className="grid md:grid-cols-3 gap-4.5 mb-4.5">
        <KpiCard label="Active Users (7d)" value={data.activeUsers7d} />
        <KpiCard label="Engagement Rate" value={`${data.engagementRate}%`} />
        <KpiCard label="Total Habit Check-ins" value={data.totalHabitCheckins} />
      </div>

      <div className="grid md:grid-cols-2 gap-4.5">
        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Signups by week</div>
          <div className="text-[12.5px] text-inksoft mb-3">Last 8 weeks</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={data.signupsByWeek}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#4A5A6B' }} axisLine={{ stroke: '#DCD5C6' }} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#A9832B" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Daily platform activity</div>
          <div className="text-[12.5px] text-inksoft mb-3">Transactions, habit check-ins &amp; goal contributions — last 14 days</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={data.dailyActivity}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#4A5A6B' }} axisLine={{ stroke: '#DCD5C6' }} tickLine={false} interval={1} />
              <Tooltip />
              <Bar dataKey="value" fill="#3D6B52" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm mt-4.5">
        <div className="font-bold text-[15.5px]">Most active users</div>
        <div className="text-[12.5px] text-inksoft mb-3">Ranked by total logged activity</div>
        {data.leaderboard.length ? data.leaderboard.map((l, i) => (
          <div key={l.username} className="flex items-center justify-between py-3.5 border-b border-[#EFEBE0] last:border-none">
            <div className="flex items-center gap-3">
              <div className="font-mono w-[22px] text-inksoft font-bold">#{i + 1}</div>
              <div>
                <div className="font-semibold text-[14px]">{l.name}</div>
                <div className="text-[11.5px] text-inksoft">@{l.username}</div>
              </div>
            </div>
            <div className="font-mono font-semibold">{l.score} actions</div>
          </div>
        )) : <div className="text-center text-inksoft text-[13.5px] py-6">No activity yet.</div>}
      </div>
    </div>
  );
}
