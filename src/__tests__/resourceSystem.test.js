import {
  allocateResources,
  freeResources,
  getUsage,
  systemCrashed,
  resetResources,
} from '../lib/resourceSystem';

beforeEach(() => {
  resetResources();
});

test('allocates and frees resources', () => {
  allocateResources('app1', { cpu: 10, ram: 20, bandwidth: 5 });
  expect(getUsage()).toEqual({ cpu: 10, ram: 20, bandwidth: 5 });
  freeResources('app1');
  expect(getUsage()).toEqual({ cpu: 0, ram: 0, bandwidth: 0 });
});

test('system crashes when usage reaches limit', () => {
  allocateResources('app2', { cpu: 100 });
  expect(systemCrashed()).toBe(true);
});

test('no allocation occurs after crash', () => {
  allocateResources('app2', { cpu: 100 });
  expect(systemCrashed()).toBe(true);
  allocateResources('app3', { cpu: 10 });
  expect(getUsage().cpu).toBe(100);
});
