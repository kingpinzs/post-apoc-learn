import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DockBar from '../components/DockBar';

const getSlot = (container, index) => container.querySelector(`[data-testid="dock-slot-${index}"]`);

function createDataTransfer(appId) {
  const dt = {
    data: {},
    setData(type, val) { this.data[type] = val; },
    getData(type) { return this.data[type]; },
    dropEffect: '',
    effectAllowed: 'all'
  };
  if (appId) dt.setData('text/plain', appId);
  return dt;
}

test('renders five slots', () => {
  const { container } = render(<DockBar slots={[null, null, null, null, null]} />);
  expect(getSlot(container, 0)).toBeInTheDocument();
  expect(getSlot(container, 4)).toBeInTheDocument();
});

test('calls onDropApp and persists arrangement', () => {
  localStorage.clear();
  const handleDrop = jest.fn();
  const { container } = render(
    <DockBar slots={[null, null, null, null, null]} onDropApp={handleDrop} />
  );
  const slot = getSlot(container, 0);
  const dt = createDataTransfer('communicator');
  fireEvent.dragOver(slot, { dataTransfer: dt });
  expect(slot).toHaveClass('border-green-400');
  fireEvent.drop(slot, { dataTransfer: dt });
  expect(handleDrop).toHaveBeenCalledWith(0, 'communicator');
  const stored = JSON.parse(localStorage.getItem('dockSlots'));
  expect(stored[0]).toBe('communicator');
});

test('calls onRemoveApp when removing', () => {
  const handleRemove = jest.fn();
  const { container } = render(
    <DockBar slots={['communicator', null, null, null, null]} onRemoveApp={handleRemove} />
  );
  const slot = getSlot(container, 0);
  const button = slot.querySelector('button');
  fireEvent.click(button);
  expect(handleRemove).toHaveBeenCalledWith(0);
});
