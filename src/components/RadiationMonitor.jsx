import React, { useEffect, useState, useRef } from 'react';

const randomLevel = () => Math.floor(Math.random() * 10);

const RadiationMonitor = () => {
  const [level, setLevel] = useState(randomLevel());
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationMsg, setCalibrationMsg] = useState('');
  const gaugeRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setLevel(randomLevel()), 3000);
    return () => clearInterval(t);
  }, []);

  const startCalibration = () => {
    setCalibrating(true);
    setCalibrationMsg('');
    gaugeRef.current = 0;
  };

  const press = () => {
    if (!calibrating) return;
    const success = gaugeRef.current >= 4 && gaugeRef.current <= 6;
    setCalibrationMsg(success ? 'Calibrated!' : 'Missed');
    setCalibrating(false);
  };

  useEffect(() => {
    if (!calibrating) return;
    const i = setInterval(() => {
      gaugeRef.current = (gaugeRef.current + 1) % 10;
    }, 200);
    return () => clearInterval(i);
  }, [calibrating]);

  return (
    <div className="p-4 space-y-4" data-testid="radiation-monitor">
      <div className="text-green-400 font-mono text-sm">Radiation Level: {level} Gy</div>
      {level > 6 && (
        <div className="text-red-500 text-sm" data-testid="radiation-warning">
          Danger! Seek shelter.
        </div>
      )}
      <button
        onClick={calibrating ? press : startCalibration}
        className="border border-green-500 text-green-400 rounded px-3 py-1"
      >
        {calibrating ? 'Stop' : 'Calibrate'}
      </button>
      {calibrationMsg && <div className="text-green-400 text-xs">{calibrationMsg}</div>}
      {calibrating && (
        <div className="w-full bg-gray-700 h-2">
          <div className="bg-green-500 h-full" style={{ width: `${gaugeRef.current * 10}%` }} />
        </div>
      )}
      <p className="text-green-400 text-xs">
        Radiation dose is measured in Gray (Gy), equal to one joule per kilogram.
      </p>
    </div>
  );
};

export default RadiationMonitor;
