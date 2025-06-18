import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TutorialProvider, useTutorial } from '../hooks/useTutorial';
import { tutorialMissions } from '../lib/tutorialSystem';
import React from 'react';

describe('useTutorial hook', () => {
  test('resume starts first incomplete mission', () => {
    const wrapper = ({ children }) => <TutorialProvider>{children}</TutorialProvider>;
    const { result } = renderHook(() => useTutorial(), { wrapper });
    act(() => result.current.resume());
    expect(result.current.activeMission).toBe(tutorialMissions[0].id);
  });

  test('skipTutorial marks all missions complete', () => {
    const wrapper = ({ children }) => <TutorialProvider>{children}</TutorialProvider>;
    const { result } = renderHook(() => useTutorial(), { wrapper });
    act(() => result.current.skipTutorial());
    expect(result.current.completed).toEqual(tutorialMissions.map(m => m.id));
  });

  test('showHelp displays tutorial overlay', () => {
    const Test = () => {
      const { showHelp } = useTutorial();
      React.useEffect(() => {
        showHelp('target', 'Help message');
      }, [showHelp]);
      return <button id="target">Target</button>;
    };
    render(
      <TutorialProvider>
        <Test />
      </TutorialProvider>
    );
    expect(screen.getByText('Help message')).toBeInTheDocument();
  });
});
