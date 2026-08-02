import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

const NAV_ITEMS = [
  { path: '/admin', icon: 'space_dashboard', label: 'Dashboard' },
  { path: '/admin/scenarios', icon: 'format_list_bulleted', label: 'Scenarios' },
];

export function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06152B]">
        <div className="animate-spin h-9 w-9 border-2 border-white/20 border-t-[#F47D00] rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-[#1B365D]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F47D00] text-white flex items-center justify-center font-bold text-lg shrink-0">J</div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight leading-none">Jong RECRON</h1>
            <p className="text-[11px] text-[#38BDF8] font-bold uppercase tracking-wider mt-1">Admin</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={[
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all',
                active
                  ? 'bg-[#F47D00]/15 text-[#F47D00] border border-[#F47D00]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5',
              ].join(' ')}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#1B365D] bg-[#08172D]">
        <div className="text-xs text-white truncate mb-3">{user.email}</div>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate('/admin/login'); }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Uitloggen
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#06152B] text-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0B1D3A] border-r border-[#1B365D] flex-col shrink-0">
        <NavContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-[#0B1D3A] border-r border-[#1B365D] flex flex-col z-50 animate-in slide-in-from-left">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#0B1D3A] border-b border-[#1B365D]">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10">
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          <h1 className="font-bold text-white text-sm">Jong RECRON Admin</h1>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
