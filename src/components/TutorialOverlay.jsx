import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import PropTypes from "prop-types";

// --- FIX START ---
// This custom hook makes the component compatible with both the browser and the JSDOM test environment.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
// --- FIX END ---

const TutorialOverlay = ({ steps = [], onComplete }) => {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const tipRef = useRef(null);
  const [tipSize, setTipSize] = useState({ width: 0, height: 0 });

  // update highlight rect on step change
  // We now use the "safe" hook instead of useLayoutEffect directly.
  useIsomorphicLayoutEffect(() => {
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

  const message = index < steps.length ? steps[index].message : "";

  // Measure the tooltip size whenever the step changes
  useIsomorphicLayoutEffect(() => {
    if (tipRef.current) {
      setTipSize({
        width: tipRef.current.offsetWidth,
        height: tipRef.current.offsetHeight,
      });
    }
  }, [index, message]);

  if (index >= steps.length) return null;
  let highlight = {};
  let tip = {};
  if (rect) {
    highlight = {
      top: rect.top + window.scrollY - 4,
      left: rect.left + window.scrollX - 4,
      width: rect.width + 8,
      height: rect.height + 8,
    };
    let top = rect.top + window.scrollY + rect.height + 12;
    let left = rect.left + window.scrollX;
    if (left + tipSize.width > window.innerWidth - 8) {
      left = window.innerWidth - tipSize.width - 8;
    }
    if (left < 8) left = 8;
    if (top + tipSize.height > window.scrollY + window.innerHeight - 8) {
      top = rect.top + window.scrollY - tipSize.height - 12;
    }
    tip = {
      top,
      left,
    };
  }

  const hasRect = !!rect;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      data-tutorial={steps[index]?.targetId}
    >
      <div className="absolute inset-0 bg-black/70" />
      {hasRect && (
        <div
          className="absolute border-2 border-blue-400 rounded-md pointer-events-none animate-pulse ring-2 ring-blue-400"
          style={highlight}
        />
      )}
      <div
        className="absolute bg-white text-black p-2 rounded-md shadow pointer-events-none"
        style={tip}
        ref={tipRef}
      >
        {message}
      </div>
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
