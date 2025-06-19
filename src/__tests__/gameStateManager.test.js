import {
  GameStates,
  initGameState,
  startGame,
  completeTutorial,
  canStartGame,
  bootComplete,
  resetState,
  getState,
} from '../lib/gameStateManager';

beforeEach(() => {
  localStorage.clear();
  resetState();
});

test('initial state loads from storage', () => {
  localStorage.setItem('survivos-game-state', JSON.stringify('READY'));
  initGameState();
  expect(getState()).toBe('READY');
});

test('canStartGame false during tutorial', () => {
  localStorage.setItem('survivos-game-state', JSON.stringify('TUTORIAL'));
  initGameState();
  expect(canStartGame()).toBe(false);
});

test('startGame only from READY', () => {
  localStorage.setItem('survivos-game-state', JSON.stringify('READY'));
  initGameState();
  expect(startGame()).toBe(true);
  expect(getState()).toBe(GameStates.PLAYING);
});

