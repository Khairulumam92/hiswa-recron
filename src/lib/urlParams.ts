export type AppMode = 'stan' | 'school';

/**
 * Reads the app mode from URL query params.
 * Supports both ?mode=school and legacy ?from=school
 *
 * Usage:
 *   ?mode=stan    → booth/exhibition mode (default, 2min timer, auto-idle reset)
 *   ?mode=school  → classroom mode (3min timer, no idle reset)
 *   ?from=school  → legacy alias for school mode
 */
export function getAppModeFromUrl(): AppMode {
  if (typeof window === 'undefined') return 'stan';

  const params = new URLSearchParams(window.location.search);

  // Primary param: ?mode=
  const mode = params.get('mode')?.toLowerCase();
  if (mode === 'school' || mode === 'klas' || mode === 'les') return 'school';
  if (mode === 'stan' || mode === 'booth' || mode === 'beurs') return 'stan';

  // Legacy param: ?from=
  const from = params.get('from')?.toLowerCase();
  if (from === 'school' || from === 'klas' || from === 'les') return 'school';

  return 'stan'; // Default: exhibition booth
}
