import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceOverlay from '../components/PerformanceOverlay';

jest.useFakeTimers();

test('shows fps label when enabled', () => {
  render(<PerformanceOverlay show />);
  jest.advanceTimersByTime(1000);
  expect(screen.getByText(/FPS:/)).toBeInTheDocument();
});
