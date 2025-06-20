const STORAGE_KEY = 'survivos-game-state';

export const GameStates = {
  BOOTING: 'BOOTING',
  TUTORIAL: 'TUTORIAL',
  READY: 'READY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

let state = GameStates.BOOTING;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    const parsed = JSON.parse(raw);
    if (Object.values(GameStates).includes(parsed)) {
      state = parsed;
    }
  } catch {
    /* ignore */
  }
  return state;
}

function save(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function initGameState() {
  load();
  return state;
}

export function resetState() {
  state = GameStates.BOOTING;
  save(state);
}

export function bootComplete() {
  return transition(GameStates.TUTORIAL);
}

export function getState() {
  return state;
}

function emit(next) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gameStateChange', { detail: { state: next } }));
  }
}

const transitions = {
  [GameStates.BOOTING]: [GameStates.TUTORIAL],
  [GameStates.TUTORIAL]: [GameStates.READY],
  [GameStates.READY]: [GameStates.PLAYING],
  [GameStates.PLAYING]: [GameStates.PAUSED, GameStates.GAME_OVER],
  [GameStates.PAUSED]: [GameStates.PLAYING],
  [GameStates.GAME_OVER]: [GameStates.READY],
};

function transition(next) {
  const allowed = transitions[state] || [];
  if (!allowed.includes(next)) return false;
  state = next;
  save(state);
  emit(state);
  return true;
}

export function canStartGame() {
  return state !== GameStates.TUTORIAL && state !== GameStates.BOOTING;
}

export function completeTutorial() {
  return transition(GameStates.READY);
}

export function startGame() {
  return transition(GameStates.PLAYING);
}

export function pauseGame() {
  return transition(GameStates.PAUSED);
}

export function resumeGame() {
  return transition(GameStates.PLAYING);
}

export function gameOver() {
  return transition(GameStates.GAME_OVER);
}
