import { saveGame, loadGame, resetGame } from '../lib/saveSystem';

beforeEach(() => {
  localStorage.clear();
});

test('saves and loads game data', () => {
  saveGame({ unlockedApps: ['map'], completedMissions: ['m1'] });
  const data = loadGame();
  expect(data).toMatchObject({
    version: 1,
    unlockedApps: ['map'],
    completedMissions: ['m1'],
  });
});

test('resetGame clears saved data', () => {
  saveGame({ unlockedApps: [], completedMissions: [] });
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
    JSON.stringify({ version: 2, unlockedApps: [], completedMissions: [] })
  );
  expect(loadGame()).toBeNull();
});

test('loadGame returns null when fields are missing', () => {
  localStorage.setItem('survivos-save', JSON.stringify({ version: 1 }));
  expect(loadGame()).toBeNull();
});

test('saveGame persists installedApps', () => {
  saveGame({
    unlockedApps: [],
    completedMissions: [],
    installedApps: ['scanner'],
  });
  const data = loadGame();
  expect(data.installedApps).toEqual(['scanner']);
});

test('defaults array fields when missing', () => {
  saveGame({});
  const data = loadGame();
  expect(data.unlockedApps).toEqual([]);
  expect(data.completedMissions).toEqual([]);
  expect(data.installedApps).toEqual([]);
});

