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
import SecurityTrainingApp from './components/SecurityTrainingApp';
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
  securityTraining: SecurityTrainingApp,
  networkScanner: NetworkScanner,
  portScanner: PortScanner,
  firewall: FirewallApp,
};

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const practiceMode = params.has('practice');

  const [phoneState] = usePhoneState();
  const [currentApp, setCurrentApp] = useState(null);

  const handleLaunchApp = (appId) => {
    setCurrentApp(appId);
  };

  const handleBack = () => {
    setCurrentApp(null);
  };

  const Active = currentApp ? appComponents[currentApp] : null;

  return (
    <PhoneFrame
      batteryLevel={phoneState.batteryLevel}
      networkStrength={phoneState.networkStrength}
      threatLevel={phoneState.activeThreats.length}
    >
      {!Active && <HomeScreen onLaunchApp={handleLaunchApp} />}
      {Active && (
        <div className="flex flex-col h-full" data-testid="active-app">
          <button
            type="button"
            onClick={handleBack}
            className="m-2 px-2 py-1 border border-green-500 text-green-400 rounded"
            data-testid="back-button"
          >
            Back
          </button>
          <Active practice={practiceMode} />
        </div>
      )}
    </PhoneFrame>
  );
};

export default App;
