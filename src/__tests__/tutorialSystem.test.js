import { loadProgress, saveProgress, resetProgress, tutorialMissions } from '../lib/tutorialSystem';

beforeEach(() => {
  localStorage.clear();
});

test('saves and loads progress', () => {
  saveProgress({ completed: ['firstBoot'], activeMission: 'threatDefense' });
  const data = loadProgress();
  expect(data).toEqual({ completed: ['firstBoot'], activeMission: 'threatDefense' });
});

test('resetProgress clears data', () => {
  saveProgress({ completed: [], activeMission: 'firstBoot' });
  resetProgress();
  expect(loadProgress()).toEqual({ completed: [], activeMission: null });
});

test('loadProgress handles malformed JSON', () => {
  localStorage.setItem('survivos-tutorial', '{bad json');
  const data = loadProgress();
  expect(data).toEqual({ completed: [], activeMission: null });
});

// ensure missions list includes expected ids
test('tutorial missions defined', () => {
  const ids = tutorialMissions.map((m) => m.id);
  expect(ids).toContain('firstBoot');
  expect(ids).toContain('threatDefense');
});
