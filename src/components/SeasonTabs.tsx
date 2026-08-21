import React from 'react';
import { SeasonId, SeasonInfo } from '../types';
import { SEASONS } from '../data/sprites';
import * as Icons from 'lucide-react';

interface SeasonTabsProps {
  activeSeason: SeasonId;
  onSelectSeason: (season: SeasonId) => void;
  seasonCounts: Record<SeasonId, { obtained: number; total: number }>;
}

export const SeasonTabs: React.FC<SeasonTabsProps> = ({
  activeSeason,
  onSelectSeason,
  seasonCounts,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3 bg-white/70 dark:bg-[#18132B]/80 border border-[#E9D5FF] dark:border-[#2A2147] p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xs backdrop-blur-md">
      {/* Tab Selectors */}
      <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
        {SEASONS.map((season: SeasonInfo) => {
          const isActive = activeSeason === season.id;
          const counts = seasonCounts[season.id] || { obtained: 0, total: 103 };
          const percent = counts.total > 0 ? Math.round((counts.obtained / counts.total) * 100) : 0;

          return (
            <button
              key={season.id}
              onClick={() => onSelectSeason(season.id)}
              className={`flex-1 sm:flex-none relative px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2.5 ${
                isActive
                  ? 'bg-linear-to-r from-[#A855F7] to-[#8B5CF6] text-white shadow-[0_4px_16px_rgba(168,85,247,0.35)] scale-[1.01]'
                  : 'bg-white/50 dark:bg-[#0D0B18]/50 hover:bg-[#F3E8FF] dark:hover:bg-[#251E44] text-[#5B21B6] dark:text-[#C084FC] border border-[#E9D5FF]/60 dark:border-[#2A2147]/60'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <Icons.Layers className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#A855F7] dark:text-[#C084FC]'}`} />
                <span className="tracking-tight font-black">{season.shortName}</span>
                {season.id === 'c7s4' && (
                  <span className={`px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#A855F7]/15 text-[#7C3AED] dark:text-[#A78BFA]'
                  }`}>
                    Active
                  </span>
                )}
              </div>

              {/* Mini progress badge */}
              <div className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md font-bold shrink-0 ${
                isActive ? 'bg-black/20 text-white' : 'bg-[#F3E8FF] dark:bg-[#251E44] text-[#5B21B6] dark:text-[#C084FC]'
              }`}>
                {counts.obtained}/{counts.total} ({percent}%)
              </div>
            </button>
          );
        })}
      </div>

      {/* Season Info / Context helper note */}
      <div className="flex items-center justify-center sm:justify-end gap-1.5 text-[10.5px] sm:text-xs text-[#7C3AED] dark:text-[#A78BFA] font-medium px-2 py-0.5 sm:py-0 text-center sm:text-right">
        {activeSeason === 'c7s4' ? (
          <span className="flex items-center gap-1">
            <Icons.Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 animate-pulse shrink-0" />
            <strong className="text-[#1E1A34] dark:text-white">Chapter 7 Season 4:</strong> Active Season
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Icons.Archive className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#A855F7] dark:text-[#C084FC] shrink-0" />
            <strong className="text-[#1E1A34] dark:text-white">Chapter 7 Season 3:</strong> Archive
          </span>
        )}
      </div>
    </div>
  );
};
