import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmergencyKeypad from '../components/EmergencyKeypad';

function clickDigit(d) {
  const button = screen.getAllByText(d).find(el => el.tagName === 'BUTTON');
  fireEvent.click(button);
}

function enterDigits(digits) {
  digits.forEach(clickDigit);
}

test('calls onComplete with true for correct code', () => {
  jest.useFakeTimers();
  const onComplete = jest.fn();
  render(<EmergencyKeypad code="12" onComplete={onComplete} />);
  enterDigits(['1','2']);
  expect(onComplete).toHaveBeenCalledWith(true);
  expect(screen.getByText(/access granted/i)).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.getByTestId('display')).toHaveTextContent('----');
  jest.useRealTimers();
});

test('shows denied for wrong code', () => {
  jest.useFakeTimers();
  const onComplete = jest.fn();
  render(<EmergencyKeypad code="12" onComplete={onComplete} />);
  enterDigits(['9','9']);
  expect(onComplete).toHaveBeenCalledWith(false);
  expect(screen.getByText(/denied/i)).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.getByTestId('display')).toHaveTextContent('----');
  jest.useRealTimers();
});
