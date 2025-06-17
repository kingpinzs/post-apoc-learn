import { validateScript } from '../lib/scriptValidator';

const start = { id: 1, type: 'START', x: 0, y: 0, parameters: {} };
const action = { id: 2, type: 'ACTION', x: 0, y: 50, parameters: { foo: 'bar' } };
const end = { id: 3, type: 'END', x: 0, y: 100, parameters: {} };

test('accepts valid script', () => {
  const result = validateScript([start, action, end]);
  expect(result.isValid).toBe(true);
});

test('rejects missing START', () => {
  const result = validateScript([action, end]);
  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('Missing START block');
});

test('rejects invalid connections', () => {
  const bad = { ...action, x: 50 };
  const result = validateScript([start, bad, end]);
  expect(result.isValid).toBe(false);
});

test('detects infinite loop', () => {
  const loop = { id: 4, type: 'LOOP', x: 0, y: 50, parameters: {} };
  const res = validateScript([start, loop, end]);
  expect(res.isValid).toBe(false);
  expect(res.errors.some(e => e.includes('infinite loop'))).toBe(true);
});
