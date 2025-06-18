import { startThreatGenerator } from '../lib/threatGenerator';

function mockRandomSequence(values) {
  let i = 0;
  jest.spyOn(Math, 'random').mockImplementation(() => {
    const val = values[i % values.length];
    i += 1;
    return val;
  });
}

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test('generator invokes callback repeatedly and can stop', () => {
  jest.useFakeTimers();
  const threats = [];
  // deterministic values for type, severity, timeToImpact, target
  mockRandomSequence([0.1, 0.9, 0.5, 0.3]);
  const stop = startThreatGenerator(t => threats.push(t), ['net']);
  expect(threats).toHaveLength(0);
  // run first scheduled threat
  jest.runOnlyPendingTimers();
  expect(threats).toHaveLength(1);
  // run second
  jest.runOnlyPendingTimers();
  expect(threats).toHaveLength(2);
  stop();
  jest.runOnlyPendingTimers();
  expect(threats).toHaveLength(2);
});
