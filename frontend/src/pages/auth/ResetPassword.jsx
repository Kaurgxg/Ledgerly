import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import AuthShell from '../../components/AuthShell';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password, confirmPassword });
      navigate('/login?reset=success');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset your password. Request a new link and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell portal="user" onPortalChange={() => {}}>
      <h2 className="font-serif text-2xl font-semibold mb-1.5">Choose a new password</h2>
      <p className="text-inksoft text-[13.5px] mb-6">Use a password you have not used elsewhere.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-rustsoft text-rust text-[13px] px-3 py-2.5 rounded-lg">{error}</div>}
        <PasswordField label="New password" value={password} onChange={setPassword} />
        <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} />
        <button type="submit" disabled={loading} className="w-full bg-brass hover:bg-[#FF7A1A] text-white py-3 rounded-xl text-[14.5px] font-bold shadow-[0_12px_28px_rgba(255,106,0,.22)] disabled:opacity-60">
          {loading ? 'Updating password…' : 'Update password'}
        </button>
      </form>
      <p className="text-center text-[13px] text-inksoft mt-5"><Link to="/login" className="text-brass font-semibold">Back to login</Link></p>
    </AuthShell>
  );
}

function PasswordField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-inksoft mb-1.5">{label}</label>
      <input type="password" required minLength={4} value={value} onChange={(event) => onChange(event.target.value)}
        className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px] outline-none focus:border-brass" />
    </div>
  );
}
