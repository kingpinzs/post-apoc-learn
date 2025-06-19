import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const Modal = ({ className, children, ...props }) => (
  <div
    className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/80', className)}
    {...props}
  >
    <div className="bg-black text-green-400 border border-green-500/30 rounded p-4 max-w-full">
      {children}
    </div>
  </div>
);

Modal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Modal };
