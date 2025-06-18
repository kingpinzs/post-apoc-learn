import { loadHighScores, saveHighScores, addHighScore } from '../lib/highscores';

beforeEach(() => {
  localStorage.clear();
});

test('loadHighScores returns empty array when none stored', () => {
  expect(loadHighScores()).toEqual([]);
});

test('saveHighScores persists data', () => {
  const scores = [{ score: 10 }];
  saveHighScores(scores);
  expect(loadHighScores()).toEqual(scores);
});

test('addHighScore sorts scores and keeps top 10', () => {
  for (let i = 0; i < 12; i++) {
    addHighScore({ score: i });
  }
  const scores = loadHighScores();
  expect(scores.length).toBe(10);
  expect(scores[0].score).toBe(11);
  expect(scores[9].score).toBe(2);
});

test('loadHighScores handles malformed JSON', () => {
  localStorage.setItem('survivos-highscores', '{bad');
  expect(loadHighScores()).toEqual([]);
});
