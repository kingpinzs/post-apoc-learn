import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as Icons from 'lucide-react';
import { validateScript } from '../../lib/scriptValidator';
function snap(value) {
  return Math.round(value / 50) * 50;
}

const PaletteItem = ({ command }) => {
  const Icon = Icons[command.icon] || Icons.Terminal;
  const handleDragStart = (e) => {
    e.dataTransfer.setData('command', JSON.stringify(command));
  };
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center space-x-1 bg-black border border-green-500/30 text-green-400 px-2 py-1 rounded-md cursor-grab active:cursor-grabbing select-none"
    >
      <Icon className="w-4 h-4" />
      <span>{command.type}</span>
    </div>
  );
};

PaletteItem.propTypes = {
  command: PropTypes.shape({
    type: PropTypes.string.isRequired,
    parameters: PropTypes.object,
    icon: PropTypes.string,
  }).isRequired,
};

const CanvasBlock = ({ block, onMouseDown }) => {
  const Icon = Icons[block.icon] || Icons.Terminal;
  return (
    <div
      onMouseDown={onMouseDown}
      className="absolute w-12 h-12 flex items-center justify-center border border-green-500/30 bg-black text-green-400 rounded select-none cursor-grab active:cursor-grabbing"
      style={{ left: block.x, top: block.y }}
      data-testid="canvas-block"
    >
      <Icon className="w-5 h-5" />
    </div>
  );
};

CanvasBlock.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
    parameters: PropTypes.object,
    icon: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  onMouseDown: PropTypes.func.isRequired,
};

const ScriptBuilderCanvas = ({ availableCommands = [], onScriptComplete }) => {
  const canvasRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [invalidConns, setInvalidConns] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('command');
    if (!data) return;
    const cmd = JSON.parse(data);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(e.clientX - rect.left);
    const y = snap(e.clientY - rect.top);
    const id = Date.now() + Math.random();
    setBlocks((prev) => [...prev, { ...cmd, id, x, y }]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const startDrag = (id) => (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    setDragging(id);
    setOffset({ x: e.clientX - rect.left - block.x, y: e.clientY - rect.top - block.y });
  };

  const handleMouseMove = (e) => {
    if (dragging === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(e.clientX - rect.left - offset.x);
    const y = snap(e.clientY - rect.top - offset.y);
    setBlocks((prev) => prev.map((b) => (b.id === dragging ? { ...b, x, y } : b)));
  };

  const handleMouseUp = () => setDragging(null);

  const completeScript = () => {
    const result = validateScript(blocks);
    setErrors(result.errors);

    const sortedBlocks = blocks.slice().sort((a, b) => a.y - b.y);
    const invalid = [];
    for (let i = 1; i < sortedBlocks.length; i += 1) {
      const prev = sortedBlocks[i - 1];
      const curr = sortedBlocks[i];
      if (prev.x === undefined || curr.x === undefined) continue;
      if (curr.x !== prev.x || curr.y !== prev.y + 50) {
        invalid.push({ from: prev.id, to: curr.id });
      }
    }
    setInvalidConns(invalid);

    if (result.isValid && onScriptComplete) onScriptComplete(blocks);
  };

  const sorted = blocks.slice();
  sorted.sort((a, b) => a.y - b.y);

  return (
    <div className="flex space-x-4">
      {/* Command Palette */}
      <div className="space-y-2" data-testid="command-palette">
        {availableCommands.map((cmd) => (
          <PaletteItem key={cmd.type} command={cmd} />
        ))}
      </div>

      {/* Canvas */}
      <div className="relative flex-1 border border-green-500/30" style={{ minHeight: 300 }}
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        data-testid="script-canvas"
      >
        <svg className="absolute inset-0 pointer-events-none" data-testid="lines">
          {sorted.map((b, i) => {
            if (i === 0) return null;
            const prev = sorted[i - 1];
            const invalid = invalidConns.some(
              (c) => c.from === prev.id && c.to === b.id,
            );
            return (
              <line
                key={b.id}
                x1={prev.x + 24}
                y1={prev.y + 24}
                x2={b.x + 24}
                y2={b.y + 24}
                stroke={invalid ? '#dc2626' : '#22c55e'}
                strokeWidth="2"
              />
            );
          })}
        </svg>
        {blocks.map((b) => (
          <CanvasBlock key={b.id} block={b} onMouseDown={startDrag(b.id)} />
        ))}
      </div>

      <div className="flex flex-col justify-start">
        <button
          type="button"
          onClick={completeScript}
          className="border border-green-500 text-green-400 rounded px-2 py-1"
        >
          Complete
        </button>
        {errors.length > 0 && (
          <ul className="mt-2 text-red-400 text-sm list-disc list-inside" data-testid="validation-errors">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

ScriptBuilderCanvas.propTypes = {
  availableCommands: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      parameters: PropTypes.object,
      icon: PropTypes.string,
    })
  ),
  onScriptComplete: PropTypes.func,
};

export default ScriptBuilderCanvas;
