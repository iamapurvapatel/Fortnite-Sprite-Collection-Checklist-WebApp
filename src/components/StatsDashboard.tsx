import React from 'react';
import { Sprite } from '../types';

interface StatsDashboardProps {
  sprites: Sprite[];
  obtainedIds: string[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  sprites,
  obtainedIds,
}) => {
  const totalCount = sprites.filter((s) => !s.unreleased).length;
  const obtainedCount = sprites.filter((s) => !s.unreleased && obtainedIds.includes(s.id)).length;
  const totalPercentage = totalCount > 0 ? Math.round((obtainedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full">
      <div className="bg-[#FFF6E6] dark:bg-zinc-900/30 border border-[#F1E4C6] dark:border-white/5 rounded-xl py-2.5 px-4 flex flex-row items-center justify-between gap-4 shadow-[0_8px_24px_rgba(180,120,20,0.06)] dark:shadow-none">
        {/* Metric Label */}
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-[#A38F72] dark:text-zinc-500 uppercase tracking-wider">
            Progress
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#221A12] dark:text-zinc-100 truncate">
            {obtainedCount} / {totalCount} <span className="font-normal text-[#6B5E48] dark:text-zinc-500 text-[11px] hidden sm:inline">obtained</span>
          </span>
        </div>

        {/* Thin Horizontal Progress Bar and Percentage */}
        <div className="flex items-center gap-3 flex-1 max-w-xs sm:max-w-md">
          <div className="flex-1 bg-[#F4E7C6] dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#F59E0B] to-[#FFD978] dark:bg-purple-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(245,158,11,0.25)] dark:shadow-none"
              style={{ width: `${totalPercentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#F59E0B] dark:text-purple-400 font-mono min-w-[32px] text-right">
            {totalPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
