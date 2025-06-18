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

test('rejects missing END block', () => {
  const result = validateScript([start, action]);
  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('Missing END block');
});

test('handles blocks without coordinates', () => {
  const loose = { type: 'ACTION' };
  const res = validateScript([start, loose, end]);
  expect(res.isValid).toBe(true);
});

test('supports string blocks', () => {
  const result = validateScript(['START', 'END']);
  expect(result.isValid).toBe(true);
});

test('detects infinite loop', () => {
  const loop = { id: 4, type: 'LOOP', x: 0, y: 50, parameters: {} };
  const res = validateScript([start, loop, end]);
  expect(res.isValid).toBe(false);
  expect(res.errors.some(e => e.includes('infinite loop'))).toBe(true);
});

test('rejects non-array input', () => {
  const result = validateScript(null);
  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('Invalid script format');
});

test('rejects empty script', () => {
  const result = validateScript([]);
  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('Script is empty');
});

test('errors when END appears before START', () => {
  const earlyEnd = { id: 1, type: 'END', x: 0, y: 0 };
  const lateStart = { id: 2, type: 'START', x: 0, y: 50 };
  const res = validateScript([earlyEnd, lateStart]);
  expect(res.isValid).toBe(false);
  expect(res.errors).toContain('END block occurs before START');
});

test('detects missing parameter values', () => {
  const startBlock = { type: 'START', x: 0, y: 0 };
  const blockWithArray = { type: 'ACTION', x: 0, y: 50, parameters: [{ name: 'foo' }] };
  const blockWithObj = { type: 'END', x: 0, y: 100, parameters: { bar: '' } };
  const res = validateScript([startBlock, blockWithArray, blockWithObj]);
  expect(res.isValid).toBe(false);
  expect(res.errors).toContain('Missing value for foo in block 1');
  expect(res.errors).toContain('Missing value for bar in block 2');
});
