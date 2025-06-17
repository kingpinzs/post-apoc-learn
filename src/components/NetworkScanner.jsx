import React, { useState, useEffect, useRef } from 'react';
import {
  allocateResources,
  freeResources,
} from '../lib/resourceSystem';

const DEVICE_TYPES = ['Camera', 'Terminal', 'Laptop', 'Drone', 'Sensor'];
const VULN_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

function randomIp() {
  return `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(
    Math.random() * 256
  )}`;
}

function generateDevices() {
  const count = 3 + Math.floor(Math.random() * 3); // 3-5
  const devices = Array.from({ length: count }).map((_, i) => ({
    id: i,
    ip: randomIp(),
    type: DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)],
    vulnerability: VULN_LEVELS[Math.floor(Math.random() * VULN_LEVELS.length)],
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
  }));
  const badIndex = Math.floor(Math.random() * count);
  devices[badIndex].isBad = true;
  return devices;
}

const NetworkScanner = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
    freeResources('scanner');
  }, []);

  const startScan = () => {
    allocateResources('scanner', { cpu: 10, ram: 5, bandwidth: 15 });
    setScanning(true);
    setDevices([]);
    setSelected(null);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((p) => Math.min(100, p + 5));
    }, 150);
    timerRef.current = setTimeout(() => {
      setDevices(generateDevices());
      setScanning(false);
      setProgress(100);
      clearInterval(intervalRef.current);
      freeResources('scanner');
    }, 3000);
  };

  return (
    <div className="p-4 space-y-4" data-testid="network-scanner">
      <div className="relative w-64 h-64 mx-auto">
        <div className="absolute inset-0 rounded-full border border-green-500 overflow-hidden">
          <div className="radar-lines" />
        </div>
        <div className="radar-sweep" />
        {devices.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`absolute w-2 h-2 rounded-full ${
              d.isBad ? 'bg-red-500 animate-pulse' : 'bg-green-500'
            }`}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            onClick={() => setSelected(d)}
            data-testid={d.isBad ? 'bad-device' : 'device'}
          />
        ))}
      </div>
      {scanning && (
        <div className="w-full bg-gray-700 h-2" data-testid="scan-progress">
          <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
        </div>
      )}
      <button
        onClick={startScan}
        className="border border-green-500 text-green-400 rounded px-3 py-1"
        disabled={scanning}
      >
        {scanning ? 'Scanning...' : 'Scan'}
      </button>
      {selected && (
        <div className="text-green-400 border border-green-500 rounded p-2">
          <div>IP: {selected.ip}</div>
          <div>Type: {selected.type}</div>
          <div>Vulnerability: {selected.vulnerability}</div>
          {selected.isBad && <div className="text-red-400">TARGET DEVICE</div>}
        </div>
      )}
    </div>
  );
};

export default NetworkScanner;
