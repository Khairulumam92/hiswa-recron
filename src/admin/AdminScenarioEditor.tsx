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
        if (field === 'isCorrect' && value === true) {
          prev.forEach((p) => {
            if (p.key !== key) p.isCorrect = false;
          });
        }
        return updated;
      })
    );
  };

  const correctRoleId = options.find((o) => o.isCorrect)?.roleId || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (options.length < 2) return;
    if (!correctRoleId) {
      setError('Please mark one option as the correct answer.');
      return;
    }
    setSaving(true);
    setError(null);

    const scenarioPayload = {
      id: formId || `S${Date.now()}`,
      time_of_day: timeOfDay,
      location,
      title,
      description,
      difficulty,
      correct_role_id: correctRoleId,
      feedback_text: feedbackText,
      is_active: true,
    };

    try {
      if (isEditing) {
        await supabase.from('scenarios').update(scenarioPayload).eq('id', id);
        await supabase.from('scenario_options').delete().eq('scenario_id', id);
      } else {
        await supabase.from('scenarios').insert(scenarioPayload);
      }

      const optionRows = options.map((opt, i) => ({
        scenario_id: formId,
        role_id: opt.roleId,
        label: opt.label,
        is_correct: opt.isCorrect,
        sort_order: i,
      }));

      await supabase.from('scenario_options').insert(optionRows);

      navigate('/admin/scenarios');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin h-8 w-8 border-2 border-slate-400 border-t-white rounded-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">
          {isEditing ? 'Edit Scenario' : 'Add Scenario'}
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/scenarios')}
            className="px-4 py-2 rounded-lg text-slate-400 text-sm hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField label="Scenario ID">
            <input
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              placeholder="S016"
              disabled={isEditing}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500 outline-none disabled:opacity-50"
              required
            />
          </FormField>

          <FormField label="Title (NL)">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Motorpech bij vertrek..."
              className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500 outline-none"
              required
            />
          </FormField>

          <FormField label="Description (NL)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Een familie wil net uitvaren..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500 outline-none resize-y"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Time of Day (NL)">
              <input
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                placeholder="09:15 - Ochtend"
                className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500 outline-none"
                required
              />
            </FormField>

            <FormField label="Location (NL)">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jachthaven Steiger B"
                className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500 outline-none"
                required
              />
            </FormField>
          </div>

          <FormField label="Difficulty">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm focus:border-indigo-500 outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </FormField>

          <FormField label="Feedback Text (NL)">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Super! De technicus vervangt het filter..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0F172A] border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-indigo-500 outline-none resize-y"
              required
            />
          </FormField>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-slate-300 text-sm font-medium">Answer Options</label>
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              Add Option
            </button>
          </div>

          <div className="space-y-3">
            {options.map((opt, i) => (
              <div
                key={opt.key}
                className={`p-3 rounded-lg border ${opt.isCorrect ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700 bg-[#0F172A]'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-500 text-xs font-mono w-5">#{i + 1}</span>
                  <select
                    value={opt.roleId}
                    onChange={(e) => updateOption(opt.key, 'roleId', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded bg-[#1E293B] border border-slate-600 text-white text-xs focus:border-indigo-500 outline-none"
                    required
                  >
                    <option value="">-- Select Role --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title} ({role.category})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => updateOption(opt.key, 'isCorrect', !opt.isCorrect)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium border ${opt.isCorrect ? 'bg-green-600/30 text-green-400 border-green-500/40' : 'bg-slate-800 text-slate-500 border-slate-600 hover:text-green-400'}`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {opt.isCorrect ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    {opt.isCorrect ? 'Correct' : 'Mark Correct'}
                  </button>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(opt.key)}
                      className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  )}
                </div>
                <input
                  value={opt.label}
                  onChange={(e) => updateOption(opt.key, 'label', e.target.value)}
                  placeholder="Jacht & Maritiem Technicus inschakelen..."
                  className="w-full px-3 py-1.5 rounded bg-[#1E293B] border border-slate-600 text-white text-xs placeholder-slate-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            ))}
          </div>

          {!correctRoleId && (
            <p className="mt-2 text-xs text-amber-400">
              Mark one option as correct above.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
