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
  const [element, setElement] = useState(null);
  const [missing, setMissing] = useState(false);
  const tipRef = useRef(null);
  const [tipSize, setTipSize] = useState({ width: 0, height: 0 });

  const debug =
    typeof window !== 'undefined' &&
    window.localStorage.getItem('tutorial-debug') === '1';

  // find target element with retries
  useEffect(() => {
    if (index >= steps.length) return;
    setMissing(false);
    setElement(null);
    // Increase retries to better handle slower renders
    // Extend retry window to better handle sluggish renders
    const delays = [0, 100, 500, 1000, 2000, 4000];
    let attempt = 0;
    let timer;
    function search() {
      const el = document.querySelector(
        `[data-tutorial="${steps[index].target}"]`
      );
      if (el) {
        setElement(el);
      } else if (attempt < delays.length - 1) {
        timer = setTimeout(search, delays[++attempt]);
      } else {
        setMissing(true);
      }
    }
    search();
    return () => clearTimeout(timer);
  }, [index, steps]);

  // update highlight rect when element changes
  useIsomorphicLayoutEffect(() => {
    if (element) setRect(element.getBoundingClientRect());
  }, [element]);

  // handle progression
  useEffect(() => {
    if (!element || index >= steps.length) return;
    const { action } = steps[index];
    const handler = () => setIndex((i) => i + 1);
    element.addEventListener(action, handler);
    return () => element.removeEventListener(action, handler);
  }, [element, index, steps]);

  // detect element removal after it was found
  useEffect(() => {
    if (!element) return undefined;
    let frame;
    const check = () => {
      if (!document.contains(element)) {
        setElement(null);
        setMissing(true);
      } else {
        frame = requestAnimationFrame(check);
      }
    };
    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [element]);

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
    <div className="fixed inset-0 z-50 pointer-events-none">
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
        {missing && (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="ml-2 text-xs underline text-blue-600 pointer-events-auto"
          >
            Skip Step
          </button>
        )}
      </div>
      {debug && (
        <div className="absolute bottom-2 left-2 text-xs bg-black/70 text-white p-1 rounded pointer-events-auto">
          Step {index + 1}/{steps.length}: {steps[index].target}
        </div>
      )}
    </div>
  );
};

TutorialOverlay.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      target: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    })
  ).isRequired,
  onComplete: PropTypes.func,
};

export default TutorialOverlay;
