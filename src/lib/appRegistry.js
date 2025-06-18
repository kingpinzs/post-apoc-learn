/**
 * Application registry storing metadata about available phone apps.
 *
 * @typedef {Object} AppDefinition
 * @property {string} id Unique string identifier.
 * @property {string} name Display name for the app.
 * @property {string} icon Lucide icon component name.
 * @property {'apps'|'tools'|'info'} category Category grouping.
 * @property {boolean} isLocked Whether the app is locked at start.
 * @property {string[]} unlockRequirements IDs of prerequisite apps.
 * @property {string} description Short description of the app.
 * @property {string} launchScreen Component name to render when launched.
 */

/**
 * A registry of all app definitions keyed by their id.
 * @type {Record<string, AppDefinition>}
 */
export const appRegistry = {
  communicator: {
    id: 'communicator',
    name: 'Communicator',
    icon: 'MessageCircle',
    category: 'apps',
    isLocked: false,
    unlockRequirements: [],
    description: 'Send and receive encrypted transmissions.',
    launchScreen: 'CommunicatorScreen',
  },
  map: {
    id: 'map',
    name: 'Map',
    icon: 'Map',
    category: 'apps',
    isLocked: true,
    unlockRequirements: ['communicator'],
    description: 'Displays known territory and points of interest.',
    launchScreen: 'MapScreen',
  },
  droneControl: {
    id: 'droneControl',
    name: 'Drone Control',
    icon: 'Drone',
    category: 'apps',
    isLocked: true,
    unlockRequirements: ['communicator', 'map'],
    description: 'Operate reconnaissance drones remotely.',
    launchScreen: 'DroneScreen',
  },

  scanner: {
    id: 'scanner',
    name: 'Scanner',
    icon: 'ScanSearch',
    category: 'tools',
    isLocked: false,
    unlockRequirements: [],
    description: 'Scan surroundings for signals and anomalies.',
    launchScreen: 'ScannerScreen',
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: 'Terminal',
    category: 'tools',
    isLocked: true,
    unlockRequirements: ['scanner'],
    description: 'Access system command line utilities.',
    launchScreen: 'TerminalScreen',
  },
  decryptor: {
    id: 'decryptor',
    name: 'Decryptor',
    icon: 'KeyRound',
    category: 'tools',
    isLocked: true,
    unlockRequirements: ['terminal'],
    description: 'Break encrypted archives and messages.',
    launchScreen: 'DecryptorScreen',
  },
  scriptBuilder: {
    id: 'scriptBuilder',
    name: 'Script Builder',
    icon: 'ClipboardList',
    category: 'tools',
    isLocked: false,
    unlockRequirements: [],
    description: 'Visually assemble and test command scripts.',
    launchScreen: 'ScriptBuilderScreen',
  },

  handbook: {
    id: 'handbook',
    name: 'Survival Handbook',
    icon: 'Book',
    category: 'info',
    isLocked: false,
    unlockRequirements: [],
    description: 'Reference guide on wasteland survival tactics.',
    launchScreen: 'HandbookScreen',
  },
  worldStats: {
    id: 'worldStats',
    name: 'World Stats',
    icon: 'BarChart2',
    category: 'info',
    isLocked: true,
    unlockRequirements: ['handbook'],
    description: 'View current radiation and weather levels.',
    launchScreen: 'StatsScreen',
  },
  signalLog: {
    id: 'signalLog',
    name: 'Signal Log',
    icon: 'Activity',
    category: 'info',
    isLocked: true,
    unlockRequirements: ['handbook'],
    description: 'Archive of intercepted radio chatter.',
    launchScreen: 'LogScreen',
  },
  trophyRoom: {
    id: 'trophyRoom',
    name: 'Trophy Room',
    icon: 'Award',
    category: 'info',
    isLocked: false,
    unlockRequirements: [],
    description: 'View earned achievements.',
    launchScreen: 'TrophyRoomScreen',
  },
  securityTraining: {
    id: 'securityTraining',
    name: 'Security Training',
    icon: 'ShieldCheck',
    category: 'apps',
    isLocked: false,
    unlockRequirements: [],
    description: 'Interactive security quiz challenges.',
    launchScreen: 'SecurityTrainingApp',
  },
  networkScanner: {
    id: 'networkScanner',
    name: 'Network Scanner',
    icon: 'Radar',
    category: 'tools',
    isLocked: false,
    unlockRequirements: [],
    description: 'Detect nearby network devices.',
    launchScreen: 'NetworkScanner',
  },
  portScanner: {
    id: 'portScanner',
    name: 'Port Scanner',
    icon: 'Server',
    category: 'tools',
    isLocked: false,
    unlockRequirements: [],
    description: 'Scan ports on a target system.',
    launchScreen: 'PortScanner',
  },
  firewall: {
    id: 'firewall',
    name: 'Firewall',
    icon: 'Shield',
    category: 'tools',
    isLocked: false,
    unlockRequirements: [],
    description: 'Configure firewall rules.',
    launchScreen: 'FirewallApp',
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    category: 'info',
    isLocked: false,
    unlockRequirements: [],
    description: 'Configure audio, display, and gameplay options.',
    launchScreen: 'SettingsScreen',
  },
};
