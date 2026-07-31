// Custom hook: sync local counter queue to server
import { useEffect } from 'react';
import { logAnalyticsQueue } from '../../lib/analytics';

export function useCounterSync() {
  useEffect(() => {
    const handleOnline = () => logAnalyticsQueue();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);
}
