import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Lock } from 'lucide-react';
import { cn } from '../lib/utils';

const AppIcon = ({
  appId,
  name,
  icon,
  isLocked = false,
  isDraggable = false,
  onDragStart,
  onDragEnd,
  onClick,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e) => {
    setDragging(true);
    if (onDragStart) {
      onDragStart(appId, e);
    }
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    if (onDragEnd) {
      onDragEnd(appId, e);
    }
  };

  return (
    <div
      id={`app-icon-${appId}`}
      className="flex flex-col items-center w-16"
      data-tutorial={`app-icon-${appId}`}
    >
      <div
        draggable={isDraggable && !isLocked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={onClick}
        className={cn(
          'relative w-16 h-16 flex items-center justify-center rounded-lg bg-gray-800 text-white',
          dragging && 'ring-2 ring-green-400 ring-offset-2 animate-pulse'
        )}
      >
        {icon}
        {isLocked && (
          <div
            data-testid="lock-overlay"
            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg"
          >
            <Lock className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      <div className="mt-1 w-full text-xs text-center truncate text-white">
        {name}
      </div>
    </div>
  );
};

AppIcon.propTypes = {
  appId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  isLocked: PropTypes.bool,
  isDraggable: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onClick: PropTypes.func,
};

export default AppIcon;
