import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ navItems, isAdmin, open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-[230px] flex-shrink-0 flex flex-col p-5 z-50
          transition-transform duration-200 ease-out
          ${isAdmin ? 'bg-[#15100D]' : 'bg-[#101010]'} border-r border-white/[.06]
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center gap-2.5 font-serif text-[20px] font-bold text-white pb-6 mb-3 border-b border-white/10 tracking-[-.04em]">
          <span className="w-2.5 h-2.5 bg-brass rounded-sm rotate-45 inline-block shadow-[0_0_16px_#FF6A00]" />
          Ledgerly
          {isAdmin && (
            <span className="text-[10px] font-bold text-brass border border-brass rounded px-1.5 py-0.5 ml-1 tracking-wide">
              ADMIN
            </span>
          )}
        </div>

        <nav className="flex flex-col gap-0.5 mt-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all
                ${isActive ? 'bg-brass text-white shadow-[0_8px_24px_rgba(255,106,0,.18)]' : 'text-zinc-500 hover:bg-white/[.06] hover:text-white'}`
              }
            >
              <span className="w-4 text-center text-sm">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="border-t border-white/10 pt-3.5 mt-3.5">
          <div className="text-[13px] font-semibold text-white">{user?.name || user?.username}</div>
          <div className="text-[11px] text-[#8195A4] uppercase tracking-wide mt-0.5">
            {user?.role === 'admin' ? 'administrator' : 'member'}
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full bg-white/[.06] hover:bg-white/[.12] text-zinc-300 py-2.5 rounded-xl text-[12px] font-semibold transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
