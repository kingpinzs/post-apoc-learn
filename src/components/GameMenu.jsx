import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
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

const GameMenu = ({ onTogglePause, paused = false, unlockedApps = [] }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [appProps, setAppProps] = useState({});

  const availableApps = Object.values(appRegistry).filter(
    (a) => a.category === 'tools'
  );
  const APPS = Object.fromEntries(
    availableApps.map((a) => [
      a.id,
      {
        icon: Icons[a.icon] || Icons.Box,
        label: a.name,
        Component: COMPONENTS[a.launchScreen],
        locked: a.isLocked && !unlockedApps.includes(a.id),
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

  useEffect(() => {
    let startX = null;
    let startY = null;
    let triggered = false;

    const getPoint = (e) => e.touches?.[0] || e;

    const handleStart = (e) => {
      if (active || open) return;
      const p = getPoint(e);
      if (!p || (e.pointerType && e.pointerType === 'mouse')) return;
      startX = p.clientX;
      startY = p.clientY;
      triggered = false;
    };

    const handleMove = (e) => {
      if (startX === null || startY === null || triggered) return;
      const p = getPoint(e);
      if (!p || (e.pointerType && e.pointerType === 'mouse')) return;
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;
      if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) {
        toggle();
        triggered = true;
        startX = null;
        startY = null;
      }
    };

    const handleEnd = () => {
      startX = null;
      startY = null;
      triggered = false;
    };

    const add = (type, fn, opts) => window.addEventListener(type, fn, opts);
    const remove = (type, fn) => window.removeEventListener(type, fn);

    add('touchstart', handleStart);
    add('touchmove', handleMove);
    add('touchend', handleEnd);

    if (window.PointerEvent) {
      add('pointerdown', handleStart);
      add('pointermove', handleMove);
      add('pointerup', handleEnd);
    }

    return () => {
      remove('touchstart', handleStart);
      remove('touchmove', handleMove);
      remove('touchend', handleEnd);
      if (window.PointerEvent) {
        remove('pointerdown', handleStart);
        remove('pointermove', handleMove);
        remove('pointerup', handleEnd);
      }
    };
  }, [active, open]);

  const ActiveComp = active ? APPS[active]?.Component : null;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        id="menu-toggle"
        className="fixed top-2 right-2 z-40 p-1 bg-gray-800 text-green-400 rounded"
        data-testid="menu-toggle"
      >
        {open ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center"
          data-testid="menu-overlay"
        >
          <div
            className="bg-gray-900 p-2 rounded grid grid-cols-2 gap-2"
            data-testid="game-menu"
          >
            {Object.entries(APPS).map(([id, { icon: Icon, label, locked }]) => (
              <button
                key={id}
                type="button"
                onClick={() => !locked && launchApp(id)}
                className={`flex flex-col items-center p-2 rounded hover:bg-gray-700 ${
                  locked ? 'opacity-40 cursor-not-allowed' : ''
                }`}
                id={`app-icon-${id}`}
                data-testid={`menu-item-${id}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{label}</span>
                {locked && (
                  <span className="text-[10px] text-yellow-400 mt-1">LOCKED</span>
                )}
              </button>
            ))}
          </div>
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
