import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeScreen from '../components/HomeScreen';
import { appRegistry } from '../lib/appRegistry';

function createDataTransfer(appId) {
  const dt = {
    data: {},
    setData(type, val) { this.data[type] = val; },
    getData(type) { return this.data[type]; },
  };
  if (appId) dt.setData('text/plain', appId);
  return dt;
}

test('renders search bar and grid slots', () => {
  localStorage.clear();
  const { getByTestId, container } = render(<HomeScreen />);
  expect(getByTestId('search-bar')).toBeInTheDocument();
  const slots = container.querySelectorAll('[data-testid^="grid-slot-"]');
  expect(slots.length).toBe(20);
});

test('dragging app reorganizes grid', () => {
  localStorage.clear();
  const firstId = Object.keys(appRegistry)[0];
  const { container } = render(<HomeScreen />);
  const slot0 = container.querySelector('[data-testid="grid-slot-0"]');
  const slot1 = container.querySelector('[data-testid="grid-slot-1"]');
  const icon = slot0.querySelector('[draggable="true"]');
  const dt = createDataTransfer(firstId);
  fireEvent.dragStart(icon, { dataTransfer: dt });
  fireEvent.dragOver(slot1, { dataTransfer: dt });
  fireEvent.drop(slot1, { dataTransfer: dt });
  const stored = JSON.parse(localStorage.getItem('homeGridSlots'));
  expect(stored[1]).toBe(firstId);
});

test('long press uninstalls app', () => {
  jest.useFakeTimers();
  window.confirm = jest.fn(() => true);
  localStorage.clear();
  const firstId = Object.keys(appRegistry)[0];
  const { container } = render(<HomeScreen />);
  const slot0 = container.querySelector('[data-testid="grid-slot-0"]');
  fireEvent.pointerDown(slot0);
  act(() => {
    jest.advanceTimersByTime(600);
  });
  expect(window.confirm).toHaveBeenCalled();
  const stored = JSON.parse(localStorage.getItem('homeGridSlots'));
  expect(stored[0]).toBeNull();
  jest.useRealTimers();
});

test('tapping unlocked app launches and back returns home', () => {
  localStorage.clear();
  const { container, getByTestId } = render(<HomeScreen />);
  const slot0 = container.querySelector('[data-testid="grid-slot-0"]');
  const icon = slot0.querySelector('[draggable="true"]');
  fireEvent.click(icon);
  expect(getByTestId('communicator-screen')).toBeInTheDocument();
  fireEvent.click(getByTestId('back-button'));
  expect(getByTestId('home-screen')).toBeInTheDocument();
});

test('shows message when launching locked app', () => {
  localStorage.clear();
  const { container, getByTestId } = render(<HomeScreen />);
  const slot1 = container.querySelector('[data-testid="grid-slot-1"]');
  const icon = slot1.querySelector('[draggable]');
  fireEvent.click(icon);
  expect(getByTestId('lock-message')).toBeInTheDocument();
});
