export type GamePhase = 'intro' | 'map' | 'playing' | 'result';
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
  is_active?: boolean;
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
  isContentReady: boolean;
  contentError: string | null;
  selectedRoleCounts: Record<string, number>;
  playHistory: ScenarioPlayRecord[];
  matchedRole: RoleData | null;
  matchScorePercentage: number;

  // Idle Overlay State
  isIdleOverlayVisible: boolean;

  // Active Tab State ('home' | 'ontdekken' | 'pad' | 'badges')
  activeTab: 'home' | 'ontdekken' | 'pad' | 'badges';
  setActiveTab: (tab: 'home' | 'ontdekken' | 'pad' | 'badges') => void;

  // Actions
  setMode: (mode: GameMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  startGame: () => Promise<void>;
  answerScenario: (option: ScenarioOption) => void;
  dismissRoleReveal: () => void;
  nextScenario: () => void;
  tickTimer: () => void;
  finishGame: () => void;
  resetGame: () => void;
  showIdleOverlay: () => void;
  dismissIdleOverlay: () => void;
  navigateToMap: () => void;
  navigateToHome: () => void;
}
