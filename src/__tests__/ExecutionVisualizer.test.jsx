import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionVisualizer from '../components/scriptbuilder/ExecutionVisualizer';

test('runs through commands and triggers completion', () => {
  jest.useFakeTimers();
  const handleComplete = jest.fn();
  render(
    <ExecutionVisualizer
      commands={[{ type: 'init' }, { type: 'end' }]}
      onComplete={handleComplete}
    />,
  );

  // First command highlighted after 300ms
  act(() => {
    jest.advanceTimersByTime(300);
  });
  expect(screen.getByText('init')).toHaveClass('text-black');

  // Second command highlighted after 600ms
  act(() => {
    jest.advanceTimersByTime(300);
  });
  expect(screen.getByText('end')).toHaveClass('text-black');

  // Completion callback after final step
  act(() => {
    jest.advanceTimersByTime(300);
  });
  expect(handleComplete).toHaveBeenCalled();
  jest.useRealTimers();
});
