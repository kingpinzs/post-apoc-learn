import React from 'react';
import { loadHighScores } from '../lib/highscores';

const LeaderboardScreen = () => {
  const scores = loadHighScores();
  return (
    <div className="p-4 space-y-2 text-green-400" data-testid="leaderboard-screen">
      <h2 className="font-bold mb-2">High Scores</h2>
      {scores.length === 0 && <p>No scores yet</p>}
      <ol className="list-decimal list-inside space-y-1">
        {scores.map((s, i) => (
          <li key={i}>
            {s.score} pts - {s.threatsStopped} threats - {s.time}s -{' '}
            {s.accuracy.toFixed(0)}%
          </li>
        ))}
      </ol>
    </div>
  );
};

export default LeaderboardScreen;
