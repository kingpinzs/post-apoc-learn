export const THREAT_TYPES = ['malware', 'phishing', 'bruteforce', 'backdoor'];
export const DEFAULT_COMPONENTS = ['network', 'database', 'services', 'kernel'];

let nextId = 1;

export function generateThreat(difficulty = 1, components = DEFAULT_COMPONENTS) {
  const type = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
  const severity = Math.min(5, Math.max(1, Math.ceil(Math.random() * difficulty)));
  const timeToImpact = Math.max(5, Math.floor(30 - difficulty * 2 + Math.random() * 5));
  const target = components[Math.floor(Math.random() * components.length)];
  return {
    id: nextId++,
    type,
    severity,
    timeToImpact,
    target,
  };
}

export function startThreatGenerator(callback, components = DEFAULT_COMPONENTS) {
  let difficulty = 1;
  let active = true;
  let timeoutId;

  function schedule() {
    if (!active) return;
    const delay = 10000 + Math.random() * 20000;
    timeoutId = setTimeout(() => {
      const threat = generateThreat(difficulty, components);
      difficulty += 0.5;
      callback(threat);
      schedule();
    }, delay);
  }

  schedule();

  return () => {
    active = false;
    clearTimeout(timeoutId);
  };
}
