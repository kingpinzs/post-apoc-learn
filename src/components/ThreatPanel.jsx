import React from 'react';
import PropTypes from 'prop-types';
import { AlertOctagon, Bug, ServerCrash } from 'lucide-react';
import { cn } from '../lib/utils';

const icons = {
  ddos: AlertOctagon,
  malware: Bug,
  exploit: ServerCrash,
};

const ThreatPanel = ({ threat, timeLeft = 0, combo = 0 }) => {
  if (!threat) return null;
  const Icon = icons[threat.id] || AlertOctagon;
  return (
    <div
      className="fixed top-2 left-1/2 -translate-x-1/2 z-30 bg-black border border-red-500 text-red-400 px-4 py-2 rounded shadow animate-pulse"
      data-testid="threat-panel"
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span className="font-mono text-xs">{threat.message}</span>
        <span className="font-mono text-xs">{timeLeft}s</span>
      </div>
      <div className="text-xs text-green-400 font-mono mt-1">
        Target: {threat.target} | Use {threat.tool.toUpperCase()}
      </div>
      {threat.pattern && (
        <div className="text-xs text-yellow-400 font-mono mt-1">
          Pattern: {threat.pattern.join(' ')}
        </div>
      )}
      {combo > 1 && (
        <div className="text-green-500 text-xs font-mono mt-1">Combo x{combo}</div>
      )}
    </div>
  );
};

ThreatPanel.propTypes = {
  threat: PropTypes.object,
  timeLeft: PropTypes.number,
  combo: PropTypes.number,
};

export default ThreatPanel;
