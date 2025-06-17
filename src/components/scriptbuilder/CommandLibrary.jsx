import React from 'react';
import DragCommandBlock from '../drag/DragCommandBlock';

const COMMANDS = ['init', 'step', 'wait', 'end'];

const CommandLibrary = () => {
  return (
    <div className="space-y-2" data-testid="command-library">
      {COMMANDS.map(cmd => (
        <DragCommandBlock key={cmd} command={cmd} />
      ))}
    </div>
  );
};

export default CommandLibrary;
