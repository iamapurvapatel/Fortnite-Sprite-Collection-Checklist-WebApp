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
      <div className="bg-[#F3E8FF]/60 dark:bg-[#18132B]/80 border border-[#E9D5FF] dark:border-[#2A2147] rounded-2xl py-4 px-5 flex flex-row items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Icons.CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider">
              Collected
            </span>
            <span className="text-base font-black text-[#1E1A34] dark:text-[#F3E8FF] font-mono leading-tight">
              {obtainedCount} <span className="font-semibold text-[#5B21B6] dark:text-[#C084FC] text-xs font-sans">/ {totalCount} Sprites</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 flex-1 max-w-[170px] sm:max-w-xs md:max-w-none">
          <div className="flex-1 bg-[#E9D5FF] dark:bg-[#2A2147] rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{ width: `${obtainedPercentage}%` }}
            />
          </div>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono min-w-[36px] text-right">
            {obtainedPercentage}%
          </span>
        </div>
      </div>

      {/* 2. Mastered Progress Card */}
      <div className="bg-[#F3E8FF]/60 dark:bg-[#18132B]/80 border border-[#E9D5FF] dark:border-[#2A2147] rounded-2xl py-4 px-5 flex flex-row items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#A855F7]/20 dark:bg-[#A855F7]/30 text-[#9333EA] dark:text-[#C084FC] flex items-center justify-center shrink-0">
            <Icons.Sparkle className="w-6 h-6 fill-[#A855F7]/25" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider">
              Mastered
            </span>
            <span className="text-base font-black text-[#1E1A34] dark:text-[#F3E8FF] font-mono leading-tight">
              {masteredCount} <span className="font-semibold text-[#5B21B6] dark:text-[#C084FC] text-xs font-sans">/ {totalCount} Sprites</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 flex-1 max-w-[170px] sm:max-w-xs md:max-w-none">
          <div className="flex-1 bg-[#E9D5FF] dark:bg-[#2A2147] rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#A855F7] to-[#EC4899] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${masteredPercentage}%` }}
            />
          </div>
          <span className="text-sm font-black text-[#9333EA] dark:text-[#C084FC] font-mono min-w-[36px] text-right">
            {masteredPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
