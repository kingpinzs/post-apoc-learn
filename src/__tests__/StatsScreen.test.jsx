import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsScreen from '../components/StatsScreen';

test('shows world stats', () => {
  render(<StatsScreen />);
  expect(screen.getByText(/Radiation Levels/)).toBeInTheDocument();
  expect(screen.getByText(/Threat Level/)).toBeInTheDocument();
});
