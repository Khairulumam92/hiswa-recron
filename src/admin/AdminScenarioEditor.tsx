import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { RoleData } from '../game/store/types';

interface OptionRow {
  key: string;
  roleId: string;
  label: string;
  isCorrect: boolean;
}

function genKey() {
  return `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AdminScenarioEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successFlash, setSuccessFlash] = useState(false);

  const [formId, setFormId] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [feedbackText, setFeedbackText] = useState('');
  const [options, setOptions] = useState<OptionRow[]>([
    { key: genKey(), roleId: '', label: '', isCorrect: false },
    { key: genKey(), roleId: '', label: '', isCorrect: false },
  ]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: roleData, error: rErr } = await supabase.from('roles').select('*').order('title');
      if (rErr) throw rErr;

      const mappedRoles: RoleData[] = (roleData || []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        title: r.title as string,
        category: r.category as string,
        icon: (r.icon as string) || 'Briefcase',
        badgeColor: (r.badge_color as string) || 'navy',
        shortDescription: (r.short_description as string) || '',
        fullDescription: (r.full_description as string) || '',
        keySkills: (r.key_skills as string[]) || [],
        careerPath: (r.career_path as string) || '',
        salaryRange: (r.salary_range as string) || '',
      }));
      setRoles(mappedRoles);

      if (isEditing && id) {
        const { data: scenarioData, error: sErr } = await supabase
          .from('scenarios')
          .select('*, scenario_options(*)')
          .eq('id', id)
          .single();

        if (sErr) throw sErr;
        if (scenarioData) {
          const s = scenarioData as Record<string, unknown>;
          setFormId(s.id as string);
          setTimeOfDay(s.time_of_day as string);
          setLocation(s.location as string);
          setTitle(s.title as string);
          setDescription(s.description as string);
          setDifficulty((s.difficulty as 'easy' | 'medium' | 'hard') || 'easy');
          setFeedbackText(s.feedback_text as string);

          const opts = (s.scenario_options as Array<Record<string, unknown>>) || [];
          if (opts.length) {
            setOptions(
              opts.map((opt) => ({
                key: genKey(),
                roleId: opt.role_id as string,
                label: opt.label as string,
                isCorrect: Boolean(opt.is_correct),
              }))
            );
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    setOptions((prev) => [...prev, { key: genKey(), roleId: '', label: '', isCorrect: false }]);
  };

  const removeOption = (key: string) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((o) => o.key !== key));
  };

  const updateOption = (key: string, field: keyof OptionRow, value: string | boolean) => {
    setOptions((prev) =>
      prev.map((o) => {
        if (o.key !== key) return o;
        const updated = { ...o, [field]: value };
        return updated;
      })
    );
    if (field === 'isCorrect' && value === true) {
      setOptions((prev) =>
        prev.map((o) => (o.key === key ? o : { ...o, isCorrect: false }))
      );
    }
  };

  const correctRoleId = options.find((o) => o.isCorrect)?.roleId || '';
  const orderedOptions = [...options].sort((a, b) => {
    if (a.isCorrect) return -1;
    if (b.isCorrect) return 1;
    return 0;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (options.length < 2) return;
    if (!correctRoleId) {
      setError('Please mark one option as the correct answer.');
      return;
    }
    setSaving(true);
    setError(null);

    const scenarioId = formId || `S${Date.now()}`;
    const scenarioPayload = {
      id: scenarioId,
      time_of_day: timeOfDay,
      location,
      title,
      description,
      difficulty,
      correct_role_id: correctRoleId,
      feedback_text: feedbackText,
      is_active: true,
    };

    const optionRows = options.map((opt, i) => ({
      scenario_id: scenarioId,
      role_id: opt.roleId,
      label: opt.label,
      is_correct: opt.isCorrect,
      sort_order: i,
    }));

    try {
      if (isEditing) {
        const { error: updErr } = await supabase.from('scenarios').update(scenarioPayload).eq('id', id);
        if (updErr) throw updErr;
        const { error: delErr } = await supabase.from('scenario_options').delete().eq('scenario_id', id);
        if (delErr) throw delErr;
      } else {
        const { error: insErr } = await supabase.from('scenarios').insert(scenarioPayload);
        if (insErr) throw insErr;
      }

      const { error: optErr } = await supabase.from('scenario_options').insert(optionRows);
      if (optErr) throw optErr;
      
      setSuccessFlash(true);
      setTimeout(() => navigate('/admin/scenarios'), 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setSaving(false);
      return;
    }
  };

  const filledFields = [formId, timeOfDay, location, title, description, feedbackText].filter(Boolean).length;
  const totalFields = 6;
  const progress = Math.round((filledFields / totalFields) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin h-8 w-8 border-2 border-slate-400 border-t-white rounded-full" />
      </div>
    );
  }

  const difficultyConfig = {
    easy: { label: 'Easy', color: 'emerald', icon: 'sentiment_satisfied', desc: 'Ochtend — situatie is duidelijk, rol makkelijk te raden' },
    medium: { label: 'Medium', color: 'amber', icon: 'psychology', desc: 'Middag — vereist enig nadenken' },
    hard: { label: 'Hard', color: 'rose', icon: 'mood_bad', desc: 'Avond — complex, heeft strategie nodig' },
  } as const;

  const difficultyLookup: Record<string, { active: string; icon: string }> = {
    easy:   { active: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-sm', icon: 'text-emerald-400' },
    medium: { active: 'border-amber-500/50 bg-amber-500/10 text-amber-300 shadow-sm', icon: 'text-amber-400' },
    hard:   { active: 'border-rose-500/50 bg-rose-500/10 text-rose-300 shadow-sm', icon: 'text-rose-400' },
  };

  const dc = difficultyConfig[difficulty];

  return (
    <form onSubmit={handleSubmit}>
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/scenarios')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 text-sm hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Scenarios
        </button>
        <span className="text-slate-600">/</span>
        <h2 className="font-heading font-bold text-xl text-white">
          {isEditing ? `Edit ${formId}` : 'New Scenario'}
        </h2>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/scenarios')}
            className="px-4 py-2 rounded-lg text-slate-400 text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
          >
            <span className="material-symbols-outlined text-[18px]">
              {saving ? 'sync' : 'save'}
            </span>
            {saving ? 'Saving...' : 'Save Scenario'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 bg-[#1E293B] border border-slate-700/60 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs font-medium">Form Completion</span>
          <span className="text-indigo-400 text-xs font-bold tabular-nums">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
          <div className="flex-1">{error}</div>
          <button onClick={() => setError(null)} className="shrink-0 text-red-400/60 hover:text-red-400">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Success flash */}
      {successFlash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1E293B] border border-emerald-500/30 rounded-2xl p-8 text-center shadow-2xl animate-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px] text-emerald-400">check</span>
            </div>
            <p className="text-white font-heading font-bold text-lg mb-1">Scenario Saved</p>
            <p className="text-slate-400 text-sm">Redirecting to scenarios list...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Main form — 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          {/* Scenario identity card */}
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-700/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-indigo-400">description</span>
              </div>
              <span className="font-heading font-semibold text-white text-sm">Scenario Details</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">ID</label>
                  <input
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="S016"
                    disabled={isEditing}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 outline-none disabled:opacity-50 font-mono transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Time</label>
                  <input
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    placeholder="09:15 - Ochtend"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Jachthaven Steiger B"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Motorpech bij vertrek van een zeiljacht!"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Een familie wil net uitvaren voor het weekend..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-y transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Difficulty</label>
                  <div className="flex gap-2">
                    {(Object.keys(difficultyConfig) as Array<'easy' | 'medium' | 'hard'>).map((key) => {
                      const item = difficultyConfig[key];
                      const active = difficulty === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setDifficulty(key)}
                          className={`flex-1 flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                            active
                              ? difficultyLookup[key]?.active || 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 shadow-sm'
                              : 'border-slate-700 bg-[#0F172A] text-slate-500 hover:border-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[16px] ${active ? difficultyLookup[key]?.icon || '' : ''}`}>
                            {item.icon}
                          </span>
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1.5 flex items-center gap-1">
                    <span className={`material-symbols-outlined text-[12px] text-${dc.color}-400`}>{dc.icon}</span>
                    {dc.desc}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Feedback</label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Super! De technicus vervangt het filter..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-y transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Options card */}
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">list_alt</span>
                </div>
                <span className="font-heading font-semibold text-white text-sm">Answer Options</span>
                <span className="text-slate-600 text-xs">{options.length} options</span>
              </div>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 hover:border-indigo-500/50 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                Add Option
              </button>
            </div>
            <div className="p-5 space-y-3">
              {orderedOptions.map((opt, displayIndex) => {
                const matchedRole = roles.find((r) => r.id === opt.roleId);
                return (
                  <div
                    key={opt.key}
                    className={`group relative rounded-xl border-2 transition-all duration-200 ${
                      opt.isCorrect
                        ? 'border-emerald-500/40 bg-emerald-500/[0.04] shadow-sm shadow-emerald-500/5'
                        : 'border-slate-700/60 bg-[#0F172A] hover:border-slate-600'
                    }`}
                  >
                    {opt.isCorrect && (
                      <div className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                          opt.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
                        }`}>
                          {displayIndex + 1}
                        </div>

                        <div className="flex-1 space-y-2.5 min-w-0">
                          <select
                            value={opt.roleId}
                            onChange={(e) => updateOption(opt.key, 'roleId', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#1E293B] border border-slate-600 text-white text-sm focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-colors"
                            required
                          >
                            <option value="">Select a role...</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.title}
                              </option>
                            ))}
                          </select>

                          {matchedRole && (
                            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 w-fit">
                              <span className="w-2 h-2 rounded-full" style={{
                                backgroundColor: {
                                  cyan: '#22d3ee', amber: '#f59e0b', blue: '#3b82f6',
                                  emerald: '#10b981', purple: '#a855f7', rose: '#f43f5e',
                                  orange: '#f97316', navy: '#6366f1', green: '#22c55e',
                                }[matchedRole.badgeColor] || '#64748b'
                              }} />
                              <span className="text-slate-400 text-[11px]">{matchedRole.category}</span>
                            </div>
                          )}

                          <input
                            value={opt.label}
                            onChange={(e) => updateOption(opt.key, 'label', e.target.value)}
                            placeholder="Jacht & Maritiem Technicus inschakelen met de gereedschapskist"
                            className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-sm placeholder-slate-500 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-colors"
                            required
                          />
                        </div>

                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateOption(opt.key, 'isCorrect', !opt.isCorrect)}
                            className={`p-2 rounded-lg border transition-all ${
                              opt.isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'border-slate-600 text-slate-600 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                            title={opt.isCorrect ? 'Correct answer' : 'Mark as correct'}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {opt.isCorrect ? 'verified' : 'check_circle'}
                            </span>
                          </button>

                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(opt.key)}
                              className="p-2 rounded-lg border border-slate-600 text-slate-600 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                              title="Remove option"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!correctRoleId && orderedOptions.length > 0 && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-400/80 text-sm">
                  <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
                  Click the checkmark button on one option to mark it as the correct answer.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview panel — 2 cols */}
        <div className="lg:col-span-2">
          <div className="sticky top-8 space-y-6">
            {/* Preview card */}
            <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-700/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-cyan-400">preview</span>
                </div>
                <span className="font-heading font-semibold text-white text-sm">Live Preview</span>
              </div>

              <div className="p-5">
                {!title && !description ? (
                  <div className="text-center py-10 text-slate-500">
                    <span className="material-symbols-outlined text-[40px] mb-3 block opacity-40">edit_note</span>
                    <p className="text-sm">Fill in the form to see a preview</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Simulated game card */}
                    <div className="rounded-xl bg-[#0F172A] border border-slate-700/60 overflow-hidden">
                      <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-700/40 bg-slate-800/30">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                            difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-rose-500/20 text-rose-400'
                          }`}>
                            {difficulty}
                          </span>
                          <span className="text-slate-400 text-[11px] font-medium">{timeOfDay || '09:15'}</span>
                        </div>
                        <span className="text-slate-500 text-[10px] font-mono">{location || 'Jachthaven'}</span>
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-heading font-bold text-sm mb-1.5">
                          {title || 'Title will appear here'}
                        </h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {description || 'Description will appear here'}
                        </p>
                      </div>
                    </div>

                    {/* Simulated options */}
                    <div className="space-y-2">
                      <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                        Answer Options ({orderedOptions.length})
                      </p>
                      {orderedOptions.map((opt, i) => {
                        const matchedRole = roles.find((r) => r.id === opt.roleId);
                        return (
                          <div
                            key={opt.key}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-xs transition-all ${
                              opt.isCorrect
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-slate-700/40 bg-[#0F172A]'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              opt.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="text-slate-300 truncate block">
                                {opt.label || 'Option label...'}
                              </span>
                              {matchedRole && (
                                <span className="text-slate-500 text-[10px]">{matchedRole.title}</span>
                              )}
                            </div>
                            {opt.isCorrect && (
                              <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">check_circle</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Simulated feedback */}
                    {feedbackText && (
                      <div className="px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700/40 flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] text-amber-400 shrink-0 mt-0.5">campaign</span>
                        <p className="text-slate-400 text-[11px] leading-relaxed italic">{feedbackText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats card */}
            <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5">
              <h4 className="font-heading font-semibold text-white text-sm mb-4">Scenario Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#0F172A] border border-slate-700/60 p-3 text-center">
                  <div className="text-indigo-400 text-lg font-heading font-bold tabular-nums">{options.length}</div>
                  <div className="text-slate-500 text-[11px]">Options</div>
                </div>
                <div className="rounded-lg bg-[#0F172A] border border-slate-700/60 p-3 text-center">
                  <div className={`text-lg font-heading font-bold tabular-nums ${correctRoleId ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {correctRoleId ? 'Yes' : 'No'}
                  </div>
                  <div className="text-slate-500 text-[11px]">Correct Answer Set</div>
                </div>
                <div className="rounded-lg bg-[#0F172A] border border-slate-700/60 p-3 text-center">
                  <div className="text-cyan-400 text-lg font-heading font-bold tabular-nums">{title.length}</div>
                  <div className="text-slate-500 text-[11px]">Title Chars</div>
                </div>
                <div className="rounded-lg bg-[#0F172A] border border-slate-700/60 p-3 text-center">
                  <div className="text-amber-400 text-lg font-heading font-bold tabular-nums">{description.length}</div>
                  <div className="text-slate-500 text-[11px]">Description Chars</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
