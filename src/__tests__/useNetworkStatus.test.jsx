import { renderHook, act } from '@testing-library/react';
import useNetworkStatus from '../hooks/useNetworkStatus';

test('returns current online status', () => {
  const { result } = renderHook(() => useNetworkStatus());
  expect(result.current).toBe(navigator.onLine);
});

test('updates when offline and online events fire', () => {
  const { result } = renderHook(() => useNetworkStatus());
  act(() => {
    window.dispatchEvent(new Event('offline'));
  });
  expect(result.current).toBe(false);
  act(() => {
    window.dispatchEvent(new Event('online'));
  });
  expect(result.current).toBe(true);
});


