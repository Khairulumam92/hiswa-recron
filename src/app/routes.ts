// Route constants (state-based, no router library needed)
export const ROUTES = {
  INTRO: 'intro',
  PLAYING: 'playing',
  RESULT: 'result',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
