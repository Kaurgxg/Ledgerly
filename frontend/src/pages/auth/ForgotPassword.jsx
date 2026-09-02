import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import AuthShell from '../../components/AuthShell';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [portal, setPortal] = useState(searchParams.get('portal') === 'admin' ? 'admin' : 'user');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send the reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell portal={portal} onPortalChange={setPortal}>
      <h2 className="font-serif text-2xl font-semibold mb-1.5">Reset your password</h2>
      <p className="text-inksoft text-[13.5px] mb-6">Enter the email address linked to your {portal === 'admin' ? 'Admin' : 'User'} Portal account.</p>

      {sent ? (
        <div className="bg-sagesoft text-sage text-[13px] px-3 py-3 rounded-lg leading-relaxed">
          If an account matches that email, a reset link has been sent. Please check your inbox and spam folder.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-rustsoft text-rust text-[13px] px-3 py-2.5 rounded-lg">{error}</div>}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-inksoft mb-1.5">Email address</label>
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)}
              className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px] outline-none focus:border-brass" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brass hover:bg-[#FF7A1A] text-white py-3 rounded-xl text-[14.5px] font-bold shadow-[0_12px_28px_rgba(255,106,0,.22)] disabled:opacity-60">
            {loading ? 'Sending link…' : 'Email reset link'}
          </button>
        </form>
      )}

      <p className="text-center text-[13px] text-inksoft mt-5">
        Remembered your password? <Link to={`/login?portal=${portal}`} className="text-brass font-semibold">Log in</Link>
      </p>
    </AuthShell>
  );
}
