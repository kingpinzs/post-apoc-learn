import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const DragCommandBlock = ({ command, className }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', command);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        'bg-black border border-green-500/30 text-green-400 font-mono px-3 py-1 rounded-lg cursor-grab active:cursor-grabbing select-none',
        className,
      )}
    >
      {command}
    </div>
  );
};

DragCommandBlock.propTypes = {
  command: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default DragCommandBlock;
