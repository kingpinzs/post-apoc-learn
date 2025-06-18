import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortScanner from '../components/PortScanner';
import { getUsage, resetResources } from '../lib/resourceSystem';

beforeEach(() => {
  resetResources();
});

test('prefills target ip', () => {
  render(<PortScanner initialTarget="10.0.0.1" />);
  expect(screen.getByDisplayValue('10.0.0.1')).toBeInTheDocument();
});

test('scan generates results after delay', () => {
  jest.useFakeTimers();
  render(<PortScanner />);
  fireEvent.click(screen.getByText('Scan'));
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  const rows = screen.getAllByTestId('scan-result-row');
  expect(rows.length).toBeGreaterThan(0);
  jest.useRealTimers();
});

test('can add custom port and scan', () => {
  jest.useFakeTimers();
  render(<PortScanner />);
  fireEvent.change(screen.getByPlaceholderText(/e.g./i), { target: { value: '8080' } });
  fireEvent.click(screen.getByText('Add Ports'));
  expect(screen.getByLabelText(/8080/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText('Scan'));
  act(() => {
    jest.advanceTimersByTime(4000);
  });
  const row = screen.getAllByTestId('scan-result-row').find((r) => r.textContent.startsWith('8080'));
  expect(row).toBeInTheDocument();
  jest.useRealTimers();
});

test('resources allocated during scan are released', () => {
  jest.useFakeTimers();
  render(<PortScanner />);
  fireEvent.click(screen.getByText('Scan'));
  expect(getUsage().cpu).toBeGreaterThan(0);
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(getUsage().cpu).toBe(0);
  jest.useRealTimers();
});
