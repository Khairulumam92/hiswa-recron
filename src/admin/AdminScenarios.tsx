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
        options: ((row.scenario_options as Array<Record<string, unknown>>) || []).map((opt) => ({
          roleId: opt.role_id as string,
          label: opt.label as string,
          isCorrect: Boolean(opt.is_correct),
        })),
      }));

      setScenarios(mapped);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete scenario "${id}"?`)) return;
    try {
      await supabase.from('scenario_options').delete().eq('scenario_id', id);
      await supabase.from('scenarios').delete().eq('id', id);
      setScenarios((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleToggleActive = async (id: string, current: boolean | undefined) => {
    try {
      await supabase.from('scenarios').update({ is_active: !current }).eq('id', id);
      setScenarios((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !current } as ScenarioData : s))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Update failed');
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
    easy: 'text-green-400 bg-green-500/10',
    medium: 'text-orange-400 bg-orange-500/10',
    hard: 'text-red-400 bg-red-500/10',
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
        <button onClick={loadScenarios} className="ml-3 underline text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">Scenarios</h2>
        <Link
          to="/admin/scenarios/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Scenario
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search scenarios..."
          className="w-full max-w-sm px-3 py-2 rounded-lg bg-[#1E293B] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500 outline-none"
        />
      </div>

      <div className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-slate-400 font-medium">ID</th>
              <th className="text-left p-3 text-slate-400 font-medium">Title</th>
              <th className="text-left p-3 text-slate-400 font-medium">Location</th>
              <th className="text-left p-3 text-slate-400 font-medium">Difficulty</th>
              <th className="text-left p-3 text-slate-400 font-medium">Options</th>
              <th className="text-right p-3 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="p-3 text-slate-300 font-mono text-xs">{s.id}</td>
                <td className="p-3">
                  <span className="text-white font-medium">{s.title}</span>
                </td>
                <td className="p-3 text-slate-400">{s.location}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[s.difficulty] || ''}`}>
                    {s.difficulty}
                  </span>
                </td>
                <td className="p-3 text-slate-400">{s.options?.length || 0}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleActive(s.id, s.is_active)}
                      className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700"
                      title={s.is_active !== false ? 'Deactivate' : 'Activate'}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {s.is_active !== false ? 'toggle_on' : 'toggle_off'}
                      </span>
                    </button>
                    <button
                      onClick={() => navigate(`/admin/scenarios/${s.id}/edit`)}
                      className="p-1.5 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-700"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-700"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  {filter ? 'No scenarios match your search.' : 'No scenarios yet. Create your first one!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
