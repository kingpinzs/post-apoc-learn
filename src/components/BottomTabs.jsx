import React from 'react';
import PropTypes from 'prop-types';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';

const TAB_DEFS = {
  game: { label: 'Game', icon: Icons.Gamepad },
  tools: { label: 'Tools', icon: Icons.Wrench },
  learn: { label: 'Learn', icon: Icons.BookOpen },
  stats: { label: 'Stats', icon: Icons.BarChart2 },
  menu: { label: 'Menu', icon: Icons.Menu },
};

const BottomTabs = ({ active, onChange }) => (
  <div className="fixed bottom-0 inset-x-0 z-30 bg-gray-900/80 border-t border-green-500/30 flex justify-around">
    {Object.entries(TAB_DEFS).map(([id, { label, icon: Icon }]) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={cn('flex-1 flex flex-col items-center p-2 text-green-400', active === id && 'bg-gray-800')}
        data-testid={`tab-${id}`}
        data-tutorial={`${id}-tab`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-xs mt-1">{label}</span>
      </button>
    ))}
  </div>
);

BottomTabs.propTypes = {
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BottomTabs;
