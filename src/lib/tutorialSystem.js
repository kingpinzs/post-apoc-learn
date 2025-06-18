const STORAGE_KEY = 'survivos-tutorial';

export const tutorialMissions = [
  {
    id: 'firstBoot',
    name: 'First Boot',
    steps: [
      {
        targetId: 'search-input',
        message: 'This is your app search. Locate tools quickly.',
        action: 'focus',
      },
      {
        targetId: 'app-grid',
        message: 'Tap an app icon to open it.',
        action: 'click',
      },
    ],
  },
  {
    id: 'threatDefense',
    name: 'Threat Defense 101',
    steps: [
      {
        targetId: 'threat-indicator',
        message: 'Watch for incoming attacks here.',
        action: 'click',
      },
      {
        targetId: 'app-icon-firewall',
        message: 'Launch the Firewall to repel threats.',
        action: 'click',
      },
    ],
  },
  {
    id: 'appMastery',
    name: 'App Mastery',
    steps: [
      {
        targetId: 'app-icon-scriptBuilder',
        message: 'Drag blocks to build scripts.',
        action: 'click',
      },
    ],
  },
  {
    id: 'resourceMgmt',
    name: 'Resource Management',
    steps: [
      {
        targetId: 'status-widgets',
        message: 'Monitor CPU, RAM and bandwidth here.',
        action: 'click',
      },
    ],
  },
];

export function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { completed: [], activeMission: null };
  try {
    return JSON.parse(raw);
  } catch {
    return { completed: [], activeMission: null };
  }
}

export function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
