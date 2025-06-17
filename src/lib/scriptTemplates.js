export const scriptTemplates = {
  basicScan: [
    { type: 'START', x: 0, y: 0, parameters: {} },
    { type: 'SCAN', x: 0, y: 50, parameters: {} },
    { type: 'REPORT', x: 0, y: 100, parameters: {} },
    { type: 'END', x: 0, y: 150, parameters: {} },
  ],
  attack: [
    { type: 'START', x: 0, y: 0, parameters: {} },
    { type: 'SELECT_TARGET', x: 0, y: 50, parameters: {} },
    { type: 'ATTACK', x: 0, y: 100, parameters: {} },
    { type: 'END', x: 0, y: 150, parameters: {} },
  ],
  defense: [
    { type: 'START', x: 0, y: 0, parameters: {} },
    { type: 'DETECT', x: 0, y: 50, parameters: {} },
    { type: 'BLOCK', x: 0, y: 100, parameters: {} },
    { type: 'LOG', x: 0, y: 150, parameters: {} },
    { type: 'END', x: 0, y: 200, parameters: {} },
  ],
};
