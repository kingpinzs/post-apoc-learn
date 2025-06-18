import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import NetworkScanner from './NetworkScanner';
import PortScanner from './PortScanner';
import FirewallApp from './FirewallApp';
import TerminalScreen from './TerminalScreen';

/**
 * Context providing API to request in-game apps.
 */
const AppIntegrationContext = createContext(null);

export const useAppIntegration = () => useContext(AppIntegrationContext);

// Map of supported apps to components.
const APP_COMPONENTS = {
  networkScanner: NetworkScanner,
  portScanner: PortScanner,
  firewall: FirewallApp,
  terminal: TerminalScreen,
};

const overlayClasses =
  'fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity animate-in fade-in';

/**
 * AppIntegration provider handles app request queue and overlay rendering.
 */
const AppIntegration = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [active, setActive] = useState(null);

  // Request an app with optional props and callbacks.
  const requestApp = useCallback((id, props = {}, callbacks = {}) => {
    setQueue((q) => [...q, { id, props, callbacks }]);
  }, []);

  // Show next app when none active.
  useEffect(() => {
    if (!active && queue.length > 0) {
      const [next, ...rest] = queue;
      setActive(next);
      setQueue(rest);
    }
  }, [queue, active]);

  const handleClose = (result = { success: true }) => {
    if (result.success) {
      active?.callbacks?.onSuccess?.(result.data);
    } else {
      active?.callbacks?.onFail?.(result.error);
    }
    setActive(null);
  };

  const ActiveComp = active ? APP_COMPONENTS[active.id] : null;

  return (
    <AppIntegrationContext.Provider value={{ requestApp }}>
      {children}
      {ActiveComp && (
        <div className={overlayClasses} data-testid="integration-overlay">
          <div className="relative bg-gray-900 p-4 rounded shadow-lg w-96 max-w-full">
            <button
              type="button"
              onClick={() => handleClose()}
              className="absolute top-2 right-2 text-green-400"
              data-testid="integration-close"
            >
              ×
            </button>
            <ActiveComp {...active.props} onComplete={handleClose} />
          </div>
        </div>
      )}
    </AppIntegrationContext.Provider>
  );
};

AppIntegration.propTypes = {
  children: PropTypes.node,
};

export default AppIntegration;
