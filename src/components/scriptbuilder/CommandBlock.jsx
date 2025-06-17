import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const COLORS = {
  START: 'bg-blue-700 border-blue-400',
  IF: 'bg-yellow-700 border-yellow-400',
  LOOP: 'bg-purple-700 border-purple-400',
  ACTION: 'bg-green-700 border-green-400',
  END: 'bg-red-700 border-red-400',
};

const CommandBlock = ({ blockType, parameters = [], connections = { top: true, bottom: true }, className }) => {
  const color = COLORS[blockType] || 'bg-gray-700 border-gray-400';
  const handleDragStart = (e) => {
    e.dataTransfer.setData('blockType', blockType);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        'relative inline-block rounded-md px-4 py-2 text-sm font-mono text-white border select-none cursor-grab active:cursor-grabbing',
        color,
        className,
      )}
      data-testid="command-block"
    >
      {connections.top && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black rounded-t-sm" data-testid="conn-top" />
      )}
      <span>{blockType}</span>
      {parameters.map((p, i) => {
        if (p.type === 'select') {
          return (
            <select key={i} className="mx-1 bg-black text-white border border-gray-500 rounded" data-testid="param-select">
              {p.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          );
        }
        return (
          <input key={i} placeholder={p.name} className="mx-1 bg-black text-white border border-gray-500 rounded w-16" data-testid="param-input" />
        );
      })}
      {connections.bottom && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black rounded-b-sm" data-testid="conn-bottom" />
      )}
    </div>
  );
};

CommandBlock.propTypes = {
  blockType: PropTypes.oneOf(['START', 'IF', 'LOOP', 'ACTION', 'END']).isRequired,
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['text', 'select']),
      name: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  connections: PropTypes.shape({
    top: PropTypes.bool,
    bottom: PropTypes.bool,
  }),
  className: PropTypes.string,
};

export default CommandBlock;
