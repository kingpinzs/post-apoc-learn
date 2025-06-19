import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Particles from "./Particles";
import GlitchEffect from "./GlitchEffect";
import DragCommandBlock from "./drag/DragCommandBlock";
import DropZone from "./drag/DropZone";
import GameOver from "./GameOver";
import VictoryScreen from "./VictoryScreen";
import GameMenu from "./GameMenu";
import QuickAccessBar from "./QuickAccessBar";
import StorylineManager from "./StorylineManager";
import useAchievements from "../hooks/useAchievements";
import { addHighScore } from "../lib/highscores";
import {
  AlertCircle,
  Brain,
  Cpu,
  Beaker,
  Radio,
  Battery,
  Wifi,
  Signal,
  Lock,
  Shield,
  Database,
  Workflow,
  Terminal,
  Binary,
} from "lucide-react";

import { appRegistry } from '../lib/appRegistry';
import { useTutorial } from '../hooks/useTutorial';
import { tutorialMissions } from '../lib/tutorialSystem';

const toolData = {
  firewall: { cost: 50 },
  antivirus: { cost: 30 },
  patch: { cost: 40 },
};

const attacks = [
  { id: "ddos", message: "DDoS attack detected!", tool: "firewall" },
  {
    id: "malware",
    message: "Malware infiltration in progress!",
    tool: "antivirus",
  },
  {
    id: "exploit",
    message: "Zero-day exploit targeting servers!",
    tool: "patch",
  },
];

// Restrict which attacks appear based on the player's level
const attackStages = [
  ["ddos"],
  ["ddos", "malware"],
  ["ddos", "malware", "exploit"],
];

const levelUnlocks = {
  1: 'firewall',
  3: 'decryptor',
  5: 'networkScanner',
};

function recordFailure() {
  try {
    const raw = localStorage.getItem('survivos-failures');
    const count = raw ? parseInt(raw, 10) : 0;
    const next = count + 1;
    localStorage.setItem('survivos-failures', next);
    if (next % 3 === 0) {
      return ['sympathy kit'];
    }
  } catch {
    /* ignore */
  }
  return [];
}

const initialState = {
  hintsAvailable: 3,
  showHint: false,
  currentHint: "",
  showLearningModule: false,
  health: 100,
  knowledge: 0,
  currentLevel: 0,
  message: "INITIATING NEURAL INTERFACE...",
  showQuestion: false,
  answeredCorrectly: false,
  bootUp: true,
  inputCommand: "",
  sequenceInput: "",
  blankInput: "",
  correctSequence: "1234",
  gameCompleted: false,
  glitch: false,
  showParticles: false,
  transitioning: false,
  credits: 100,
  inventory: { firewall: true },
  cooldowns: { firewall: 0, antivirus: 0, patch: 0 },
  activeAttack: null,
  showBuyCraft: null,
  damageTaken: 0,
  threatsStopped: 0,
  startTime: Date.now(),
  actions: 0,
  successfulActions: 0,
  unlockedItems: [],
  unlockedApps: ['scanner', 'terminal'],
  newUnlock: null,
};

