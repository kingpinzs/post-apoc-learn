import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const Panel = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-black/60 text-green-400 border border-green-500/30 rounded p-2',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Panel.displayName = 'Panel';

Panel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Panel };
