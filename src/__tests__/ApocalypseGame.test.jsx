import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApocalypseGame from '../components/Game';

describe('ApocalypseGame', () => {
  test('shows boot message then start button', () => {
    jest.useFakeTimers();
    render(<ApocalypseGame />);
    expect(screen.getByText(/INITIATING NEURAL INTERFACE/i)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/INITIATE HACK/i)).toBeInTheDocument();
    jest.useRealTimers();
  });

  test('can start first challenge', () => {
    jest.useFakeTimers();
    render(<ApocalypseGame />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    fireEvent.click(screen.getByText(/INITIATE HACK/i));
    expect(
      screen.getByText(/SELECT CORRECT RADIATION MEASUREMENT PROTOCOL/i)
    ).toBeInTheDocument();
    jest.useRealTimers();
  });

  test('quick save stores state', () => {
    render(<ApocalypseGame />);
    fireEvent.keyDown(window, { key: 'F5' });
    expect(localStorage.getItem('survivos-quick')).not.toBeNull();
  });
});

