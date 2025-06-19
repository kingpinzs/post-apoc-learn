import { DIFFICULTY_PRESETS } from '../lib/difficulties';

test('difficulty presets include expected levels', () => {
  expect(Object.keys(DIFFICULTY_PRESETS)).toEqual(
    expect.arrayContaining(['Rookie', 'Operative', 'Elite', 'Survival'])
  );
});
