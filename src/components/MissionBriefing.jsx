import React from 'react';
import PropTypes from 'prop-types';

const MissionBriefing = ({ mission, onStart }) => {
  if (!mission) return null;
  const {
    title,
    description,
    objectives = [],
    recommendedTools = [],
    difficulty,
    timeLimit,
  } = mission;

  return (
    <div className="p-4 space-y-4" data-testid="mission-briefing">
      <h2 className="text-xl font-bold text-green-400" data-testid="mission-title">
        {title}
      </h2>
      <p className="text-green-200" data-testid="mission-description">
        {description}
      </p>
      <div>
        <h3 className="font-semibold text-green-400">Objectives</h3>
        <ul className="space-y-1" data-testid="objective-list">
          {objectives.map((obj, i) => (
            <li key={i} className="flex items-center space-x-2">
              <input type="checkbox" disabled className="form-checkbox" />
              <span className="text-green-200">{obj}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-green-400">Recommended Tools</h3>
        <ul className="list-disc list-inside text-green-200" data-testid="tool-list">
          {recommendedTools.map((tool, i) => (
            <li key={i}>{tool}</li>
          ))}
        </ul>
      </div>
      <div className="flex space-x-4 text-green-200" data-testid="mission-meta">
        {difficulty && <span>Difficulty: {difficulty}</span>}
        {timeLimit ? <span>Time Limit: {timeLimit}</span> : <span>No Time Limit</span>}
      </div>
      <button
        type="button"
        onClick={onStart}
        className="border border-green-500 text-green-400 rounded px-3 py-1"
        data-testid="start-mission"
      >
        Start Mission
      </button>
    </div>
  );
};

MissionBriefing.propTypes = {
  mission: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    objectives: PropTypes.arrayOf(PropTypes.string),
    recommendedTools: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    timeLimit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onStart: PropTypes.func,
};

export default MissionBriefing;
