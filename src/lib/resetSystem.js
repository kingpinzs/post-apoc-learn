import { resetResources } from './resourceSystem';
import { resetState } from './gameStateManager';
import { resetProgress as resetTutorial } from './tutorialSystem';

/**
 * Modes for resetting the game.
 * - soft: keep achievements/high scores
 * - hard: remove all saved data
 * - tutorial: restart tutorial only
 */
export const RESET_MODES = {
  SOFT: 'soft',
  HARD: 'hard',
  TUTORIAL: 'tutorial',
};

/**
 * Clears all localStorage keys that start with the survivos prefix.
 * Certain keys may be preserved depending on the mode.
 *
 * @param {'soft'|'hard'|'tutorial'} mode
 */
function clearStorage(mode) {
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (!key.startsWith('survivos-')) continue;
    if (mode === RESET_MODES.SOFT && key === 'survivos-achievements') continue;
    if (mode === RESET_MODES.SOFT && key === 'survivos-highscores') continue;
    if (mode === RESET_MODES.TUTORIAL && key !== 'survivos-tutorial') continue;
    localStorage.removeItem(key);
  }
}

/**
 * Fully resets the game state and reloads the page to cancel timers
 * and remove event listeners.
 *
 * @param {'soft'|'hard'|'tutorial'} [mode='soft']
 */
export function resetGame(mode = RESET_MODES.SOFT) {
  clearStorage(mode);
  if (mode === RESET_MODES.TUTORIAL) {
    resetTutorial();
  }
  resetResources();
  resetState();
  // reload to ensure all timers and listeners are cleared
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}
