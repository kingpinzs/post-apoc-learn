import { appRegistry } from '../lib/appRegistry';

test('includes communicator app with required fields', () => {
  const app = appRegistry.communicator;
  expect(app).toMatchObject({
    id: 'communicator',
    category: 'apps',
    isLocked: false,
    launchScreen: 'CommunicatorScreen',
  });
  expect(Array.isArray(app.unlockRequirements)).toBe(true);
});

test('all apps have required properties', () => {
  Object.values(appRegistry).forEach(app => {
    expect(app).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        icon: expect.any(String),
        category: expect.any(String),
        isLocked: expect.any(Boolean),
        unlockRequirements: expect.any(Array),
        description: expect.any(String),
        launchScreen: expect.any(String),
      })
    );
  });
});
