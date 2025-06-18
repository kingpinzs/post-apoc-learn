import React, { useState } from 'react';
import PhoneFrame from './components/PhoneFrame';
import HomeScreen from './components/HomeScreen';
import NetworkScanner from './components/NetworkScanner';
import PortScanner from './components/PortScanner';
import FirewallApp from './components/FirewallApp';
import CommunicatorScreen from './components/CommunicatorScreen';
import MapScreen from './components/MapScreen';
import DroneScreen from './components/DroneScreen';
import ScannerScreen from './components/ScannerScreen';
import TerminalScreen from './components/TerminalScreen';
import DecryptorScreen from './components/DecryptorScreen';
import { ScriptBuilderScreen } from './components/scriptbuilder';
import HandbookScreen from './components/HandbookScreen';
import StatsScreen from './components/StatsScreen';
import LogScreen from './components/LogScreen';
import TrophyRoomScreen from './components/TrophyRoomScreen';
import SecurityTrainingApp from './components/SecurityTrainingApp';
import SettingsScreen from './components/SettingsScreen';
import { TutorialProvider } from "./hooks/useTutorial";
import usePhoneState from './hooks/usePhoneState';

const appComponents = {
  communicator: CommunicatorScreen,
  map: MapScreen,
  droneControl: DroneScreen,
  scanner: ScannerScreen,
  terminal: TerminalScreen,
  decryptor: DecryptorScreen,
  scriptBuilder: ScriptBuilderScreen,
  handbook: HandbookScreen,
  worldStats: StatsScreen,
  signalLog: LogScreen,
  trophyRoom: TrophyRoomScreen,
  securityTraining: SecurityTrainingApp,
  networkScanner: NetworkScanner,
  portScanner: PortScanner,
  firewall: FirewallApp,
  settings: SettingsScreen,
};

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const practiceMode = params.has('practice');

  const [phoneState] = usePhoneState();
  const [currentApp, setCurrentApp] = useState(null);
  const [appProps, setAppProps] = useState({});
  const [animating, setAnimating] = useState(false);

  const handleLaunchApp = (appId, props = {}) => {
    setAnimating(true);
    setCurrentApp(appId);
    setAppProps(props);
    setTimeout(() => setAnimating(false), 300);
  };

  const handleBack = () => {
    setAnimating(true);
    setCurrentApp(null);
    setAppProps({});
    setTimeout(() => setAnimating(false), 300);
  };

  const Active = currentApp ? appComponents[currentApp] : null;

  return (<TutorialProvider>
  
    <PhoneFrame
      batteryLevel={phoneState.batteryLevel}
      networkStrength={phoneState.networkStrength}
      threatLevel={phoneState.activeThreats.length}
    >
      <div className="relative h-full overflow-hidden">
        <div
          className={`absolute inset-0 transition-transform duration-300 ${
            currentApp ? '-translate-x-full' : 'translate-x-0'
          } ${animating ? '' : ''}`}
        >
          <HomeScreen onLaunchApp={handleLaunchApp} />
        </div>
        {Active && (
          <div
            className={`absolute inset-0 transition-transform duration-300 ${
              currentApp ? 'translate-x-0' : 'translate-x-full'
            } ${animating ? '' : ''}`}
            data-testid="active-app"
          >
            <div className="flex flex-col h-full">
              <button
                type="button"
                onClick={handleBack}
                className="m-2 px-2 py-1 border border-green-500 text-green-400 rounded"
                data-testid="back-button"
              >
                Back
              </button>
              <Active
                practice={practiceMode}
                onLaunchApp={handleLaunchApp}
                {...appProps}
              />
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  </TutorialProvider>
);
};

export default App;
