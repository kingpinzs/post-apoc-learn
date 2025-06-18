import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Minimal command-line interface supporting a few demo commands.
 */
const fs = {
  '/': ['home', 'var'],
  '/home': ['survivor.txt'],
};

const readFile = {
  'survivor.txt': 'Stay hidden. Avoid radiation. Keep moving.',
};

const TerminalScreen = ({ initialCommand = '' }) => {
  const [cwd, setCwd] = useState('/');
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState(initialCommand);

  useEffect(() => {
    setInput(initialCommand);
  }, [initialCommand]);

  const run = () => {
    const parts = input.trim().split(' ');
    const cmd = parts[0];
    const arg = parts[1];
    let out = '';
    if (cmd === 'ls') {
      out = (fs[cwd] || []).join(' ');
    } else if (cmd === 'cd') {
      const path = arg === '..' ? '/' : `${cwd === '/' ? '' : cwd}/${arg}`;
      if (fs[path]) setCwd(path);
    } else if (cmd === 'cat') {
      out = readFile[arg] || 'file not found';
    } else {
      out = `unknown command: ${cmd}`;
    }
    setHistory((h) => [...h, `$ ${input}`, out]);
    setInput('');
  };

  return (
    <div className="p-2 font-mono text-green-400" data-testid="terminal-screen">
      <div className="h-60 overflow-auto bg-black p-2 border border-green-500 mb-2 space-y-1">
        {history.map((h, i) => (
          <div key={i}>{h}</div>
        ))}
      </div>
      <div className="flex space-x-2">
        <span className="shrink-0">{cwd} $</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          className="flex-1 bg-transparent border-b border-green-500 outline-none"
        />
      </div>
    </div>
  );
};

TerminalScreen.propTypes = {
  initialCommand: PropTypes.string,
};

export default TerminalScreen;
