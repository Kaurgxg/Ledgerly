import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import KpiCard from '../../components/KpiCard';

export default function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [replyDrafts, setReplyDrafts] = useState({});

  const load = useCallback(async () => {
    const { data } = await api.get('/feedback');
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveReply(id, resolve) {
    const reply = replyDrafts[id];
    await api.patch(`/feedback/${id}/reply`, { reply, resolve });
    load();
  }
  async function reopen(id) {
    await api.patch(`/feedback/${id}/reopen`);
    load();
  }

  if (loading) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  const openCount = items.filter((f) => f.status === 'open').length;
  const filtered = items.filter((f) => (filter === 'all' ? true : f.status === filter));

  return (
    <div>
      <PageHead eyebrow="Support the community" title="Feedback & complaints" />
      <div className="grid md:grid-cols-3 gap-4.5 mb-4.5">
        <KpiCard label="Total Submissions" value={items.length} />
        <KpiCard label="Open" value={openCount} deltaTone="down" />
        <KpiCard label="Resolved" value={items.length - openCount} deltaTone="up" />
      </div>

      <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
        <div className="font-bold text-[15.5px]">Submissions</div>
        <div className="text-[12.5px] text-inksoft mb-3">Review and respond to user feedback and complaints</div>
        <div className="flex gap-2 mb-4">
          {['all', 'open', 'resolved'].map((f) => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={`border rounded-full px-3.5 py-1.5 text-[12px] font-semibold capitalize
                ${filter === f ? 'border-brass bg-brasssoft text-brass' : 'border-line text-inksoft bg-white'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length ? filtered.map((f) => (
          <div key={f._id} className="border border-line rounded-lg p-4 mb-3 bg-[#FCFBF8]">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${f.category === 'Complaint' ? 'bg-rustsoft text-rust' : 'bg-sagesoft text-sage'}`}>{f.category}</span>
              <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${f.status === 'resolved' ? 'bg-sagesoft text-sage' : 'bg-rustsoft text-rust'}`}>
                {f.status === 'resolved' ? 'Resolved' : 'Open'}
              </span>
            </div>
            <div className="text-[11.5px] text-inksoft mb-1">From {f.name} (@{f.username}) · {new Date(f.createdAt).toLocaleString()}</div>
            <div className="font-bold text-[14px] mb-1">{f.subject}</div>
            <div className="text-[13px] text-inksoft mb-2 leading-relaxed">{f.message}</div>
            {f.adminReply && (
              <div className="bg-brasssoft rounded-lg px-3 py-2.5 text-[12.5px] text-[#5A4415] leading-relaxed mb-2">
                <strong>Your reply:</strong> {f.adminReply}
              </div>
            )}
            <div className="flex flex-col gap-2 mt-2.5 sm:flex-row sm:items-start">
              <input
                type="text" placeholder="Write a reply…"
                defaultValue={f.adminReply || ''}
                onChange={(e) => setReplyDrafts((d) => ({ ...d, [f._id]: e.target.value }))}
                className="w-full flex-1 px-2.5 py-2 border-[1.5px] border-line rounded-lg text-[12.5px]"
              />
              <button onClick={() => saveReply(f._id, false)} className="border border-line hover:border-brass hover:text-brass rounded-lg px-3 py-2 text-[12px] font-semibold">
                Save reply
              </button>
              {f.status === 'open' ? (
                <button onClick={() => saveReply(f._id, true)} className="bg-brass hover:bg-[#95721F] text-white rounded-lg px-3.5 py-2 text-[12px] font-bold">
                  Reply &amp; resolve
                </button>
              ) : (
                <button onClick={() => reopen(f._id)} className="border border-line hover:border-brass hover:text-brass rounded-lg px-3 py-2 text-[12px] font-semibold">
                  Reopen
                </button>
              )}
            </div>
          </div>
        )) : <div className="text-center text-inksoft text-[13.5px] py-8">No {filter === 'all' ? '' : filter + ' '}submissions.</div>}
      </div>
    </div>
  );
}
