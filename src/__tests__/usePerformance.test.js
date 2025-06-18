import { renderHook, act } from '@testing-library/react';
import { detectQuality, useRenderCount } from '../hooks/usePerformance';

describe('detectQuality', () => {
  const originalMemory = Object.getOwnPropertyDescriptor(navigator, 'deviceMemory');
  const originalCores = Object.getOwnPropertyDescriptor(navigator, 'hardwareConcurrency');

  function mockHW(mem, cores) {
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: mem });
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: cores });
  }

  afterEach(() => {
    if (originalMemory) Object.defineProperty(navigator, 'deviceMemory', originalMemory);
    if (originalCores) Object.defineProperty(navigator, 'hardwareConcurrency', originalCores);
  });

  test('returns Low for weak hardware', () => {
    mockHW(1, 1);
    expect(detectQuality()).toBe('Low');
  });

  test('returns Medium for mid hardware', () => {
    mockHW(3, 3);
    expect(detectQuality()).toBe('Medium');
  });

  test('returns High for strong hardware', () => {
    mockHW(8, 8);
    expect(detectQuality()).toBe('High');
  });
});

describe('useRenderCount', () => {
  test('increments on each render', () => {
    const { result, rerender } = renderHook(() => useRenderCount());
    expect(result.current).toBe(1);
    rerender();
    expect(result.current).toBe(2);
  });
});
