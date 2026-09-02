import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';

const CATEGORIES = ['Feedback', 'Complaint', 'Bug', 'Feature request'];

export default function Feedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: 'Feedback', subject: '', message: '' });

  const load = useCallback(async () => {
    const { data } = await api.get('/feedback');
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function submit(e) {
    e.preventDefault();
    await api.post('/feedback', form);
    setForm({ category: 'Feedback', subject: '', message: '' });
    load();
  }

  if (loading) return <div className="text-inksoft text-sm py-10 text-center">Loading…</div>;

  return (
    <div>
      <PageHead eyebrow="We're listening" title="Feedback & complaints" />
      <div className="grid md:grid-cols-2 gap-4.5 items-start">
        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Send feedback</div>
          <div className="text-[12.5px] text-inksoft mb-3">Report a bug, raise a complaint, or suggest an improvement — the admin team reviews every submission.</div>
          <form onSubmit={submit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Subject</label>
              <input required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Short summary"
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Tell us what happened or what you'd like to see…"
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px] resize-y" />
            </div>
            <button className="w-full bg-brass hover:bg-[#95721F] text-white font-bold text-[13.5px] py-2.5 rounded-lg">Submit</button>
          </form>
        </div>

        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Your submissions</div>
          <div className="text-[12.5px] text-inksoft mb-3">{items.length} sent · status updates from the admin team appear here</div>
          {items.length ? items.map((f) => (
            <div key={f._id} className="border border-line rounded-lg p-4 mb-3 bg-[#FCFBF8]">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${f.category === 'Complaint' ? 'bg-rustsoft text-rust' : 'bg-sagesoft text-sage'}`}>{f.category}</span>
                <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${f.status === 'resolved' ? 'bg-sagesoft text-sage' : 'bg-rustsoft text-rust'}`}>
                  {f.status === 'resolved' ? 'Resolved' : 'Open'}
                </span>
              </div>
              <div className="font-bold text-[14px] mb-1">{f.subject}</div>
              <div className="text-[13px] text-inksoft mb-2 leading-relaxed">{f.message}</div>
              <div className="text-[11px] text-[#9B937A] font-mono">{new Date(f.createdAt).toLocaleString()}</div>
              {f.adminReply && (
                <div className="mt-2.5 bg-brasssoft rounded-lg px-3 py-2.5 text-[12.5px] text-[#5A4415] leading-relaxed">
                  <strong>Admin reply:</strong> {f.adminReply}
                </div>
              )}
            </div>
          )) : <div className="text-center text-inksoft text-[13.5px] py-8">You haven&apos;t sent any feedback yet.</div>}
        </div>
      </div>
    </div>
  );
}
