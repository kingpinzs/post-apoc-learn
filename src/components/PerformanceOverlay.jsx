import React from 'react';
import PropTypes from 'prop-types';
import usePerformance from '../hooks/usePerformance';

const box = 'absolute top-0 right-0 m-2 p-1 bg-black bg-opacity-70 text-green-400 text-xs z-50';

const PerformanceOverlay = ({ show }) => {
  const { fps, memory } = usePerformance();
  if (!show) return null;
  return (
    <div className={box} data-testid="perf-overlay">
      <div>FPS: {fps}</div>
      {memory ? <div>Mem: {memory.toFixed(1)} MB</div> : null}
    </div>
  );
};

PerformanceOverlay.propTypes = {
  show: PropTypes.bool,
};

export default PerformanceOverlay;
