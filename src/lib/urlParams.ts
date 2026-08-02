export type AppMode = 'stan' | 'school';

export function getAppModeFromUrl(): AppMode {
  if (typeof window === 'undefined') return 'stan';
  
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from')?.toLowerCase();
  
  if (from === 'school' || from === 'klas' || from === 'les') {
    return 'school';
  }
  
  return 'stan'; // Default mode: Exhibition booth
}
