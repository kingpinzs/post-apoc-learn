import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RadiationMonitor from '../components/RadiationMonitor';

// helper to control randomness
const mockRandom = (value) => {
  jest.spyOn(Math, 'random').mockReturnValue(value);
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('shows warning when radiation level is high', () => {
  mockRandom(0.8); // level 8
  render(<RadiationMonitor />);
  expect(screen.getByTestId('radiation-warning')).toBeInTheDocument();
});

test('successful calibration displays message', () => {
  jest.useFakeTimers();
  mockRandom(0.1); // start with safe level
  render(<RadiationMonitor />);
  const btn = screen.getByRole('button', { name: /calibrate/i });
  fireEvent.click(btn); // start calibration
  // advance 5 steps so gaugeRef.current becomes 5
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  fireEvent.click(btn); // press to stop
  expect(screen.getByText('Calibrated!')).toBeInTheDocument();
  jest.useRealTimers();
});
