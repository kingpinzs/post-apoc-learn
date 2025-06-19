import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Smartphone, X } from 'lucide-react';
import PhoneFrame from './PhoneFrame';
import HomeScreen from './HomeScreen';
import ApocalypseGame from './Game';
import PerformanceOverlay from './PerformanceOverlay';
import AppIntegration from './AppIntegration';
import usePhoneState from '../hooks/usePhoneState';

const MainGameContainer = ({ practiceMode = false, showPerformance = false, difficulty = 'Operative', hints = true }) => {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneState] = usePhoneState();

  return (
    <div className="relative w-full h-full">
      <AppIntegration>
        <ApocalypseGame practice={practiceMode} difficulty={difficulty} hints={hints} />
        <PerformanceOverlay show={showPerformance} />
      </AppIntegration>
      <button
        type="button"
        onClick={() => setPhoneOpen(true)}
        className="fixed bottom-2 right-2 z-30 p-1 bg-gray-800 text-green-400 rounded"
        data-testid="phone-toggle"
        aria-label="Open phone"
      >
        <Smartphone className="w-5 h-5" />
      </button>
      {phoneOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
          data-testid="phone-overlay"
        >
          <div className="relative w-full max-w-xs h-full">
            <PhoneFrame
              batteryLevel={phoneState.batteryLevel}
              networkStrength={phoneState.networkStrength}
              threatLevel={phoneState.activeThreats.length}
            >
              <HomeScreen />
            </PhoneFrame>
            <button
              type="button"
              onClick={() => setPhoneOpen(false)}
              className="absolute top-2 right-2 z-50 p-1 bg-gray-800 text-green-400 rounded"
              data-testid="close-phone"
              aria-label="Close phone"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

MainGameContainer.propTypes = {
  practiceMode: PropTypes.bool,
  showPerformance: PropTypes.bool,
  difficulty: PropTypes.string,
  hints: PropTypes.bool,
};

export default MainGameContainer;
