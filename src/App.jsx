import React, { useState } from 'react';
import { loadSettings } from './lib/settings';
import { detectQuality } from './hooks/usePerformance';
import { TutorialProvider } from './hooks/useTutorial';
import MainGameContainer from './components/MainGameContainer';

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const practiceMode = params.has('practice');

  const [settings] = useState(() => loadSettings(detectQuality));

  return (
    <TutorialProvider>
      <MainGameContainer
        practiceMode={practiceMode}
        showPerformance={settings.performance.debugOverlay}
        difficulty={settings.gameplay.difficulty}
        hints={settings.gameplay.hints}
      />
    </TutorialProvider>
  );
};

export default App;
