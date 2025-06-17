import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScannerScreen from '../components/ScannerScreen';

test('environment scan reveals results', () => {
  jest.useFakeTimers();
  const { getByText, container } = render(<ScannerScreen />);
  fireEvent.click(getByText('Scan Environment'));
  act(() => {
    jest.advanceTimersByTime(3200);
  });
  const items = container.querySelectorAll('li');
  expect(items.length).toBeGreaterThan(0);
  jest.useRealTimers();
});
