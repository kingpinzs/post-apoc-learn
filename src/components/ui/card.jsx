import * as React from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-black text-green-400 border border-green-500/30 rounded-lg shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card };
