// Client-side analytics wrapper — sends non-PII aggregate statistics only
// Per master-plan 07_PRIVASI_KEPATUHAN.md: NO PII, only anonymous counters

type AnalyticsEvent = {
  eventType: string;
  mode?: string;
  matchedRoleId?: string;
  score?: number;
  timestamp: number;
};

// In-memory queue for offline support
const eventQueue: AnalyticsEvent[] = [];

function enqueueEvent(event: AnalyticsEvent) {
  eventQueue.push(event);
}

async function flushQueue() {
  if (!navigator.onLine || eventQueue.length === 0) return;
  const batch = [...eventQueue];
  eventQueue.length = 0;

  for (const payload of batch) {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {
      // Re-enqueue if failed
      eventQueue.push(payload);
    });
  }
}

/** Call this when browser comes back online to sync pending events */
export function logAnalyticsQueue(): void {
  flushQueue();
}

export async function logGameCompletion(mode: string, matchedRoleId: string, score: number) {
  const event: AnalyticsEvent = {
    eventType: 'session_completed',
    mode,
    matchedRoleId,
    score,
    timestamp: Date.now()
  };

  enqueueEvent(event);

  if (navigator.onLine) {
    flushQueue();
  }
}

export async function logGameStarted(mode: string) {
  const event: AnalyticsEvent = {
    eventType: 'session_started',
    mode,
    timestamp: Date.now()
  };

  enqueueEvent(event);
  if (navigator.onLine) flushQueue();
}
