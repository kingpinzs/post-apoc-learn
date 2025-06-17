import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const DefenseMinigame = ({ threatPattern = [], timeLimit = 10, onSuccess, onFailure }) => {
  const [slots, setSlots] = useState(Array(threatPattern.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const checkPattern = () => {
    const match = slots.join('') === threatPattern.join('');
    if (match) {
      if (onSuccess) onSuccess();
    } else if (onFailure) onFailure();
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      checkPattern();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (slots.every(Boolean)) {
      clearInterval(timerRef.current);
      checkPattern();
    }
  }, [slots]);

  const handleDragStart = (sym) => (e) => {
    e.dataTransfer.setData('text/plain', sym);
  };

  const handleDrop = (index) => (e) => {
    e.preventDefault();
    const sym = e.dataTransfer.getData('text/plain');
    if (!sym) return;
    setSlots((prev) => {
      const ns = prev.slice();
      ns[index] = sym;
      return ns;
    });
  };

  return (
    <div className="p-4 space-y-4" data-testid="defense-minigame">
      <div className="text-green-400 font-mono" data-testid="threat-pattern">
        {threatPattern.join(' ')}
      </div>
      <div className="flex space-x-2" data-testid="drop-area">
        {slots.map((sym, i) => (
          <div
            key={i}
            onDrop={handleDrop(i)}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              'w-8 h-8 border border-green-500/30 rounded flex items-center justify-center',
              sym ? 'bg-green-900/30' : 'bg-black'
            )}
            data-testid={`slot-${i}`}
          >
            {sym}
          </div>
        ))}
      </div>
      <div className="flex space-x-2" data-testid="palette">
        {threatPattern.map((sym, idx) => (
          <div
            key={`${sym}-${idx}`}
            draggable
            onDragStart={handleDragStart(sym)}
            className="w-8 h-8 border border-green-500/30 bg-black text-green-400 rounded flex items-center justify-center cursor-grab active:cursor-grabbing"
            data-testid={`symbol-${idx}`}
          >
            {sym}
          </div>
        ))}
      </div>
      <div className="text-green-400" data-testid="timer">
        {timeLeft}
      </div>
    </div>
  );
};

DefenseMinigame.propTypes = {
  threatPattern: PropTypes.arrayOf(PropTypes.string).isRequired,
  timeLimit: PropTypes.number,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
};

export default DefenseMinigame;
