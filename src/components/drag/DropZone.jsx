import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const DropZone = ({ onDropCommand, children, className, ...props }) => {
  const [over, setOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const cmd = e.dataTransfer.getData('text/plain');
    if (cmd && onDropCommand) onDropCommand(cmd);
    setOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setOver(true);
  };

  const handleDragLeave = () => setOver(false);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'min-h-[40px] flex items-center justify-center border border-dashed rounded-md text-green-400',
        over ? 'border-green-400 bg-green-900/30' : 'border-green-500/30',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

DropZone.propTypes = {
  onDropCommand: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default DropZone;
