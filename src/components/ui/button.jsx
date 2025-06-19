import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const styles = {
  default: 'px-3 py-1 border border-green-500 rounded bg-black text-green-400 hover:bg-green-900/40 transition-colors',
  danger: 'px-3 py-1 border border-red-500 rounded bg-black text-red-400 hover:bg-red-900/40 transition-colors',
};

const Button = ({ variant = 'default', className, ...props }) => (
  <button
    type="button"
    className={cn(styles[variant] || styles.default, className)}
    {...props}
  />
);

Button.propTypes = {
  variant: PropTypes.string,
  className: PropTypes.string,
};

export { Button };
