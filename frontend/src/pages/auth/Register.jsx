import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/AuthShell';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [portal, setPortal] = useState(searchParams.get('portal') === 'admin' ? 'admin' : 'user');
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', adminCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      setError('Username must be 3-20 characters (letters, numbers, underscore).');
      return;
    }
    setLoading(true);
    try {
      const user = await register({ ...form, role: portal });
      navigate(user.role === 'admin' ? '/admin/users' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong creating your account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell portal={portal} onPortalChange={setPortal}>
      <h2 className="font-serif text-2xl font-semibold mb-1.5">
        {portal === 'admin' ? 'Create an admin account' : 'Create your ledger'}
      </h2>
      <p className="text-inksoft text-[13.5px] mb-6">
        {portal === 'admin' ? 'Requires an admin access code from your organization.' : 'Start building financial habits today.'}
      </p>

      {error && (
        <div className="bg-rustsoft text-rust text-[13px] px-3 py-2.5 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" type="text" value={form.name} onChange={update('name')} />
        <Field label="Username" type="text" value={form.username} onChange={update('username')} />
        <Field label="Email" type="email" value={form.email} onChange={update('email')} />
        <Field label="Password" type="password" value={form.password} onChange={update('password')} minLength={4} />
        {portal === 'admin' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-inksoft mb-1.5">Admin access code</label>
            <input
              type="text" value={form.adminCode} onChange={update('adminCode')} placeholder="Provided by your organization"
              className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px] outline-none focus:border-brass"
            />
          </div>
        )}
        <button
          type="submit" disabled={loading}
          className="w-full bg-brass hover:bg-[#FF7A1A] text-white py-3 rounded-xl text-[14.5px] font-bold shadow-[0_12px_28px_rgba(255,106,0,.22)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-[13px] text-inksoft mt-5">
        Already have an account?{' '}
        <Link to={`/login?portal=${portal}`} className="text-brass font-semibold">Log in</Link>
      </p>
    </AuthShell>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-inksoft mb-1.5">{label}</label>
      <input
        required {...props}
        className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px] outline-none focus:border-brass"
      />
    </div>
  );
}
