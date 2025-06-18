import React, { useState } from 'react';
import VirtualList from './VirtualList';

/**
 * Viewer for intercepted signal logs.
 */
const LogScreen = () => {
  const [logs] = useState(() =>
    Array.from({ length: 100 }).map((_, i) => ({
      id: i + 1,
      text: `Log entry ${i + 1}`,
    }))
  );

  return (
    <div className="p-4 text-green-400" data-testid="log-screen">
      <VirtualList
        items={logs}
        height={200}
        rowRenderer={(l) => (
          <div key={l.id} data-testid="log-entry">
            {l.text}
          </div>
        )}
      />
    </div>
  );
};

export default LogScreen;
