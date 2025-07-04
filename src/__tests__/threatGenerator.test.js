import {
  generateThreat,
  computeNextDifficulty,
  recordPerformance,
  resetPerformance,
} from '../lib/threatGenerator';

const components = ['net', 'db'];

function mockRandomSequence(values) {
  let i = 0;
  jest.spyOn(Math, 'random').mockImplementation(() => {
    const val = values[i % values.length];
    i += 1;
    return val;
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('generates threat with required properties', () => {
  mockRandomSequence([0, 0, 0, 0]);
  const threat = generateThreat(1, components);
  expect(threat).toHaveProperty('id');
  expect(threat).toHaveProperty('type');
  expect(threat).toHaveProperty('severity');
  expect(threat).toHaveProperty('timeToImpact');
  expect(threat).toHaveProperty('target');
  expect(['malware', 'phishing', 'bruteforce', 'backdoor']).toContain(threat.type);
  expect(threat.severity).toBeGreaterThanOrEqual(1);
  expect(threat.severity).toBeLessThanOrEqual(5);
  expect(components).toContain(threat.target);
});

test('higher difficulty increases severity', () => {
  mockRandomSequence([0.9, 0.9, 0, 0]);
  const low = generateThreat(1, components);
  const high = generateThreat(5, components);
  expect(high.severity).toBeGreaterThan(low.severity);
});

test('bounds severity and timeToImpact', () => {
  mockRandomSequence([0.5, 0.1, 0, 0]);
  const threat = generateThreat(-3, ['x']);
  expect(threat.severity).toBe(1);
  expect(threat.timeToImpact).toBeGreaterThanOrEqual(5);
});

describe('dynamic difficulty', () => {
  beforeEach(() => {
    resetPerformance();
  });

  test('computeNextDifficulty increases on high success', () => {
    for (let i = 0; i < 5; i += 1) {
      recordPerformance({ success: true, time: 5, damage: 0 });
    }
    const next = computeNextDifficulty(1);
    expect(next).toBeGreaterThan(1);
  });

  test('computeNextDifficulty decreases when failing', () => {
    for (let i = 0; i < 5; i += 1) {
      recordPerformance({ success: false, time: 25, damage: 30 });
    }
    const next = computeNextDifficulty(3);
    expect(next).toBeLessThan(3);
  });
});
