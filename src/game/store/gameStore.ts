import { create } from 'zustand';
import { GameStoreState, GameMode, ScenarioOption, RoleData, ScenarioData } from './types';
import { GAME_CONSTANTS } from '../../lib/constants';
import { calculateTopMatchedRole } from '../engine/ResultCalculator';
import { logGameCompletion } from '../../lib/analytics';

// Import Static Roles
import receptionist from '../../content/roles/receptionist.json';
import bootmonteur from '../../content/roles/bootmonteur.json';
import marketing from '../../content/roles/marketing.json';
import animator from '../../content/roles/animator.json';
import hafenmeister from '../../content/roles/hafenmeister.json';
import campingManager from '../../content/roles/camping_manager.json';
import zwembadtechnicus from '../../content/roles/zwembadtechnicus.json';
import hovenier from '../../content/roles/hovenier.json';
import zeilinstructeur from '../../content/roles/zeilinstructeur.json';
import kok from '../../content/roles/kok.json';
import gastenservice from '../../content/roles/gastenservice.json';
import socialmedia from '../../content/roles/socialmedia.json';
import evenementenplanner from '../../content/roles/evenementenplanner.json';
import technischdienst from '../../content/roles/technischdienst.json';
import havenmeester from '../../content/roles/havenmeester.json';
import parkmanager from '../../content/roles/parkmanager.json';
// Import Static Scenarios
import S001 from '../../content/scenarios/S001.json';
import S002 from '../../content/scenarios/S002.json';
import S003 from '../../content/scenarios/S003.json';
import S004 from '../../content/scenarios/S004.json';
import S005 from '../../content/scenarios/S005.json';
import S006 from '../../content/scenarios/S006.json';
import S007 from '../../content/scenarios/S007.json';
import S008 from '../../content/scenarios/S008.json';
import S009 from '../../content/scenarios/S009.json';
import S010 from '../../content/scenarios/S010.json';
import S011 from '../../content/scenarios/S011.json';
import S012 from '../../content/scenarios/S012.json';
import S013 from '../../content/scenarios/S013.json';
import S014 from '../../content/scenarios/S014.json';
import S015 from '../../content/scenarios/S015.json';
const ALL_ROLES: RoleData[] = [
  receptionist,
  bootmonteur,
  marketing,
  animator,
  hafenmeister,
  campingManager,
  zwembadtechnicus,
  hovenier,
  zeilinstructeur,
  kok,
  gastenservice,
  socialmedia,
  evenementenplanner,
  technischdienst,
  havenmeester,
  parkmanager
] as RoleData[];

const ALL_SCENARIOS: ScenarioData[] = [
  S001,
  S002,
  S003,
  S004,
  S005,
  S006,
  S007,
  S008,
  S009,
  S010,
  S011,
  S012,
  S013,
  S014,
  S015
] as ScenarioData[];

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

  scenarios: ALL_SCENARIOS,
  roles: ALL_ROLES,
  selectedRoleCounts: {},
  playHistory: [],
  matchedRole: null,
  matchScorePercentage: 0,

  isIdleOverlayVisible: false,

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
    const shuffledScenarios = shuffleArray(ALL_SCENARIOS);
    const initialTime = mode === 'school' ? GAME_CONSTANTS.TIMER_SCHOOL_SECONDS : GAME_CONSTANTS.TIMER_STAN_SECONDS;

    set({
      sessionId: `session_${Date.now()}`,
      phase: 'playing',
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
      isIdleOverlayVisible: false
    });
  },

  answerScenario: (option: ScenarioOption) => {
    const { scenarios, roles, currentScenarioIndex, score, streak, maxStreak, selectedRoleCounts, playHistory, discoveredRolesCount } = get();
    const currentScenario = scenarios[currentScenarioIndex];

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

    // Find role data for reveal popup (Screen 3 GDD)
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
    // Only tick when actively playing AND no modal is blocking
    if (phase !== 'playing') return;
    if (activeRoleReveal !== null) return; // BUG-4: pause timer during role reveal

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
      isIdleOverlayVisible: false
    });
  },

  showIdleOverlay: () => set({ isIdleOverlayVisible: true }),
  dismissIdleOverlay: () => set({ isIdleOverlayVisible: false })
}));
