import React, { useState } from 'react';
import DropZone from '../drag/DropZone';
import CommandLibrary from './CommandLibrary';
import TemplateSelector from './TemplateSelector';
import ExecutionVisualizer from './ExecutionVisualizer';
import { validateScript } from '../../lib/scriptValidator';

const ScriptBuilder = () => {
  const [commands, setCommands] = useState([]);
  const [exec, setExec] = useState(null);
  const [error, setError] = useState(null);

  const addCommand = (cmd) => {
    setCommands((prev) => [...prev, cmd]);
  };

  const loadTemplate = (tpl) => {
    if (tpl) setCommands(tpl);
  };

  const runScript = () => {
    const result = validateScript(commands);
    if (!result.isValid) {
      setError(result.errors.join(', '));
      setExec(null);
      return;
    }
    setError(null);
    setExec(commands);
  };

  return (
    <div className="p-4 space-y-4" data-testid="script-builder">
      <TemplateSelector onSelect={loadTemplate} />
      <div className="flex space-x-4">
        <CommandLibrary />
        <DropZone
          onDropCommand={addCommand}
          className="flex-1 min-h-[100px] p-2"
          data-testid="script-dropzone"
        >
          <div className="space-y-1">
            {commands.map((c, i) => {
              const label = typeof c === 'string' ? c : c.type;
              return (
                <div key={i} className="text-green-400">
                  {i + 1}. {label}
                </div>
              );
            })}
          </div>
        </DropZone>
      </div>
      <button
        className="border border-green-500 text-green-400 rounded px-3 py-1"
        onClick={runScript}
      >
        Run Script
      </button>
      {error && <div className="text-red-400">{error}</div>}
      {exec && <ExecutionVisualizer commands={exec} onComplete={() => setExec(null)} />}
    </div>
  );
};

export default ScriptBuilder;
