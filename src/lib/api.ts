import { supabase, hasSupabaseConfig } from './supabase';
import type { RoleData, ScenarioData, ScenarioOption } from '../game/store/types';
import { set as idbSet, get as idbGet } from 'idb-keyval';

const CACHE_KEY_ROLES = 'cached-roles';
const CACHE_KEY_SCENARIOS = 'cached-scenarios';

async function cacheSet(key: string, value: unknown): Promise<void> {
  try { await idbSet(key, value); } catch { /* IndexedDB unavailable */ }
}

async function cacheGet<T>(key: string): Promise<T | null> {
  try { return (await idbGet(key)) as T | null; } catch { return null; }
}

export async function fetchRoles(): Promise<RoleData[]> {
  if (hasSupabaseConfig()) {
    try {
      const { data, error } = await supabase.from('roles').select('*').order('category');
      if (!error && data?.length) {
        const roles = data.map(mapDbRowToRole);
        await cacheSet(CACHE_KEY_ROLES, roles);
        return roles;
      }
    } catch { /* network error — fall through to cache */ }
  }

  const cached = await cacheGet<RoleData[]>(CACHE_KEY_ROLES);
  if (cached?.length) return cached;

  return [];
}

export async function fetchScenarios(): Promise<ScenarioData[]> {
  if (hasSupabaseConfig()) {
    try {
      const { data: scenarios, error } = await supabase
        .from('scenarios')
        .select('*, scenario_options(*)')
        .eq('is_active', true)
        .order('id');

      if (!error && scenarios?.length) {
        const mapped = scenarios.map(mapDbRowToScenario);
        await cacheSet(CACHE_KEY_SCENARIOS, mapped);
        return mapped;
      }
    } catch { /* network error — fall through to cache */ }
  }

  const cached = await cacheGet<ScenarioData[]>(CACHE_KEY_SCENARIOS);
  if (cached?.length) return cached;

  return [];
}

function mapDbRowToRole(row: Record<string, unknown>): RoleData {
  return {
    id: row.id as string,
    title: row.title as string,
    category: row.category as string,
    icon: (row.icon as string) || 'Briefcase',
    badgeColor: (row.badge_color as string) || 'navy',
    shortDescription: (row.short_description as string) || '',
    fullDescription: (row.full_description as string) || '',
    keySkills: (row.key_skills as string[]) || [],
    careerPath: (row.career_path as string) || '',
    salaryRange: (row.salary_range as string) || '',
  };
}

function mapDbRowToScenario(row: Record<string, unknown>): ScenarioData {
  const options = (row.scenario_options as Array<Record<string, unknown>>) || [];
  return {
    id: row.id as string,
    timeOfDay: row.time_of_day as string,
    location: row.location as string,
    title: row.title as string,
    description: row.description as string,
    difficulty: (row.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
    correctRoleId: row.correct_role_id as string,
    feedbackText: row.feedback_text as string,
    options: options
      .map((opt) => ({
        roleId: opt.role_id as string,
        label: opt.label as string,
        isCorrect: Boolean(opt.is_correct),
      })),
  };
}
