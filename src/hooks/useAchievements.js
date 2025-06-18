import React, { createContext, useContext, useEffect, useState } from 'react';
import { ACHIEVEMENTS } from '../lib/achievements';

const STORAGE_KEY = 'survivos-achievements';

const AchievementsContext = createContext(null);

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const AchievementsProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => loadProgress());
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addProgress = (id, amount = 1) => {
    setProgress((prev) => {
      const current = prev[id] || 0;
      const next = Math.min(100, current + amount);
      if (current < 100 && next >= 100) {
        const def = ACHIEVEMENTS.find((a) => a.id === id);
        if (def) {
          // Only push the achievement if it is not already queued for display
          setRecent((list) =>
            list.some((item) => item.id === def.id) ? list : [...list, def]
          );
          setTimeout(() =>
            setRecent((r) => r.filter((d) => d.id !== id)),
          5000);
        }
      }
      return { ...prev, [id]: next };
    });
  };

  const value = {
    progress,
    addProgress,
  };

  return (
    <AchievementsContext.Provider value={value}>
      {children}
      <div className="absolute top-2 right-2 space-y-2 z-50">
        {recent.map((a) => (
          <div
            key={a.id}
            className="bg-black/80 text-green-400 border border-green-600 px-3 py-2 rounded shadow"
          >
            Achievement Unlocked: {a.name}
          </div>
        ))}
      </div>
    </AchievementsContext.Provider>
  );
};

export default function useAchievements() {
  return useContext(AchievementsContext);
}