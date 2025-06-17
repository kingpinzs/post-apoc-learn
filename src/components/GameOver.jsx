import React from 'react';
import PropTypes from 'prop-types';

const GameOver = ({ reason, stats, unlocked = [], onRetry, onPractice, onShare }) => (
  <div className="text-center border border-red-500 rounded-lg p-4" data-testid="game-over">
    <p className="text-red-500 font-mono mb-4" data-testid="failure-reason">
      {reason}
    </p>
    <div className="text-green-400 font-mono mb-4 space-y-1" data-testid="statistics">
      <div>Threats Stopped: {stats.threatsStopped}</div>
      <div>Damage Taken: {stats.damageTaken}</div>
    </div>
    <div className="text-green-400 font-mono mb-4" data-testid="unlocked-items">
      {unlocked.length > 0 ? (
        <ul className="list-disc list-inside">
          {unlocked.map((item) => (
            <li key={item}>{item.toUpperCase()}</li>
          ))}
        </ul>
      ) : (
        <p>No items unlocked</p>
      )}
    </div>
    <div className="space-y-2">
      <button
        onClick={onRetry}
        className="bg-red-900/30 border border-red-500 text-red-400 font-mono py-1 px-3 rounded hover:bg-red-900/50"
        data-testid="retry-button"
      >
        RETRY
      </button>
      <button
        onClick={onPractice}
        className="bg-green-900/30 border border-green-500 text-green-400 font-mono py-1 px-3 rounded hover:bg-green-900/50 block w-full mt-2"
        data-testid="practice-button"
      >
        CONTINUE IN PRACTICE
      </button>
      <button
        onClick={onShare}
        className="bg-blue-900/30 border border-blue-500 text-blue-400 font-mono py-1 px-3 rounded hover:bg-blue-900/50 block w-full mt-2"
        data-testid="share-button"
      >
        SHARE SCORE
      </button>
    </div>
  </div>
);

GameOver.propTypes = {
  reason: PropTypes.string.isRequired,
  stats: PropTypes.shape({
    threatsStopped: PropTypes.number,
    damageTaken: PropTypes.number,
  }).isRequired,
  unlocked: PropTypes.arrayOf(PropTypes.string),
  onRetry: PropTypes.func,
  onPractice: PropTypes.func,
  onShare: PropTypes.func,
};

export default GameOver;
