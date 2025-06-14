import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Particles = ({ trigger }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (trigger) {
      const p = Array.from({ length: 20 }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setItems(p);
      const t = setTimeout(() => setItems([]), 800);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <span
          key={i}
          className="particle"
          style={{ left: `${item.left}%`, animationDelay: `${item.delay}s` }}
        />
      ))}
    </div>
  );
};

Particles.propTypes = {
  trigger: PropTypes.bool,
};

export default Particles;
