import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUsage } from '../lib/resourceSystem';

const TYPE_COLORS = {
  http: 'bg-blue-500',
  ftp: 'bg-yellow-500',
  malware: 'bg-red-500',
  default: 'bg-green-400',
};

const PacketFlow = ({ source, destination, packetType, count }) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 20);
    return () => clearTimeout(t);
  }, [source, destination, count]);

  const { bandwidth } = getUsage();
  const duration = Math.max(0.5, 5 - bandwidth / 25);

  const sx = source.x;
  const sy = source.y;
  const dx = destination.x;
  const dy = destination.y;

  const color = TYPE_COLORS[packetType] || TYPE_COLORS.default;

  return (
    <div className="absolute inset-0 pointer-events-none" data-testid="packet-flow">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          data-testid="packet-dot"
          className={`rounded-full absolute w-2 h-2 ${color}`}
          style={{
            left: `${sx}px`,
            top: `${sy}px`,
            transform: animate ? `translate(${dx - sx}px, ${dy - sy}px)` : 'translate(0,0)',
            transitionProperty: 'transform',
            transitionDuration: `${duration}s`,
            transitionTimingFunction: 'linear',
          }}
        />
      ))}
    </div>
  );
};

PacketFlow.propTypes = {
  source: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  destination: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  packetType: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

export default PacketFlow;

