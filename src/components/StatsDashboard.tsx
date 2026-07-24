import React from 'react';
import { Sprite } from '../types';
import * as Icons from 'lucide-react';

interface StatsDashboardProps {
  sprites: Sprite[];
  obtainedIds: string[];
  masteredIds?: string[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  sprites,
  obtainedIds,
  masteredIds = [],
}) => {
  const totalCount = sprites.filter((s) => !s.unreleased).length;
  const obtainedCount = sprites.filter((s) => !s.unreleased && obtainedIds.includes(s.id)).length;
  const masteredCount = sprites.filter((s) => !s.unreleased && masteredIds.includes(s.id)).length;

  const obtainedPercentage = totalCount > 0 ? Math.round((obtainedCount / totalCount) * 100) : 0;
  const masteredPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Collected Progress Card */}
      <div className="bg-[#FFF6E6]/40 dark:bg-[#1C1610]/20 border border-transparent dark:border-transparent rounded-2xl py-3 px-4 flex flex-row items-center justify-between gap-4 shadow-[0_4px_12px_rgba(180,120,20,0.02)] dark:shadow-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Icons.CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-[#A38F72] dark:text-zinc-500 uppercase tracking-widest">
              Collected
            </span>
            <span className="text-sm font-black text-[#221A12] dark:text-zinc-100 font-mono">
              {obtainedCount} <span className="font-normal text-[#6B5E48] dark:text-[#A38F72] text-xs font-sans">/ {totalCount} Sprites</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 flex-1 max-w-[160px] sm:max-w-xs md:max-w-none">
          <div className="flex-1 bg-[#F4E7C6] dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.2)]"
              style={{ width: `${obtainedPercentage}%` }}
            />
          </div>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono min-w-[32px] text-right">
            {obtainedPercentage}%
          </span>
        </div>
      </div>

      {/* 2. Mastered Progress Card */}
      <div className="bg-[#FFF6E6]/40 dark:bg-[#1C1610]/20 border border-transparent dark:border-transparent rounded-2xl py-3 px-4 flex flex-row items-center justify-between gap-4 shadow-[0_4px_12px_rgba(180,120,20,0.02)] dark:shadow-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Icons.Sparkle className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-[#A38F72] dark:text-zinc-500 uppercase tracking-widest">
              Mastered
            </span>
            <span className="text-sm font-black text-[#221A12] dark:text-zinc-100 font-mono">
              {masteredCount} <span className="font-normal text-[#6B5E48] dark:text-[#A38F72] text-xs font-sans">/ {totalCount} Sprites</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 flex-1 max-w-[160px] sm:max-w-xs md:max-w-none">
          <div className="flex-1 bg-[#F4E7C6] dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(245,158,11,0.2)]"
              style={{ width: `${masteredPercentage}%` }}
            />
          </div>
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono min-w-[32px] text-right">
            {masteredPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
