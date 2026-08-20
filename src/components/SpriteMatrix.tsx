import React from 'react';
import { Sprite } from '../types';
import { ProceduralSprite } from './ProceduralSprite';
import { CUSTOM_FAMILY_ORDER, VARIANT_ORDER } from '../data/sprites';
import * as Icons from 'lucide-react';

interface SpriteMatrixProps {
  sprites: Sprite[];
  obtainedIds: string[];
  masteredIds?: string[];
  favoriteIds: string[];
  onToggleObtained: (id: string) => void;
  onToggleMastered?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (sprite: Sprite) => void;
}

export const SpriteMatrix: React.FC<SpriteMatrixProps> = ({
  sprites,
  obtainedIds,
  masteredIds = [],
  favoriteIds,
  onToggleObtained,
  onToggleMastered,
  onToggleFavorite,
  onOpenDetail,
}) => {
  // Group the current filtered sprites by family name
  const familyNames: string[] = Array.from(new Set(sprites.map((s) => s.name)));

  // Sort the families based on CUSTOM_FAMILY_ORDER
  const sortedFamilies = familyNames.sort((a: string, b: string) => {
    const idxA = CUSTOM_FAMILY_ORDER.indexOf(a);
    const idxB = CUSTOM_FAMILY_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  // Calculate distinct variants dynamically from the current dataset
  const distinctVariants = VARIANT_ORDER.filter((v) =>
    sprites.some((s) => s.variant === v)
  );

  const numVariants = distinctVariants.length || 7;
  const isFewVariants = numVariants <= 4;
  const labelColsClass = isFewVariants ? 'col-span-3 sm:col-span-2 md:col-span-2' : 'col-span-3 sm:col-span-2';
  const slotColsClass = isFewVariants ? 'col-span-9 sm:col-span-10 md:col-span-10' : 'col-span-9 sm:col-span-10';
  const gridColsClass =
    numVariants === 3
      ? 'sm:grid-cols-3 max-w-[460px] md:max-w-[540px]'
      : numVariants === 4
      ? 'sm:grid-cols-4 max-w-[600px] md:max-w-[680px]'
      : numVariants === 5
      ? 'sm:grid-cols-5'
      : numVariants === 6
      ? 'sm:grid-cols-6'
      : 'sm:grid-cols-7';

  return (
    <div className="w-full space-y-4 animate-fadeInScale">
      {/* Helper Legend Banner for Matrix Mode Interactions */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#FFF6E6]/60 dark:bg-zinc-900/40 border border-[#F1E4C6] dark:border-zinc-800/50 text-[11px] text-[#6B5E48] dark:text-zinc-400">
        <div className="flex items-center gap-4 flex-wrap font-mono">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <strong>Tap Slot:</strong> Cycle (Obtained → Mastered ✨ → Reset)
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <Icons.Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <strong>Sparkles Icon:</strong> Quick Master
          </span>
        </div>
        <span className="text-[10px] opacity-75 font-mono hidden sm:inline-block">
          💡 Mastered sprites show up with a golden glow and star counts!
        </span>
      </div>

      {/* Non-scrolling container wrapper so only individual row variants scroll on mobile */}
      <div className="w-full space-y-4">
        {/* Visual Header Section - Hidden on mobile because each card has its own variant name inside */}
        <div className="text-left py-2 hidden sm:block">
          <h2 id="variants-header" className="font-mono text-xs uppercase tracking-[0.25em] text-[#6B5E48] dark:text-zinc-500 font-extrabold mb-3">
            Variants
          </h2>
          
          {/* Double Border Framing */}
          <div className="border-t border-b border-[#F1E4C6]/20 dark:border-zinc-800/20 py-3 opacity-90">
            <div className="grid grid-cols-12 gap-2 items-center text-center">
              {/* Row Label Spacer */}
              <div className={`${labelColsClass} text-left`}>
                <span className="font-mono text-[10px] tracking-widest text-[#A38F72] dark:text-zinc-500 uppercase font-extrabold">
                  Sprite Family
                </span>
              </div>
              
              {/* Dynamic Variant Columns */}
              <div className={`${slotColsClass}`}>
                <div className={`grid ${gridColsClass} gap-2 sm:gap-3 md:gap-3.5 font-mono text-xs tracking-wider font-extrabold text-[#221A12] dark:text-zinc-300 uppercase text-center`}>
                  {distinctVariants.map((v) => (
                    <div key={v}>{v}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rows of Sprite Families */}
        <div className="space-y-2.5 sm:space-y-2">
          {sortedFamilies.map((familyName) => {
            // Get all sprites belonging to this family
            const familySprites = sprites.filter((s) => s.name === familyName);

            // Calculate obtained progress for this family
            const totalFamilySprites = familySprites.length;
            const obtainedFamilySprites = familySprites.filter((s) => obtainedIds.includes(s.id)).length;
            const isFamilyComplete = totalFamilySprites > 0 && obtainedFamilySprites === totalFamilySprites;

            return (
              <div
                key={familyName}
                className="flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-2 items-stretch sm:items-center p-2.5 sm:p-2.5 rounded-2xl border border-transparent dark:border-transparent bg-white/[0.45] dark:bg-white/[0.005] hover:bg-[#FFF6E6]/60 dark:hover:bg-zinc-900/15 shadow-[0_4px_16px_-4px_rgba(180,120,20,0.03)] dark:shadow-none transition-all duration-300"
              >
                {/* Left Column: Family Name & Progress Badge */}
                <div className={`${labelColsClass} flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center text-left pb-1.5 sm:pb-0 border-b border-transparent sm:border-b-0`}>
                  <span className="font-sans font-black text-sm sm:text-base text-[#221A12] dark:text-zinc-200 tracking-tight flex items-center gap-1.5 truncate">
                    {familyName}
                    {isFamilyComplete && (
                      <Icons.CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 fill-emerald-500/10 shrink-0" />
                    )}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-[#A38F72] dark:text-zinc-500 font-bold tracking-wider bg-[#FFF6E6]/60 sm:bg-transparent dark:bg-zinc-800/40 px-2 py-0.5 sm:px-0 sm:py-0 rounded-full">
                    {obtainedFamilySprites}/{totalFamilySprites} OBTAINED
                  </span>
                </div>

                {/* Right Columns: Interactive Dynamic Slot Grid */}
                <div className={`${slotColsClass} flex sm:grid ${gridColsClass} gap-2 sm:gap-2.5 md:gap-3 items-center overflow-x-auto sm:overflow-visible pb-1.5 sm:pb-0 scrollbar-none sm:scrollbar-default -mx-2 px-2 sm:mx-0 sm:px-0`}>
                  {distinctVariants.map((v) => {
                    const variantSprite = familySprites.find((s) => s.variant === v);
                    return (
                      <VariantSlot
                        key={v}
                        sprite={variantSprite}
                        obtainedIds={obtainedIds}
                        masteredIds={masteredIds}
                        favoriteIds={favoriteIds}
                        onToggleObtained={onToggleObtained}
                        onToggleMastered={onToggleMastered}
                        onToggleFavorite={onToggleFavorite}
                        onOpenDetail={onOpenDetail}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS FOR HIGHLY POLISHED INTERACTIVE GRID SLOTS --- */

interface VariantSlotProps {
  sprite: Sprite | undefined;
  obtainedIds: string[];
  masteredIds?: string[];
  favoriteIds: string[];
  onToggleObtained: (id: string) => void;
  onToggleMastered?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (sprite: Sprite) => void;
  compact?: boolean;
}

const VariantSlot: React.FC<VariantSlotProps> = ({
  sprite,
  obtainedIds,
  masteredIds = [],
  favoriteIds,
  onToggleObtained,
  onToggleMastered,
  onToggleFavorite,
  onOpenDetail,
  compact = false,
}) => {
  if (!sprite) return <EmptySlot />;

  const { id, name, variant, features, unreleased } = sprite;
  const isObtained = obtainedIds.includes(id);
  const isFavorite = favoriteIds.includes(id);
  const isComingSoon = !!unreleased;

  // Mobile Long-Press / Press-and-Hold Touch logic
  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPressActive = React.useRef(false);
  const touchStartTime = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    isLongPressActive.current = false;
    touchStartTime.current = Date.now();
    longPressTimer.current = setTimeout(() => {
      isLongPressActive.current = true;
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }
      // Disabled inspect on long-press for now
      // onOpenDetail(sprite);
    }, 500); // 500ms press to inspect
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const isMastered = masteredIds.includes(id);

  const handleSlotClick = (e: React.MouseEvent) => {
    if (isComingSoon) return;
    
    // Prevent standard toggle if long press occurred
    if (isLongPressActive.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressActive.current = false;
      return;
    }

    if (Date.now() - touchStartTime.current > 500 && touchStartTime.current !== 0) {
      touchStartTime.current = 0;
      return;
    }

    // 3-State cycling for fast & easy collection tracking:
    // 1) Unobtained -> Click -> Obtained
    // 2) Obtained -> Click -> Mastered ✨
    // 3) Mastered -> Click -> Reset (Unobtained)
    if (!isObtained) {
      onToggleObtained(id);
    } else if (isObtained && !isMastered) {
      if (onToggleMastered) onToggleMastered(id);
    } else if (isMastered) {
      if (onToggleMastered) onToggleMastered(id); // unmaster
      onToggleObtained(id); // unobtain
    }
  };

  return (
    <div
      onTouchStart={isComingSoon ? undefined : handleTouchStart}
      onTouchEnd={isComingSoon ? undefined : handleTouchEnd}
      onTouchMove={isComingSoon ? undefined : handleTouchMove}
      onClick={handleSlotClick}
      className={`group relative min-h-[118px] sm:min-h-[136px] md:min-h-[148px] rounded-xl sm:rounded-2xl border border-transparent transition-all duration-300 flex flex-col items-center justify-between overflow-hidden cursor-pointer select-none w-[108px] sm:w-full max-w-[160px] flex-shrink-0 p-2 sm:p-2.5 ${
        isComingSoon
          ? 'bg-[#FFE4B5]/3 dark:bg-zinc-900/10 opacity-35 cursor-not-allowed'
          : isMastered
          ? 'bg-white dark:bg-zinc-900/55 hover:border-amber-500/20 shadow-[0_4px_12px_rgba(245,158,11,0.12)]'
          : isObtained
          ? 'bg-white dark:bg-zinc-900/55 border-zinc-100/30 dark:border-zinc-850/20'
          : 'bg-[#FFFDFA]/60 dark:bg-white/[0.01] hover:bg-[#FFF6E6]/40 dark:hover:bg-white/[0.03]'
      }`}
      style={{
        boxShadow: !isComingSoon && isMastered
          ? `0 6px 18px -4px rgba(245, 158, 11, 0.22), inset 0 1px 1px rgba(251,191,36,0.12)`
          : !isComingSoon && isObtained
          ? `0 6px 16px -8px ${features.glowColor}, inset 0 1px 1px rgba(255,255,255,0.12)`
          : undefined,
      }}
      title={`${name} (${variant})`}
    >
      {/* Obtained status dot / Sparkle (Top-Left) */}
      {!compact && (
        <span className="absolute top-1.5 left-1.5 opacity-75 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 z-20">
          {isMastered ? (
            <Icons.Sparkle className="w-2.5 h-2.5 text-amber-500 fill-amber-500 animate-pulse shrink-0" />
          ) : isObtained && !isComingSoon && (
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          )}
        </span>
      )}

      {/* Coming Soon Lock */}
      {isComingSoon && (
        <Icons.Lock className="w-4 h-4 text-[#F59E0B]/50 dark:text-rose-400/60 animate-pulse" />
      )}

      {/* Central Sprite Art - Maximized relative to container */}
      {!isComingSoon && (
        <div
          className={`w-full flex-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 pt-1 pb-2 px-1 ${
            !isObtained ? 'opacity-30 filter grayscale-[15%] dark:opacity-25' : ''
          }`}
        >
          <ProceduralSprite features={features} obtained={isObtained} mastered={isMastered} size="full" />
        </div>
      )}

      {/* Bottom Mastered Checkbox Bar */}
      {!isComingSoon && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!isObtained) {
              onToggleObtained(id);
            } else if (onToggleMastered) {
              onToggleMastered(id);
            }
          }}
          className={`w-full z-30 flex items-center justify-between px-2 py-1 rounded-md border text-[8px] sm:text-[9px] font-mono font-black uppercase transition-all duration-200 cursor-pointer select-none ${
            isMastered
              ? 'bg-amber-500/90 text-white border-amber-400 shadow-[0_2px_8px_rgba(245,158,11,0.35)] scale-[1.02]'
              : isObtained
              ? 'bg-white/90 dark:bg-zinc-800/90 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-amber-400 hover:text-amber-500'
              : 'bg-white/70 dark:bg-zinc-900/60 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 dark:text-zinc-500 opacity-60 hover:opacity-100 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
          title={isMastered ? "Mastered! Click to unmark" : isObtained ? "Click to mark Mastered" : "Click to mark as Collected & Mastered"}
        >
          <span className="flex items-center gap-1 tracking-tight truncate">
            <Icons.Sparkles className={`w-3 h-3 shrink-0 ${isMastered ? 'fill-white text-white animate-pulse' : 'text-zinc-400'}`} />
            <span className="truncate">Mastered</span>
          </span>
          <span className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded flex items-center justify-center border shrink-0 transition-all ${
            isMastered
              ? 'bg-white text-amber-600 border-white'
              : 'border-zinc-400/60 dark:border-zinc-600 bg-white/40 dark:bg-zinc-900/40'
          }`}>
            {isMastered && <Icons.Check className="w-2.5 h-2.5 stroke-[3.5]" />}
          </span>
        </div>
      )}
    </div>
  );
};

// Clean Placeholder for Non-existent slots
const EmptySlot: React.FC = () => {
  return (
    <div className="w-[108px] sm:w-full max-w-[160px] min-h-[118px] sm:min-h-[136px] md:min-h-[148px] flex-shrink-0 rounded-xl sm:rounded-2xl border border-transparent bg-[#FFE4B5]/2 dark:bg-white/[0.005] flex items-center justify-center opacity-25 pointer-events-none select-none">
      <span className="text-[10px] font-mono font-bold text-[#A38F72] dark:text-zinc-600">-</span>
    </div>
  );
};
