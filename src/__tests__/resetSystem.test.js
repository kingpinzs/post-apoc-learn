import { resetGame, RESET_MODES } from '../lib/resetSystem';

beforeEach(() => {
  localStorage.clear();
});

test('soft reset preserves achievements', () => {
  localStorage.setItem('survivos-save', 'foo');
  localStorage.setItem('survivos-achievements', 'bar');
  resetGame(RESET_MODES.SOFT);
  expect(localStorage.getItem('survivos-save')).toBeNull();
  expect(localStorage.getItem('survivos-achievements')).toBe('bar');
});

test('hard reset removes all survivos data', () => {
  localStorage.setItem('survivos-save', 'foo');
  localStorage.setItem('survivos-achievements', 'bar');
  resetGame(RESET_MODES.HARD);
  expect(localStorage.getItem('survivos-save')).toBeNull();
  expect(localStorage.getItem('survivos-achievements')).toBeNull();
});

