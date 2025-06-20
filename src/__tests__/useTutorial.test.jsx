import { renderHook, act, waitFor, fireEvent } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TutorialProvider, useTutorial } from '../hooks/useTutorial';
import { tutorialMissions } from '../lib/tutorialSystem';
import React from 'react';

describe('useTutorial hook', () => {
  test('autoStart begins first mission', () => {
    const wrapper = ({ children }) => <TutorialProvider>{children}</TutorialProvider>;
    const { result } = renderHook(() => useTutorial(), { wrapper });
    expect(result.current.activeMission).toBe(tutorialMissions[0].id);
  });

  test('skipTutorial marks all missions complete', () => {
    console.log('[TUTORIAL TEST] ==> Running "skipTutorial" test...');
    const wrapper = ({ children }) => <TutorialProvider>{children}</TutorialProvider>;
    const { result } = renderHook(() => useTutorial(), { wrapper });
    act(() => result.current.skipTutorial());
    expect(result.current.completed).toEqual(tutorialMissions.map(m => m.id));
    console.log('[TUTORIAL TEST] ==> Finished "skipTutorial" test.');
  });

  test('showHelp displays tutorial overlay', () => {
    console.log('[TUTORIAL TEST] ==> Running "showHelp" test...');
    const Test = () => {
      const { showHelp } = useTutorial();
      React.useEffect(() => {
        showHelp('target', 'Help message');
      }, [showHelp]);
      return <button data-tutorial="target">Target</button>;
    };
    render(
      <TutorialProvider autoStart={false}>
        <Test />
      </TutorialProvider>
    );
    expect(screen.getByText('Help message')).toBeInTheDocument();
    console.log('[TUTORIAL TEST] ==> Finished "showHelp" test.');
  });

  test('showHelp overlay completes on action', () => {
    const Test = () => {
      const { showHelp } = useTutorial();
      React.useEffect(() => {
        showHelp('target', 'Help message');
      }, [showHelp]);
      return <button data-tutorial="target">Target</button>;
    };
    render(
      <TutorialProvider autoStart={false}>
        <Test />
      </TutorialProvider>
    );
    const btn = screen.getByRole('button');
    act(() => {
      btn.click();
    });
    return waitFor(() => {
      expect(screen.queryByText('Help message')).not.toBeInTheDocument();
    });
  });

  test('startMission activates a mission', () => {
    const wrapper = ({ children }) => <TutorialProvider>{children}</TutorialProvider>;
    const { result } = renderHook(() => useTutorial(), { wrapper });
    act(() => result.current.startMission(tutorialMissions[0].id));
    expect(result.current.activeMission).toBe(tutorialMissions[0].id);
  });
});