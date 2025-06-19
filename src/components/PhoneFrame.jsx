import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Battery, Wifi, Shield, Menu, Cpu, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { getUsage } from '../lib/resourceSystem';

const PhoneFrame = ({
  children,
  statusBarColor = 'bg-gray-900',
  batteryLevel = 100,
  networkStrength = 4,
  threatLevel = 0,
  gameMode = false,
  level = 1,
  totalLevels = 1,
  onMenu,
  onSystem,
}) => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [usage, setUsage] = useState(getUsage());
  const [fullscreen, setFullscreen] = useState(false);
  const progress = Math.min(100, ((level - 1) / totalLevels) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setUsage(getUsage()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fullscreen) {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullscreen]);

  return (
    <div
      data-testid="phone-frame"
      className="relative w-full h-screen border overflow-hidden bg-black text-green-400 flex flex-col font-mono"
    >
      {!gameMode && !fullscreen && (
        <div className={cn('flex items-center justify-between text-xs px-2 py-1', statusBarColor)}>
          <span>{time}</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Battery className="w-4 h-4" />
              <span>{batteryLevel}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wifi className="w-4 h-4" />
              <span className={networkStrength === 0 ? 'text-red-500' : ''}>{networkStrength}</span>
            </div>
            <div id="threat-indicator" className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>{threatLevel}</span>
            </div>
          </div>
        </div>
      )}
      {gameMode && (
        <div
          className="flex items-center justify-between text-xs px-2 py-1 bg-gray-900 border-b border-green-500/40"
          data-testid="game-status-bar"
          id="status-bar"
          data-tutorial="status-bar"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="whitespace-nowrap">LV {level}/{totalLevels}</span>
              <div className="w-20 h-2 bg-gray-700 rounded">
                <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>{threatLevel}</span>
            </div>
            <div className="flex space-x-2">
              <span className="flex items-center space-x-1"><Cpu className="w-3 h-3" /> <span>{usage.cpu}%</span></span>
              <span>RAM {usage.ram}%</span>
              <span>BW {usage.bandwidth}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setFullscreen((f) => !f)}
              className="p-1 hover:bg-green-900/40 rounded"
              data-testid="fullscreen-toggle"
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onMenu}
              title="Open menu"
              className="p-1 hover:bg-green-900/40 rounded"
              data-testid="menu-button"
            >
              <Menu className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onSystem}
              className="px-2 py-1 border border-green-500 rounded text-xs hover:bg-green-900/40"
              data-testid="system-button"
            >
              System
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto">{children}</div>
      {!gameMode && !fullscreen && (
        <div className="flex justify-around items-center p-2 border-t border-gray-700 bg-gray-900/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-800 rounded-md" />
          ))}
        </div>
      )}
    </div>
  );
};

PhoneFrame.propTypes = {
  children: PropTypes.node,
  statusBarColor: PropTypes.string,
  batteryLevel: PropTypes.number,
  networkStrength: PropTypes.number,
  threatLevel: PropTypes.number,
  gameMode: PropTypes.bool,
  level: PropTypes.number,
  totalLevels: PropTypes.number,
  onMenu: PropTypes.func,
  onSystem: PropTypes.func,
};

export default PhoneFrame;
