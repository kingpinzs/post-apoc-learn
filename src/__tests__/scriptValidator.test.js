import { validateScript } from '../lib/scriptValidator';

test('accepts valid script', () => {
  const result = validateScript(['init', 'step', 'end']);
  expect(result.valid).toBe(true);
});

test('rejects missing init', () => {
  const result = validateScript(['step', 'end']);
  expect(result.valid).toBe(false);
});

test('rejects too long script', () => {
  const cmds = ['init', ...Array(9).fill('step'), 'end'];
  const result = validateScript(cmds);
  expect(result.valid).toBe(false);
});
