import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ScenarioData } from '../game/store/types';

export function AdminScenarios() {
  const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const { data, error: sErr } = await supabase
        .from('scenarios')
        .select('*, scenario_options(*)')
        .order('id');

      if (sErr) throw sErr;

      const mapped: ScenarioData[] = (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        timeOfDay: row.time_of_day as string,
        location: row.location as string,
        title: row.title as string,
        description: row.description as string,
        difficulty: (row.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
        correctRoleId: row.correct_role_id as string,
        feedbackText: row.feedback_text as string,
        is_active: row.is_active !== false,
        options: ((row.scenario_options as Array<Record<string, unknown>>) || []).map((opt) => ({
          roleId: opt.role_id as string,
          label: opt.label as string,
          isCorrect: Boolean(opt.is_correct),
        })),
      }));

      setScenarios(mapped);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fout bij laden van scenario\'s');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Scenario "${id}" definitief verwijderen?`)) return;
    try {
      await supabase.from('scenario_options').delete().eq('scenario_id', id);
      await supabase.from('scenarios').delete().eq('id', id);
      setScenarios((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Verwijderen mislukt');
    }
  };

  const handleToggleActive = async (id: string, current: boolean | undefined) => {
    try {
      await supabase.from('scenarios').update({ is_active: !current }).eq('id', id);
      setScenarios((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !current } as ScenarioData : s))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Update mislukt');
    }
  };

  const filtered = scenarios.filter((s) => {
    const q = filter.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  });

  const difficultyColors: Record<string, string> = {
    easy: 'text-[#2d6a04] bg-[#edf7e3] border-[#2d6a04]/30',
    medium: 'text-[#F47D00] bg-[#fff4e6] border-[#F47D00]/30',
    hard: 'text-red-400 bg-red-500/10 border-red-500/30',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-36">
        <div className="animate-spin h-10 w-10 border-3 border-[#1B365D] border-t-[#F47D00] rounded-full mb-3" />
        <p className="text-xs text-slate-400 font-heading font-medium tracking-wider uppercase">Scenario's laden...</p>
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
          onClick={loadScenarios} 
          className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white font-heading font-bold text-xs transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Opnieuw proberen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">

      {/* ── HEADER BAR ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B365D]">
        <div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Scenario Beheer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Beheer alle {scenarios.length} spelscenario's, situaties en opties.
          </p>
        </div>

        <Link
          to="/admin/scenarios/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F47D00] hover:bg-[#D96F00] text-white text-xs font-heading font-bold transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nieuw Scenario Toevoegen
        </Link>
      </div>

      {/* ── SEARCH BAR & STATS ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Zoek op ID, titel of locatie..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F243E] border border-[#1B365D] text-white text-xs placeholder-slate-400 focus:border-[#F47D00] outline-none shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="px-3 py-1.5 rounded-lg bg-[#0F243E] border border-[#1B365D] font-mono font-bold text-slate-200">
            {filtered.length} / {scenarios.length} scenario's
          </span>
        </div>
      </div>

      {/* ── TABLE CONTAINER ──────────────────────────────────── */}
      <div className="bg-[#0F243E] border border-[#1B365D] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1B365D] bg-[#06152B]/80 text-slate-300 font-heading font-bold uppercase tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Titel & Omschrijving</th>
              <th className="p-4">Locatie</th>
              <th className="p-4">Moeilijkheid</th>
              <th className="p-4 text-center">Opties</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1B365D]">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono font-bold text-[#38BDF8]">{s.id}</td>
                <td className="p-4 max-w-xs">
                  <div className="font-heading font-bold text-white text-sm leading-tight mb-0.5">{s.title}</div>
                  <div className="text-[#94A3B8] text-[11px] line-clamp-1">{s.description}</div>
                </td>
                <td className="p-4 font-medium text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                    {s.location}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-bold border uppercase tracking-wider ${difficultyColors[s.difficulty] || ''}`}>
                    {s.difficulty}
                  </span>
                </td>
                <td className="p-4 text-center font-mono font-bold text-slate-300">
                  {s.options?.length || 0}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-bold border ${
                    s.is_active !== false 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                  }`}>
                    {s.is_active !== false ? 'Actief' : 'Inactief'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleToggleActive(s.id, s.is_active)}
                      className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                      title={s.is_active !== false ? 'Deactiveren' : 'Activeren'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {s.is_active !== false ? 'toggle_on' : 'toggle_off'}
                      </span>
                    </button>
                    <button
                      onClick={() => navigate(`/admin/scenarios/${s.id}/edit`)}
                      className="p-2 rounded-xl text-slate-300 hover:text-[#38BDF8] bg-white/5 hover:bg-[#0284C7]/20 transition-colors"
                      title="Bewerken"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-xl text-slate-300 hover:text-red-400 bg-white/5 hover:bg-red-500/20 transition-colors"
                      title="Verwijderen"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl text-slate-500 mb-1 block">search_off</span>
                  {filter ? 'Geen scenario\'s gevonden die voldoen aan de zoekopdracht.' : 'Nog geen scenario\'s aanwezig.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
