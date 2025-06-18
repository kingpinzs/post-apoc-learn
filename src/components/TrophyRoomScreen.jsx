import React from 'react';
import * as Icons from 'lucide-react';
import { ACHIEVEMENTS } from '../lib/achievements';
import useAchievements from '../hooks/useAchievements';

const TrophyRoomScreen = () => {
  const { progress } = useAchievements() || { progress: {} };
  const overall =
    ACHIEVEMENTS.reduce((a, c) => a + (progress[c.id] || 0), 0) /
    ACHIEVEMENTS.length;

  return (
    <div className="p-4 space-y-3 overflow-auto text-green-400">
      <div className="text-sm">Overall Completion: {overall.toFixed(0)}%</div>
      {ACHIEVEMENTS.map((a) => {
        const Icon = Icons[a.icon] || Icons.Award;
        const value = progress[a.id] || 0;
        return (
          <div
            key={a.id}
            className="border border-green-500/30 rounded p-2 flex items-center space-x-2"
          >
            <Icon
              className={`w-6 h-6 ${value >= 100 ? 'text-yellow-400' : 'text-gray-500'}`}
            />
            <div className="flex-1">
              <div className="font-bold text-xs">{a.name}</div>
              <div className="text-xs opacity-75">{a.description}</div>
              <div className="h-1 bg-green-900 rounded mt-1">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-right w-12">{value}%</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrophyRoomScreen;
