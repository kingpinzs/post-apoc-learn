import React, { useState, useRef, useEffect } from 'react';
import PacketFlow from './PacketFlow';
import { allocateResources, freeResources } from '../lib/resourceSystem';

const TARGETS = [
  { id: 'alpha', label: 'Alpha Node', x: 180, y: 20 },
  { id: 'bravo', label: 'Bravo Node', x: 180, y: 60 },
  { id: 'charlie', label: 'Charlie Node', x: 180, y: 100 },
];

const SOURCE = { x: 10, y: 60 };

const DDoSSimulator = () => {
  const [target, setTarget] = useState(TARGETS[0].id);
  const [packetSize, setPacketSize] = useState(512);
  const [frequency, setFrequency] = useState(5);
  const [packets, setPackets] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    freeResources('ddos');
  }, []);

  const startAttack = () => {
    clearInterval(timerRef.current);
    allocateResources('ddos', { bandwidth: 20, cpu: 5 });
    timerRef.current = setInterval(() => {
      setPackets((p) => [
        ...p,
        { id: Date.now() + Math.random(), target },
      ]);
    }, Math.max(100, 1000 / frequency));
  };

  const stopAttack = () => {
    clearInterval(timerRef.current);
    freeResources('ddos');
    setPackets([]);
  };

  return (
    <div className="p-4 space-y-4" data-testid="ddos-simulator">
      <div className="space-y-2">
        <label className="text-green-400 font-mono text-sm block">
          Target
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="ml-2 bg-transparent border border-green-500/30 rounded p-1"
          >
            {TARGETS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-green-400 font-mono text-sm block">
          Packet Size
          <input
            type="number"
            value={packetSize}
            onChange={(e) => setPacketSize(parseInt(e.target.value, 10) || 0)}
            className="ml-2 w-20 bg-transparent border border-green-500/30 rounded p-1"
          />
          bytes
        </label>
        <label className="text-green-400 font-mono text-sm block">
          Frequency
          <input
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value, 10) || 0)}
            className="ml-2 w-20 bg-transparent border border-green-500/30 rounded p-1"
          />
          p/s
        </label>
      </div>
      <div className="space-x-2">
        <button
          type="button"
          onClick={startAttack}
          className="border border-red-500 text-red-400 rounded px-3 py-1"
        >
          Launch
        </button>
        <button
          type="button"
          onClick={stopAttack}
          className="border border-green-500 text-green-400 rounded px-3 py-1"
        >
          Stop
        </button>
      </div>
      <div className="relative h-40 border border-green-500/30" data-testid="attack-area">
        {packets.map((p) => {
          const tgt = TARGETS.find((t) => t.id === p.target) || TARGETS[0];
          return (
            <PacketFlow
              key={p.id}
              source={SOURCE}
              destination={{ x: tgt.x, y: tgt.y }}
              packetType="http"
              count={1}
            />
          );
        })}
        <div
          className="absolute w-4 h-4 bg-green-500 rounded-full"
          style={{ left: SOURCE.x, top: SOURCE.y }}
        />
        {TARGETS.map((t) => (
          <div
            key={t.id}
            className="absolute w-6 h-6 border border-green-500 text-green-400 flex items-center justify-center text-[10px]"
            style={{ left: t.x, top: t.y }}
          >
            {t.label}
          </div>
        ))}
      </div>
      <p className="text-green-400 text-xs" data-testid="ddos-tips">
        High traffic can overwhelm servers. Defenses include rate limiting,
        load balancing and traffic filtering.
      </p>
    </div>
  );
};

export default DDoSSimulator;
