import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import usePhoneState from '../hooks/usePhoneState';
import { appRegistry } from '../lib/appRegistry';
import NetworkScanner from './NetworkScanner';
import PortScanner from './PortScanner';
import FirewallApp from './FirewallApp';
import TerminalScreen from './TerminalScreen';
import TrophyRoomScreen from './TrophyRoomScreen';
import StatsScreen from './StatsScreen';
import SettingsScreen from './SettingsScreen';

const COMPONENTS = {
  NetworkScanner,
  PortScanner,
  FirewallApp,
  TerminalScreen,
  TrophyRoomScreen,
  StatsScreen,
  SettingsScreen,
};

const GameMenu = ({ onTogglePause, paused = false }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [appProps, setAppProps] = useState({});
  const [phoneState] = usePhoneState();

  const availableApps = Object.values(appRegistry).filter(
    (a) =>
      a.category === 'tools' && (!a.isLocked || phoneState.unlockedApps.includes(a.id))
  );
  const APPS = Object.fromEntries(
    availableApps.map((a) => [
      a.id,
      {
        icon: Icons[a.icon] || Icons.Box,
        label: a.name,
        Component: COMPONENTS[a.launchScreen],
      },
    ])
  );

  APPS.achievements = {
    icon: Icons.Award,
    label: 'Achievements',
    Component: TrophyRoomScreen,
  };
  APPS.stats = { icon: Icons.BarChart2, label: 'Stats', Component: StatsScreen };
  APPS.settings = {
    icon: Icons.Settings,
    label: 'Settings',
    Component: SettingsScreen,
  };

  const toggle = () => setOpen((o) => !o);

  const launchApp = (id, props = {}) => {
    setActive(id);
    setAppProps(props);
    setOpen(false);
  };

  const closeApp = () => {
    setActive(null);
    setAppProps({});
  };

  useEffect(() => {
    const handler = (e) => {
      if (active) {
        if (e.key === 'Escape') closeApp();
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 'escape') {
        toggle();
        return;
      }
      if (key === 'm') {
        toggle();
        return;
      }
      if (key === 'p') {
        onTogglePause?.();
        return;
      }
      if (key === 't') launchApp('terminal');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, onTogglePause]);

  const ActiveComp = active ? APPS[active]?.Component : null;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="fixed top-2 right-2 z-40 p-1 bg-gray-800 text-green-400 rounded"
        data-testid="menu-toggle"
      >
        {open ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div
          className="fixed top-10 right-2 z-40 bg-black/80 p-2 rounded grid grid-cols-2 gap-2"
          data-testid="game-menu"
        >
          {Object.entries(APPS).map(([id, { icon: Icon, label }]) => (
            <button
              key={id}
              type="button"
              onClick={() => launchApp(id)}
              className="flex flex-col items-center p-2 rounded hover:bg-gray-700"
              data-testid={`menu-item-${id}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      )}
      {ActiveComp && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          data-testid="app-overlay"
        >
          <div className="relative bg-gray-900 p-4 rounded w-96 max-w-full">
            <div className="text-xs mb-2 text-green-400 flex items-center space-x-1">
              <span>Game</span>
              <span>&gt;</span>
              <span>{APPS[active]?.label}</span>
            </div>
            <button
              type="button"
              onClick={closeApp}
              className="absolute top-2 right-2"
              data-testid="minimize-button"
            >
              <Icons.X className="w-4 h-4" />
            </button>
            <ActiveComp {...appProps} onLaunchApp={launchApp} />
          </div>
        </div>
      )}
    </>
  );
};

export default GameMenu;
