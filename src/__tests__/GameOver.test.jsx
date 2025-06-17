import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameOver from '../components/GameOver';

test('renders reason, stats and items', () => {
  const { getByTestId } = render(
    <GameOver
      reason="Failure"
      stats={{ threatsStopped: 3, damageTaken: 20 }}
      unlocked={['firewall', 'antivirus']}
    />
  );
  expect(getByTestId('failure-reason')).toHaveTextContent('Failure');
  expect(getByTestId('statistics')).toHaveTextContent('Threats Stopped: 3');
  expect(getByTestId('unlocked-items').textContent).toMatch(/FIREWALL/);
});

test('calls callbacks on button click', () => {
  const onRetry = jest.fn();
  const onPractice = jest.fn();
  const onShare = jest.fn();
  const { getByTestId } = render(
    <GameOver
      reason="Failure"
      stats={{ threatsStopped: 0, damageTaken: 0 }}
      unlocked={[]}
      onRetry={onRetry}
      onPractice={onPractice}
      onShare={onShare}
    />
  );
  fireEvent.click(getByTestId('retry-button'));
  fireEvent.click(getByTestId('practice-button'));
  fireEvent.click(getByTestId('share-button'));
  expect(onRetry).toHaveBeenCalled();
  expect(onPractice).toHaveBeenCalled();
  expect(onShare).toHaveBeenCalled();
});
