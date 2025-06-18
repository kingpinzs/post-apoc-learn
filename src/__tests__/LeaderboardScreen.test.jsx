import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeaderboardScreen from '../components/LeaderboardScreen';
import { saveHighScores } from '../lib/highscores';

describe('LeaderboardScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows message when no scores', () => {
    render(<LeaderboardScreen />);
    expect(screen.getByText(/No scores yet/)).toBeInTheDocument();
  });

  test('displays saved scores', () => {
    saveHighScores([{ score: 20, threatsStopped: 2, time: 30, accuracy: 95 }]);
    render(<LeaderboardScreen />);
    expect(screen.getByText(/20 pts/)).toBeInTheDocument();
  });
});
