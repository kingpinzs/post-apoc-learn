import React, { useState, useRef, useEffect } from 'react';
import PacketFlow from './PacketFlow';
import { allocateResources, freeResources } from '../lib/resourceSystem';

const PROTOCOLS = ['HTTP', 'FTP', 'SSH', 'MALWARE'];

function randomIp() {
  return `10.0.${Math.floor(Math.random() * 256)}.${Math.floor(
    Math.random() * 256
  )}`;
}

function randomProtocol() {
  return PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
}

const PacketAnalyzer = () => {
  const [capturing, setCapturing] = useState(false);
  const [packets, setPackets] = useState([]);
  const [filter, setFilter] = useState({ protocol: '', src: '', dest: '' });
  const timerRef = useRef(null);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    freeResources('packetAnalyzer');
  }, []);

  const startCapture = () => {
    allocateResources('packetAnalyzer', { cpu: 5, bandwidth: 10 });
    setCapturing(true);
    timerRef.current = setInterval(() => {
      setPackets((p) => [
        ...p.slice(-19),
        {
          id: Date.now() + Math.random(),
          src: randomIp(),
          dest: randomIp(),
          protocol: randomProtocol(),
        },
      ]);
    }, 800);
  };

  const stopCapture = () => {
    clearInterval(timerRef.current);
    freeResources('packetAnalyzer');
    setCapturing(false);
  };

  const filtered = packets.filter(
    (p) =>
      (!filter.protocol || p.protocol === filter.protocol) &&
      (!filter.src || p.src.includes(filter.src)) &&
      (!filter.dest || p.dest.includes(filter.dest))
  );

  return (
    <div className="p-4 space-y-4" data-testid="packet-analyzer">
      <button
        onClick={capturing ? stopCapture : startCapture}
        className="border border-green-500 text-green-400 rounded px-3 py-1"
      >
        {capturing ? 'Stop Capture' : 'Start Capture'}
      </button>
      <div className="flex space-x-2 text-green-400 font-mono text-sm">
        <label>
          Protocol
          <select
            value={filter.protocol}
            onChange={(e) =>
              setFilter((f) => ({ ...f, protocol: e.target.value }))
            }
            className="ml-1 bg-transparent border border-green-500/30 rounded"
          >
            <option value="">Any</option>
            {PROTOCOLS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label>
          Src
          <input
            value={filter.src}
            onChange={(e) => setFilter((f) => ({ ...f, src: e.target.value }))}
            className="ml-1 bg-transparent border border-green-500/30 rounded w-20"
          />
        </label>
        <label>
          Dest
          <input
            value={filter.dest}
            onChange={(e) => setFilter((f) => ({ ...f, dest: e.target.value }))}
            className="ml-1 bg-transparent border border-green-500/30 rounded w-20"
          />
        </label>
      </div>
      <div className="relative h-32 border border-green-500/30 overflow-hidden" data-testid="flow-area">
        {filtered.map((p) => (
          <PacketFlow
            key={p.id}
            source={{ x: 20, y: 20 }}
            destination={{ x: 180, y: 20 }}
            packetType={p.protocol.toLowerCase()}
            count={1}
          />
        ))}
      </div>
      <table className="w-full text-green-400 font-mono text-xs" data-testid="packet-table">
        <thead>
          <tr>
            <th className="border-b border-green-500/30">Source</th>
            <th className="border-b border-green-500/30">Destination</th>
            <th className="border-b border-green-500/30">Protocol</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} title="Packets contain headers with src, dest and payload information">
              <td>{p.src}</td>
              <td>{p.dest}</td>
              <td>{p.protocol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PacketAnalyzer;
