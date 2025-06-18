import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Radar, Server, Shield } from 'lucide-react';
import NetworkScanner from './NetworkScanner';
import PortScanner from './PortScanner';
import FirewallApp from './FirewallApp';
import TerminalScreen from './TerminalScreen';

const APPS = {
  terminal: { icon: Terminal, label: 'Terminal', Component: TerminalScreen },
  networkScanner: { icon: Radar, label: 'Net Scan', Component: NetworkScanner },
  portScanner: { icon: Server, label: 'Port Scan', Component: PortScanner },
  firewall: { icon: Shield, label: 'Firewall', Component: FirewallApp },
};

const GameMenu = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [appProps, setAppProps] = useState({});

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
      switch (e.key.toLowerCase()) {
        case 'm':
          toggle();
          break;
        case 't':
          launchApp('terminal');
          break;
        case 'n':
          launchApp('networkScanner');
          break;
        case 'p':
          launchApp('portScanner');
          break;
        case 'f':
          launchApp('firewall');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active]);

  const ActiveComp = active ? APPS[active]?.Component : null;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="fixed top-2 right-2 z-40 p-1 bg-gray-800 text-green-400 rounded"
        data-testid="menu-toggle"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            <button
              type="button"
              onClick={closeApp}
              className="absolute top-2 right-2"
              data-testid="minimize-button"
            >
              <X className="w-4 h-4" />
            </button>
            <ActiveComp {...appProps} onLaunchApp={launchApp} />
          </div>
        </div>
      )}
    </>
  );
};

export default GameMenu;
