import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Displays a list of active threats with countdown timers.
 * Flashes red when a critical threat is present.
 *
 * @param {{
 *  threats: {id:string|number,type:string,severity:number,timeRemaining:number}[],
 *  onThreatClick?: Function
 * }} props
 */
const ThreatIndicator = ({ threats = [], onThreatClick }) => {
  const [localThreats, setLocalThreats] = useState(() =>
    threats.map((t) => ({ ...t }))
  );

  useEffect(() => {
    setLocalThreats(threats.map((t) => ({ ...t })));
  }, [threats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalThreats((ts) =>
        ts.map((t) => ({
          ...t,
          timeRemaining: Math.max(0, t.timeRemaining - 1),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...localThreats].sort((a, b) => {
    if (b.severity !== a.severity) return b.severity - a.severity;
    return a.timeRemaining - b.timeRemaining;
  });

  const critical = sorted.some((t) => t.severity >= 4 || t.severity >= 80);

  return (
    <div
      data-testid="threat-indicator"
      data-tutorial="threat-indicator"
      onClick={onThreatClick}
      className={cn(
        'border p-2 rounded text-green-400 cursor-pointer select-none',
        critical && 'border-red-500 text-red-400 animate-pulse'
      )}
    >
      <div className="flex items-center justify-between">
        <span>Threats: {sorted.length}</span>
        {critical && <AlertTriangle className="w-4 h-4" />}
      </div>
      <ul className="mt-1 space-y-1 text-xs">
        {sorted.map((t) => (
          <li key={t.id} className="flex justify-between">
            <span>
              {t.type} (s{t.severity})
            </span>
            <span>{t.timeRemaining}s</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

ThreatIndicator.propTypes = {
  threats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      severity: PropTypes.number.isRequired,
      timeRemaining: PropTypes.number.isRequired,
    })
  ),
  onThreatClick: PropTypes.func,
};

export default ThreatIndicator;
