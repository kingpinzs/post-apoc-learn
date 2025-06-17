import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThreatIndicator from '../components/ThreatIndicator';

const baseThreats = [
  { id: 1, type: 'malware', severity: 3, timeRemaining: 5 },
  { id: 2, type: 'phishing', severity: 2, timeRemaining: 10 },
];

test('shows threat count and lists sorted threats', () => {
  render(<ThreatIndicator threats={baseThreats} />);
  expect(screen.getByText(/Threats: 2/)).toBeInTheDocument();
  const items = screen.getAllByRole('listitem');
  expect(items[0].textContent).toMatch('malware');
  expect(items[1].textContent).toMatch('phishing');
});

test('flashes red when critical threat present', () => {
  const threats = [
    { id: 3, type: 'ddos', severity: 5, timeRemaining: 6 },
  ];
  const { getByTestId } = render(<ThreatIndicator threats={threats} />);
  expect(getByTestId('threat-indicator')).toHaveClass('animate-pulse');
});

test('calls onThreatClick when clicked', () => {
  const handle = jest.fn();
  const { getByTestId } = render(
    <ThreatIndicator threats={baseThreats} onThreatClick={handle} />
  );
  fireEvent.click(getByTestId('threat-indicator'));
  expect(handle).toHaveBeenCalled();
});

test('counts down timers each second', () => {
  jest.useFakeTimers();
  render(<ThreatIndicator threats={baseThreats} />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  const item = screen.getAllByRole('listitem')[0];
  expect(item.textContent).toMatch('4s');
  jest.useRealTimers();
});
