export const THREAT_TYPES = ['malware', 'phishing', 'bruteforce', 'backdoor'];
export const DEFAULT_COMPONENTS = ['network', 'database', 'services', 'kernel'];

let nextId = 1;

/**
 * Track player performance for dynamic difficulty adjustments.
 * @type {{successes:number, failures:number, totalTime:number, damage:number}}
 */
let performance = {
  successes: 0,
  failures: 0,
  totalTime: 0,
  damage: 0,
};

/**
 * Resets performance metrics. Primarily for testing.
 */
export function resetPerformance() {
  performance = { successes: 0, failures: 0, totalTime: 0, damage: 0 };
}

/**
 * Records the outcome of a resolved threat.
 * @param {Object} result
 * @param {boolean} result.success - Whether the threat was stopped
 * @param {number} [result.time=0] - Time taken to resolve the threat
 * @param {number} [result.damage=0] - Health lost while resolving
 */
export function recordPerformance({ success, time = 0, damage = 0 }) {
  if (success) performance.successes += 1; else performance.failures += 1;
  performance.totalTime += time;
  performance.damage += damage;
}

/**
 * Determine the next difficulty level based on player performance.
 * @param {number} current
 * @returns {number}
 */
export function computeNextDifficulty(current) {
  const attempts = performance.successes + performance.failures;
  if (attempts === 0) {
    return current + 0.25;
  }
  const successRate = performance.successes / attempts;
  const avgTime = performance.successes
    ? performance.totalTime / performance.successes
    : Infinity;
  const avgDamage = performance.damage / attempts;

  let next = current;
  if (successRate > 0.8 && avgTime < 10 && avgDamage < 5) {
    next += 1;
  } else if (successRate < 0.5 || avgTime > 20 || avgDamage > 15) {
    next -= 0.5;
  } else {
    next += 0.25;
  }
  return Math.max(1, next);
}

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
      difficulty = computeNextDifficulty(difficulty);
      const threat = generateThreat(difficulty, components);
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
