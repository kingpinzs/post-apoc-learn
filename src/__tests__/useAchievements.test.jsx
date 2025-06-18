import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import useAchievements, { AchievementsProvider } from '../hooks/useAchievements';

const wrapper = ({ children }) => <AchievementsProvider>{children}</AchievementsProvider>;

describe('useAchievements', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loads initial progress from localStorage', () => {
    localStorage.setItem('survivos-achievements', JSON.stringify({ 'boot-sequence': 20 }));
    const { result } = renderHook(() => useAchievements(), { wrapper });
    expect(result.current.progress['boot-sequence']).toBe(20);
  });

  test('addProgress updates progress and saves', () => {
    const { result } = renderHook(() => useAchievements(), { wrapper });
    act(() => result.current.addProgress('boot-sequence', 40));
    expect(result.current.progress['boot-sequence']).toBe(40);
    expect(JSON.parse(localStorage.getItem('survivos-achievements'))['boot-sequence']).toBe(40);
  });

  test('handles malformed JSON in storage', () => {
    localStorage.setItem('survivos-achievements', '{bad json');
    const { result } = renderHook(() => useAchievements(), { wrapper });
    expect(result.current.progress).toEqual({});
  });

  test('achievement notification appears once when completed multiple times', async () => {
    jest.useFakeTimers();
    function Test() {
      const { addProgress } = useAchievements();
      return <button onClick={() => addProgress('boot-sequence', 100)}>go</button>;
    }
    render(
      <AchievementsProvider>
        <Test />
      </AchievementsProvider>
    );
    const btn = screen.getByRole('button');
    act(() => { btn.click(); });
    expect(await screen.findByText('Achievement Unlocked: Boot Sequence')).toBeInTheDocument();
    act(() => { btn.click(); });
    expect(screen.getAllByText('Achievement Unlocked: Boot Sequence')).toHaveLength(1);
    act(() => jest.runAllTimers());
    expect(screen.queryByText('Achievement Unlocked: Boot Sequence')).not.toBeInTheDocument();
    jest.useRealTimers();
  });
});
