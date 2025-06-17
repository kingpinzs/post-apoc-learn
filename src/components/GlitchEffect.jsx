import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../lib/utils';

const GlitchEffect = ({ intensity = 5, duration = 500, children, active = false }) => {
  const style = {
    '--glitch-intensity': intensity,
    '--glitch-duration': `${duration}ms`,
  };
  return (
    <span
      data-testid="glitch-effect"
      style={style}
      className={cn('glitch-effect', active && 'glitch-active')}
    >
      {children}
      <span className="glitch-noise" aria-hidden="true" />
    </span>
  );
};

GlitchEffect.propTypes = {
  intensity: PropTypes.number,
  duration: PropTypes.number,
  active: PropTypes.bool,
  children: PropTypes.node,
};

export default GlitchEffect;
