import { loadSettings, saveSettings, defaultSettings } from '../lib/settings';

beforeEach(() => {
  localStorage.clear();
});

test('loadSettings merges saved settings and applies detectQuality', () => {
  localStorage.setItem('survivos-settings', JSON.stringify({ display: { brightness: 50 } }));
  const detect = jest.fn(() => 'Low');
  const settings = loadSettings(detect);
  expect(settings.display.brightness).toBe(50);
  expect(settings.performance.quality).toBe('Low');
});

test('loadSettings returns defaults on invalid data', () => {
  localStorage.setItem('survivos-settings', '{bad');
  const settings = loadSettings();
  expect(settings.audio.masterVolume).toBe(defaultSettings.audio.masterVolume);
});

test('saveSettings writes to storage and ignores errors', () => {
  saveSettings({ foo: 'bar' });
  expect(localStorage.getItem('survivos-settings')).toContain('foo');
  const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('fail'); });
  expect(() => saveSettings({})).not.toThrow();
  spy.mockRestore();
});
