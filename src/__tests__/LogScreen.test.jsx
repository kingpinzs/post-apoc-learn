import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogScreen from '../components/LogScreen';

test('displays intercepted logs', () => {
  render(<LogScreen />);
  expect(screen.getByText(/Log entry 1$/)).toBeInTheDocument();
  expect(screen.getByText(/Log entry 2$/)).toBeInTheDocument();
});
