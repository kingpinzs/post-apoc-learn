import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { cn } from '../lib/utils';

const ports = ['22', '80', '443'];

const FirewallApp = () => {
  const [rules, setRules] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [form, setForm] = useState({ action: 'block', source: 'any', destination: 'any', port: '80' });
  const [threats, setThreats] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const threatId = useRef(0);

  const addRule = () => {
    setRules((r) => [...r, { ...form, id: Date.now() }]);
  };

  const handleDragStart = (index) => () => setDragIndex(index);
  const handleDrop = (index) => () => {
    if (dragIndex === null || dragIndex === index) return;
    const updated = rules.slice();
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setRules(updated);
    setDragIndex(null);
  };

  useEffect(() => {
    const spawn = setInterval(() => {
      threatId.current += 1;
      setThreats((t) => [
        ...t,
        {
          id: threatId.current,
          port: ports[Math.floor(Math.random() * ports.length)],
          x: 0,
          y: Math.random() * 80,
        },
      ]);
    }, 2000);
    return () => clearInterval(spawn);
  }, []);

  useEffect(() => {
    const move = setInterval(() => {
      setThreats((ths) =>
        ths
          .map((th) => {
            const newX = th.x + 5;
            const match = rules.find(
              (r) =>
                r.action === 'block' &&
                (r.port === 'any' || r.port === th.port)
            );
            if (newX >= 70 && match) {
              setBlocked((b) => [...b, { id: th.id, x: newX, y: th.y }]);
              setTimeout(() => {
                setBlocked((b) => b.filter((bb) => bb.id !== th.id));
              }, 500);
              return null;
            }
            if (newX > 100) return null;
            return { ...th, x: newX };
          })
          .filter(Boolean)
      );
    }, 300);
    return () => clearInterval(move);
  }, [rules]);

  return (
    <div className="p-4 space-y-4" data-testid="firewall-app">
      <div className="space-x-2 flex text-green-400">
        <select
          value={form.action}
          onChange={(e) => setForm({ ...form, action: e.target.value })}
          className="bg-black border border-green-500/30 rounded px-1"
          aria-label="Action"
        >
          <option value="allow">allow</option>
          <option value="block">block</option>
        </select>
        <input
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          placeholder="source"
          aria-label="Source"
          className="bg-black border border-green-500/30 rounded px-1 w-20"
        />
        <input
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
          placeholder="dest"
          aria-label="Destination"
          className="bg-black border border-green-500/30 rounded px-1 w-20"
        />
        <select
          value={form.port}
          onChange={(e) => setForm({ ...form, port: e.target.value })}
          className="bg-black border border-green-500/30 rounded px-1"
          aria-label="Port"
        >
          <option value="any">any</option>
          {ports.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addRule}
          className="border border-green-500 rounded px-2"
          data-testid="add-rule"
        >
          Add
        </button>
      </div>
      <ul className="space-y-1" data-testid="rule-list">
        {rules.map((r, i) => (
          <li
            key={r.id}
            draggable
            onDragStart={handleDragStart(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop(i)}
            data-testid={`rule-${i}`}
            className={cn(
              'p-1 border border-green-500/30 text-green-400 bg-black rounded flex items-center space-x-1',
              r.hit && 'bg-red-800'
            )}
          >
            <span className="font-mono text-sm">
              {r.action} {r.source} {r.destination} {r.port}
            </span>
          </li>
        ))}
      </ul>
      <div className="relative h-32 border border-green-500/30 overflow-hidden" data-testid="threat-area">
        {threats.map((t) => (
          <ArrowRight
            key={t.id}
            data-testid="threat"
            className="absolute text-red-500"
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          />
        ))}
        {blocked.map((b) => (
          <X key={b.id} className="absolute text-green-400" style={{ left: `${b.x}%`, top: `${b.y}%` }} />
        ))}
      </div>
    </div>
  );
};

export default FirewallApp;
