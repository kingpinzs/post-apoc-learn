import React, { useEffect, useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";

const TutorialOverlay = ({ steps = [], onComplete }) => {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);

  // update highlight rect on step change
  useLayoutEffect(() => {
    if (index >= steps.length) return;
    const el = document.getElementById(steps[index].targetId);
    if (el) setRect(el.getBoundingClientRect());
  }, [index, steps]);

  // handle progression
  useEffect(() => {
    if (index >= steps.length) {
      return;
    }
    const { targetId, action } = steps[index];
    const el = document.getElementById(targetId);
    if (!el) return;

    const handler = () => setIndex((i) => i + 1);
    el.addEventListener(action, handler);
    return () => {
      el.removeEventListener(action, handler);
    };
  }, [index, steps]);

  // fire completion callback
  useEffect(() => {
    if (index === steps.length && onComplete) {
      onComplete();
    }
  }, [index, steps, onComplete]);

  if (index >= steps.length) return null;

  const { targetId, message } = steps[index];
  let highlight = {};
  let tip = {};
  if (rect) {
    highlight = {
      top: rect.top + window.scrollY - 4,
      left: rect.left + window.scrollX - 4,
      width: rect.width + 8,
      height: rect.height + 8,
    };
    tip = {
      top: rect.top + window.scrollY + rect.height + 12,
      left: rect.left + window.scrollX,
    };
  }

  const hasRect = !!rect;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/70"></div>
      {hasRect && (
        <div
          className="absolute border-2 border-blue-400 rounded-md pointer-events-none"
          style={highlight}
        />
      )}
      {hasRect && (
        <div
          className="absolute bg-white text-black p-2 rounded-md shadow pointer-events-auto"
          style={tip}
        >
          {message}
        </div>
      )}
    </div>
  );
};

TutorialOverlay.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      targetId: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    })
  ).isRequired,
  onComplete: PropTypes.func,
};

export default TutorialOverlay;
