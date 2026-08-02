import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalSessions: number;
  totalCompletions: number;
  completionRate: number;
  topRoles: Array<{ roleId: string; title: string; count: number }>;
  sessionsByMode: Array<{ mode: string; count: number }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: sessions, error: sErr } = await supabase
        .from('aggregate_stats')
        .select('event_type, event_data');

      if (sErr) throw sErr;

      const totalSessions = sessions?.filter(s => s.event_type === 'session_started').length || 0;
      const totalCompletions = sessions?.filter(s => s.event_type === 'session_completed').length || 0;
      const completionRate = totalSessions > 0 ? Math.round((totalCompletions / totalSessions) * 100) : 0;

      const rolesCount: Record<string, { title: string; count: number }> = {};
      const modeCounts: Record<string, number> = {};

      sessions?.forEach((s) => {
        const data = (s.event_data as Record<string, unknown>) || {};
        if (s.event_type === 'session_started') {
          const mode = (data.mode as string) || 'unknown';
          modeCounts[mode] = (modeCounts[mode] || 0) + 1;
        }
        if (s.event_type === 'session_completed' && data.role_id) {
          const rid = data.role_id as string;
          const rtitle = (data.role_title as string) || rid;
          if (!rolesCount[rid]) rolesCount[rid] = { title: rtitle, count: 0 };
          rolesCount[rid].count++;
        }
      });

      const topRoles = Object.entries(rolesCount)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 8)
        .map(([roleId, info]) => ({ roleId, title: info.title, count: info.count }));

      const sessionsByMode = Object.entries(modeCounts).map(([mode, count]) => ({ mode, count }));

      setStats({
        totalSessions,
        totalCompletions,
        completionRate,
        topRoles,
        sessionsByMode,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin h-8 w-8 border-2 border-slate-400 border-t-white rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
        {error}
        <button onClick={loadStats} className="ml-3 underline text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Sessions" value={stats?.totalSessions ?? 0} color="indigo" />
        <StatCard label="Completions" value={stats?.totalCompletions ?? 0} color="green" />
        <StatCard label="Completion Rate" value={`${stats?.completionRate ?? 0}%`} color="orange" />
        <StatCard
          label="Roles Discovered"
          value={stats?.topRoles.length ?? 0}
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-5">
          <h3 className="font-heading font-semibold text-white text-sm mb-4">Top Roles by Selection</h3>
          {!stats?.topRoles.length ? (
            <p className="text-slate-400 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.topRoles.map((role, i) => (
                <div key={role.roleId} className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs w-6">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm font-medium">{role.title}</span>
                      <span className="text-slate-400 text-xs">{role.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${(role.count / stats.topRoles[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-5">
          <h3 className="font-heading font-semibold text-white text-sm mb-4">Sessions by Mode</h3>
          {!stats?.sessionsByMode.length ? (
            <p className="text-slate-400 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.sessionsByMode.map((item) => (
                <div key={item.mode} className="flex items-center gap-3">
                  <span className="text-white text-sm flex-1 capitalize">{item.mode}</span>
                  <span className="text-slate-400 text-sm">{item.count}</span>
                  <div className="w-32 h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${Math.min(100, (item.count / (stats?.totalSessions || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    green: 'bg-green-500/10 border-green-500/20 text-green-300',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] || colorMap.indigo}`}>
      <div className="text-2xl font-heading font-bold mb-1">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}
