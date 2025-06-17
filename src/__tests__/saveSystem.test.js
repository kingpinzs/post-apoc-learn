import { saveGame, loadGame, resetGame } from '../lib/saveSystem';

beforeEach(() => {
  localStorage.clear();
});

test('saves and loads game data', () => {
  saveGame({ currentScreen: 'home', unlockedApps: ['map'], completedMissions: ['m1'] });
  const data = loadGame();
  expect(data).toMatchObject({
    version: 1,
    currentScreen: 'home',
    unlockedApps: ['map'],
    completedMissions: ['m1'],
  });
});

test('resetGame clears saved data', () => {
  saveGame({ currentScreen: 'home', unlockedApps: [], completedMissions: [] });
  resetGame();
  expect(loadGame()).toBeNull();
});
