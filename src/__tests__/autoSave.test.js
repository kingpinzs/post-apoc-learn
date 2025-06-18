import { startAutoSave, resetGame } from '../lib/saveSystem';

describe('startAutoSave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('saves at interval and stops after cleanup', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem');
    const stop = startAutoSave(() => ({ currentScreen: 'home', unlockedApps: [], completedMissions: [] }), 1000);
    jest.advanceTimersByTime(1000);
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
    stop();
    jest.advanceTimersByTime(1000);
    expect(spy).not.toHaveBeenCalled();
    resetGame();
  });
});
