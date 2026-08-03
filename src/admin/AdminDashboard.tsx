import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalSessions: number;
  totalCompletions: number;
  completionRate: number;
  topRoles: Array<{ roleId: string; title: string; count: number }>;
  sessionsByMode: Array<{ mode: string; count: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: sessions, error: sErr } = await supabase
        .from('aggregate_stats')
        .select('event_type, event_data, created_at')
        .order('created_at', { ascending: false });

      if (sErr) throw sErr;

      const totalSessions = sessions?.filter(s => s.event_type === 'session_started').length || 0;
      const totalCompletions = sessions?.filter(s => s.event_type === 'session_completed').length || 0;
      const completionRate = totalSessions > 0 ? Math.round((totalCompletions / totalSessions) * 100) : 0;

      const rolesCount: Record<string, { title: string; count: number }> = {};
      const modeCounts: Record<string, number> = {};
      const categoryCounts: Record<string, number> = {};

      sessions?.forEach((s) => {
        const data = (s.event_data as Record<string, unknown>) || {};
        if (s.event_type === 'session_started') {
          const mode = (data.mode as string) || 'stan';
          modeCounts[mode] = (modeCounts[mode] || 0) + 1;
        }
        if (s.event_type === 'session_completed' && data.role_id) {
          const rid = data.role_id as string;
          const rtitle = (data.role_title as string) || rid;
          const rcat = (data.category as string) || 'Recreatie';
          if (!rolesCount[rid]) rolesCount[rid] = { title: rtitle, count: 0 };
          rolesCount[rid].count++;

          categoryCounts[rcat] = (categoryCounts[rcat] || 0) + 1;
        }
      });

      const topRoles = Object.entries(rolesCount)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 8)
        .map(([roleId, info]) => ({ roleId, title: info.title, count: info.count }));

      const sessionsByMode = Object.entries(modeCounts).map(([mode, count]) => ({ mode, count }));
      const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

      setStats({
        totalSessions,
        totalCompletions,
        completionRate,
        topRoles,
        sessionsByMode,
        categoryDistribution,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fout bij het laden van statistieken');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-36">
        <div className="animate-spin h-10 w-10 border-3 border-[#1B365D] border-t-[#F47D00] rounded-full mb-3" />
        <p className="text-xs text-slate-400 font-heading font-medium tracking-wider uppercase">Statistieken analyseren...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-red-400 text-2xl">error</span>
          <div>
            <div className="font-heading font-bold text-sm text-white">Fout bij laden</div>
            <div className="text-xs text-red-300 mt-0.5">{error}</div>
          </div>
        </div>
        <button 
          onClick={loadStats} 
          className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white font-heading font-bold text-xs transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Opnieuw proberen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">

      {/* ── HEADER BAR ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B365D]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              Prestatie Dashboard
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Realtime inzicht in sessies, beroepenmatches en bezoekersstatistieken.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F243E] hover:bg-[#152E4E] border border-[#1B365D] text-slate-200 text-xs font-heading font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Vernieuwen
          </button>
        </div>
      </div>

      {/* ── KEY METRICS CARDS ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Totaal Gestarte Sessies" 
          value={stats?.totalSessions ?? 0} 
          icon="query_stats"
          accentColor="#38BDF8"
          bgGradient="from-[#0369A1]/20 to-[#0284C7]/5"
          borderColor="#0284C7/30"
          subtext="Bezoekers op beurs & klaslokaal"
        />
        <MetricCard 
          label="Voltooide Matches" 
          value={stats?.totalCompletions ?? 0} 
          icon="verified"
          accentColor="#10B981"
          bgGradient="from-[#047857]/20 to-[#10B981]/5"
          borderColor="#10B981/30"
          subtext="Volledig afgeronde ontdekkingen"
        />
        <MetricCard 
          label="Voltooiingspercentage" 
          value={`${stats?.completionRate ?? 0}%`} 
          icon="analytics"
          accentColor="#F47D00"
          bgGradient="from-[#C25E00]/20 to-[#F47D00]/5"
          borderColor="#F47D00/30"
          subtext="Gemiddelde retentie per sessie"
        />
        <MetricCard 
          label="Unieke Beroepen Ontdekt" 
          value={stats?.topRoles.length ?? 0} 
          icon="military_tech"
          accentColor="#A855F7"
          bgGradient="from-[#7E22CE]/20 to-[#A855F7]/5"
          borderColor="#A855F7/30"
          subtext="Van de 16 beschikbare functies"
        />
      </div>

      {/* ── ANALYTICS DETAILS ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Roles Selection Ranking */}
        <div className="bg-[#0F243E] border border-[#1B365D] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">leaderboard</span>
              </div>
              <h3 className="font-heading font-black text-white text-base">Populairste Beroepen Matches</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Ranglijst</span>
          </div>

          {!stats?.topRoles.length ? (
            <div className="p-8 text-center border border-dashed border-[#1B365D] rounded-xl bg-[#06152B]/40">
              <span className="material-symbols-outlined text-3xl text-slate-500 mb-1">hourglass_empty</span>
              <p className="text-slate-400 text-xs font-medium">Nog geen voltooid beroepsresultaat geregistreerd.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {stats.topRoles.map((role, i) => {
                const maxCount = stats.topRoles[0].count || 1;
                const percentage = Math.round((role.count / maxCount) * 100);
                return (
                  <div key={role.roleId} className="flex items-center gap-3">
                    <span className="font-heading font-black text-xs text-slate-400 w-5 text-center">
                      {i + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-xs font-heading font-bold">{role.title}</span>
                        <span className="text-[#38BDF8] text-xs font-mono font-bold">{role.count}x</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#06152B] overflow-hidden p-0.5 border border-[#1B365D]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sessions by Game Mode */}
        <div className="bg-[#0F243E] border border-[#1B365D] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F47D00]/15 text-[#F47D00] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <h3 className="font-heading font-black text-white text-base">Verdeling per Spelmodus</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Modus Statistiek</span>
            </div>

            {!stats?.sessionsByMode.length ? (
              <div className="p-8 text-center border border-dashed border-[#1B365D] rounded-xl bg-[#06152B]/40">
                <span className="material-symbols-outlined text-3xl text-slate-500 mb-1">query_stats</span>
                <p className="text-slate-400 text-xs font-medium">Geen modus data beschikbaar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.sessionsByMode.map((item) => {
                  const modeLabel = item.mode === 'stan' ? 'Stan (2 Minuten Beurs-modus)' : 'Klaslokaal (3 Minuten Educatief)';
                  const total = stats?.totalSessions || 1;
                  const pct = Math.round((item.count / total) * 100);
                  const isStan = item.mode === 'stan';

                  return (
                    <div key={item.mode} className="p-4 rounded-xl bg-[#06152B]/60 border border-[#1B365D]">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${isStan ? 'text-[#F47D00]' : 'text-emerald-400'}`}>
                            {isStan ? 'store' : 'school'}
                          </span>
                          <span className="text-white text-xs font-heading font-bold">{modeLabel}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-300">{item.count} sessies ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#0F243E] overflow-hidden border border-[#1B365D]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isStan ? 'bg-[#F47D00]' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Info footer inside card */}
          <div className="mt-6 pt-4 border-t border-[#1B365D] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#38BDF8]">info</span>
              Automatische realtime synchronisatie met Supabase
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  subtext: string;
}

function MetricCard({ label, value, icon, accentColor, bgGradient, subtext }: MetricCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#1B365D] bg-gradient-to-br ${bgGradient} bg-[#0F243E] p-5 shadow-lg transition-transform hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-slate-400 text-xs font-heading font-bold uppercase tracking-wider">
          {label}
        </span>
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shrink-0"
          style={{ background: `${accentColor}20`, color: accentColor }}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
      </div>

      <div className="font-heading font-black text-3xl text-white tracking-tight mb-1 tabular-nums">
        {value}
      </div>

      <div className="text-[11px] text-slate-400 font-medium leading-tight">
        {subtext}
      </div>
    </div>
  );
}
