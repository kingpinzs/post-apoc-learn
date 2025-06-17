import React, { useState } from 'react';

/**
 * Environmental scanner displaying nearby threats and hidden items.
 */
const ScannerScreen = () => {
  const [results, setResults] = useState([]);
  const [scanning, setScanning] = useState(false);

  const scan = () => {
    setScanning(true);
    setResults([]);
    const sample = [
      'Low radiation levels',
      'Hostile signature detected',
      'Hidden access point found',
      'Signal strength weak',
    ];
    sample.forEach((r, i) => {
      setTimeout(() => {
        setResults((res) => [...res, r]);
        if (i === sample.length - 1) setScanning(false);
      }, 800 * (i + 1));
    });
  };

  return (
    <div className="p-4 space-y-2" data-testid="scanner-screen">
      <button
        onClick={scan}
        disabled={scanning}
        className="border border-green-500 text-green-400 rounded px-3 py-1"
      >
        {scanning ? 'Scanning...' : 'Scan Environment'}
      </button>
      <ul className="text-green-400 space-y-1">
        {results.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScannerScreen;
