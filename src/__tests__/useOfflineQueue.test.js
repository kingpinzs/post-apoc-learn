import { renderHook, act } from '@testing-library/react';
import useOfflineQueue, { enqueueAction, flushQueue } from '../hooks/useOfflineQueue';

beforeEach(() => {
  localStorage.clear();
});

test('flushQueue processes queued actions and clears storage', async () => {
  enqueueAction({ a: 1 });
  enqueueAction({ a: 2 });
  const processor = jest.fn(() => Promise.resolve());
  await flushQueue(processor);
  expect(processor).toHaveBeenCalledTimes(2);
  expect(localStorage.getItem('offline-actions')).toBeNull();
});

test('useOfflineQueue registers online listener and flushes queue', async () => {
  enqueueAction({ a: 1 });
  const processor = jest.fn(() => Promise.resolve());
  const addSpy = jest.spyOn(window, 'addEventListener');
  const removeSpy = jest.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useOfflineQueue(processor));
  await Promise.resolve();
  expect(addSpy).toHaveBeenCalledWith('online', expect.any(Function));
  // processor should run immediately if online
  expect(processor).toHaveBeenCalledTimes(1);
  act(() => {
    window.dispatchEvent(new Event('online'));
  });
  await Promise.resolve();
  expect(processor).toHaveBeenCalledTimes(2);
  unmount();
  expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
});
