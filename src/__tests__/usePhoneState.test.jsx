import { render, renderHook, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import usePhoneState, { initialPhoneState } from '../hooks/usePhoneState';

function TestComponent() {
  const [state] = usePhoneState();
  return <div data-testid="level">{state.batteryLevel}</div>;
}

test('usePhoneState falls back to defaults with invalid save data', () => {
  localStorage.setItem('survivos-save', '{bad json');
  const { getByTestId } = render(<TestComponent />);
  expect(getByTestId('level').textContent).toBe(String(initialPhoneState.batteryLevel));
});

test('network strength updates on offline event', async () => {
  const { result } = renderHook(() => usePhoneState());
  act(() => {
    window.dispatchEvent(new Event('offline'));
  });
  await waitFor(() => expect(result.current[0].networkStrength).toBe(0));
});

test('loads saved state from localStorage', () => {
  const saved = {
    version: 1,
    unlockedApps: ['map'],
    completedMissions: [],
    installedApps: [],
  };
  localStorage.setItem('survivos-save', JSON.stringify(saved));
  const { result } = renderHook(() => usePhoneState());
  expect(result.current[0].unlockedApps).toContain('map');
});

