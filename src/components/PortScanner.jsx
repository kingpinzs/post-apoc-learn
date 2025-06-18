import React, { useState, useEffect } from 'react';
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

const SPEED_MAP = {
  fast: 200,
  normal: 500,
  slow: 1000,
};

const PortScanner = ({ initialTarget = '' }) => {
  const [target, setTarget] = useState(initialTarget);
  const [ports, setPorts] = useState(DEFAULT_PORTS);
  const [selected, setSelected] = useState(() => {
    const sel = {};
    DEFAULT_PORTS.forEach((p) => {
      sel[p.port] = true;
    });
    return sel;
  });
  const [customInput, setCustomInput] = useState('');
  const [speed, setSpeed] = useState('normal');
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(false);

  useEffect(() => () => {
    freeResources('portScanner');
  }, []);

  const togglePort = (port) => {
    setSelected((prev) => ({ ...prev, [port]: !prev[port] }));
  };

  const addPorts = () => {
    const numbers = customInput
      .split(/[,\s]+/)
      .map((v) => parseInt(v, 10))
      .filter((n) => n > 0 && n <= 65535 && !Number.isNaN(n));
    if (numbers.length === 0) return;
    setPorts((prev) => {
      const existing = new Set(prev.map((p) => p.port));
      const newPorts = numbers.filter((n) => !existing.has(n)).map((n) => ({ port: n, service: 'Custom' }));
      const updated = [...prev, ...newPorts];
      return updated.sort((a, b) => a.port - b.port);
    });
    setSelected((prev) => {
      const sel = { ...prev };
      numbers.forEach((n) => {
        sel[n] = true;
      });
      return sel;
    });
    setCustomInput('');
  };

  const startScan = () => {
    const toScan = ports.filter((p) => selected[p.port]);
    if (toScan.length === 0) return;
    allocateResources('portScanner', { cpu: 5, ram: 2, bandwidth: 5 });
    setScanning(true);
    setResults([]);
    setProgress(0);
    const delay = SPEED_MAP[speed] || 500;
    toScan.forEach((p, i) => {
      setTimeout(() => {
        setResults((r) => [...r, { ...p, status: randomStatus() }]);
        setProgress(Math.round(((i + 1) / toScan.length) * 100));
        if (i === toScan.length - 1) {
          setScanning(false);
          freeResources('portScanner');
        }
      }, delay * (i + 1));
    });
  };

  const exportResults = () => {
    const header = 'Port,Service,Status\n';
    const rows = results.map((r) => `${r.port},${r.service},${r.status}`).join('\n');
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
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. 21,25,8080"
            className="flex-grow bg-transparent border border-green-500/30 rounded p-1 text-green-400 font-mono text-sm"
          />
          <button
            onClick={addPorts}
            className="border border-green-500 text-green-400 rounded px-3 py-1"
          >
            Add Ports
          </button>
        </div>
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
        <label className="text-green-400 font-mono text-sm block">
          Speed
          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="ml-2 bg-transparent border border-green-500/30 rounded p-1"
          >
            <option value="fast">Fast</option>
            <option value="normal">Normal</option>
            <option value="slow">Slow</option>
          </select>
        </label>
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
