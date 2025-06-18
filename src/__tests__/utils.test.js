import { cn } from '../lib/utils';

test('joins class names', () => {
  expect(cn('foo', 'bar')).toBe('foo bar');
});

test('later classes override earlier ones', () => {
  expect(cn('p-2', 'p-4')).toBe('p-4');
});
