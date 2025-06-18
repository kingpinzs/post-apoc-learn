import { useEffect } from 'react';

const KEY = 'offline-actions';

export function enqueueAction(action) {
  try {
    const current = JSON.parse(localStorage.getItem(KEY) || '[]');
    current.push(action);
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
}

export function flushQueue(processor) {
  try {
    const current = JSON.parse(localStorage.getItem(KEY) || '[]');
    return current.reduce(
      (p, a) => p.then(() => processor(a)),
      Promise.resolve()
    ).then(() => localStorage.removeItem(KEY));
  } catch {
    return Promise.resolve();
  }
}

export default function useOfflineQueue(processor) {
  useEffect(() => {
    if (navigator.onLine) flushQueue(processor);
    const handle = () => flushQueue(processor);
    window.addEventListener('online', handle);
    return () => window.removeEventListener('online', handle);
  }, [processor]);
}

