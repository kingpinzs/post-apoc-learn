const STORAGE_KEY = 'survivos-tutorial';

export const tutorialMissions = [
  {
    id: 'firstBoot',
    name: 'First Boot',
    steps: [
      {
        target: 'phone-toggle',
        message: 'Open your phone to access your tools.',
        action: 'click',
      },
      {
        target: 'app-icon-scanner',
        message: 'Launch the Scanner to begin.',
        action: 'click',
      },
    ],
  },
  {
    id: 'threatDefense',
    name: 'Threat Defense 101',
    steps: [
      {
        target: 'threat-indicator',
        message: 'Watch for incoming attacks here.',
        action: 'click',
      },
      {
        target: 'app-icon-firewall',
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
        target: 'app-icon-scriptBuilder',
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
        target: 'status-bar',
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
