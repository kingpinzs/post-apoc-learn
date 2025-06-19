import React, { useState } from 'react';
import { loadSettings } from './lib/settings';
import { detectQuality } from './hooks/usePerformance';
import PhoneFrame from './components/PhoneFrame';
import PerformanceOverlay from './components/PerformanceOverlay';
import ApocalypseGame from './components/Game';
import AppIntegration from './components/AppIntegration';
import { TutorialProvider } from './hooks/useTutorial';
import usePhoneState from './hooks/usePhoneState';

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const practiceMode = params.has('practice');

  const [phoneState] = usePhoneState();
  const [settings] = useState(() => loadSettings(detectQuality));

  return (
    <TutorialProvider>
      <PhoneFrame
        batteryLevel={phoneState.batteryLevel}
        networkStrength={phoneState.networkStrength}
        threatLevel={phoneState.activeThreats.length}
        gameMode={true}
      >
        <AppIntegration>
          <ApocalypseGame practice={practiceMode} />
          <PerformanceOverlay show={settings.performance.debugOverlay} />
        </AppIntegration>
      </PhoneFrame>
    </TutorialProvider>
  );
};

export default App;
