import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NetworkScanner from '../components/NetworkScanner';

test('scan generates devices after delay', () => {
  jest.useFakeTimers();
  render(<NetworkScanner />);
  fireEvent.click(screen.getByText('Scan'));
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  const devices = screen.getAllByTestId(/device/);
  expect(devices.length).toBeGreaterThanOrEqual(3);
  expect(devices.length).toBeLessThanOrEqual(5);
  expect(screen.getByTestId('bad-device')).toBeInTheDocument();
  jest.useRealTimers();
});

test('clicking device shows details panel', () => {
  jest.useFakeTimers();
  render(<NetworkScanner />);
  fireEvent.click(screen.getByText('Scan'));
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  const device = screen.getAllByTestId('device')[0];
  fireEvent.click(device);
  expect(screen.getByText(/IP:/i)).toBeInTheDocument();
  expect(screen.getByText(/Type:/i)).toBeInTheDocument();
  jest.useRealTimers();
});
