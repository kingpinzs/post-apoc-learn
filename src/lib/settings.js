import { DEFAULT_DIFFICULTY } from './difficulties';

const STORAGE_KEY = 'survivos-settings';

export const defaultSettings = {
  audio: {
    masterVolume: 1,
    musicVolume: 0.7,
    sfxVolume: 0.7,
    muted: false,
  },
  display: {
    brightness: 100,
    highContrast: false,
    reduceMotion: false,
    fontSize: 16,
  },
  gameplay: {
    difficulty: DEFAULT_DIFFICULTY,
    hints: true,
    autosaveInterval: 30000,
    practiceMode: false,
  },
  performance: {
    quality: 'High',
    particleDensity: 1,
    animations: true,
    renderScale: 1,
    debugOverlay: false,
  },
};

export function loadSettings(detectQuality) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base = { ...defaultSettings };
    if (detectQuality) base.performance.quality = detectQuality();
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return { ...base, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}
