import React, { useEffect, useState } from 'react';
import MissionBriefing from './MissionBriefing';
import missions from '../data/missions';
import usePhoneState from '../hooks/usePhoneState';

const STORAGE_KEY = 'survivos-mission-progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { active: null, completed: [], objectives: {} };
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.completed) &&
      typeof parsed.objectives === 'object'
    ) {
      return { active: parsed.active || null, completed: parsed.completed, objectives: parsed.objectives };
    }
  } catch {
    /* ignore */
  }
  return { active: null, completed: [], objectives: {} };
}

function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const MissionManager = () => {
  const [phoneState, setPhoneState] = usePhoneState();
  const [state, setState] = useState(() => loadProgress());
  const activeMission = missions.find((m) => m.id === state.active);

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  const startNextMission = () => {
    if (state.active) return;
    const next = missions.find((m) => !state.completed.includes(m.id));
    if (next) {
      setState((prev) => ({
        ...prev,
        active: next.id,
        objectives: {
          ...prev.objectives,
          [next.id]: next.objectives.map(() => false),
        },
      }));
    }
  };

  const completeObjective = (index) => {
    if (!activeMission) return;
    setState((prev) => {
      const prog = prev.objectives[prev.active].slice();
      prog[index] = true;
      const newState = {
        ...prev,
        objectives: { ...prev.objectives, [prev.active]: prog },
      };
      const done = prog.every(Boolean);
      if (done) {
        newState.completed = [...prev.completed, prev.active];
        newState.active = null;
        const reward = activeMission.reward;
        setPhoneState((ps) => {
          const notifications = [
            ...ps.notifications,
            {
              id: `${activeMission.id}-done`,
              message: `${activeMission.title} completed`,
              type: 'mission',
              timestamp: Date.now(),
            },
          ];
          let unlockedApps = ps.unlockedApps;
          if (reward && !ps.unlockedApps.includes(reward)) {
            unlockedApps = [...ps.unlockedApps, reward];
            notifications.push({
              id: `${activeMission.id}-reward`,
              message: `${reward} unlocked`,
              type: 'reward',
              timestamp: Date.now(),
            });
          }
          return { ...ps, unlockedApps, notifications };
        });
      }
      return newState;
    });
  };

  if (!activeMission) {
    return (
      <div className="p-4 space-y-2" data-testid="mission-manager">
        <button
          type="button"
          onClick={startNextMission}
          className="border border-green-500 text-green-400 rounded px-3 py-1"
          data-testid="start-next"
        >
          Start Next Mission
        </button>
      </div>
    );
  }

  const progress = state.objectives[state.active] || [];

  return (
    <div className="p-4 space-y-2" data-testid="mission-manager">
      <MissionBriefing mission={activeMission} />
      <ul className="space-y-1">
        {activeMission.objectives.map((obj, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={progress[idx]}
              onChange={() => completeObjective(idx)}
              className="form-checkbox"
              data-testid={`objective-${idx}`}
            />
            <span className="text-green-200">{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissionManager;
