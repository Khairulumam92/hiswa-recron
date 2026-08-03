export const GAME_CONSTANTS = {
  TIMER_STAN_SECONDS: Number(import.meta.env.VITE_APP_STAN_TIMER_SECONDS) || 120, // 2 minutes for booth speed run
  TIMER_SCHOOL_SECONDS: Number(import.meta.env.VITE_APP_SCHOOL_TIMER_SECONDS) || 180, // 3 minutes for classroom depth
  IDLE_TIMEOUT_SECONDS: Number(import.meta.env.VITE_APP_IDLE_TIMEOUT_SECONDS) || 45, // 45 seconds idle trigger
  POINTS_PER_CORRECT: 100,
  BONUS_STREAK_MULTIPLIER: 25,
  TOTAL_SECTOR_ROLES_COUNT: 16,
  MAX_SCENARIOS_PER_SESSION: Number(import.meta.env.VITE_APP_MAX_SCENARIOS_PER_SESSION) || 16 // random 16 of 25 per round
};
