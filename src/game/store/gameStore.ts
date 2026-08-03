import { create } from 'zustand';
import { GameStoreState, GameMode, ScenarioOption, RoleData, ScenarioData } from './types';
import { GAME_CONSTANTS } from '../../lib/constants';
import { calculateTopMatchedRole } from '../engine/ResultCalculator';
import { logGameCompletion } from '../../lib/analytics';
import { fetchRoles, fetchScenarios } from '../../lib/api';

const STATIC_ROLES = import.meta.glob('../../content/roles/*.json', { eager: true }) as Record<string, { default: RoleData }>;
const STATIC_SCENARIOS = import.meta.glob('../../content/scenarios/*.json', { eager: true }) as Record<string, { default: ScenarioData }>;

const FALLBACK_ROLES: RoleData[] = Object.values(STATIC_ROLES).map(m => m.default);
const FALLBACK_SCENARIOS: ScenarioData[] = Object.values(STATIC_SCENARIOS).map(m => m.default);

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  sessionId: `session_${Date.now()}`,
  mode: 'stan',
  phase: 'intro',
  soundEnabled: true,
  theme: 'dark',

  timeRemaining: GAME_CONSTANTS.TIMER_STAN_SECONDS,
  score: 0,
  streak: 0,
  maxStreak: 0,
  currentScenarioIndex: 0,
  discoveredRolesCount: 0,

  activeRoleReveal: null,

  scenarios: [] as ScenarioData[],
  roles: [],
  isContentReady: false,
  contentError: null,
  selectedRoleCounts: {},
  playHistory: [],
  matchedRole: null,
  matchScorePercentage: 0,

  isIdleOverlayVisible: false,
  activeTab: 'home',

  setActiveTab: (activeTab) => set({ activeTab }),

  setMode: (mode: GameMode) => {
    set({
      mode,
      timeRemaining: mode === 'school' ? GAME_CONSTANTS.TIMER_SCHOOL_SECONDS : GAME_CONSTANTS.TIMER_STAN_SECONDS
    });
  },

  setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled }),
  setTheme: (theme: 'dark' | 'light') => set({ theme }),

  startGame: () => {
    const { mode } = get();
    const initialTime = mode === 'school' ? GAME_CONSTANTS.TIMER_SCHOOL_SECONDS : GAME_CONSTANTS.TIMER_STAN_SECONDS;
    return Promise.resolve().then(async () => {
      let roles: RoleData[] = [];
      let scenarios: ScenarioData[] = [];
      try {
        const [fRoles, fScenarios] = await Promise.all([fetchRoles(), fetchScenarios()]);
        roles = fRoles.length ? fRoles : FALLBACK_ROLES;
        scenarios = fScenarios.length ? fScenarios : FALLBACK_SCENARIOS;
      } catch {
        roles = FALLBACK_ROLES;
        scenarios = FALLBACK_SCENARIOS;
      }
      if (!roles.length || !scenarios.length) {
        set({ contentError: 'No content available. Please try again later.' });
        return;
      }
      const shuffledScenarios = shuffleArray(scenarios).slice(0, GAME_CONSTANTS.MAX_SCENARIOS_PER_SESSION);
      set({
        sessionId: `session_${Date.now()}`,
        phase: 'playing',
        roles,
        scenarios: shuffledScenarios,
        currentScenarioIndex: 0,
        timeRemaining: initialTime,
        score: 0,
        streak: 0,
        maxStreak: 0,
        discoveredRolesCount: 0,
        selectedRoleCounts: {},
        playHistory: [],
        matchedRole: null,
        matchScorePercentage: 0,
        activeRoleReveal: null,
        isIdleOverlayVisible: false,
        isContentReady: true,
        contentError: null,
      });
    });
  },

  answerScenario: (option: ScenarioOption) => {
    const { scenarios, roles, currentScenarioIndex, score, streak, maxStreak, selectedRoleCounts, playHistory } = get();
    const currentScenario = scenarios[currentScenarioIndex];
    if (!currentScenario) return;

    const isCorrect = option.isCorrect;
    const newStreak = isCorrect ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);

    const bonusPoints = isCorrect ? GAME_CONSTANTS.POINTS_PER_CORRECT + (newStreak * GAME_CONSTANTS.BONUS_STREAK_MULTIPLIER) : 10;
    const newScore = score + bonusPoints;

    const newCounts = {
      ...selectedRoleCounts,
      [option.roleId]: (selectedRoleCounts[option.roleId] || 0) + 1
    };

    const newHistory = [
      ...playHistory,
      {
        scenarioId: currentScenario.id,
        selectedRoleId: option.roleId,
        isCorrect,
        timeSpentMs: 4000
      }
    ];

    const selectedRoleData = roles.find(r => r.id === option.roleId) || roles[0];
    const uniqueRolesDiscovered = Object.keys(newCounts).length;

    set({
      score: newScore,
      streak: newStreak,
      maxStreak: newMaxStreak,
      discoveredRolesCount: uniqueRolesDiscovered,
      selectedRoleCounts: newCounts,
      playHistory: newHistory,
      activeRoleReveal: {
        role: selectedRoleData,
        isCorrect,
        feedbackText: currentScenario.feedbackText
      }
    });
  },

  dismissRoleReveal: () => {
    set({ activeRoleReveal: null });
    get().nextScenario();
  },

  nextScenario: () => {
    const { scenarios, currentScenarioIndex } = get();
    if (currentScenarioIndex < scenarios.length - 1) {
      set({ currentScenarioIndex: currentScenarioIndex + 1 });
    } else {
      get().finishGame();
    }
  },

  tickTimer: () => {
    const { timeRemaining, phase, activeRoleReveal } = get();
    if (phase !== 'playing') return;
    if (activeRoleReveal !== null) return;

    if (timeRemaining <= 1) {
      get().finishGame();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  finishGame: () => {
    const { roles, selectedRoleCounts, playHistory, mode, score } = get();
    const { matchedRole, matchScorePercentage } = calculateTopMatchedRole(roles, selectedRoleCounts, playHistory);

    set({
      phase: 'result',
      matchedRole,
      matchScorePercentage,
      activeRoleReveal: null
    });

    logGameCompletion(mode, matchedRole.id, score);
  },

  resetGame: () => {
    const { mode } = get();
    set({
      phase: 'intro',
      currentScenarioIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      discoveredRolesCount: 0,
      selectedRoleCounts: {},
      playHistory: [],
      matchedRole: null,
      activeRoleReveal: null,
      timeRemaining: mode === 'school' ? GAME_CONSTANTS.TIMER_SCHOOL_SECONDS : GAME_CONSTANTS.TIMER_STAN_SECONDS,
      isIdleOverlayVisible: false,
      activeTab: 'home'
    });
  },

  showIdleOverlay: () => set({ isIdleOverlayVisible: true }),
  dismissIdleOverlay: () => set({ isIdleOverlayVisible: false }),
  navigateToMap: () => set({ phase: 'map', activeTab: 'ontdekken' }),
  navigateToHome: () => set({ phase: 'intro', activeTab: 'home' })
}));
