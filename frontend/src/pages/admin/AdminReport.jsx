import { useState } from 'react';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';

export default function AdminReport() {
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  async function downloadReport() {
    setLoading(true);
    try {
      const res = await api.get('/reports/platform', { responseType: 'blob' });
      const text = await res.data.text();
      setPreview(text);

      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ledgerly-platform-report-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHead eyebrow="Export a snapshot" title="Analytics report" />
      <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
        <div className="font-bold text-[15.5px]">Generate a platform analytics report</div>
        <div className="text-[12.5px] text-inksoft mb-3">
          Compiles user, financial, habit, goal, and feedback metrics into a downloadable text report — useful for sharing a snapshot with stakeholders.
        </div>
        <button onClick={downloadReport} disabled={loading} className="bg-brass hover:bg-[#95721F] text-white font-bold text-[13.5px] px-4.5 py-2.5 rounded-lg disabled:opacity-60">
          {loading ? 'Generating…' : '⬇ Download report (.txt)'}
        </button>

        {preview && (
          <div className="mt-5">
            <div className="font-bold text-[13.5px] mb-2">Preview</div>
            <pre className="bg-[#FCFBF8] border border-line rounded-lg p-4 text-[11.5px] leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-auto font-mono">
              {preview}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
