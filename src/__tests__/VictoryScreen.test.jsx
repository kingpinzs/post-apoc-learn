import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VictoryScreen from '../components/VictoryScreen';

const stats = { time: 42, accuracy: 88, threatsStopped: 3, score: 9001 };

test('displays statistics and unlocked items', () => {
  render(<VictoryScreen stats={stats} unlocked={['map', 'radio']} />);
  expect(screen.getByTestId('victory-message')).toHaveTextContent('TRAINING COMPLETE');
  expect(screen.getByText('Time Played: 42s')).toBeInTheDocument();
  expect(screen.getByText('MAP')).toBeInTheDocument();
});

test('restart and new game plus buttons trigger callbacks', () => {
  const onRestart = jest.fn();
  const onNewGamePlus = jest.fn();
  render(
    <VictoryScreen
      stats={stats}
      onRestart={onRestart}
      onNewGamePlus={onNewGamePlus}
      unlocked={[]}
    />
  );
  fireEvent.click(screen.getByTestId('restart-button'));
  fireEvent.click(screen.getByTestId('ngp-button'));
  expect(onRestart).toHaveBeenCalled();
  expect(onNewGamePlus).toHaveBeenCalled();
});
