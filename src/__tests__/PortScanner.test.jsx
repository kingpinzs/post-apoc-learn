import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortScanner from '../components/PortScanner';

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

test('can add a custom port', () => {
  render(<PortScanner />);
  fireEvent.change(screen.getByPlaceholderText('Add port'), {
    target: { value: '8080' },
  });
  fireEvent.click(screen.getByText('Add'));
  expect(screen.getByText(/8080/)).toBeInTheDocument();
});

test('cancel stops scan', () => {
  jest.useFakeTimers();
  render(<PortScanner />);
  fireEvent.click(screen.getByText('Scan'));
  fireEvent.click(screen.getByText('Cancel'));
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  jest.useRealTimers();
});
