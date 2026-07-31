// Pure game loop utilities (stateless)
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getTimerColor(remaining: number, total: number): string {
  const ratio = remaining / total;
  if (ratio > 0.5) return '#003E6F';
  if (ratio > 0.25) return '#F47D00';
  return '#BA1A1A';
}

export function isUrgent(remaining: number): boolean {
  return remaining <= 20;
}
