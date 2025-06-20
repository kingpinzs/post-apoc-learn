import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as Icons from 'lucide-react';
import { appRegistry } from '../lib/appRegistry';
import { cn } from '../lib/utils';
import AppIcon from './AppIcon';
import DockBar from './DockBar';
import { getUsage } from '../lib/resourceSystem';
import usePhoneState from '../hooks/usePhoneState';
import CommunicatorScreen from './CommunicatorScreen';
import MapScreen from './MapScreen';
import DroneScreen from './DroneScreen';
import ScannerScreen from './ScannerScreen';
import TerminalScreen from './TerminalScreen';
import DecryptorScreen from './DecryptorScreen';
import { ScriptBuilderScreen } from './scriptbuilder';
import HandbookScreen from './HandbookScreen';
import StatsScreen from './StatsScreen';
import LogScreen from './LogScreen';
import TrophyRoomScreen from './TrophyRoomScreen';
import NetworkScanner from './NetworkScanner';
import PortScanner from './PortScanner';
import FirewallApp from './FirewallApp';
import SecurityTrainingApp from './SecurityTrainingApp';
import SettingsScreen from './SettingsScreen';
import LeaderboardScreen from './LeaderboardScreen';
import DDoSSimulator from './DDoSSimulator';
import PacketAnalyzer from './PacketAnalyzer';
import ChemicalDatabase from './ChemicalDatabase';
import RadiationMonitor from './RadiationMonitor';
import EmergencyKeypad from './EmergencyKeypad';

const GRID_KEY = 'homeGridSlots';

function loadDefaultGrid() {
  const ids = Object.keys(appRegistry).slice(0, 20);
  return ids.concat(Array(20 - ids.length).fill(null));
}

