import { useState, useEffect, useRef } from 'react';

export function detectQuality() {
  const mem = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  if (mem <= 2 || cores <= 2) return 'Low';
  if (mem <= 4 || cores <= 4) return 'Medium';
  return 'High';
}

export function useRenderCount() {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}

export default function usePerformance() {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState(0);
  const last = useRef(performance.now());
  const frames = useRef(0);

  useEffect(() => {
    let id;
    const loop = () => {
      frames.current += 1;
      const now = performance.now();
      if (now >= last.current + 1000) {
        setFps(frames.current);
        frames.current = 0;
        last.current = now;
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (performance.memory) {
        setMemory(performance.memory.usedJSHeapSize / 1048576);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { fps, memory };
}
