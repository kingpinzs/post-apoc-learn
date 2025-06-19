import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApocalypseGame from '../components/Game';

describe('ApocalypseGame', () => {
  test('shows boot then waits for tutorial', () => {
    jest.useFakeTimers();
    render(<ApocalypseGame />);
    expect(screen.getByText(/INITIATING NEURAL INTERFACE/i)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByText(/INITIATE HACK/i)).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  test('can start first challenge when ready', () => {
    jest.useFakeTimers();
    localStorage.setItem('survivos-game-state', JSON.stringify('READY'));
    const { initGameState } = require('../lib/gameStateManager');
    initGameState();
    render(<ApocalypseGame />);
    act(() => {
      jest.advanceTimersByTime(0);
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

