import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import TutorialOverlay from '../components/TutorialOverlay';
import { tutorialMissions, loadProgress, saveProgress } from '../lib/tutorialSystem';

const TutorialContext = createContext(null);

export const TutorialProvider = ({ children, autoStart = true }) => {
  const [state, setState] = useState(() => loadProgress());
  const [helpSteps, setHelpSteps] = useState(null);

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  const startMission = (id) => {
    setState({ ...state, activeMission: id });
  };

  const skipTutorial = useCallback(() => {
    setState({ completed: tutorialMissions.map((m) => m.id), activeMission: null });
  }, []);

  const resume = () => {
    if (state.activeMission) return;
    const next = tutorialMissions.find((m) => !state.completed.includes(m.id));
    if (next) setState({ ...state, activeMission: next.id });
  };

  const showHelp = useCallback((targetId, message) => {
    setHelpSteps([{ targetId, message, action: 'click' }]);
  }, []);

  useEffect(() => {
    if (autoStart) {
      resume();
    }
  }, [autoStart]);

  const activeMission = tutorialMissions.find((m) => m.id === state.activeMission);

  const handleMissionComplete = () => {
    setState((prev) => ({
      completed: [...prev.completed, prev.activeMission],
      activeMission: null,
    }));
  };

  return (
    <TutorialContext.Provider value={{ ...state, startMission, skipTutorial, resume, showHelp }}>
      {children}
      {activeMission && (
        <TutorialOverlay key={activeMission.id} steps={activeMission.steps} onComplete={handleMissionComplete} />
      )}
      {helpSteps && !activeMission && (
        <TutorialOverlay key="help" steps={helpSteps} onComplete={() => setHelpSteps(null)} />
      )}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => useContext(TutorialContext);
