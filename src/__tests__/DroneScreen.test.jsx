import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DroneScreen from '../components/DroneScreen';

test('launching drone outputs scan log', () => {
  jest.useFakeTimers();
  const { getByText } = render(<DroneScreen />);
  fireEvent.click(getByText('Launch Drone'));
  act(() => {
    jest.advanceTimersByTime(4000);
  });
  expect(getByText('Radiation spike detected')).toBeInTheDocument();
  jest.useRealTimers();
});