const HomeScreen = ({ notifications = [], onLaunchApp }) => {
  const [phoneState] = usePhoneState();
  const [activeApp, setActiveApp] = useState(null);
  const [lockMessage, setLockMessage] = useState('');

  useEffect(() => {
    const handler = () => setActiveApp(null);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const [gridSlots, setGridSlots] = useState(() => {
    const saved = localStorage.getItem(GRID_KEY);
    let slots;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 20) {
          slots = parsed;
        }
      } catch {
        /* ignore */
      }
    }
    if (!slots) {
      slots = loadDefaultGrid();
    }
    if (!slots.includes('scanner')) {
      const idx = slots.indexOf(null);
      if (idx !== -1) slots[idx] = 'scanner';
      else slots[0] = 'scanner';
    }
    return slots;
  });

  useEffect(() => {
    localStorage.setItem(GRID_KEY, JSON.stringify(gridSlots));
  }, [gridSlots]);

  const [overIndex, setOverIndex] = useState(null);
  const [showGrid, setShowGrid] = useState(true);

  const handleDrop = (index) => (e) => {
    e.preventDefault();
    setOverIndex(null);
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    setGridSlots((prev) => {
      const from = prev.indexOf(id);
      if (from === -1) return prev;
      const updated = [...prev];
      const tmp = updated[index];
      updated[index] = id;
      updated[from] = tmp;
      return updated;
    });
  };

  const handleDragOver = (index) => (e) => {
    e.preventDefault();
    setOverIndex(index);
  };
  const handleDragLeave = () => setOverIndex(null);

  const longPress = useRef(null);
  const handlePointerDown = (index) => () => {
    if (!gridSlots[index]) return;
    longPress.current = setTimeout(() => {
      if (window.confirm('Uninstall app?')) {
        setGridSlots((prev) => {
          const updated = [...prev];
          updated[index] = null;
          return updated;
        });
      }
    }, 600);
  };
  const cancelLongPress = () => clearTimeout(longPress.current);

  const [search, setSearch] = useState('');

  const [usage, setUsage] = useState(getUsage());
  useEffect(() => {
    const t = setInterval(() => setUsage(getUsage()), 1000);
    return () => clearInterval(t);
  }, []);

  const screenMap = {
    CommunicatorScreen,
    MapScreen,
    DroneScreen,
    ScannerScreen,
    TerminalScreen,
    DecryptorScreen,
    ScriptBuilderScreen,
    HandbookScreen,
    StatsScreen,
    LogScreen,
    TrophyRoomScreen,
    LeaderboardScreen,
    NetworkScanner,
    PortScanner,
    FirewallApp,
    SecurityTrainingApp,
    SettingsScreen,
    DDoSSimulator,
    PacketAnalyzer,
    ChemicalDatabase,
    RadiationMonitor,
    EmergencyKeypad,
  };

  const launchApp = (appId, props = {}) => {
    const def = appRegistry[appId];
    if (!def) return;
    const locked = def.isLocked && !phoneState.unlockedApps.includes(appId);
    if (locked) {
      const req = def.unlockRequirements?.join(', ');
      setLockMessage(req ? `Requires: ${req}` : 'App locked');
      return;
    }
    setLockMessage('');
    if (onLaunchApp) {
      onLaunchApp(appId, props);
    } else {
      window.history.pushState({ app: appId }, '');
      setActiveApp(appId);
    }
  };

  const closeApp = () => {
    if (activeApp) {
      window.history.back();
      setActiveApp(null);
    }
  };

  if (activeApp) {
    const def = appRegistry[activeApp];
    const Screen = screenMap[def.launchScreen];
    return (
      <div className="flex flex-col h-full" data-testid="active-app">
        <div className="flex items-center text-xs text-green-400 space-x-1 m-2" data-testid="breadcrumbs">
          <span>Tools</span>
          <span>&gt;</span>
          <span>{def.name}</span>
        </div>
        <button
          type="button"
          onClick={closeApp}
          className="m-2 px-2 py-1 border border-green-500 text-green-400 rounded"
          data-testid="back-button"
        >
          Back
        </button>
        {Screen && <Screen />}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-2 space-y-2" data-testid="home-screen">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        className="w-full px-2 py-1 rounded bg-gray-800 text-green-400"
        id="search-input" data-testid="search-bar"
      />
      <div
        className="text-xs text-green-400 flex justify-around border border-gray-700 rounded p-1"
        id="status-widgets"
        data-testid="status-widgets"
        data-tutorial="status-bar"
      >
        <div>CPU {usage.cpu}%</div>
        <div>RAM {usage.ram}%</div>
        <div>BW {usage.bandwidth}%</div>
      </div>
      <button
        type="button"
        onClick={() => setShowGrid((s) => !s)}
        className="self-end border border-green-500 text-green-400 rounded px-2 py-1 text-xs"
        data-testid="toggle-apps"
      >
        {showGrid ? 'Hide Apps' : 'Show Apps'}
      </button>
      {showGrid && (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-4 gap-2" id="app-grid" data-testid="app-grid">
            {gridSlots.map((appId, i) => {
              const def = appRegistry[appId];
              const Icon = def ? Icons[def.icon] : null;
              const hidden = search && def && !def.name.toLowerCase().includes(search.toLowerCase());
              return (
                <div
                  key={i}
                  onDrop={handleDrop(i)}
                  onDragOver={handleDragOver(i)}
                  onDragLeave={handleDragLeave}
                  onPointerDown={handlePointerDown(i)}
                  onPointerUp={cancelLongPress}
                  onPointerMove={cancelLongPress}
                  className={cn(
                    'w-full h-20 flex items-center justify-center rounded border',
                    overIndex === i ? 'border-green-400 bg-gray-700/50' : 'border-gray-700 bg-gray-800'
                  )}
                  data-testid={`grid-slot-${i}`}
                >
                  {!hidden && def && Icon && (
                    <AppIcon
                      appId={def.id}
                      name={def.name}
                      icon={<Icon className="w-6 h-6" />}
                      isDraggable
                      isLocked={def.isLocked && !phoneState.unlockedApps.includes(def.id)}
                      onClick={() => launchApp(def.id)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {notifications.length > 0 && (
        <div className="text-xs text-green-400 space-y-1" data-testid="notifications">
          {notifications.map((n) => (
            <div key={n.id}>{n.message}</div>
          ))}
        </div>
      )}
      {lockMessage && (
        <div className="text-xs text-red-400" data-testid="lock-message">
          {lockMessage}
        </div>
      )}
      <DockBar />
    </div>
  );
};

HomeScreen.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
    })
  ),
  onLaunchApp: PropTypes.func,
};

export default HomeScreen;
