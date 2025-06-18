import React, { useState } from 'react';
import PropTypes from 'prop-types';

const digits = ['1','2','3','4','5','6','7','8','9','0'];

const EmergencyKeypad = ({ code = '0000', onComplete }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');

  const press = (d) => () => {
    const next = (input + d).slice(0, code.length);
    setInput(next);
    if (next.length === code.length) {
      const ok = next === code;
      setStatus(ok ? 'ACCESS GRANTED' : 'DENIED');
      if (ok && onComplete) onComplete(true);
      if (!ok && onComplete) onComplete(false);
      setTimeout(() => {
        setInput('');
        setStatus('');
      }, 1000);
    }
  };

  return (
    <div className="p-4 space-y-2" data-testid="emergency-keypad">
      <div className="border border-green-500 text-green-400 font-mono p-2 text-center" data-testid="display">
        {input || '----'}
      </div>
      <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
        {digits.map((d) => (
          <button
            key={d}
            onClick={press(d)}
            className="border border-green-500 text-green-400 rounded px-2 py-1"
          >
            {d}
          </button>
        ))}
      </div>
      {status && <div className="text-green-400 font-mono text-center">{status}</div>}
    </div>
  );
};

EmergencyKeypad.propTypes = {
  code: PropTypes.string,
  onComplete: PropTypes.func,
};

export default EmergencyKeypad;
