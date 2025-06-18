import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { allocateResources, freeResources } from '../lib/resourceSystem';

const DEFAULT_PORTS = [
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
  const [ports, setPorts] = useState(DEFAULT_PORTS);
  const [customPort, setCustomPort] = useState('');
  const [selected, setSelected] = useState(() => {
    const sel = {};
    DEFAULT_PORTS.forEach((p) => {
      sel[p.port] = true;
    });
    return sel;
  });
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const timeouts = useRef([]);

  useEffect(
    () => () => {
      cancelScan();
    },
    []
  );

  const togglePort = (port) => {
    setSelected((prev) => ({ ...prev, [port]: !prev[port] }));
  };

  const addPort = () => {
    const num = parseInt(customPort, 10);
    if (Number.isNaN(num) || ports.some((p) => p.port === num)) return;
    setPorts((prev) => [...prev, { port: num, service: 'Custom' }]);
    setSelected((prev) => ({ ...prev, [num]: true }));
    setCustomPort('');
  };

  const startScan = () => {
    const toScan = ports.filter((p) => selected[p.port]);
    if (toScan.length === 0) return;
    allocateResources('portScanner', { cpu: 5, ram: 3, bandwidth: 8 });
    setScanning(true);
    setResults([]);
    setProgress(0);
    timeouts.current = toScan.map((p, i) =>
      setTimeout(() => {
        setResults((r) => [...r, { ...p, status: randomStatus() }]);
        setProgress(Math.round(((i + 1) / toScan.length) * 100));
        if (i === toScan.length - 1) {
          setScanning(false);
          freeResources('portScanner');
        }
      }, 500 * (i + 1))
    );
  };

  const cancelScan = () => {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];
    setScanning(false);
    setProgress(0);
    freeResources('portScanner');
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
          {ports.map((p) => (
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
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Add port"
            value={customPort}
            onChange={(e) => setCustomPort(e.target.value)}
            className="flex-grow bg-transparent border border-green-500/30 rounded p-1"
          />
          <button
            type="button"
            onClick={addPort}
            className="border border-green-500 text-green-400 rounded px-2"
          >
            Add
          </button>
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
        <button
          type="button"
          onClick={cancelScan}
          className="border border-red-500 text-red-400 rounded px-3 py-1"
        >
          Cancel
        </button>
      )}
      {scanning && (
        <div className="w-full bg-gray-700 h-2">
          <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-2">
          <table className="w-full text-left text-green-400 font-mono text-sm overflow-x-auto">
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
