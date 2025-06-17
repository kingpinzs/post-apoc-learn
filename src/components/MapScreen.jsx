import React from 'react';

/**
 * Displays a simple wasteland map with placeholder points of interest.
 */
const MapScreen = () => {
  const locations = [
    { id: 'player', label: 'You', x: 40, y: 70, color: 'bg-blue-500' },
    { id: 'safe', label: 'Safe House', x: 20, y: 20, color: 'bg-green-500' },
    { id: 'cache', label: 'Supply Cache', x: 70, y: 35, color: 'bg-yellow-500' },
    { id: 'rad', label: 'Radiation Zone', x: 55, y: 55, color: 'bg-red-500' },
  ];

  return (
    <div className="p-4" data-testid="map-screen">
      <div className="relative w-full h-64 border border-green-500 rounded">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className={`absolute w-3 h-3 rounded-full ${loc.color}`}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            title={loc.label}
          />
        ))}
      </div>
      <ul className="mt-2 text-green-400 space-y-1">
        {locations.map((l) => (
          <li key={l.id}>{l.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default MapScreen;
