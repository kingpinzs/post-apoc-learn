import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogScreen from '../components/LogScreen';

test('displays intercepted logs', () => {
  render(<LogScreen />);
  expect(screen.getByText(/Encrypted ping/)).toBeInTheDocument();
  expect(screen.getByText(/Distress call/)).toBeInTheDocument();
});
