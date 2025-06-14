import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card } from '../components/ui/card';
import Particles from './Particles';
import { 
  AlertCircle, Brain, Cpu, Beaker, Radio, Battery, Wifi, Signal,
  Lock, Shield, Database, Workflow, Terminal, Binary
} from 'lucide-react';

const initialState = {
    hintsAvailable: 3,
    showHint: false,
    currentHint: '',
    showLearningModule: false,
    health: 100,
    knowledge: 0,
    currentLevel: 0,
    message: "INITIATING NEURAL INTERFACE...",
    showQuestion: false,
    answeredCorrectly: false,
    bootUp: true,
    inputCommand: '',
    sequenceInput: '',
    correctSequence: '1234',
    gameCompleted: false,
    glitch: false,
    showParticles: false,
    transitioning: false
};

const ApocalypseGame = () => {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('gameState');
    return saved ? JSON.parse(saved) : initialState;
  });

  const handleKeyPress = useCallback(
    (e) => {
      if (
        gameState.showQuestion &&
        levels[gameState.currentLevel].type === 'sequence'
      ) {
        if (/^\d$/.test(e.key)) {
          setGameState((prev) => ({
            ...prev,
            sequenceInput: prev.sequenceInput + e.key,
          }));
        }
      }
    },
    [gameState.showQuestion, gameState.currentLevel]
  );

  useEffect(() => {
    let bootTimeout;
    if (gameState.bootUp) {
      bootTimeout = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          message: 'Welcome to SURVIV-OS v2.0. Commence hacking training...',
          bootUp: false,
        }));
      }, 2000);
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      clearTimeout(bootTimeout);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState.showQuestion, gameState.currentLevel, handleKeyPress]);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    if (gameState.glitch) {
      const t = setTimeout(() => {
        setGameState(prev => ({ ...prev, glitch: false }));
      }, 500);
      return () => clearTimeout(t);
    }
  }, [gameState.glitch]);

  useEffect(() => {
    if (gameState.showParticles) {
      const t = setTimeout(() => {
        setGameState(prev => ({ ...prev, showParticles: false }));
      }, 800);
      return () => clearTimeout(t);
    }
  }, [gameState.showParticles]);

  const hints = {
    radiation: [
      'Think about the units used to measure absorbed radiation energy.',
      'The Gray (Gy) measures energy absorbed per kilogram.',
      '1 Gray = 1 joule per kilogram of absorbed radiation.',
      'Use number keys 1-4 to select an option.'
    ],
    binary: [
      'Break down the number into powers of 2.',
      '13 = 8 + 4 + 1.',
      '8 = 2³, 4 = 2², 1 = 2⁰.',
      'You can type directly into the input field.'
    ],
    sequence: [
      'Watch for patterns in the numbers.',
      'Try entering the numbers in order.',
      'The sequence follows a simple ascending pattern.',
      'Use keyboard digits or on-screen buttons.'
    ],
    database: [
      'SQL queries filter data using WHERE clause.',
      "The syntax should be: column='value'.",
      "We're looking for organic compounds.",
      'Press Enter or VERIFY to submit.'
    ],
    cipher: [
      'Shift each letter back by 3.',
      'K -> H is your first clue.',
      'Think of the alphabet looping around.',
      'Type the decoded word.'
    ],
    logic: [
      'Three options are harmful programs.',
      'Firewalls protect systems rather than attack.',
      'Identify the defensive software.',
      'Use number keys 1-4.'
    ],
    protocol: [
      'Used by HTTPS to secure connections.',
      'It replaced the older SSL standard.',
      'Stands for Transport Layer Security.',
      'Use number keys 1-4.'
    ],
    base64: [
      'Base64 groups characters into sets of four.',
      'Padding often appears as = at the end.',
      'U1VSVklWRQ== decodes to a single word.',
      'Type the decoded text.'
    ],
    override: [
      'Digits flash briefly on the keypad.',
      'Enter them exactly in that order.',
      'DELETE removes the last digit.',
      'Use on-screen buttons or keyboard.'
    ],
    firewall: [
      'Standard web traffic uses a common port.',
      'Blocking that port stops HTTP requests.',
      'HTTPS typically uses port 443 instead.',
      'Use number keys 1-4.'
    ],
    network: [
      'Multicast addresses begin with 224.',
      'They are reserved for one-to-many traffic.',
      'Class D is set aside for this purpose.',
      'Use number keys 1-4.'
    ],
    hash: [
      'Look for a hashing algorithm, not encryption.',
      'It outputs 64 hexadecimal characters.',
      'Part of the SHA-2 family.',
      'Use number keys 1-4.'
    ],
    counterhack: [
      'This command reveals each hop to a destination.',
      'Useful when tracking adversaries across the net.',
      'Often installed by default on Unix systems.',
      'Use number keys 1-4.'
    ]
  };

  const learningModules = {
    'radiation': {
      title: "Radiation Measurement",
      content: "Radiation dose is measured in Gray (Gy), which quantifies absorbed energy. 1 Gy equals 1 joule of radiation energy absorbed per kilogram of matter. This is crucial for radiation protection and medical applications.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/radiation.svg`,
      example: "Example: Dosimeters in nuclear facilities report exposure in Gray.",
      resource: "surviv-os://docs/radiation"
    },
    'binary': {
      title: "Binary Conversion",
      content: "To convert decimal to binary:\n1. Find the largest power of 2 that fits\n2. Subtract it and mark 1\n3. Repeat for remainder\n4. Mark 0 for missing powers\nExample: 13\n8(1) + 4(1) + 2(0) + 1(1) = 1101",
      diagram: `${process.env.PUBLIC_URL}/diagrams/binary.svg`,
      example: "Example: Microcontrollers process instructions in binary form.",
      resource: "surviv-os://docs/binary"
    },
    'sequence': {
      title: "Pattern Recognition",
      content: "Sequences often follow patterns like:\n- Counting up/down\n- Mathematical operations\n- Repeating cycles\nLook for the simplest explanation first!",
      diagram: `${process.env.PUBLIC_URL}/diagrams/sequence.svg`,
      example: "Example: Authentication tokens often rely on numeric sequences.",
      resource: "surviv-os://docs/sequences"
    },
    'database': {
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
      example: "Example: Querying customers WHERE active='true' fetches valid accounts.",
      resource: "surviv-os://docs/database"
    },
    'cipher': {
      title: "Caesar Cipher",
      content: "A Caesar cipher shifts letters by a fixed number. To decode, shift each letter backwards. Example: KHOOR shifted back by 3 becomes HELLO.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/cipher.svg`,
      example: "Example: Julius Caesar used a 3-letter shift to encrypt messages.",
      resource: "surviv-os://docs/caesar"
    },
    'logic': {
      title: "Malware Types",
      content: "Trojans, worms and spyware are malicious software. Firewalls, on the other hand, defend systems against attacks.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/logic.svg`,
      example: "Example: Firewalls act as gatekeepers to block malicious traffic.",
      resource: "surviv-os://docs/malware"
    },
    'protocol': {
      title: "Secure Protocols",
      content: "TLS (Transport Layer Security) establishes encrypted connections and is widely used to secure web traffic.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/protocol.svg`,
      example: "Example: Websites like banks use TLS to protect data in transit.",
      resource: "surviv-os://docs/tls"
    },
    'base64': {
      title: "Base64 Encoding",
      content: "Base64 converts binary data into ASCII characters. Example: 'U1VSVklWRQ==' decodes to 'SURVIVE'.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/base64.svg`,
      example: "Example: Images in emails are often encoded in Base64.",
      resource: "surviv-os://docs/base64"
    },
    'override': {
      title: "Keypad Overrides",
      content: "Security keypads use numeric codes. Entering the correct sequence disables locks while mistakes can trigger alarms.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/override.svg`,
      example: "Example: Keypads for secure doors can be overridden by entering master codes.",
      resource: "surviv-os://docs/override"
    },
    'firewall': {
      title: "Firewall Ports",
      content: "Firewalls filter traffic by port number. Blocking port 80 stops standard HTTP traffic while HTTPS uses 443.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/firewall.svg`,
      example: "Example: Administrators block port 80 to disable standard web access.",
      resource: "surviv-os://docs/firewall"
    },
    'network': {
      title: "IP Address Classes",
      content: "Class D addresses (224.0.0.0–239.255.255.255) are reserved for multicast, enabling one-to-many communication.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/network.svg`,
      example: "Example: IPTV streaming uses Class D multicast addresses.",
      resource: "surviv-os://docs/multicast"
    },
    'hash': {
      title: "Cryptographic Hashes",
      content: "SHA-256 generates a 256-bit digest used to verify data integrity. It is part of the SHA-2 family.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/hash.svg`,
      example: "Example: Downloads often provide a SHA-256 checksum for verification.",
      resource: "surviv-os://docs/sha256"
    },
    'counterhack': {
      title: "Traceroute Command",
      content: "Traceroute maps the path packets take to a destination by sending packets with increasing TTL values. It helps reveal each intermediary hop and diagnose network issues.",
      diagram: `${process.env.PUBLIC_URL}/diagrams/traceroute.svg`,
      example: "Example: traceroute 8.8.8.8 displays hops to Google's DNS server.",
      resource: "surviv-os://docs/traceroute"
    }
  };

  const levels = [
    {
      id: 'radiation',
      scenario: "[ SECURITY BREACH DETECTED ]\nRadiation firewall compromised. Hack the system to restore protection.",
      question: "SELECT CORRECT RADIATION MEASUREMENT PROTOCOL:",
      type: 'multiple-choice',
      options: ["EXECUTE Gray.protocol", "RUN Volt.exe", "LOAD Pascal.sys", "START Candela.bin"],
      correct: 0,
      explanation: "Gray.protocol successfully loaded. System calibrated to measure absorbed radiation dose at 1 joule/kg.",
      icon: <Radio className="w-8 h-8 text-green-500" />
    },
    {
      id: 'binary',
      scenario: "[ BINARY SEQUENCE REQUIRED ]\nNeural firewall requires binary authentication.",
      question: "CONVERT DECIMAL 13 TO BINARY:",
      type: 'command',
      correct: "1101",
      explanation: "Binary conversion verified. Neural firewall updated.",
      icon: <Binary className="w-8 h-8 text-green-500" />
    },
    {
      id: 'sequence',
      scenario: "[ SECURITY PATTERN DETECTED ]\nBypass quantum encryption using the correct sequence.",
      question: "ENTER THE DISPLAYED SEQUENCE: 1-2-3-4",
      type: 'sequence',
      correct: "1234",
      explanation: "Sequence accepted. Quantum encryption bypassed.",
      icon: <Lock className="w-8 h-8 text-green-500" />
    },
    {
      id: 'database',
      scenario: "[ DATABASE INFILTRATION REQUIRED ]\nChemical formula database locked. Execute SQL injection.",
      question: "COMPLETE THE QUERY:\nSELECT * FROM compounds WHERE",
      type: 'command',
      correct: "type='organic'",
      explanation: "SQL injection successful. Chemical database accessed.",
      icon: <Database className="w-8 h-8 text-green-500" />
    },
    {
      id: 'cipher',
      scenario: "[ ENCRYPTED TRANSMISSION ]\nA short message was intercepted. Decrypt it.",
      question: "DECRYPT 'KHOOR' WITH CAESAR SHIFT 3:",
      type: 'command',
      correct: 'HELLO',
      explanation: "Message decrypted. Coordinates acquired.",
      icon: <Cpu className="w-8 h-8 text-green-500" />
    },
    {
      id: 'logic',
      scenario: "[ SECURITY AI CHALLENGE ]\nIdentify the non-malware item.",
      question: "WHICH ITEM IS NOT MALICIOUS?\n1. Trojans\n2. Worms\n3. Firewalls\n4. Spyware",
      type: 'multiple-choice',
      options: ['Trojans', 'Worms', 'Firewalls', 'Spyware'],
      correct: 2,
      explanation: "Correct. Firewalls are defensive software.",
      icon: <Shield className="w-8 h-8 text-green-500" />
    },
    {
      id: 'protocol',
      scenario: "[ SECURE CHANNEL INITIATION ]\nEstablish a protected data link.",
      question: "SELECT HANDSHAKE FOR ENCRYPTED COMMUNICATION:",
      type: 'multiple-choice',
      options: ['TLS', 'FTP', 'SMTP', 'IRC'],
      correct: 0,
      explanation: "TLS handshake complete. Channel encrypted.",
      icon: <Workflow className="w-8 h-8 text-green-500" />
    },
    {
      id: 'base64',
      scenario: "[ ENCODED DATA BLOCK ]\nA message was captured in Base64.",
      question: "DECODE 'U1VSVklWRQ==' :",
      type: 'command',
      correct: 'SURVIVE',
      explanation: "Message decoded. Hidden directive obtained.",
      icon: <Terminal className="w-8 h-8 text-green-500" />
    },
    {
      id: 'override',
      scenario: "[ DOOR OVERRIDE ]\nSequence required to unlock the blast door.",
      question: "INPUT OVERRIDE CODE 4-2-0-3",
      type: 'sequence',
      correct: '4203',
      explanation: "Override accepted. Door unlocked.",
      icon: <Lock className="w-8 h-8 text-green-500" />
    },
    {
      id: 'firewall',
      scenario: "[ FIREWALL RECONFIGURATION ]\nMalicious traffic on port 80.",
      question: "WHICH PORT SHOULD BE BLOCKED TO STOP HTTP?",
      type: 'multiple-choice',
      options: ['80', '22', '53', '443'],
      correct: 0,
      explanation: "Port 80 blocked. Firewall updated.",
      icon: <Shield className="w-8 h-8 text-green-500" />
    },
    {
      id: 'network',
      scenario: "[ NETWORK SCAN ]\nIdentify the multicast IP class.",
      question: "WHICH IP CLASS IS USED FOR MULTICASTING?\n1. Class A\n2. Class B\n3. Class D\n4. Class E",
      type: 'multiple-choice',
      options: ['Class A', 'Class B', 'Class D', 'Class E'],
      correct: 2,
      explanation: "Class D reserved for multicast groups.",
      icon: <Wifi className="w-8 h-8 text-green-500" />
    },
    {
      id: 'hash',
      scenario: "[ DATA INTEGRITY CHECK ]\nCompute the SHA-256 digest.",
      question: "WHICH ALGORITHM CREATES A 256-BIT HASH?\n1. MD5\n2. SHA-256\n3. AES\n4. RSA",
      type: 'multiple-choice',
      options: ['MD5', 'SHA-256', 'AES', 'RSA'],
      correct: 1,
      explanation: "SHA-256 selected. Data integrity verified.",
      icon: <Beaker className="w-8 h-8 text-green-500" />
    },
    {
      id: 'counterhack',
      scenario: "[ COUNTER-HACK OPERATION ]\nRival intruders detected on a government node. Trace their network path.",
      question: "SELECT THE COMMAND THAT TRACES HOPS TO AN IP:",
      type: 'multiple-choice',
      options: ['traceroute', 'wget', 'scp', 'netstat'],
      correct: 0,
      explanation: "Traceroute executed. Attacker route mapped.",
      icon: <Signal className="w-8 h-8 text-green-500" />
    },
  ];

  const handleAnswer = (selectedIndex) => {
    const currentLevel = levels[gameState.currentLevel];
    let correct = false;

    switch (currentLevel.type) {
      case 'multiple-choice':
        correct = selectedIndex === currentLevel.correct;
        break;
      case 'command':
        correct = gameState.inputCommand.toLowerCase() === currentLevel.correct.toLowerCase();
        break;
      case 'sequence':
        correct = gameState.sequenceInput === currentLevel.correct;
        break;
      default:
        correct = false;
    }
    
    setGameState(prev => ({
      ...prev,
      health: correct ? prev.health : Math.max(0, prev.health - 20),
      knowledge: correct ? prev.knowledge + 25 : prev.knowledge,
      message: correct
        ? `[ HACK SUCCESSFUL ]\n${currentLevel.explanation}`
        : "[ HACK FAILED ]\nSystem integrity compromised. Retry sequence...",
      answeredCorrectly: correct,
      inputCommand: '',
      sequenceInput: '',
      glitch: !correct,
      showParticles: correct
    }));
  };

  const nextLevel = () => {
    setGameState(prev => ({ ...prev, transitioning: true }));
    setTimeout(() => {
      setGameState(prev => {
        if (prev.currentLevel < levels.length - 1) {
          return {
            ...prev,
            currentLevel: prev.currentLevel + 1,
            message: levels[prev.currentLevel + 1].scenario,
            answeredCorrectly: false,
            showQuestion: false,
            inputCommand: '',
            sequenceInput: '',
            transitioning: false
          };
        }
        return {
          ...prev,
          message: "[ TRAINING COMPLETE ]\nAll security protocols mastered. Full access granted.",
          showQuestion: false,
          gameCompleted: true,
          transitioning: false
        };
      });
    }, 300);
  };

  const restartGame = () => {
    setGameState(initialState);
    localStorage.removeItem('gameState');
  };

  const renderChallenge = () => {
    const currentLevel = levels[gameState.currentLevel];

    switch (currentLevel.type) {
      case 'multiple-choice':
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
      
      case 'command':
        return (
          <div className="space-y-4">
            <div className="flex items-center border border-green-500/30 rounded-lg overflow-hidden">
              <span className="text-green-500 px-2">></span>
              <input
                type="text"
                value={gameState.inputCommand}
                onChange={(e) => setGameState(prev => ({...prev, inputCommand: e.target.value}))}
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

      case 'sequence':
        return (
          <div className="space-y-4">
            <div className="text-center text-green-400 font-mono">
              {gameState.sequenceInput.split('').map((num, i) => (
                <span key={i} className="mx-1 px-2 py-1 border border-green-500/30 rounded">
                  {num}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6,7,8,9,0].map(num => (
                <button
                  key={num}
                  onClick={() => setGameState(prev => ({
                    ...prev,
                    sequenceInput: prev.sequenceInput + num
                  }))}
                  className="bg-black border border-green-500/30 text-green-400 font-mono p-2 rounded-lg hover:bg-green-900/30 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setGameState(prev => ({
                  ...prev,
                  sequenceInput: prev.sequenceInput.slice(0, -1)
                }))}
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
      <div className="w-full max-w-md relative">
        <Particles trigger={gameState.showParticles} />
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
          <Battery className="w-4 h-4 text-green-500" />
        </div>

        <div className={`p-6 bg-black rounded-b-3xl transition-opacity duration-500 ${gameState.transitioning ? 'opacity-0' : 'opacity-100'}`}>
          {/* System Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-green-500/30 rounded-lg p-2">
              <div className="flex items-center space-x-2 text-green-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">SYSTEM HEALTH</span>
              </div>
              <div className="text-green-400 font-mono mt-1">{gameState.health}%</div>
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
              <div className="text-green-400 font-mono mt-1">{gameState.knowledge}%</div>
              <div className="h-2 bg-green-900 rounded overflow-hidden mt-1">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${gameState.knowledge}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Help System */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => {
                if (gameState.hintsAvailable > 0) {
                  setGameState(prev => ({
                    ...prev,
                    hintsAvailable: prev.hintsAvailable - 1,
                    showHint: true,
                    currentHint: hints[levels[gameState.currentLevel].id][2 - prev.hintsAvailable],
                    showLearningModule: false
                  }));
                }
              }}
              className="bg-black border border-yellow-500/30 text-yellow-400 font-mono px-3 py-1 rounded-lg hover:bg-yellow-900/30 transition-colors text-sm"
            >
              HINT ({gameState.hintsAvailable})
            </button>
            <button
              onClick={() => setGameState(prev => ({
                ...prev,
                showLearningModule: !prev.showLearningModule,
                showHint: false
              }))}
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
            
            <pre className={`text-green-400 font-mono text-sm mb-4 whitespace-pre-wrap ${gameState.glitch ? 'glitch' : ''}`}>
              {gameState.message}
            </pre>

            {gameState.showHint && (
              <div className="border border-yellow-500/30 rounded-lg p-3 mb-4 bg-yellow-900/10">
                <p className="text-yellow-400 font-mono text-sm">
                  {gameState.currentHint}
                </p>
              </div>
            )}

            {gameState.showLearningModule && (
              (() => {
                const module = learningModules[levels[gameState.currentLevel].id];
                return (
                  <div className="border border-blue-500/30 rounded-lg p-3 mb-4 bg-blue-900/10">
                    <h3 className="text-blue-400 font-mono text-sm font-bold mb-2">
                      {module.title}
                    </h3>
                    <img src={module.diagram} alt={`${module.title} diagram`} className="w-full h-auto mb-2" />
                    <p className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
                      {module.content}
                    </p>
                    <p className="text-blue-400 font-mono text-xs mt-2 italic">
                      {module.example}
                    </p>
                    <a href={module.resource} className="text-blue-300 underline text-xs block mt-1">
                      Additional resource
                    </a>
                  </div>
                );
              })()
            )}
            
            {!gameState.showQuestion && !gameState.answeredCorrectly && !gameState.bootUp && (
              <button 
                onClick={() => setGameState(prev => ({...prev, showQuestion: true}))}
                className="w-full bg-green-900/30 border border-green-500 text-green-400 font-mono py-2 px-4 rounded-lg hover:bg-green-900/50 transition-colors"
              >
                INITIATE HACK
              </button>
            )}

            {gameState.showQuestion && !gameState.answeredCorrectly && (
              <div className="space-y-4">
                <div className="text-green-400 font-mono mb-4">{levels[gameState.currentLevel].question}</div>
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
            <div className="text-center border border-red-500 rounded-lg p-4">
              <p className="text-red-500 font-mono mb-4">[ CRITICAL SYSTEM FAILURE ]</p>
              <button
                onClick={restartGame}
                className="bg-red-900/30 border border-red-500 text-red-400 font-mono py-2 px-4 rounded-lg hover:bg-red-900/50 transition-colors"
              >
                SYSTEM REBOOT
              </button>
            </div>
          )}

          {gameState.gameCompleted && (
            <div className="text-center border border-green-500 rounded-lg p-4 mt-4">
              <button
                onClick={restartGame}
                className="bg-green-900/30 border border-green-500 text-green-400 font-mono py-2 px-4 rounded-lg hover:bg-green-900/50 transition-colors"
              >
                RESTART TRAINING
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApocalypseGame;

ApocalypseGame.propTypes = {};
