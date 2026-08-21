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
    <div className="w-full grid grid-cols-2 gap-2 sm:gap-4">
      {/* 1. Collected Progress Card */}
      <div className="bg-[#F3E8FF]/60 dark:bg-[#18132B]/80 border border-[#E9D5FF] dark:border-[#2A2147] rounded-xl sm:rounded-2xl py-2 px-2.5 sm:py-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Icons.CheckCircle2 className="w-3.5 h-3.5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-xs font-black text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider truncate">
              Collected
            </span>
            <span className="text-xs sm:text-base font-black text-[#1E1A34] dark:text-[#F3E8FF] font-mono leading-tight truncate">
              {obtainedCount} <span className="font-semibold text-[#5B21B6] dark:text-[#C084FC] text-[9px] sm:text-xs font-sans">/ {totalCount}</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:flex-1 sm:max-w-[160px] md:max-w-none">
          <div className="flex-1 bg-[#E9D5FF] dark:bg-[#2A2147] rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{ width: `${obtainedPercentage}%` }}
            />
          </div>
          <span className="text-[10.5px] sm:text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
            {obtainedPercentage}%
          </span>
        </div>
      </div>

      {/* 2. Mastered Progress Card */}
      <div className="bg-[#F3E8FF]/60 dark:bg-[#18132B]/80 border border-[#E9D5FF] dark:border-[#2A2147] rounded-xl sm:rounded-2xl py-2 px-2.5 sm:py-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#A855F7]/20 dark:bg-[#A855F7]/30 text-[#9333EA] dark:text-[#C084FC] flex items-center justify-center shrink-0">
            <Icons.Sparkle className="w-3.5 h-3.5 sm:w-5.5 sm:h-5.5 fill-[#A855F7]/25" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-xs font-black text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider truncate">
              Mastered
            </span>
            <span className="text-xs sm:text-base font-black text-[#1E1A34] dark:text-[#F3E8FF] font-mono leading-tight truncate">
              {masteredCount} <span className="font-semibold text-[#5B21B6] dark:text-[#C084FC] text-[9px] sm:text-xs font-sans">/ {totalCount}</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:flex-1 sm:max-w-[160px] md:max-w-none">
          <div className="flex-1 bg-[#E9D5FF] dark:bg-[#2A2147] rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#A855F7] to-[#EC4899] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${masteredPercentage}%` }}
            />
          </div>
          <span className="text-[10.5px] sm:text-sm font-black text-[#9333EA] dark:text-[#C084FC] font-mono shrink-0">
            {masteredPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
