import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from './ui/panel';

const HUD = ({ objective, time, health, buffs }) => (
  <div className="pointer-events-none select-none font-mono text-xs">
    <div className="fixed top-2 left-2 z-30 w-60">
      <Panel>
        {objective && (
          <div className="mb-1">
            Objective: {objective.length > 30 ? `${objective.slice(0,30)}...` : objective}
          </div>
        )}
        {time !== null && <div>Time: {time}s</div>}
        <div>Health: {health}%</div>
        {buffs?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {buffs.map((b) => (
              <span key={b} className="px-1 py-[1px] border border-green-500 rounded">
                {b}
              </span>
            ))}
          </div>
        )}
      </Panel>
    </div>
  </div>
);

HUD.propTypes = {
  objective: PropTypes.string,
  time: PropTypes.number,
  health: PropTypes.number,
  buffs: PropTypes.arrayOf(PropTypes.string),
};

export default HUD;
