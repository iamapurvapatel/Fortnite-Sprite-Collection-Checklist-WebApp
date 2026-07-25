import React from 'react';
import * as Icons from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenSettings: () => void;
  onExportImage: () => void;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  onOpenSettings,
  onExportImage,
  isExporting,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-linear-to-tr from-[#A855F7] to-[#EC4899] dark:from-[#7E22CE] dark:to-[#A855F7] text-white shadow-[0_4px_16px_rgba(168,85,247,0.3)]">
          <Icons.Sparkles className="w-5.5 h-5.5 animate-pulse" />
          <div className="absolute -inset-1 bg-linear-to-tr from-[#A855F7] to-[#EC4899] dark:from-[#7E22CE] dark:to-[#A855F7] rounded-xl blur-xs opacity-35 -z-10" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-display font-black tracking-tight text-[#1E1A34] dark:text-[#F3E8FF]">
            My Sprites
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Export Poster Trigger */}
        <button
          onClick={onExportImage}
          disabled={isExporting}
          className="relative p-2.5 rounded-full border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B]/80 hover:bg-[#FAF5FF] dark:hover:bg-[#251E44] text-[#1E1A34] dark:text-[#F3E8FF] transition-all flex items-center gap-1.5 text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs hover:shadow-sm"
          title="Export obtained sprites as high-res 1080x1080 1:1 picture"
        >
          {isExporting ? (
            <>
              <Icons.Loader2 className="w-4 h-4 text-[#A855F7] dark:text-[#C084FC] animate-spin" />
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <Icons.Download className="w-4 h-4 text-[#A855F7] dark:text-[#C084FC]" />
              <span className="hidden sm:inline">Export Poster</span>
            </>
          )}
        </button>

        {/* Settings Toggle button */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-full border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B]/80 hover:bg-[#FAF5FF] dark:hover:bg-[#251E44] text-[#1E1A34] dark:text-[#F3E8FF] transition-all cursor-pointer shadow-xs hover:shadow-sm"
          title="Data Backup & Configuration"
        >
          <Icons.Settings className="w-4 h-4 text-[#5B21B6] dark:text-[#C084FC]" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B]/80 hover:bg-[#FAF5FF] dark:hover:bg-[#251E44] text-[#1E1A34] dark:text-[#F3E8FF] transition-all cursor-pointer shadow-xs hover:shadow-sm"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Icons.Sun className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <Icons.Moon className="w-4 h-4 text-[#A855F7]" />
          )}
        </button>
      </div>
    </header>
  );
};
