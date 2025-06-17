import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ExecutionVisualizer = ({ commands, onComplete }) => {
  const [current, setCurrent] = useState(-1);

  useEffect(() => {
    if (!commands || commands.length === 0) return;
    setCurrent(-1);
    let index = 0;
    const id = setInterval(() => {
      setCurrent(index);
      index += 1;
      if (index >= commands.length) {
        clearInterval(id);
        if (onComplete) onComplete();
      }
    }, 300);
    return () => clearInterval(id);
  }, [commands, onComplete]);

  return (
    <div className="space-y-1 mt-2" data-testid="execution-visualizer">
      {commands.map((cmd, i) => {
        const label = typeof cmd === 'string' ? cmd : cmd.type;
        return (
          <div
            key={i}
            className={
              i === current
                ? 'text-black bg-green-400 rounded px-2'
                : 'text-green-400'
            }
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

ExecutionVisualizer.propTypes = {
  commands: PropTypes.arrayOf(PropTypes.string).isRequired,
  onComplete: PropTypes.func,
};

export default ExecutionVisualizer;
