import React from 'react';

/**
 * Displays world statistics such as radiation and threat levels.
 */
const StatsScreen = () => {
  const stats = {
    radiation: 'Moderate',
    threats: 'Low',
    progress: '12%',
  };

  return (
    <div className="p-4 space-y-2 text-green-400" data-testid="stats-screen">
      <div>Radiation Levels: {stats.radiation}</div>
      <div>Threat Level: {stats.threats}</div>
      <div>Progress: {stats.progress}</div>
    </div>
  );
};

export default StatsScreen;
