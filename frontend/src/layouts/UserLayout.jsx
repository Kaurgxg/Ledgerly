import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '◆', label: 'Dashboard' },
  { to: '/expenses', icon: '₹', label: 'Income & Expenses' },
  { to: '/habits', icon: '✓', label: 'Habit Tracker' },
  { to: '/goals', icon: '◎', label: 'Savings Goals' },
  { to: '/analytics', icon: '▲', label: 'Money Analytics' },
  { to: '/feedback', icon: '✉', label: 'Feedback' },
  { to: '/profile', icon: '⚙', label: 'Profile' },
];

export default function UserLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-surface min-h-screen md:flex">
      <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 bg-[#111111] text-white px-4 py-3.5 font-serif font-semibold text-[17px]">
        <button onClick={() => setOpen(true)} className="border border-white/30 rounded-md px-2.5 py-1.5 text-[15px]" aria-label="Open menu">☰</button>
        Ledgerly
      </div>
      <Sidebar navItems={NAV_ITEMS} isAdmin={false} open={open} onClose={() => setOpen(false)} />
      <main className="flex-1 min-w-0 px-4 py-7 md:px-10 md:py-10 max-w-[1240px]">
        <Outlet />
      </main>
    </div>
  );
}
