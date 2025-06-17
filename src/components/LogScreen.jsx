import React, { useState } from 'react';

/**
 * Viewer for intercepted signal logs.
 */
const LogScreen = () => {
  const [logs] = useState([
    { id: 1, text: 'Encrypted ping from sector 7' },
    { id: 2, text: 'Old broadcast decoded: keep moving' },
    { id: 3, text: 'Distress call triangulated near canyon' },
  ]);

  return (
    <div className="p-4 space-y-1 text-green-400" data-testid="log-screen">
      {logs.map((l) => (
        <div key={l.id}>- {l.text}</div>
      ))}
    </div>
  );
};

export default LogScreen;
