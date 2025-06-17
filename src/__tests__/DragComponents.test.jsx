import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DragCommandBlock from '../components/drag/DragCommandBlock';
import DropZone from '../components/drag/DropZone';

function createDataTransfer(cmd) {
  const dt = {
    data: {},
    setData(type, val) { this.data[type] = val; },
    getData(type) { return this.data[type]; },
  };
  if (cmd) dt.setData('text/plain', cmd);
  return dt;
}

test('drag command sets dataTransfer', () => {
  const { getByText } = render(<DragCommandBlock command="test" />);
  const block = getByText('test');
  const dt = createDataTransfer();
  fireEvent.dragStart(block, { dataTransfer: dt });
  expect(dt.getData('text/plain')).toBe('test');
});

test('drop zone calls handler on drop', () => {
  const handleDrop = jest.fn();
  const { getByTestId } = render(
    <DropZone onDropCommand={handleDrop} data-testid="zone">DROP HERE</DropZone>
  );
  const zone = getByTestId('zone');
  const dt = createDataTransfer('cmd');
  fireEvent.dragOver(zone, { dataTransfer: dt });
  fireEvent.drop(zone, { dataTransfer: dt });
  expect(handleDrop).toHaveBeenCalledWith('cmd');
});
