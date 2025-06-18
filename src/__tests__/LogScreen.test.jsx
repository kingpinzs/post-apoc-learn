import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogScreen from '../components/LogScreen';

test('displays intercepted logs', () => {
  render(<LogScreen />);

  // ensure container renders
  expect(screen.getByTestId('log-screen')).toBeInTheDocument();

  // first couple of logs should be visible
  expect(screen.getByText('Log entry 1')).toBeInTheDocument();
  expect(screen.getByText('Log entry 2')).toBeInTheDocument();

  // there should be multiple log entries rendered
  const entries = screen.getAllByTestId('log-entry');
  expect(entries.length).toBeGreaterThan(0);
});
