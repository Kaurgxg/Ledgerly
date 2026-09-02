import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/AuthShell';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [portal, setPortal] = useState(searchParams.get('portal') === 'admin' ? 'admin' : 'user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ username, password, portal });
      navigate(user.role === 'admin' ? '/admin/users' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong logging in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell portal={portal} onPortalChange={setPortal}>
      <h2 className="font-serif text-2xl font-semibold mb-1.5">
        {portal === 'admin' ? 'Admin sign-in' : 'Welcome back'}
      </h2>
      <p className="text-inksoft text-[13.5px] mb-6">
        {portal === 'admin' ? 'Log into the platform Admin Portal.' : 'Log in to your financial ledger.'}
      </p>

      {error && (
        <div className="bg-rustsoft text-rust text-[13px] px-3 py-2.5 rounded-lg mb-4">{error}</div>
      )}
      {searchParams.get('reset') === 'success' && (
        <div className="bg-sagesoft text-sage text-[13px] px-3 py-2.5 rounded-lg mb-4">Password updated. You can now log in.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-inksoft mb-1.5">Username</label>
          <input
            type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px] outline-none focus:border-brass"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-inksoft">Password</label>
            <Link to={`/forgot-password?portal=${portal}`} className="text-[12px] text-brass font-semibold">Forgot password?</Link>
          </div>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px] outline-none focus:border-brass"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-brass hover:bg-[#FF7A1A] text-white py-3 rounded-xl text-[14.5px] font-bold shadow-[0_12px_28px_rgba(255,106,0,.22)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-center text-[13px] text-inksoft mt-5">
        Don&apos;t have an account?{' '}
        <Link to={`/register?portal=${portal}`} className="text-brass font-semibold">Register</Link>
      </p>
    </AuthShell>
  );
}
