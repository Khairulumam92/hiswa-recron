// Pure action helper types
export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'TICK_TIMER' }
  | { type: 'ANSWER_SCENARIO'; roleId: string; isCorrect: boolean }
  | { type: 'NEXT_SCENARIO' }
  | { type: 'FINISH_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SHOW_IDLE_OVERLAY' }
  | { type: 'DISMISS_IDLE_OVERLAY' };
