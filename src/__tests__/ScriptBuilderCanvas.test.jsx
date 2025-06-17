import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScriptBuilderCanvas from '../components/scriptbuilder/ScriptBuilderCanvas';

function createDataTransfer(data) {
  return {
    data: {},
    setData(type, val) { this.data[type] = val; },
    getData(type) { return this.data[type]; },
    dropEffect: '',
    effectAllowed: 'all'
  };
}

describe('ScriptBuilderCanvas', () => {
  const commands = [
    { type: 'init', icon: 'Terminal', parameters: {} },
    { type: 'end', icon: 'Square', parameters: {} },
  ];

  test('renders palette and canvas', () => {
    const { getByTestId } = render(
      <ScriptBuilderCanvas availableCommands={commands} />
    );
    expect(getByTestId('command-palette')).toBeInTheDocument();
    expect(getByTestId('script-canvas')).toBeInTheDocument();
  });

  test('drops command onto canvas', () => {
    const { getByTestId, getAllByText } = render(
      <ScriptBuilderCanvas availableCommands={commands} />
    );
    const paletteItem = getAllByText('init')[0];
    const dt = createDataTransfer();
    fireEvent.dragStart(paletteItem, { dataTransfer: dt });
    const canvas = getByTestId('script-canvas');
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0 });
    fireEvent.dragOver(canvas, { dataTransfer: dt });
    fireEvent.drop(canvas, { dataTransfer: dt, clientX: 10, clientY: 10 });
    expect(canvas.querySelector('[data-testid=canvas-block]')).toBeInTheDocument();
  });

  test('calls onScriptComplete', () => {
    const handleComplete = jest.fn();
    const { getByText } = render(
      <ScriptBuilderCanvas availableCommands={commands} onScriptComplete={handleComplete} />
    );
    fireEvent.click(getByText('Complete'));
    expect(handleComplete).toHaveBeenCalled();
  });
});
