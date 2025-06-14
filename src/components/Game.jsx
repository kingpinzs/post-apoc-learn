import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card } from '../components/ui/card';
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
    correctSequence: '1234'
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
    ]
  };

  const learningModules = {
    'radiation': {
      title: "Radiation Measurement",
      content: "Radiation dose is measured in Gray (Gy), which quantifies absorbed energy. 1 Gy equals 1 joule of radiation energy absorbed per kilogram of matter. This is crucial for radiation protection and medical applications."
    },
    'binary': {
      title: "Binary Conversion",
      content: "To convert decimal to binary:\n1. Find the largest power of 2 that fits\n2. Subtract it and mark 1\n3. Repeat for remainder\n4. Mark 0 for missing powers\nExample: 13\n8(1) + 4(1) + 2(0) + 1(1) = 1101"
    },
    'sequence': {
      title: "Pattern Recognition",
      content: "Sequences often follow patterns like:\n- Counting up/down\n- Mathematical operations\n- Repeating cycles\nLook for the simplest explanation first!"
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
4. Don't forget the = operator.`
    },
    'cipher': {
      title: "Caesar Cipher",
      content: "A Caesar cipher shifts letters by a fixed number. To decode, shift each letter backwards. Example: KHOOR shifted back by 3 becomes HELLO."
    },
    'logic': {
      title: "Malware Types",
      content: "Trojans, worms and spyware are malicious software. Firewalls, on the other hand, defend systems against attacks."
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
    }
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
      message: correct ? 
        `[ HACK SUCCESSFUL ]\n${currentLevel.explanation}` : 
        "[ HACK FAILED ]\nSystem integrity compromised. Retry sequence...",
      answeredCorrectly: correct,
      inputCommand: '',
      sequenceInput: ''
    }));
  };

  const nextLevel = () => {
    if (gameState.currentLevel < levels.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        message: levels[prev.currentLevel + 1].scenario,
        answeredCorrectly: false,
        showQuestion: false,
        inputCommand: '',
        sequenceInput: ''
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        message: "[ TRAINING COMPLETE ]\nAll security protocols mastered. Full access granted.",
        showQuestion: false
      }));
    }
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
              {[1,2,3,4,5,6,7,8,9].map(num => (
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
      <div className="w-full max-w-md relative">
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

        <div className="p-6 bg-black rounded-b-3xl">
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
            
            <pre className="text-green-400 font-mono text-sm mb-4 whitespace-pre-wrap">
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
              <div className="border border-blue-500/30 rounded-lg p-3 mb-4 bg-blue-900/10">
                <h3 className="text-blue-400 font-mono text-sm font-bold mb-2">
                  {learningModules[levels[gameState.currentLevel].id].title}
                </h3>
                <p className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
                  {learningModules[levels[gameState.currentLevel].id].content}
                </p>
              </div>
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
                onClick={() => window.location.reload()}
                className="bg-red-900/30 border border-red-500 text-red-400 font-mono py-2 px-4 rounded-lg hover:bg-red-900/50 transition-colors"
              >
                SYSTEM REBOOT
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
