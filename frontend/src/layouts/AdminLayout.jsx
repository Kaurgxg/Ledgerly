import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const NAV_ITEMS = [
  { to: '/admin/users', icon: '☰', label: 'Manage Users' },
  { to: '/admin/usage', icon: '▲', label: 'Platform Usage' },
  { to: '/admin/feedback', icon: '✉', label: 'Feedback & Complaints' },
  { to: '/admin/report', icon: '⬇', label: 'Analytics Report' },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-surface min-h-screen md:flex">
      <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 bg-[#20160D] text-white px-4 py-3.5 font-serif font-semibold text-[17px]">
        <button onClick={() => setOpen(true)} className="border border-white/30 rounded-md px-2.5 py-1.5 text-[15px]" aria-label="Open menu">☰</button>
        Ledgerly Admin
      </div>
      <Sidebar navItems={NAV_ITEMS} isAdmin open={open} onClose={() => setOpen(false)} />
      <main className="flex-1 min-w-0 px-4 py-7 md:px-10 md:py-10 max-w-[1240px]">
        <Outlet />
      </main>
    </div>
  );
}
