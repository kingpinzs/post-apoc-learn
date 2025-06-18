const KEY = 'survivos-highscores';

export function loadHighScores() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHighScores(scores) {
  try {
    localStorage.setItem(KEY, JSON.stringify(scores));
  } catch {
    /* ignore */
  }
}

export function addHighScore(entry) {
  const scores = loadHighScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  saveHighScores(scores.slice(0, 10));
}
