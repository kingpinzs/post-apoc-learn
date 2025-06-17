import React, { useState } from 'react';

/**
 * Drone control interface for basic reconnaissance.
 * Players can launch a drone and receive random scan results.
 */
const DroneScreen = () => {
  const [log, setLog] = useState([]);
  const [active, setActive] = useState(false);

  const launch = () => {
    setActive(true);
    setLog([]);
    const messages = [
      'Scanning sector...',
      'No hostiles detected',
      'Cache spotted',
      'Radiation spike detected',
    ];
    messages.forEach((m, i) => {
      setTimeout(() => {
        setLog((l) => [...l, m]);
        if (i === messages.length - 1) setActive(false);
      }, 1000 * (i + 1));
    });
  };

  return (
    <div className="p-4 space-y-2" data-testid="drone-screen">
      <button
        onClick={launch}
        disabled={active}
        className="border border-green-500 text-green-400 rounded px-3 py-1"
      >
        {active ? 'Deploying...' : 'Launch Drone'}
      </button>
      <div className="text-green-400 space-y-1">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
};

export default DroneScreen;
