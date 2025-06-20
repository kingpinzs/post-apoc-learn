import React, { useState, useEffect } from 'react';
import { loadSettings } from './lib/settings';
import { detectQuality } from './hooks/usePerformance';
import { TutorialProvider } from './hooks/useTutorial';
import MainGameContainer from './components/MainGameContainer';
import HomeScreen from './components/HomeScreen';
import StatsScreen from './components/StatsScreen';
import SecurityTrainingApp from './components/SecurityTrainingApp';
import SettingsScreen from './components/SettingsScreen';
import BottomTabs from './components/BottomTabs';

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const practiceMode = params.has('practice');

  const [settings] = useState(() => loadSettings(detectQuality));
  const [activeTab, setActiveTab] = useState('game');

  useEffect(() => {
    const handler = (e) => {
      if (e.state && e.state.tab) setActiveTab(e.state.tab);
    };
    window.addEventListener('popstate', handler);
    window.history.replaceState({ tab: 'game' }, '');
    return () => window.removeEventListener('popstate', handler);
  }, []);

  useEffect(() => {
    window.history.pushState({ tab: activeTab }, '');
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'tools':
        return <HomeScreen />;
      case 'learn':
        return <SecurityTrainingApp practice={practiceMode} />;
      case 'stats':
        return <StatsScreen />;
      case 'menu':
        return <SettingsScreen />;
      default:
        return (
          <MainGameContainer
            practiceMode={practiceMode}
            showPerformance={settings.performance.debugOverlay}
            difficulty={settings.gameplay.difficulty}
            hints={settings.gameplay.hints}
          />
        );
    }
  };

  return (
    <TutorialProvider>
      {renderTab()}
      <BottomTabs active={activeTab} onChange={setActiveTab} />
    </TutorialProvider>
  );
};

export default App;
