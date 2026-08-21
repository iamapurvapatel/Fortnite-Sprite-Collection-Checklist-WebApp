import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface FloatingActionsProps {
  onExportImage: () => void;
  isExporting: boolean;
  onOpenCodes: () => void;
  unclaimedCodesCount: number;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onExportImage,
  isExporting,
  onOpenCodes,
  unclaimedCodesCount,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto select-none animate-fadeIn">
      {/* Scroll to Top (conditional) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="p-2.5 sm:p-3 rounded-full bg-white/90 dark:bg-[#1C1635]/90 backdrop-blur-md border border-[#E9D5FF] dark:border-[#2A2147] text-zinc-600 dark:text-zinc-300 hover:text-[#A855F7] dark:hover:text-[#C084FC] hover:scale-110 shadow-lg shadow-purple-500/10 transition-all duration-200 cursor-pointer"
          title="Scroll to top"
        >
          <Icons.ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Codes Vault Floating Trigger */}
      <button
        type="button"
        onClick={onOpenCodes}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-xl shadow-amber-500/30 hover:shadow-amber-500/45 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-amber-300/40"
        title="View Redeem Codes & Rewards (19 Codes)"
      >
        <Icons.KeyRound className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
        <span className="text-xs sm:text-sm font-black font-display tracking-tight">
          Codes
        </span>
        {unclaimedCodesCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-white text-amber-700 shadow-2xs">
            {unclaimedCodesCount}
          </span>
        )}
      </button>

      {/* Floating Export Poster Trigger */}
      <button
        type="button"
        onClick={onExportImage}
        disabled={isExporting}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-linear-to-r from-[#A855F7] via-[#9333EA] to-[#7E22CE] hover:from-[#B568F8] hover:to-[#8B2BE2] text-white shadow-xl shadow-purple-500/35 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 cursor-pointer border border-purple-300/30"
        title="Export your obtained sprites collection as a high-resolution 1080x1080 poster"
      >
        {isExporting ? (
          <>
            <Icons.Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" />
            <span className="text-xs sm:text-sm font-black font-display tracking-tight">
              Exporting...
            </span>
          </>
        ) : (
          <>
            <div className="relative">
              <Icons.Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-400" />
              </span>
            </div>
            <span className="text-xs sm:text-sm font-black font-display tracking-tight">
              Export Poster
            </span>
          </>
        )}
      </button>
    </div>
  );
};
