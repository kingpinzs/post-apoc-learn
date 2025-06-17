import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Icons from 'lucide-react';
import { appRegistry } from '../lib/appRegistry';
import { cn } from '../lib/utils';

const STORAGE_KEY = 'dockSlots';

const DockBar = ({ slots = Array(5).fill(null), onDropApp, onRemoveApp }) => {
  const [dockSlots, setDockSlots] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 5) {
          return parsed;
        }
      } catch {
        /* ignore */
      }
    }
    return slots;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dockSlots));
  }, [dockSlots]);

  const [overIndex, setOverIndex] = useState(null);

  const handleDrop = (index, e) => {
    e.preventDefault();
    setOverIndex(null);
    const appId = e.dataTransfer.getData('text/plain');
    if (!appId) return;
    const updated = [...dockSlots];
    updated[index] = appId;
    setDockSlots(updated);
    if (onDropApp) onDropApp(index, appId);
  };

  const handleDragOver = (index, e) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const handleDragLeave = () => {
    setOverIndex(null);
  };

  const removeApp = (index) => {
    const updated = [...dockSlots];
    updated[index] = null;
    setDockSlots(updated);
    if (onRemoveApp) onRemoveApp(index);
  };

  return (
    <div className="flex justify-around items-center p-2 border-t border-gray-700 bg-gray-900/60">
      {dockSlots.map((appId, i) => {
        const def = appRegistry[appId];
        const Icon = def ? Icons[def.icon] : null;
        return (
          <div
            key={i}
            onDrop={(e) => handleDrop(i, e)}
            onDragOver={(e) => handleDragOver(i, e)}
            onDragLeave={handleDragLeave}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-md border',
              overIndex === i ? 'border-green-400 bg-gray-700/50' : 'border-gray-700 bg-gray-800'
            )}
            data-testid={`dock-slot-${i}`}
          >
            {Icon && (
              <button
                type="button"
                onClick={() => removeApp(i)}
                className="w-full h-full flex items-center justify-center"
              >
                <Icon className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

DockBar.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.string),
  onDropApp: PropTypes.func,
  onRemoveApp: PropTypes.func,
};

export default DockBar;
