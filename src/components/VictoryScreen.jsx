import React from 'react';
import PropTypes from 'prop-types';

const VictoryScreen = ({ stats, unlocked = [], onRestart, onNewGamePlus }) => (
  <div className="text-center border border-green-500 rounded-lg p-4" data-testid="victory-screen">
    <p className="text-green-400 font-mono mb-4" data-testid="victory-message">
      TRAINING COMPLETE
    </p>
    <div className="text-green-400 font-mono mb-4 space-y-1" data-testid="statistics">
      <div>Time Played: {stats.time}s</div>
      <div>Accuracy: {stats.accuracy.toFixed(0)}%</div>
      <div>Threats Stopped: {stats.threatsStopped}</div>
      <div>Score: {stats.score}</div>
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
    <div className="text-green-400 font-mono mb-4" data-testid="credits">
      <p>\u00A9 20XX SURVIV-OS Team</p>
    </div>
    <div className="space-y-2">
      <button
        onClick={onRestart}
        className="bg-green-900/30 border border-green-500 text-green-400 font-mono py-1 px-3 rounded hover:bg-green-900/50"
        data-testid="restart-button"
      >
        RESTART
      </button>
      <button
        onClick={onNewGamePlus}
        className="bg-blue-900/30 border border-blue-500 text-blue-400 font-mono py-1 px-3 rounded hover:bg-blue-900/50 block w-full mt-2"
        data-testid="ngp-button"
      >
        NEW GAME+
      </button>
    </div>
  </div>
);

VictoryScreen.propTypes = {
  stats: PropTypes.shape({
    time: PropTypes.number.isRequired,
    accuracy: PropTypes.number.isRequired,
    threatsStopped: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
  }).isRequired,
  unlocked: PropTypes.arrayOf(PropTypes.string),
  onRestart: PropTypes.func,
  onNewGamePlus: PropTypes.func,
};

export default VictoryScreen;
