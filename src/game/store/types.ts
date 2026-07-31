export type GamePhase = 'intro' | 'playing' | 'result';
export type GameMode = 'stan' | 'school';

export interface RoleData {
  id: string;
  title: string;
  category: string;
  icon: string;
  badgeColor: string;
  shortDescription: string;
  fullDescription: string;
  keySkills: string[];
  careerPath: string;
  salaryRange: string;
}

export interface ScenarioOption {
  roleId: string;
  label: string;
  isCorrect: boolean;
}

export interface ScenarioData {
  id: string;
  timeOfDay: string;
  location: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correctRoleId: string;
  options: ScenarioOption[];
  feedbackText: string;
}

export interface ScenarioPlayRecord {
  scenarioId: string;
  selectedRoleId: string;
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface GameStoreState {
  // Session State
  sessionId: string;
  mode: GameMode;
  phase: GamePhase;
  soundEnabled: boolean;
  theme: 'dark' | 'light';

  // Game Engine
  timeRemaining: number;
  score: number;
  streak: number;
  maxStreak: number;
  currentScenarioIndex: number;
  discoveredRolesCount: number;

  // Active Role Reveal Popup Modal (GDD Screen 3)
  activeRoleReveal: {
    role: RoleData;
    isCorrect: boolean;
    feedbackText: string;
  } | null;

  // Records & Matched Data
  scenarios: ScenarioData[];
  roles: RoleData[];
  selectedRoleCounts: Record<string, number>;
  playHistory: ScenarioPlayRecord[];
  matchedRole: RoleData | null;
  matchScorePercentage: number;

  // Idle Overlay State
  isIdleOverlayVisible: boolean;

  // Actions
  setMode: (mode: GameMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  startGame: () => void;
  answerScenario: (option: ScenarioOption) => void;
  dismissRoleReveal: () => void;
  nextScenario: () => void;
  tickTimer: () => void;
  finishGame: () => void;
  resetGame: () => void;
  showIdleOverlay: () => void;
  dismissIdleOverlay: () => void;
}
