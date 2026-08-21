import React from 'react';
import * as Icons from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenSettings: () => void;
  onExportImage: () => void;
  isExporting: boolean;
  onOpenCodes: () => void;
  unclaimedCodesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  onOpenSettings,
  onExportImage,
  isExporting,
  onOpenCodes,
  unclaimedCodesCount = 0,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-2.5 sm:py-3.5">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="relative flex items-center justify-center p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-linear-to-tr from-[#A855F7] to-[#EC4899] dark:from-[#7E22CE] dark:to-[#A855F7] text-white shadow-[0_4px_16px_rgba(168,85,247,0.3)] shrink-0">
          <Icons.Sparkles className="w-4 h-4 sm:w-5.5 sm:h-5.5 animate-pulse" />
          <div className="absolute -inset-1 bg-linear-to-tr from-[#A855F7] to-[#EC4899] dark:from-[#7E22CE] dark:to-[#A855F7] rounded-xl blur-xs opacity-35 -z-10" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg md:text-xl font-display font-black tracking-tight text-[#1E1A34] dark:text-[#F3E8FF] truncate">
            My Sprites
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Codes Vault Button */}
        <button
          onClick={onOpenCodes}
          className="relative px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-300/80 dark:border-amber-500/40 bg-linear-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-700 dark:text-amber-300 transition-all flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold cursor-pointer shadow-xs hover:shadow-sm"
          title="Secret In-Game Codes & Rewards Vault"
        >
          <Icons.KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse shrink-0" />
          <span className="hidden sm:inline">Cheat Codes</span>
          {unclaimedCodesCount > 0 && (
            <span className="px-1.5 py-0.2 text-[9px] sm:text-[9.5px] font-mono font-black rounded-full bg-amber-500 text-white">
              {unclaimedCodesCount}
            </span>
          )}
        </button>

        {/* Export Poster Trigger */}
        <button
          onClick={onExportImage}
          disabled={isExporting}
          className="relative p-1.5 sm:p-2.5 rounded-full border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B]/80 hover:bg-[#FAF5FF] dark:hover:bg-[#251E44] text-[#1E1A34] dark:text-[#F3E8FF] transition-all flex items-center gap-1.5 text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs hover:shadow-sm"
          title="Export obtained sprites as high-res 1080x1080 1:1 picture"
        >
          {isExporting ? (
            <>
              <Icons.Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7] dark:text-[#C084FC] animate-spin" />
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <Icons.Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7] dark:text-[#C084FC]" />
              <span className="hidden sm:inline">Export Poster</span>
            </>
          )}
        </button>

        {/* Settings Toggle button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2.5 rounded-full border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B]/80 hover:bg-[#FAF5FF] dark:hover:bg-[#251E44] text-[#1E1A34] dark:text-[#F3E8FF] transition-all cursor-pointer shadow-xs hover:shadow-sm"
          title="Data Backup & Configuration"
        >
          <Icons.Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5B21B6] dark:text-[#C084FC]" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 sm:p-2.5 rounded-full border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B]/80 hover:bg-[#FAF5FF] dark:hover:bg-[#251E44] text-[#1E1A34] dark:text-[#F3E8FF] transition-all cursor-pointer shadow-xs hover:shadow-sm"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Icons.Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
          ) : (
            <Icons.Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7]" />
          )}
        </button>
      </div>
    </header>
  );
};
