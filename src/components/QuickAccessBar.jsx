import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Heart, AlertCircle } from 'lucide-react';
import { getUsage } from '../lib/resourceSystem';

const toolList = ['firewall', 'antivirus', 'patch'];

const QuickAccessBar = ({
  health = 100,
  credits = 0,
  activeAttack = null,
  inventory = {},
  cooldowns = {},
  selectedTool = null,
  onSelectTool,
  onDefend,
  onOpenMenu,
}) => {
  const [usage, setUsage] = useState(getUsage());

  useEffect(() => {
    const t = setInterval(() => setUsage(getUsage()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const tool = e.dataTransfer.getData('text/plain');
    if (tool) onDefend(tool);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-gray-900/80 border-t border-green-500/30 text-green-400 text-xs">
      <div className="flex items-center justify-between px-2 py-1 space-x-2">
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4" />
          <span>{health}%</span>
        </div>
        <div
          className={`flex-1 mx-2 px-2 py-1 rounded text-center ${activeAttack ? 'bg-red-900/40 text-red-400 animate-pulse' : 'bg-gray-800 text-green-400'}`}
          onClick={() => selectedTool && onDefend(selectedTool)}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {activeAttack ? activeAttack.message : 'No Threats'}
        </div>
        <div className="flex items-center space-x-1">
          <span>CR {credits}</span>
        </div>
        <button type="button" onClick={onOpenMenu} className="p-1">
          <Menu className="w-4 h-4" />
        </button>
      </div>
      <div className="flex justify-center space-x-2 px-2 pb-1">
        {toolList.map((tool) =>
          inventory[tool] ? (
            <button
              key={tool}
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', tool)}
              onClick={() => onSelectTool(tool)}
              className={`px-2 py-1 border border-green-500 rounded text-white text-xs ${selectedTool === tool ? 'bg-green-700' : 'bg-black'} ${cooldowns[tool] ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={cooldowns[tool] > 0}
            >
              {tool.toUpperCase()} {cooldowns[tool] ? `(${cooldowns[tool]})` : ''}
            </button>
          ) : null
        )}
      </div>
      <div className="flex justify-center text-[10px] space-x-2 pb-1">
        <span>CPU {usage.cpu}%</span>
        <span>RAM {usage.ram}%</span>
        <span>BW {usage.bandwidth}%</span>
      </div>
    </div>
  );
};

QuickAccessBar.propTypes = {
  health: PropTypes.number,
  credits: PropTypes.number,
  activeAttack: PropTypes.object,
  inventory: PropTypes.object,
  cooldowns: PropTypes.object,
  selectedTool: PropTypes.string,
  onSelectTool: PropTypes.func,
  onDefend: PropTypes.func,
  onOpenMenu: PropTypes.func,
};

export default QuickAccessBar;
