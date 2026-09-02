import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import PageHead from '../../components/PageHead';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [infoError, setInfoError] = useState('');
  const [infoSaved, setInfoSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  async function saveInfo(e) {
    e.preventDefault();
    setInfoError('');
    setInfoSaved(false);
    try {
      await api.put('/profile', { name, email });
      updateUser({ name, email });
      setInfoSaved(true);
    } catch (err) {
      setInfoError(err.response?.data?.message || 'Something went wrong.');
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwError('');
    setPwSaved(false);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    try {
      await api.put('/profile/password', pwForm);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwSaved(true);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Something went wrong.');
    }
  }

  async function deleteAccount() {
    if (!confirm('Delete your account and all your data permanently? This cannot be undone.')) return;
    await api.delete('/profile');
    logout();
    navigate('/login');
  }

  return (
    <div>
      <PageHead eyebrow="Your account" title="Financial profile" />
      <div className="grid md:grid-cols-2 gap-4.5 items-start">
        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Profile details</div>
          <div className="text-[12.5px] text-inksoft mb-3">Username @{user.username} · joined {new Date(user.createdAt).toLocaleDateString()}</div>
          {infoError && <div className="bg-rustsoft text-rust text-[13px] px-3 py-2.5 rounded-lg mb-3">{infoError}</div>}
          {infoSaved && <div className="bg-sagesoft text-sage text-[13px] px-3 py-2.5 rounded-lg mb-3">Profile updated.</div>}
          <form onSubmit={saveInfo} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Full name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
            </div>
            <button className="bg-brass hover:bg-[#95721F] text-white font-bold text-[13.5px] px-4.5 py-2.5 rounded-lg">Save changes</button>
          </form>
        </div>

        <div className="bg-white border border-line rounded-[10px] p-5 shadow-sm">
          <div className="font-bold text-[15.5px]">Change password</div>
          <div className="text-[12.5px] text-inksoft mb-3">You&apos;ll need your current password to confirm.</div>
          {pwError && <div className="bg-rustsoft text-rust text-[13px] px-3 py-2.5 rounded-lg mb-3">{pwError}</div>}
          {pwSaved && <div className="bg-sagesoft text-sage text-[13px] px-3 py-2.5 rounded-lg mb-3">Password updated.</div>}
          <form onSubmit={changePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Current password</label>
              <input required type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">New password</label>
              <input required type="password" minLength={4} value={pwForm.newPassword} onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-inksoft mb-1.5">Confirm new password</label>
              <input required type="password" minLength={4} value={pwForm.confirmPassword} onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2.5 border-[1.5px] border-line rounded-lg text-[14.5px]" />
            </div>
            <button className="bg-brass hover:bg-[#95721F] text-white font-bold text-[13.5px] px-4.5 py-2.5 rounded-lg">Update password</button>
          </form>
        </div>
      </div>

      <div className="bg-white border border-rustsoft rounded-[10px] p-5 shadow-sm mt-4.5">
        <div className="font-bold text-[15.5px] text-rust">Delete account</div>
        <div className="text-[12.5px] text-inksoft mb-3">
          Permanently removes your account and all associated income, expenses, habits, goals, investments, and feedback. This cannot be undone.
        </div>
        <button onClick={deleteAccount} className="border border-rust text-rust rounded-lg px-4 py-2 text-[13px] font-semibold hover:bg-rustsoft">
          Delete my account
        </button>
      </div>
    </div>
  );
}
