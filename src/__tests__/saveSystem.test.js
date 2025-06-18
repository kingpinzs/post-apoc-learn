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

test('loadGame returns null for invalid JSON', () => {
  localStorage.setItem('survivos-save', '{bad json');
  expect(loadGame()).toBeNull();
});

test('loadGame returns null for mismatched version', () => {
  localStorage.setItem(
    'survivos-save',
    JSON.stringify({ version: 2, currentScreen: 'home', unlockedApps: [], completedMissions: [] })
  );
  expect(loadGame()).toBeNull();
});

test('loadGame returns null when fields are missing', () => {
  localStorage.setItem('survivos-save', JSON.stringify({ version: 1 }));
  expect(loadGame()).toBeNull();
});

test('saveGame persists installedApps', () => {
  saveGame({
    currentScreen: 'home',
    unlockedApps: [],
    completedMissions: [],
    installedApps: ['scanner'],
  });
  const data = loadGame();
  expect(data.installedApps).toEqual(['scanner']);
});

