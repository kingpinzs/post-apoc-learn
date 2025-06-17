import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PORTS = [
  { port: 22, service: 'SSH' },
  { port: 80, service: 'HTTP' },
  { port: 443, service: 'HTTPS' },
  { port: 3389, service: 'RDP' },
];

const STATUS_COLORS = {
  open: 'text-red-400',
  closed: 'text-green-400',
  filtered: 'text-yellow-400',
};

const randomStatus = () => {
  const states = ['open', 'closed', 'filtered'];
  return states[Math.floor(Math.random() * states.length)];
};

const PortScanner = ({ initialTarget = '' }) => {
  const [target, setTarget] = useState(initialTarget);
  const [selected, setSelected] = useState(() => {
    const sel = {};
    PORTS.forEach((p) => {
      sel[p.port] = true;
    });
    return sel;
  });
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(false);

  const togglePort = (port) => {
    setSelected((prev) => ({ ...prev, [port]: !prev[port] }));
  };

  const startScan = () => {
    const toScan = PORTS.filter((p) => selected[p.port]);
    if (toScan.length === 0) return;
    setScanning(true);
    setResults([]);
    setProgress(0);
    toScan.forEach((p, i) => {
      setTimeout(() => {
        setResults((r) => [...r, { ...p, status: randomStatus() }]);
        setProgress(Math.round(((i + 1) / toScan.length) * 100));
        if (i === toScan.length - 1) setScanning(false);
      }, 500 * (i + 1));
    });
  };

  const exportResults = () => {
    const header = 'Port,Service,Status\n';
    const rows = results
      .map((r) => `${r.port},${r.service},${r.status}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan_${target || 'results'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4" data-testid="port-scanner">
      <div className="space-y-2">
        <label className="text-green-400 font-mono text-sm">
          Target IP
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-transparent border border-green-500/30 rounded p-1 mt-1"
          />
        </label>
        <div className="space-y-1">
          {PORTS.map((p) => (
            <label key={p.port} className="text-green-400 font-mono text-sm block">
              <input
                type="checkbox"
                checked={!!selected[p.port]}
                onChange={() => togglePort(p.port)}
                className="mr-1"
              />
              {p.port} ({p.service})
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={startScan}
        disabled={scanning}
        className="border border-green-500 text-green-400 rounded px-3 py-1"
      >
        {scanning ? 'Scanning...' : 'Scan'}
      </button>
      {scanning && (
        <div className="w-full bg-gray-700 h-2">
          <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-2">
          <table className="w-full text-left text-green-400 font-mono text-sm">
            <thead>
              <tr>
                <th className="border-b border-green-500/30">Port</th>
                <th className="border-b border-green-500/30">Service</th>
                <th className="border-b border-green-500/30">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.port} data-testid="scan-result-row">
                  <td className="py-1">{r.port}</td>
                  <td>{r.service}</td>
                  <td className={STATUS_COLORS[r.status]}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={exportResults}
            className="border border-green-500 text-green-400 rounded px-3 py-1"
          >
            Export Results
          </button>
        </div>
      )}
    </div>
  );
};

PortScanner.propTypes = {
  initialTarget: PropTypes.string,
};

export default PortScanner;