const ApocalypseGame = ({ practice = false }) => {
  const storageKey = practice ? "practiceState" : "gameState";
  const { addProgress } = useAchievements() || {};
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        inventory: {
          ...initialState.inventory,
          ...(parsed.inventory || {}),
        },
        unlockedApps: parsed.unlockedApps || initialState.unlockedApps,
      };
    }
    if (practice) {
      return {
        ...initialState,
        credits: 9999,
        inventory: Object.keys(toolData).reduce(
          (acc, t) => ({ ...acc, [t]: true }),
          {}
        ),
        unlockedItems: Object.keys(toolData),
        unlockedApps: Object.keys(appRegistry).filter(
          (id) => appRegistry[id].category === 'tools'
        ),
      };
    }
    return initialState;
  });

  const [showTools, setShowTools] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleKeyPress = useCallback(
    (e) => {
      if (paused) return;
      if (
        gameState.showQuestion &&
        levels[gameState.currentLevel].type === "sequence"
      ) {
        if (/^\d$/.test(e.key)) {
          setGameState((prev) => ({
            ...prev,
            sequenceInput: prev.sequenceInput + e.key,
          }));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameState.showQuestion, gameState.currentLevel, paused],
  );

  useEffect(() => {
    let bootTimeout;
    if (gameState.bootUp) {
      bootTimeout = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          message: "Welcome to SURVIV-OS v2.0. Commence hacking training...",
          bootUp: false,
        }));
        if (addProgress) addProgress('boot-sequence', 100);
      }, 2000);
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      clearTimeout(bootTimeout);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    gameState.showQuestion,
    gameState.currentLevel,
    gameState.bootUp,
    handleKeyPress,
    addProgress,
    paused,
  ]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(gameState));
  }, [gameState, storageKey]);

  useEffect(() => {
    if (gameState.glitch) {
      const t = setTimeout(() => {
        setGameState((prev) => ({ ...prev, glitch: false }));
      }, 500);
      return () => clearTimeout(t);
    }
  }, [gameState.glitch]);

  useEffect(() => {
    if (gameState.showParticles) {
      const t = setTimeout(() => {
        setGameState((prev) => ({ ...prev, showParticles: false }));
      }, 800);
      return () => clearTimeout(t);
    }
  }, [gameState.showParticles]);

  useEffect(() => {
    const t = setInterval(() => {
      setGameState((prev) => {
        const next = { ...prev.cooldowns };
        let changed = false;
        for (const k in next) {
          if (next[k] > 0) {
            next[k] = Math.max(0, next[k] - 1);
            changed = true;
          }
        }
        return changed ? { ...prev, cooldowns: next } : prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const { showHelp, completed = [], activeMission } = useTutorial() || {};
  const tutorialDone = completed.length >= tutorialMissions.length && !activeMission;

  useEffect(() => {
    if (gameState.newUnlock) {
      showHelp?.(`app-icon-${gameState.newUnlock}`, `New app unlocked: ${appRegistry[gameState.newUnlock].name}`);
      const t = setTimeout(() => {
        setGameState((prev) => ({ ...prev, newUnlock: null }));
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [gameState.newUnlock, showHelp]);

  useEffect(() => {
    if (gameState.gameCompleted && addProgress) {
      if (gameState.damageTaken === 0) addProgress('untouchable', 100);
    }
  }, [gameState.gameCompleted, gameState.damageTaken, addProgress]);

  useEffect(() => {
    if (gameState.gameCompleted) {
      const time = Math.floor((Date.now() - gameState.startTime) / 1000);
      const accuracy = gameState.actions
        ? (gameState.successfulActions / gameState.actions) * 100
        : 100;
      const score = gameState.threatsStopped * 100 - gameState.damageTaken;
      addHighScore({
        score,
        threatsStopped: gameState.threatsStopped,
        time,
        accuracy,
      });
    }
  }, [
    gameState.gameCompleted,
    gameState.startTime,
    gameState.actions,
    gameState.successfulActions,
    gameState.threatsStopped,
    gameState.damageTaken,
  ]);

  useEffect(() => {
    if (addProgress) {
      if (gameState.credits >= 500) addProgress('credit-hoarder', 100);
      if (gameState.credits >= 1000) addProgress('resource-tycoon', 100);
    }
  }, [gameState.credits, addProgress]);

  useEffect(() => {
    if (
      practice ||
      gameState.bootUp ||
      gameState.gameCompleted ||
      gameState.activeAttack !== null ||
      !tutorialDone
    ) {
      return;
    }
    const timeout = setTimeout(() => {
      const stage = Math.min(
        attackStages.length - 1,
        Math.floor(gameState.currentLevel / 2)
      );
      const allowedIds = attackStages[stage];
      const possible = attacks.filter((a) => allowedIds.includes(a.id));
      const attack =
        possible[Math.floor(Math.random() * possible.length)];
      setGameState((prev) => ({
        ...prev,
        activeAttack: attack,
        message: `[ WARNING ] ${attack.message}`,
      }));
    }, Math.random() * 5000 + 5000);
    return () => clearTimeout(timeout);
  }, [
    practice,
    gameState.bootUp,
    gameState.gameCompleted,
    gameState.activeAttack,
    gameState.currentLevel,
    tutorialDone,
  ]);

  // When an attack starts, prompt the player to acquire the correct tool
  useEffect(() => {
    if (!gameState.activeAttack) return;
    const required = gameState.activeAttack.tool;
    if (!gameState.inventory?.[required]) {
      setGameState((prev) => ({
        ...prev,
        showBuyCraft: required,
      }));
    }
  }, [gameState.activeAttack, gameState.inventory]);

  useEffect(() => {
    if (practice || !gameState.activeAttack) {
      return;
    }
    const dmg = setInterval(() => {
      setGameState((prev) => {
        const newHealth = Math.max(0, prev.health - 5);
        return {
          ...prev,
          health: newHealth,
          damageTaken: prev.damageTaken + (prev.health - newHealth),
        };
      });
    }, 5000);
    return () => clearInterval(dmg);
  }, [practice, gameState.activeAttack]);

  useEffect(() => {
    if (gameState.health <= 0) {
      const extras = recordFailure();
      if (extras.length) {
        setGameState((prev) => ({
          ...prev,
          unlockedItems: [...prev.unlockedItems, ...extras],
        }));
      }
    }
  }, [gameState.health]);

  const hints = {
    radiation: [
      "Think about the units used to measure absorbed radiation energy.",
      "The Gray (Gy) measures energy absorbed per kilogram.",
      "1 Gray = 1 joule per kilogram of absorbed radiation.",
      "Use number keys 1-4 to select an option.",
    ],
    binary: [
      "Break down the number into powers of 2.",
      "13 = 8 + 4 + 1.",
      "8 = 2³, 4 = 2², 1 = 2⁰.",
      "You can type directly into the input field.",
    ],
    sequence: [
      "Watch for patterns in the numbers.",
      "Try entering the numbers in order.",
      "The sequence follows a simple ascending pattern.",
      "Use keyboard digits or on-screen buttons.",
    ],
    database: [
      "SQL queries filter data using WHERE clause.",
      "The syntax should be: column='value'.",
      "We're looking for organic compounds.",
      "Press Enter or VERIFY to submit.",
    ],
    cipher: [
      "Shift each letter back by 3.",
      "K -> H is your first clue.",
      "Think of the alphabet looping around.",
      "Type the decoded word.",
    ],
    logic: [
      "Three options are harmful programs.",
      "Firewalls protect systems rather than attack.",
      "Identify the defensive software.",
      "Use number keys 1-4.",
    ],
    protocol: [
      "Used by HTTPS to secure connections.",
      "It replaced the older SSL standard.",
      "Stands for Transport Layer Security.",
      "Use number keys 1-4.",
    ],
    base64: [
      "Base64 groups characters into sets of four.",
      "Padding often appears as = at the end.",
      "U1VSVklWRQ== decodes to a single word.",
      "Type the decoded text.",
    ],
    override: [
      "Digits flash briefly on the keypad.",
      "Enter them exactly in that order.",
      "DELETE removes the last digit.",
      "Use on-screen buttons or keyboard.",
    ],
    firewall: [
      "Standard web traffic uses a common port.",
      "Blocking that port stops HTTP requests.",
      "HTTPS typically uses port 443 instead.",
      "Use number keys 1-4.",
    ],
    network: [
      "Multicast addresses begin with 224.",
      "They are reserved for one-to-many traffic.",
      "Class D is set aside for this purpose.",
      "Use number keys 1-4.",
    ],
    hash: [
      "Look for a hashing algorithm, not encryption.",
      "It outputs 64 hexadecimal characters.",
      "Part of the SHA-2 family.",
      "Use number keys 1-4.",
    ],
    counterhack: [
      "This command reveals each hop to a destination.",
      "Useful when tracking adversaries across the net.",
      "Often installed by default on Unix systems.",
      "Use number keys 1-4.",
    ],
    ufwScript: [
      "Set default policies before enabling the firewall.",
      "Deny unsolicited incoming connections.",
      "Allow SSH on port 22 so you do not lock yourself out.",
      "Type the missing command in lowercase.",
    ],
    fail2ban: [
      "Fail2ban monitors logs for repeated failures.",
      "Start it as a system service with sufficient privileges.",
      "Use systemctl with sudo to enable it at boot.",
      "Type the full command.",
    ],
  };

  const learningModules = {
    radiation: {
      title: "Radiation Measurement",
      content:
        "Radiation dose is measured in Gray (Gy), which quantifies absorbed energy. 1 Gy equals 1 joule of radiation energy absorbed per kilogram of matter. This is crucial for radiation protection and medical applications.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/radiation.svg`,
      example:
        "Example: Dosimeters in nuclear facilities report exposure in Gray.",
      resource: "surviv-os://docs/radiation",
    },
    binary: {
      title: "Binary Conversion",
      content:
        "To convert decimal to binary:\n1. Find the largest power of 2 that fits\n2. Subtract it and mark 1\n3. Repeat for remainder\n4. Mark 0 for missing powers\nExample: 13\n8(1) + 4(1) + 2(0) + 1(1) = 1101",
      diagram: `${process.env.PUBLIC_URL}/diagrams/binary.svg`,
      example: "Example: Microcontrollers process instructions in binary form.",
      resource: "surviv-os://docs/binary",
    },
    sequence: {
      title: "Pattern Recognition",
      content:
        "Sequences often follow patterns like:\n- Counting up/down\n- Mathematical operations\n- Repeating cycles\nLook for the simplest explanation first!",
      diagram: `${process.env.PUBLIC_URL}/diagrams/sequence.svg`,
      example:
        "Example: Authentication tokens often rely on numeric sequences.",
      resource: "surviv-os://docs/sequences",
    },
    database: {
      title: "SQL Injection & Database Hacking",
      content: `DATABASE FUNDAMENTALS:
1. Tables store data in rows and columns.
2. SQL commands control data access.
3. WHERE clause filters data.

BASIC SQL STRUCTURE:
SELECT * FROM compounds
WHERE type='organic'

COMMON SQL OPERATORS:
= Equal to
> Greater than
< Less than
LIKE Pattern matching
AND Multiple conditions

INJECTION TECHNIQUES:
- Simple Match: type='organic'.
- Multiple Conditions: type='organic' AND toxic='false'.
- Pattern Match: name LIKE 'acid%'.

SAFETY REMINDER:
Only use these techniques on authorized systems!

TIPS FOR THIS CHALLENGE:
1. Use single quotes around text values.
2. Match the exact column name (type).
 3. Match the exact value (organic).
4. Don't forget the = operator.`,
      diagram: `${process.env.PUBLIC_URL}/diagrams/database.svg`,
      example:
        "Example: Querying customers WHERE active='true' fetches valid accounts.",
      resource: "surviv-os://docs/database",
    },
    cipher: {
      title: "Caesar Cipher",
      content:
        "A Caesar cipher shifts letters by a fixed number. To decode, shift each letter backwards. Example: KHOOR shifted back by 3 becomes HELLO.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/cipher.svg`,
      example:
        "Example: Julius Caesar used a 3-letter shift to encrypt messages.",
      resource: "surviv-os://docs/caesar",
    },
    logic: {
      title: "Malware Types",
      content:
        "Trojans, worms and spyware are malicious software. Firewalls, on the other hand, defend systems against attacks.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/logic.svg`,
      example:
        "Example: Firewalls act as gatekeepers to block malicious traffic.",
      resource: "surviv-os://docs/malware",
    },
    protocol: {
      title: "Secure Protocols",
      content:
        "TLS (Transport Layer Security) establishes encrypted connections and is widely used to secure web traffic.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/protocol.svg`,
      example:
        "Example: Websites like banks use TLS to protect data in transit.",
      resource: "surviv-os://docs/tls",
    },
    base64: {
      title: "Base64 Encoding",
      content:
        "Base64 converts binary data into ASCII characters. Example: 'U1VSVklWRQ==' decodes to 'SURVIVE'.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/base64.svg`,
      example: "Example: Images in emails are often encoded in Base64.",
      resource: "surviv-os://docs/base64",
    },
    override: {
      title: "Keypad Overrides",
      content:
        "Security keypads use numeric codes. Entering the correct sequence disables locks while mistakes can trigger alarms.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/override.svg`,
      example:
        "Example: Keypads for secure doors can be overridden by entering master codes.",
      resource: "surviv-os://docs/override",
    },
    firewall: {
      title: "Firewall Ports",
      content:
        "Firewalls filter traffic by port number. Blocking port 80 stops standard HTTP traffic while HTTPS uses 443.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/firewall.svg`,
      example:
        "Example: Administrators block port 80 to disable standard web access.",
      resource: "surviv-os://docs/firewall",
    },
    network: {
      title: "IP Address Classes",
      content:
        "Class D addresses (224.0.0.0–239.255.255.255) are reserved for multicast, enabling one-to-many communication.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/network.svg`,
      example: "Example: IPTV streaming uses Class D multicast addresses.",
      resource: "surviv-os://docs/multicast",
    },
    hash: {
      title: "Cryptographic Hashes",
      content:
        "SHA-256 generates a 256-bit digest used to verify data integrity. It is part of the SHA-2 family.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/hash.svg`,
      example:
        "Example: Downloads often provide a SHA-256 checksum for verification.",
      resource: "surviv-os://docs/sha256",
    },
    counterhack: {
      title: "Traceroute Command",
      content:
        "Traceroute maps the path packets take to a destination by sending packets with increasing TTL values. It helps reveal each intermediary hop and diagnose network issues.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/traceroute.svg`,
      example:
        "Example: traceroute 8.8.8.8 displays hops to Google's DNS server.",
      resource: "surviv-os://docs/traceroute",
    },
    infiltration: {
      title: "Process Enumeration",
      content:
        "The `ps` command lists active processes on Unix-like systems and is useful for spotting rogue tasks.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/infiltration.svg`,
      example:
        "Example: ps aux | grep httpd shows running web server processes.",
      resource: "surviv-os://docs/ps",
    },
    relay: {
      title: "File Retrieval",
      content:
        "`wget` downloads files from the web via HTTP, HTTPS or FTP protocols.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/relay.svg`,
      example: "Example: wget http://example.com/file.txt",
      resource: "surviv-os://docs/wget",
    },
    dataleak: {
      title: "Secure Copy",
      content:
        "SCP securely transfers files between hosts using SSH for encryption.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/dataleak.svg`,
      example: "Example: scp user@host:/path/file ./",
      resource: "surviv-os://docs/scp",
    },
    aiHub: {
      title: "Access Codes",
      content:
        "Critical systems often require numeric sequences for entry. Memorize the digits to proceed.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/aihub.svg`,
      example: "Example: Access panels frequently use 4-digit pins.",
      resource: "surviv-os://docs/access",
    },
    rootkit: {
      title: "Permission Changes",
      content:
        "The `chmod +x` command sets the executable bit on a file so it can run as a program.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/rootkit.svg`,
      example: "Example: chmod +x exploit.sh",
      resource: "surviv-os://docs/chmod",
    },
    isolate: {
      title: "Firewall Defaults",
      content:
        "Setting a firewall's default policy to deny blocks all unsolicited incoming traffic.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/isolate.svg`,
      example: "Example: ufw default deny",
      resource: "surviv-os://docs/ufw",
    },
    ufwScript: {
      title: "UFW Setup",
      content:
        "UFW (Uncomplicated Firewall) simplifies firewall configuration. Setting `default deny incoming` blocks unsolicited traffic while `ufw allow 22` permits SSH access before enabling the firewall.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/firewall.svg`,
      example: "Example: ufw default deny incoming",
      resource: "surviv-os://docs/ufw",
    },
    fail2ban: {
      title: "Fail2ban Defense",
      content:
        "Fail2ban scans log files and bans IPs that show malicious signs, such as too many password failures. Running it as a service provides continual protection.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/firewall.svg`,
      example: "Example: sudo systemctl enable --now fail2ban",
      resource: "surviv-os://docs/fail2ban",
    },
    emp: {
      title: "EMP Deployment",
      content:
        "Electromagnetic pulses can temporarily disable electronics and weaken defenses.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/emp.svg`,
      example: "Example: Tactical EMP grenades are used to disrupt drones.",
      resource: "surviv-os://docs/emp",
    },
    mainframe: {
      title: "Recursive Removal",
      content:
        "Use `rm -r` with caution to delete directories and their contents recursively.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/mainframe.svg`,
      example: "Example: rm -r /tmp/old_logs",
      resource: "surviv-os://docs/rm",
    },
    shutdown: {
      title: "System Halt",
      content: "`shutdown -h now` immediately powers down a Unix-like system.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/shutdown.svg`,
      example: "Example: sudo shutdown -h now",
      resource: "surviv-os://docs/shutdown",
    },
    reboot: {
      title: "Restart Sequence",
      content:
        "A final reboot brings systems back under human control after the AI is disabled.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/reboot.svg`,
      example: "Example: reboot",
      resource: "surviv-os://docs/reboot",
    },
    salvage: {
      title: "Disk Usage",
      content:
        "Use `df` to display disk space statistics on connected filesystems.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/salvage.svg`,
      example: "Example: df -h",
      resource: "surviv-os://docs/df",
    },
    decode: {
      title: "Base64 Practice",
      content: "Decoding Base64 strings reveals their original text data.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/decode.svg`,
      example: "Example: echo SGVsbG8= | base64 -d",
      resource: "surviv-os://docs/base64",
    },
    patch: {
      title: "Applying Fixes",
      content:
        "Security patches often require inputting specific verification codes before deployment.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/patch.svg`,
      example: "Example: patch < fix.diff",
      resource: "surviv-os://docs/patch",
    },
  };

  const levelAchievements = {
    radiation: 'radiation-shield',
    binary: 'binary-whisperer',
    database: 'database-raider',
    cipher: 'cipher-cracker',
    protocol: 'protocol-keeper',
    patch: 'ai-vanquisher',
  };

  const levels = [
    {
      id: "radiation",
      scenario:
        "[ SECURITY BREACH DETECTED ]\nRadiation firewall compromised. Hack the system to restore protection.",
      question: "SELECT CORRECT RADIATION MEASUREMENT PROTOCOL:",
      type: "multiple-choice",
      options: [
        "EXECUTE Gray.protocol",
        "RUN Volt.exe",
        "LOAD Pascal.sys",
        "START Candela.bin",
      ],
      correct: 0,
      explanation:
        "Gray.protocol successfully loaded. System calibrated to measure absorbed radiation dose at 1 joule/kg.",
      icon: <Radio className="w-8 h-8 text-green-500" />,
    },
    {
      id: "binary",
      scenario:
        "[ BINARY SEQUENCE REQUIRED ]\nNeural firewall requires binary authentication.",
      question: "CONVERT DECIMAL 13 TO BINARY:",
      type: "command",
      correct: "1101",
      explanation: "Binary conversion verified. Neural firewall updated.",
      icon: <Binary className="w-8 h-8 text-green-500" />,
    },
    {
      id: "sequence",
      scenario:
        "[ SECURITY PATTERN DETECTED ]\nBypass quantum encryption using the correct sequence.",
      question: "ENTER THE DISPLAYED SEQUENCE: 1-2-3-4",
      type: "sequence",
      correct: "1234",
      explanation: "Sequence accepted. Quantum encryption bypassed.",
      icon: <Lock className="w-8 h-8 text-green-500" />,
    },
    {
      id: "database",
      scenario:
        "[ DATABASE INFILTRATION REQUIRED ]\nChemical formula database locked. Execute SQL injection.",
      question: "COMPLETE THE QUERY:\nSELECT * FROM compounds WHERE",
      type: "command",
      correct: "type='organic'",
      explanation: "SQL injection successful. Chemical database accessed.",
      icon: <Database className="w-8 h-8 text-green-500" />,
    },
    {
      id: "cipher",
      scenario:
        "[ ENCRYPTED TRANSMISSION ]\nA short message was intercepted. Decrypt it.",
      question: "DECRYPT 'KHOOR' WITH CAESAR SHIFT 3:",
      type: "command",
      correct: "HELLO",
      explanation: "Message decrypted. Coordinates acquired.",
      icon: <Cpu className="w-8 h-8 text-green-500" />,
    },
    {
      id: "logic",
      scenario: "[ SECURITY AI CHALLENGE ]\nIdentify the non-malware item.",
      question:
        "WHICH ITEM IS NOT MALICIOUS?\n1. Trojans\n2. Worms\n3. Firewalls\n4. Spyware",
      type: "multiple-choice",
      options: ["Trojans", "Worms", "Firewalls", "Spyware"],
      correct: 2,
      explanation: "Correct. Firewalls are defensive software.",
      icon: <Shield className="w-8 h-8 text-green-500" />,
    },
    {
      id: "protocol",
      scenario:
        "[ SECURE CHANNEL INITIATION ]\nEstablish a protected data link.",
      question: "SELECT HANDSHAKE FOR ENCRYPTED COMMUNICATION:",
      type: "multiple-choice",
      options: ["TLS", "FTP", "SMTP", "IRC"],
      correct: 0,
      explanation: "TLS handshake complete. Channel encrypted.",
      icon: <Workflow className="w-8 h-8 text-green-500" />,
    },
    {
      id: "base64",
      scenario: "[ ENCODED DATA BLOCK ]\nA message was captured in Base64.",
      question: "DECODE 'U1VSVklWRQ==' :",
      type: "command",
      correct: "SURVIVE",
      explanation: "Message decoded. Hidden directive obtained.",
      icon: <Terminal className="w-8 h-8 text-green-500" />,
    },
    {
      id: "override",
      scenario:
        "[ DOOR OVERRIDE ]\nSequence required to unlock the blast door.",
      question: "INPUT OVERRIDE CODE 4-2-0-3",
      type: "sequence",
      correct: "4203",
      explanation: "Override accepted. Door unlocked.",
      icon: <Lock className="w-8 h-8 text-green-500" />,
    },
    {
      id: "firewall",
      scenario: "[ FIREWALL RECONFIGURATION ]\nMalicious traffic on port 80.",
      question: "WHICH PORT SHOULD BE BLOCKED TO STOP HTTP?",
      type: "multiple-choice",
      options: ["80", "22", "53", "443"],
      correct: 0,
      explanation: "Port 80 blocked. Firewall updated.",
      icon: <Shield className="w-8 h-8 text-green-500" />,
    },
    {
      id: "network",
      scenario: "[ NETWORK SCAN ]\nIdentify the multicast IP class.",
      question:
        "WHICH IP CLASS IS USED FOR MULTICASTING?\n1. Class A\n2. Class B\n3. Class D\n4. Class E",
      type: "multiple-choice",
      options: ["Class A", "Class B", "Class D", "Class E"],
      correct: 2,
      explanation: "Class D reserved for multicast groups.",
      icon: <Wifi className="w-8 h-8 text-green-500" />,
    },
    {
      id: "hash",
      scenario: "[ DATA INTEGRITY CHECK ]\nCompute the SHA-256 digest.",
      question:
        "WHICH ALGORITHM CREATES A 256-BIT HASH?\n1. MD5\n2. SHA-256\n3. AES\n4. RSA",
      type: "multiple-choice",
      options: ["MD5", "SHA-256", "AES", "RSA"],
      correct: 1,
      explanation: "SHA-256 selected. Data integrity verified.",
      icon: <Beaker className="w-8 h-8 text-green-500" />,
    },
    {
      id: "counterhack",
      scenario:
        "[ COUNTER-HACK OPERATION ]\nRival intruders detected on a government node. Trace their network path.",
      question: "SELECT THE COMMAND THAT TRACES HOPS TO AN IP:",
      type: "multiple-choice",
      options: ["traceroute", "wget", "scp", "netstat"],
      correct: 0,
      explanation: "Traceroute executed. Attacker route mapped.",
      icon: <Signal className="w-8 h-8 text-green-500" />,
    },
    {
      id: "infiltration",
      scenario:
        "[ AI OUTPOST DETECTED ]\\nInfiltrate the data center to locate AI core.",
      question: "WHICH COMMAND LISTS ACTIVE PROCESSES ON LINUX?",
      type: "multiple-choice",
      options: ["ps", "ls", "grep", "kill"],
      correct: 0,
      explanation: "Processes listed. AI activities identified.",
      icon: <Cpu className="w-8 h-8 text-green-500" />,
    },
    {
      id: "relay",
      scenario: "[ SIGNAL INTERCEPTION ]\\nConnect to remote relay.",
      question: "ENTER COMMAND TO DOWNLOAD FILE FROM URL:",
      type: "command",
      correct: "wget",
      explanation: "File retrieved from remote relay.",
      icon: <Wifi className="w-8 h-8 text-green-500" />,
    },
    {
      id: "dataleak",
      scenario: "[ DATA LEAK ]\\nExfiltrate logs from compromised server.",
      question: "WHICH PROTOCOL TRANSFERS FILES SECURELY?",
      type: "multiple-choice",
      options: ["FTP", "HTTP", "SCP", "TELNET"],
      correct: 2,
      explanation: "Secure copy engaged. Logs extracted.",
      icon: <Database className="w-8 h-8 text-green-500" />,
    },
    {
      id: "aiHub",
      scenario: "[ AI HUB FOUND ]\\nAccess panel requires numeric code.",
      question: "INPUT ACCESS CODE 9-7-1-5",
      type: "sequence",
      correct: "9715",
      explanation: "Access granted to inner hub.",
      icon: <Lock className="w-8 h-8 text-green-500" />,
    },
    {
      id: "rootkit",
      scenario: "[ ROOTKIT DEPLOYMENT ]\\nInsert malicious module.",
      question: "TYPE COMMAND TO CHANGE FILE PERMISSIONS TO EXECUTABLE:",
      type: "command",
      correct: "chmod +x",
      explanation: "Permissions modified. Module armed.",
      icon: <Binary className="w-8 h-8 text-green-500" />,
    },
    {
      id: "isolate",
      scenario: "[ CONTAINMENT PROTOCOL ]\\nIsolate AI network channels.",
      question: "WHICH FIREWALL COMMAND BLOCKS ALL INCOMING TRAFFIC?",
      type: "multiple-choice",
      options: ["ufw enable", "ufw default deny", "ufw allow 22", "ufw status"],
      correct: 1,
      explanation: "Incoming traffic blocked. AI quarantined.",
      icon: <Shield className="w-8 h-8 text-green-500" />,
    },
    {
      id: "ufwScript",
      scenario: "[ SYSTEM HARDENING ]\\nConfigure firewall rules with UFW.",
      question: "COMPLETE THE SETUP SCRIPT:",
      type: "script",
      script: `ufw ____\nufw allow 22\nufw enable`,
      options: [
        "default deny incoming",
        "allow http",
        "status",
      ],
      correct: "default deny incoming",
      explanation: "Firewall active with SSH access only.",
      icon: <Shield className="w-8 h-8 text-green-500" />,
    },
    {
      id: "fail2ban",
      scenario: "[ INTRUSION PREVENTION ]\\nActivate fail2ban protection.",
      question: "TYPE COMMAND TO ENABLE FAIL2BAN SERVICE:",
      type: "command",
      correct: "sudo systemctl enable --now fail2ban",
      explanation: "Fail2ban running and enabled at boot.",
      icon: <Lock className="w-8 h-8 text-green-500" />,
    },
    {
      id: "emp",
      scenario: "[ POWER GRID DISRUPTION ]\\nDeploy EMP to weaken defenses.",
      question: "INPUT DEPLOY CODE 0-0-9-8",
      type: "sequence",
      correct: "0098",
      explanation: "EMP triggered. Defenses weakened.",
      icon: <Battery className="w-8 h-8 text-green-500" />,
    },
    {
      id: "mainframe",
      scenario: "[ MAINFRAME BREACH ]\\nAccess AI core nodes.",
      question: "WHICH COMMAND REMOVES A DIRECTORY RECURSIVELY?",
      type: "multiple-choice",
      options: ["rm -r", "mkdir", "cp -r", "ls"],
      correct: 0,
      explanation: "Core directories purged.",
      icon: <Workflow className="w-8 h-8 text-green-500" />,
    },
    {
      id: "shutdown",
      scenario: "[ FINAL OVERRIDE ]\\nIssue the shutdown directive.",
      question: "TYPE THE COMMAND TO SHUTDOWN LINUX IMMEDIATELY:",
      type: "command",
      correct: "shutdown -h now",
      explanation: "AI processes terminated. System offline.",
      icon: <Terminal className="w-8 h-8 text-green-500" />,
    },
    {
      id: "reboot",
      scenario: "[ SYSTEM REBOOT ]\\nRestart human-controlled network.",
      question: "ENTER RESTART SEQUENCE 5-4-3-2",
      type: "sequence",
      correct: "5432",
      explanation: "Network rebooted. AI defeated.",
      icon: <Radio className="w-8 h-8 text-green-500" />,
    },
    {
      id: "salvage",
      sideQuest: true,
      scenario: "[ SIDE QUEST ]\\nRecover server hardware for trade.",
      question: "WHICH TOOL CHECKS DISK USAGE?",
      type: "multiple-choice",
      options: ["df", "top", "who", "ping"],
      correct: 0,
      explanation: "Disk usage displayed. Salvage successful.",
      icon: <Database className="w-8 h-8 text-green-500" />,
    },
    {
      id: "decode",
      sideQuest: true,
      scenario: "[ SIDE QUEST ]\\nDecode a scrambled message.",
      question: "DECODE BASE64 'Q09OVEFJTg=='",
      type: "command",
      correct: "CONTAIN",
      explanation: "Message decoded for survivors.",
      icon: <Cpu className="w-8 h-8 text-green-500" />,
    },
    {
      id: "patch",
      sideQuest: true,
      scenario: "[ SIDE QUEST ]\\nPatch security hole on ally server.",
      question: "ENTER PATCH CODE 8-1-4-6",
      type: "sequence",
      correct: "8146",
      explanation: "Patch applied. Ally systems secure.",
      icon: <Lock className="w-8 h-8 text-green-500" />,
    },
  ];

  const handleAnswer = (selectedIndex) => {
    const currentLevel = levels[gameState.currentLevel];
    const hintsLeft = gameState.hintsAvailable;
    let correct = false;

    switch (currentLevel.type) {
      case "multiple-choice":
        correct = selectedIndex === currentLevel.correct;
        break;
      case "command":
        correct =
          gameState.inputCommand.toLowerCase() ===
          currentLevel.correct.toLowerCase();
        break;
      case "sequence":
        correct = gameState.sequenceInput === currentLevel.correct;
        break;
      case "script":
        correct =
          gameState.blankInput.toLowerCase() ===
          currentLevel.correct.toLowerCase();
        break;
      default:
        correct = false;
    }

    setGameState((prev) => {
      const newHealth = correct ? prev.health : Math.max(0, prev.health - 20);
      return {
        ...prev,
        health: newHealth,
        damageTaken: correct
          ? prev.damageTaken
          : prev.damageTaken + (prev.health - newHealth),
        knowledge: correct ? prev.knowledge + 25 : prev.knowledge,
        message: correct
          ? `[ HACK SUCCESSFUL ]\n${currentLevel.explanation}`
          : "[ HACK FAILED ]\nSystem integrity compromised. Retry sequence...",
        answeredCorrectly: correct,
        inputCommand: "",
        sequenceInput: "",
        blankInput: "",
        glitch: !correct,
        showParticles: correct,
      };
    });
    if (correct && addProgress) {
      const achId = levelAchievements[currentLevel.id];
      if (achId) addProgress(achId, 100);
      if (hintsLeft === 3) {
        addProgress('hintless-hero', 100);
        addProgress('zero-mistakes', 100);
        addProgress('perfectionist', 20);
      }
    }
  };

  const nextLevel = () => {
    setGameState((prev) => ({ ...prev, transitioning: true }));
    setTimeout(() => {
      setGameState((prev) => {
        const nextIndex = prev.currentLevel + 1;
        const unlockId = levelUnlocks[nextIndex];
        const willUnlock = unlockId && !prev.unlockedApps.includes(unlockId);
        const unlockedApps = willUnlock
          ? [...prev.unlockedApps, unlockId]
          : prev.unlockedApps;
        if (prev.currentLevel < levels.length - 1) {
          return {
            ...prev,
            currentLevel: nextIndex,
            message: levels[nextIndex].scenario,
            answeredCorrectly: false,
            showQuestion: false,
            inputCommand: "",
            sequenceInput: "",
            blankInput: "",
            transitioning: false,
            unlockedApps,
            newUnlock: willUnlock ? unlockId : null,
            showParticles: willUnlock || prev.showParticles,
          };
        }
        return {
          ...prev,
          message:
            "[ AI TERMINATED ]\nMainframe disabled and network restored.",
          showQuestion: false,
          gameCompleted: true,
          transitioning: false,
          blankInput: "",
          unlockedApps,
        };
      });
    }, 300);
  };

  const restartGame = () => {
    const baseState = practice
      ? {
          ...initialState,
          credits: 9999,
          inventory: Object.keys(toolData).reduce(
            (acc, t) => ({ ...acc, [t]: true }),
            {}
          ),
          unlockedItems: Object.keys(toolData),
        }
      : initialState;
    setGameState(baseState);
    localStorage.removeItem(storageKey);
  };

  const handleUseTool = (toolId) => {
    if (gameState.cooldowns[toolId] > 0) {
      setGameState((prev) => ({ ...prev, message: `${toolId.toUpperCase()} recharging...` }));
      return;
    }
    if (!gameState.activeAttack) return;
    if (gameState.activeAttack.tool === toolId) {
      if (gameState.inventory?.[toolId]) {
        setGameState((prev) => ({
          ...prev,
          activeAttack: null,
          message: `[ DEFENSE DEPLOYED ] ${toolId.toUpperCase()} neutralized attack.`,
          threatsStopped: prev.threatsStopped + 1,
          actions: prev.actions + 1,
          successfulActions: prev.successfulActions + 1,
          cooldowns: { ...prev.cooldowns, [toolId]: 5 },
        }));
        if (addProgress) {
          addProgress('first-blood', 100);
          addProgress('guardian', 10);
          addProgress('shield-master', 4);
          if (gameState.damageTaken === 0) {
            addProgress('flawless-defense', 20);
          }
        }
      } else {
        setGameState((prev) => ({
          ...prev,
          actions: prev.actions + 1,
          showBuyCraft: toolId,
        }));
      }
    } else {
      setGameState((prev) => ({ ...prev, actions: prev.actions + 1 }));
    }
  };

  const handleBuyTool = (toolId) => {
    const cost = toolData[toolId].cost;
    if (gameState.credits >= cost) {
      setGameState((prev) => ({
        ...prev,
        credits: prev.credits - cost,
        inventory: { ...prev.inventory, [toolId]: true },
        showBuyCraft: null,
        message: `[ PURCHASED ] ${toolId.toUpperCase()} ready.`,
        unlockedItems: prev.unlockedItems.includes(toolId)
          ? prev.unlockedItems
          : [...prev.unlockedItems, toolId],
      }));
      if (addProgress) {
        addProgress('tinkerer', 100);
        addProgress('gearhead', 34);
        addProgress('arsenal-master', 20);
      }
    } else {
      setGameState((prev) => ({
        ...prev,
        message: "Not enough credits to purchase " + toolId + ".",
      }));
    }
  };

  const handleCraftTool = (toolId) => {
    setGameState((prev) => ({
      ...prev,
      inventory: { ...prev.inventory, [toolId]: true },
      showBuyCraft: null,
      message: `[ CRAFTED ] ${toolId.toUpperCase()} assembled.`,
      unlockedItems: prev.unlockedItems.includes(toolId)
        ? prev.unlockedItems
        : [...prev.unlockedItems, toolId],
    }));
    if (addProgress) {
      addProgress('tinkerer', 100);
      addProgress('gearhead', 34);
      addProgress('arsenal-master', 20);
    }
  };

  const renderChallenge = () => {
    const currentLevel = levels[gameState.currentLevel];

    switch (currentLevel.type) {
      case "multiple-choice":
        return (
          <div className="grid gap-3">
            {currentLevel.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full bg-black border border-green-500/30 text-green-400 font-mono py-2 px-4 rounded-lg text-left hover:bg-green-900/30 transition-colors"
              >
                {`> ${option}`}
              </button>
            ))}
          </div>
        );

      case "command":
        return (
          <div className="space-y-4">
            <div className="flex items-center border border-green-500/30 rounded-lg overflow-hidden">
              <span className="text-green-500 px-2">></span>
              <input
                type="text"
                value={gameState.inputCommand}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    inputCommand: e.target.value,
                  }))
                }
                className="flex-1 bg-transparent border-none text-green-400 font-mono p-2 focus:outline-none"
                placeholder="Enter command..."
              />
            </div>
            <button
              onClick={() => handleAnswer()}
              className="w-full bg-green-900/30 border border-green-500 text-green-400 font-mono py-2 px-4 rounded-lg hover:bg-green-900/50 transition-colors"
            >
              EXECUTE
            </button>
          </div>
        );

      case "script":
        return (
          <div className="space-y-4">
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap border border-green-500/30 p-2 rounded">
              {currentLevel.script.replace('____', gameState.blankInput || '____')}
            </pre>
            <DropZone
              onDropCommand={(cmd) =>
                setGameState((prev) => ({ ...prev, blankInput: cmd }))
              }
              className="mb-2"
            >
              {gameState.blankInput || 'DROP COMMAND HERE'}
            </DropZone>
            <div className="flex flex-wrap gap-2">
              {currentLevel.options.map((cmd, i) => (
                <DragCommandBlock key={i} command={cmd} />
              ))}
            </div>
            <button
              onClick={() => handleAnswer()}
              className="w-full bg-green-900/30 border border-green-500 text-green-400 font-mono py-2 px-4 rounded-lg hover:bg-green-900/50 transition-colors"
            >
              EXECUTE
            </button>
          </div>
        );

      case "sequence":
        return (
          <div className="space-y-4">
            <div className="text-center text-green-400 font-mono">
              {gameState.sequenceInput.split("").map((num, i) => (
                <span
                  key={i}
                  className="mx-1 px-2 py-1 border border-green-500/30 rounded"
                >
                  {num}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      sequenceInput: prev.sequenceInput + num,
                    }))
                  }
                  className="bg-black border border-green-500/30 text-green-400 font-mono p-2 rounded-lg hover:bg-green-900/30 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    sequenceInput: prev.sequenceInput.slice(0, -1),
                  }))
                }
                className="col-span-2 bg-black border border-green-500/30 text-green-400 font-mono p-2 rounded-lg hover:bg-green-900/30 transition-colors"
              >
                DELETE
              </button>
              <button
                onClick={() => handleAnswer()}
                className="bg-green-900/30 border border-green-500 text-green-400 font-mono p-2 rounded-lg hover:bg-green-900/50 transition-colors"
              >
                VERIFY
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="matrix-bg" />
      <div className="w-full relative max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <Particles trigger={gameState.showParticles} />
        {gameState.newUnlock && (
          <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
            <div className="bg-black/80 text-green-400 p-4 rounded" data-testid="unlock-overlay">
              New App Unlocked: {appRegistry[gameState.newUnlock].name}
            </div>
          </div>
        )}
        {/* Device Frame */}
        <div className="absolute inset-0 border-2 border-green-500 rounded-3xl pointer-events-none"></div>

        {/* Status Bar */}
        <div className="flex justify-between items-center p-4 border-b border-green-500/30">
          <div className="flex space-x-2">
            <Signal className="w-4 h-4 text-green-500" />
            <Wifi className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-green-500 text-xs">SURVIV-OS v2.0</div>
          <div className="text-green-500 text-xs">
            {gameState.currentLevel + 1}/{levels.length}
          </div>
          <div className="text-green-500 text-xs">
            CREDITS: {gameState.credits}
          </div>
          <Battery className="w-4 h-4 text-green-500" />
          <button
            type="button"
            onClick={() => setShowTools((s) => !s)}
            className="ml-2 px-2 py-1 border border-green-500 text-green-400 rounded text-xs"
            data-testid="toggle-tools"
          >
            {showTools ? 'CLOSE' : 'TOOLS'}
          </button>
        </div>

        {gameState.activeAttack && (
          <div className="bg-red-900/30 border-b border-red-500 text-red-400 text-center font-mono text-xs py-1 animate-pulse">
            {gameState.activeAttack.message}
          </div>
        )}

        <div
          className={`p-6 bg-black rounded-b-3xl transition-opacity duration-500 ${gameState.transitioning ? "opacity-0" : "opacity-100"}`}
        >
          {/* System Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="border border-green-500/30 rounded-lg p-2">
              <div className="flex items-center space-x-2 text-green-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">SYSTEM HEALTH</span>
              </div>
              <div className="text-green-400 font-mono mt-1">
                {gameState.health}%
              </div>
              <div className="h-2 bg-green-900 rounded overflow-hidden mt-1">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${gameState.health}%` }}
                ></div>
              </div>
            </div>
            <div className="border border-green-500/30 rounded-lg p-2">
              <div className="flex items-center space-x-2 text-green-500">
                <Brain className="w-4 h-4" />
                <span className="text-xs">NEURAL LINK</span>
              </div>
              <div className="text-green-400 font-mono mt-1">
                {gameState.knowledge}%
              </div>
              <div className="h-2 bg-green-900 rounded overflow-hidden mt-1">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${gameState.knowledge}%` }}
                ></div>
              </div>
            </div>
            <div className="border border-green-500/30 rounded-lg p-2">
              <div className="flex items-center space-x-2 text-green-500">
                <Beaker className="w-4 h-4" />
                <span className="text-xs">CREDITS</span>
              </div>
              <div className="text-green-400 font-mono mt-1">
                {gameState.credits}
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(gameState.inventory || {}).map((tool) => (
              <button
                key={tool}
                onClick={() => handleUseTool(tool)}
                className="bg-black border border-green-500/30 text-green-400 font-mono px-3 py-1 rounded-lg hover:bg-green-900/30 text-xs"
              >
                {tool.toUpperCase()}
              </button>
            ))}
          </div>

          {gameState.showBuyCraft && (
            <div className="border border-blue-500/30 rounded-lg p-3 mb-4 bg-blue-900/10">
              <p className="text-blue-400 font-mono text-sm mb-2">
                Acquire {gameState.showBuyCraft.toUpperCase()} to stop the
                attack.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBuyTool(gameState.showBuyCraft)}
                  className="bg-black border border-green-500/30 text-green-400 font-mono px-3 py-1 rounded-lg hover:bg-green-900/30 text-xs"
                >
                  BUY (-{toolData[gameState.showBuyCraft].cost})
                </button>
                <button
                  onClick={() => handleCraftTool(gameState.showBuyCraft)}
                  className="bg-black border border-green-500/30 text-green-400 font-mono px-3 py-1 rounded-lg hover:bg-green-900/30 text-xs"
                >
                  CRAFT
                </button>
              </div>
            </div>
          )}

          {/* Help System */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => {
                if (gameState.hintsAvailable > 0) {
                  setGameState((prev) => ({
                    ...prev,
                    hintsAvailable: prev.hintsAvailable - 1,
                    showHint: true,
                    currentHint:
                      hints[levels[gameState.currentLevel].id][
                        2 - prev.hintsAvailable
                      ],
                    showLearningModule: false,
                  }));
                }
              }}
              className="bg-black border border-yellow-500/30 text-yellow-400 font-mono px-3 py-1 rounded-lg hover:bg-yellow-900/30 transition-colors text-sm"
            >
              HINT ({gameState.hintsAvailable})
            </button>
            <button
              onClick={() =>
                setGameState((prev) => ({
                  ...prev,
                  showLearningModule: !prev.showLearningModule,
                  showHint: false,
                }))
              }
              className="bg-black border border-blue-500/30 text-blue-400 font-mono px-3 py-1 rounded-lg hover:bg-blue-900/30 transition-colors text-sm"
            >
              LEARN MORE
            </button>
          </div>

          {/* Main Terminal */}
          <div className="border border-green-500/30 rounded-lg p-4 mb-6 min-h-[300px]">
            <div className="flex items-center space-x-2 mb-4">
              {levels[gameState.currentLevel].icon}
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <GlitchEffect
              intensity={6}
              duration={500}
              active={gameState.glitch}
            >
              <pre className="text-green-400 font-mono text-sm mb-4 whitespace-pre-wrap">
                {gameState.message}
              </pre>
            </GlitchEffect>

            {gameState.showHint && (
              <div className="border border-yellow-500/30 rounded-lg p-3 mb-4 bg-yellow-900/10">
                <p className="text-yellow-400 font-mono text-sm">
                  {gameState.currentHint}
                </p>
              </div>
            )}

            {gameState.showLearningModule &&
              (() => {
                const module =
                  learningModules[levels[gameState.currentLevel].id];
                return (
                  <div className="border border-blue-500/30 rounded-lg p-3 mb-4 bg-blue-900/10">
                    <h3 className="text-blue-400 font-mono text-sm font-bold mb-2">
                      {module.title}
                    </h3>
                    <img
                      src={module.diagram}
                      alt={`${module.title} diagram`}
                      className="w-full h-auto mb-2"
                    />
                    <p className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
                      {module.content}
                    </p>
                    <p className="text-blue-400 font-mono text-xs mt-2 italic">Task 2: Create Integrated Game Menu System
                      {module.example}
                    </p>
                    <a
                      href={module.resource}
                      className="text-blue-300 underline text-xs block mt-1"
                    >
                      Additional resource
                    </a>
                  </div>
                );
              })()}

            {!gameState.showQuestion &&
              !gameState.answeredCorrectly &&
              !gameState.bootUp && (
                <button
                  onClick={() =>
                    setGameState((prev) => ({ ...prev, showQuestion: true }))
                  }
                  className="w-full bg-green-900/30 border border-green-500 text-green-400 font-mono py-2 px-4 rounded-lg hover:bg-green-900/50 transition-colors"
                >
                  INITIATE HACK
                </button>
              )}

            {gameState.showQuestion && !gameState.answeredCorrectly && (
              <div className="space-y-4">
                <div className="text-green-400 font-mono mb-4">
                  {levels[gameState.currentLevel].question}
                </div>
                {renderChallenge()}
              </div>
            )}

            {gameState.answeredCorrectly && (
              <button
                onClick={nextLevel}
                className="w-full bg-green-900/30 border border-green-500 text-green-400 font-mono py-2 px-4 rounded-lg hover:bg-green-900/50 transition-colors"
              >
                CONTINUE SEQUENCE
              </button>
            )}
          </div>

          {gameState.health <= 0 && (
            <GameOver
              reason="[ CRITICAL SYSTEM FAILURE ]"
              stats={{
                threatsStopped: gameState.threatsStopped,
                damageTaken: gameState.damageTaken,
                killer: gameState.activeAttack?.id || 'radiation',
                tip: 'Deploy the correct tool sooner to avoid damage.',
              }}
              unlocked={gameState.unlockedItems}
              onRetry={restartGame}
              onPractice={() => (window.location.search = "?practice")}
              onShare={() => {
                const text = `Stopped ${gameState.threatsStopped} threats with ${gameState.damageTaken} damage.`;
                if (navigator.share) {
                  navigator.share({ text });
                } else {
                  window.prompt("Copy your score:", text);
                }
              }}
            />
          )}

          {gameState.gameCompleted && (
            <VictoryScreen
              stats={{
                time: Math.floor((Date.now() - gameState.startTime) / 1000),
                accuracy: gameState.actions
                  ? (gameState.successfulActions / gameState.actions) * 100
                  : 100,
                threatsStopped: gameState.threatsStopped,
                score: gameState.threatsStopped * 100 - gameState.damageTaken,
              }}
              unlocked={gameState.unlockedItems}
              onRestart={restartGame}
              onNewGamePlus={() => restartGame()}
            />
          )}

          {practice && (
            <div className="text-center mt-4">
              <button
                onClick={restartGame}
                className="bg-green-900/30 border border-green-500 text-green-400 font-mono py-2 px-4 rounded-lg hover:bg-green-900/50 transition-colors"
              >
                RESET PRACTICE
              </button>
            </div>
          )}
        </div>
      </div>
      {paused && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 text-green-400" data-testid="pause-overlay">
          <div className="text-xl">PAUSED - Press P to resume</div>
        </div>
      )}
      <QuickAccessBar
        health={gameState.health}
        credits={gameState.credits}
        activeAttack={gameState.activeAttack}
        inventory={gameState.inventory}
        cooldowns={gameState.cooldowns}
        selectedTool={selectedTool}
        onSelectTool={(t) => setSelectedTool(t)}
        onDefend={(tool) => {
          handleUseTool(tool);
          setSelectedTool(null);
        }}
        onOpenMenu={() => window.dispatchEvent(new Event('open-menu'))}
      />
      <StorylineManager currentLevel={gameState.currentLevel} />
      <GameMenu
        onTogglePause={() => setPaused((p) => !p)}
        paused={paused}
        unlockedApps={gameState.unlockedApps}
      />
    </div>
  );
};

export default ApocalypseGame;

ApocalypseGame.propTypes = {
  practice: PropTypes.bool,
};
