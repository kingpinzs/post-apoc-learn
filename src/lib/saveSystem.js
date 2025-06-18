const STORAGE_KEY = 'survivos-save';
const VERSION = 1;

/**
 * Saves relevant game data to localStorage.
 *
 * @param {{currentScreen:string, unlockedApps:string[], completedMissions:string[]}} state
 */
export function saveGame(state) {
  const data = {
    version: VERSION,
    currentScreen: state.currentScreen,
    unlockedApps: state.unlockedApps || [],
    completedMissions: state.completedMissions || [],
    installedApps: state.installedApps || [],
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore write errors */
  }
}

/**
 * Loads saved game data from localStorage.
 * @returns {{version:number, currentScreen:string, unlockedApps:string[], completedMissions:string[]}|null}
 */
export function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.version !== VERSION ||
      typeof parsed.currentScreen !== 'string' ||
      !Array.isArray(parsed.unlockedApps) ||
      !Array.isArray(parsed.completedMissions) ||
      (parsed.installedApps && !Array.isArray(parsed.installedApps))
    ) {
      return null;
    }
    return {
      ...parsed,
      installedApps: parsed.installedApps || [],
    };
  } catch {
    return null;
  }
}

/**
 * Clears saved game data.
 */
export function resetGame() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Starts an auto-save interval that saves using the provided getter.
 * Returns a cleanup function to stop the interval.
 *
 * @param {Function} getState - Function returning current state object.
 * @param {number} [interval=30000] - Interval in ms.
 */
export function startAutoSave(getState, interval = 30000) {
  const save = () => saveGame(getState());
  const id = setInterval(save, interval);
  return () => clearInterval(id);
}
