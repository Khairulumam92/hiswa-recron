import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

/**
 * AdminLayout — Executive HISWA-RECRON Admin Panel Layout
 * High contrast maritime dark theme, clear typography, NO emojis.
 */

export function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06152B]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-9 w-9 border-3 border-white/20 border-t-[#F47D00] rounded-full" />
          <span className="text-xs text-slate-400 font-heading font-medium tracking-wider uppercase">Laden beheerderspaneel...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: 'space_dashboard', label: 'Dashboard Overview' },
    { path: '/admin/scenarios', icon: 'format_list_bulleted', label: 'Beheer Scenario\'s' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-[#06152B] text-slate-100 font-sans">

      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <aside className="w-64 bg-[#0B1D3A] border-r border-[#1B365D] flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1B365D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F47D00] text-white flex items-center justify-center font-heading font-black text-lg shadow-md shrink-0">
              J
            </div>
            <div>
              <h1 className="font-heading font-black text-base text-white tracking-tight leading-none">
                Jong RECRON
              </h1>
              <p className="text-[11px] text-[#38BDF8] font-heading font-bold uppercase tracking-wider mt-1">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest">
            Hoofdmenu
          </div>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all',
                  active
                    ? 'bg-[#F47D00]/15 text-[#F47D00] border border-[#F47D00]/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                <span 
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest">
            Snelkoppelingen
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Bekijk Hoofdapp
          </a>
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[#1B365D] bg-[#08172D]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#003E6F] text-white flex items-center justify-center text-xs font-bold shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.email}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ingelogd als Beheerder
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-heading font-bold text-slate-300 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Uitloggen
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ────────────────────────────────── */}
      <main className="flex-1 overflow-auto bg-[#06152B]">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
