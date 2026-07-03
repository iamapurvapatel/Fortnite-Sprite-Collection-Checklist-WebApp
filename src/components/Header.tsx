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
        <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-linear-to-tr from-[#F59E0B] to-[#FFD978] dark:from-[#5C4017] dark:to-[#F5B335] text-[#221A12] dark:text-[#1A130D] shadow-[0_4px_12px_rgba(245,158,11,0.15)] dark:shadow-none">
          <Icons.Sparkles className="w-5.5 h-5.5 animate-pulse" />
          <div className="absolute -inset-1 bg-linear-to-tr from-[#F59E0B] to-[#FFD978] dark:from-[#5C4017] dark:to-[#F5B335] rounded-xl blur-xs opacity-25 -z-10" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-display font-black tracking-tight text-[#221A12] dark:text-slate-100">
            Sprite Checklist
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Export Poster Trigger */}
        <button
          onClick={onExportImage}
          disabled={isExporting}
          className="relative p-2.5 rounded-full border border-[#F1E4C6] dark:border-white/10 bg-white dark:bg-transparent hover:bg-[#FFF6E6] dark:hover:bg-white/5 text-[#221A12]/90 dark:text-slate-300 transition-all flex items-center gap-1.5 text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs hover:shadow-sm"
          title="Export obtained sprites as high-res 1080x1080 1:1 picture"
        >
          {isExporting ? (
            <>
              <Icons.Loader2 className="w-4 h-4 text-[#F59E0B] dark:text-[#FFD977] animate-spin" />
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <Icons.Download className="w-4 h-4 text-[#F59E0B] dark:text-[#FFD977]" />
              <span className="hidden sm:inline">Export Poster</span>
            </>
          )}
        </button>

        {/* Settings Toggle button */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-full border border-[#F1E4C6] dark:border-white/10 bg-white dark:bg-transparent hover:bg-[#FFF6E6] dark:hover:bg-white/5 text-[#221A12]/90 dark:text-slate-300 transition-all cursor-pointer shadow-xs hover:shadow-sm"
          title="Data Backup & Configuration"
        >
          <Icons.Settings className="w-4 h-4 text-[#6B5E48] dark:text-slate-300" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full border border-[#F1E4C6] dark:border-white/10 bg-white dark:bg-transparent hover:bg-[#FFF6E6] dark:hover:bg-white/5 text-[#221A12]/90 dark:text-slate-300 transition-all cursor-pointer shadow-xs hover:shadow-sm"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Icons.Sun className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <Icons.Moon className="w-4 h-4 text-[#F59E0B]" />
          )}
        </button>
      </div>
    </header>
  );
};
