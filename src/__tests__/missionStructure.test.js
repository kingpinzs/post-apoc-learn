import { sampleMission } from '../lib/missionStructure';

/** Basic shape validation for the mission structure */
test('sample mission has required properties', () => {
  expect(sampleMission).toHaveProperty('id');
  expect(sampleMission).toHaveProperty('name');
  expect(sampleMission).toHaveProperty('briefing');
  expect(sampleMission).toHaveProperty('objectives');
  expect(sampleMission).toHaveProperty('unlockReward');
  expect(sampleMission).toHaveProperty('requiredApps');
  expect(Array.isArray(sampleMission.objectives)).toBe(true);
  sampleMission.objectives.forEach((obj) => {
    expect(obj).toHaveProperty('id');
    expect(obj).toHaveProperty('description');
    expect(obj).toHaveProperty('type');
    expect(obj).toHaveProperty('target');
    expect(obj).toHaveProperty('completed');
  });
});
