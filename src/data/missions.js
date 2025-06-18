export const missions = [
  {
    id: 'tutorial-scanner',
    type: 'tutorial',
    title: 'Boot Camp: Scanner',
    description: 'Learn how to use the Scanner tool to locate nearby devices.',
    objectives: [
      'Launch the Scanner app',
      'Ping a nearby device',
    ],
    recommendedTools: ['scanner'],
    reward: 'map',
  },
  {
    id: 'defense-wave1',
    type: 'defense',
    title: 'Defense Drill',
    description: 'Stop the first wave of incoming threats.',
    objectives: ['Repel 3 threats using the Firewall'],
    recommendedTools: ['firewall'],
    reward: 'terminal',
  },
  {
    id: 'offense-hub',
    type: 'offense',
    title: 'Break the Hub',
    description: 'Hack the abandoned communications hub.',
    objectives: ['Find the hub IP', 'Breach using the terminal'],
    recommendedTools: ['terminal', 'portScanner'],
    reward: 'decryptor',
  },
  {
    id: 'puzzle-cipher',
    type: 'puzzle',
    title: 'Cipher Cache',
    description: 'Solve the encrypted puzzle to reveal a supply cache.',
    objectives: ['Decode the hidden message'],
    recommendedTools: ['decryptor'],
    reward: 'droneControl',
  },
  {
    id: 'story-rescue',
    type: 'story',
    title: 'Contact the Resistance',
    description: 'Establish communication with the resistance to advance the narrative.',
    objectives: [
      'Send a distress call using the Communicator',
      'Transmit coordinates via the Map app',
    ],
    recommendedTools: ['communicator', 'map'],
    reward: 'worldStats',
  },
];

export default missions;
