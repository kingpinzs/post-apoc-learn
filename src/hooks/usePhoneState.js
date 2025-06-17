import { useState, useEffect } from 'react';
import { loadGame, startAutoSave } from '../lib/saveSystem';

/**
 * @typedef {Object} Threat
 * @property {string} id - Unique identifier for the threat.
 * @property {string} type - Type of threat encountered.
 * @property {number} severity - Severity level 0-100.
 * @property {number} timeRemaining - Seconds until the threat expires.
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique notification identifier.
 * @property {string} message - Notification text to display.
 * @property {string} type - Category of notification.
 * @property {number} timestamp - Epoch time of the event.
 */

/**
 * Initial state for the in-game phone interface.
 * @type {{
 *   isBootingUp: boolean,
 *   currentScreen: 'lock' | 'home' | 'app-drawer' | 'active-app',
 *   unlockedApps: string[],
 *   installedApps: string[],
 *   systemHealth: number,
 *   batteryLevel: number,
 *   networkStrength: number,
 *   activeThreats: Threat[],
 *   notifications: Notification[],
 * }}
 */
export const initialPhoneState = {
  isBootingUp: false,
  currentScreen: 'lock',
  unlockedApps: [],
  installedApps: [],
  completedMissions: [],
  systemHealth: 100,
  batteryLevel: 100,
  networkStrength: 5,
  activeThreats: [],
  notifications: [],
};

/**
 * React hook providing phone state and update setter.
 *
 * @returns {[typeof initialPhoneState, Function]}
 */
export default function usePhoneState() {
  const [state, setState] = useState(() => {
    const saved = loadGame();
    if (saved) {
      return { ...initialPhoneState, ...saved };
    }
    return initialPhoneState;
  });

  useEffect(() => {
    const stop = startAutoSave(() => ({
      currentScreen: state.currentScreen,
      unlockedApps: state.unlockedApps,
      completedMissions: state.completedMissions,
    }));
    return stop;
  }, [state]);

  return [state, setState];
}
