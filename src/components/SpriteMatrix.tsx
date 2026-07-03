import React from 'react';
import { Sprite } from '../types';
import { ProceduralSprite } from './ProceduralSprite';
import * as Icons from 'lucide-react';

interface SpriteMatrixProps {
  sprites: Sprite[];
  obtainedIds: string[];
  favoriteIds: string[];
  onToggleObtained: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (sprite: Sprite) => void;
}

// Canonical family order from sprites.ts
const CUSTOM_FAMILY_ORDER = [
  'Water',
  'Earth',
  'Fire',
  'Duck',
  'Ghost',
  'Dream',
  'Demon',
  'Punk',
  'King',
  'Burnt Peanut',
  'Zero Point',
  'Fishy',
  'Striker',
  'Aura',
  'Boss',
  'Grim',
  'Air',
  'Seven',
];

export const SpriteMatrix: React.FC<SpriteMatrixProps> = ({
  sprites,
  obtainedIds,
  favoriteIds,
  onToggleObtained,
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

  return (
    <div className="w-full space-y-4 animate-fadeInScale">
      {/* Non-scrolling container wrapper so only individual row variants scroll on mobile */}
      <div className="w-full space-y-4">
        {/* Visual Sketch Matching Header Section - Hidden on mobile because each card has its own name inside */}
        <div className="text-left py-2 hidden sm:block">
          <h2 id="variants-header" className="font-mono text-xs uppercase tracking-[0.25em] text-[#6B5E48] dark:text-zinc-500 font-extrabold mb-3">
            Variants
          </h2>
          
          {/* Double Border Framing with Honey Glow Colors */}
          <div className="border-t border-b border-[#F1E4C6] dark:border-zinc-800/80 py-3">
            <div className="grid grid-cols-12 gap-2 items-center text-center">
              {/* Row Label Spacer */}
              <div className="col-span-3 sm:col-span-4 text-left">
                <span className="font-mono text-[10px] tracking-widest text-[#A38F72] dark:text-zinc-500 uppercase font-extrabold">
                  Sprite Family
                </span>
              </div>
              
              {/* The 6 Variant Columns */}
              <div className="col-span-9 sm:col-span-8 grid grid-cols-6 gap-3 sm:gap-4 md:gap-5 font-mono text-xs tracking-wider font-extrabold text-[#221A12] dark:text-zinc-300 uppercase text-center">
                <div>Basic</div>
                <div>Gold</div>
                <div>Gummy</div>
                <div>Galaxy</div>
                <div>Holofoil</div>
                <div>Gem</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rows of Sprite Families */}
        <div className="space-y-3 sm:space-y-2.5">
          {sortedFamilies.map((familyName) => {
            // Get all sprites belonging to this family
            const familySprites = sprites.filter((s) => s.name === familyName);
            
            // Separate into variant slots
            const basicSprite = familySprites.find((s) => s.variant === 'Basic');
            const goldSprite = familySprites.find((s) => s.variant === 'Gold');
            const gummySprite = familySprites.find((s) => s.variant === 'Gummy');
            const galaxySprite = familySprites.find((s) => s.variant === 'Galaxy');
            const holofoilSprite = familySprites.find((s) => s.variant === 'Holofoil');
            const gemSprite = familySprites.find((s) => s.variant === 'Gem');

            // Calculate obtained progress for this family
            const totalFamilySprites = familySprites.length;
            const obtainedFamilySprites = familySprites.filter((s) => obtainedIds.includes(s.id)).length;
            const isFamilyComplete = totalFamilySprites > 0 && obtainedFamilySprites === totalFamilySprites;

            return (
              <div
                key={familyName}
                className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-2 items-stretch sm:items-center p-3 sm:p-3 rounded-2xl border border-[#F1E4C6] dark:border-zinc-800/40 bg-white/50 dark:bg-white/[0.01] hover:bg-[#FFF6E6] dark:hover:bg-zinc-900/25 transition-all duration-300"
              >
                {/* Left Column: Family Name & Progress Badge (Pinned / Left-Aligned) */}
                <div className="col-span-3 sm:col-span-4 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center text-left pb-2 sm:pb-0 border-b border-[#F1E4C6]/30 sm:border-b-0">
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

                {/* Right Columns: Interactive Slot Grid - Horizontally Scrollable on Mobile, Grid on Desktop */}
                <div className="col-span-9 sm:col-span-8 flex sm:grid sm:grid-cols-6 gap-3 sm:gap-4 md:gap-5 items-center overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none sm:scrollbar-default -mx-3 px-3 sm:mx-0 sm:px-0">
                  {/* 1. Basic Slot */}
                  <VariantSlot
                    sprite={basicSprite}
                    obtainedIds={obtainedIds}
                    favoriteIds={favoriteIds}
                    onToggleObtained={onToggleObtained}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetail={onOpenDetail}
                  />

                  {/* 2. Gold Slot */}
                  <VariantSlot
                    sprite={goldSprite}
                    obtainedIds={obtainedIds}
                    favoriteIds={favoriteIds}
                    onToggleObtained={onToggleObtained}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetail={onOpenDetail}
                  />

                  {/* 3. Gummy Slot */}
                  <VariantSlot
                    sprite={gummySprite}
                    obtainedIds={obtainedIds}
                    favoriteIds={favoriteIds}
                    onToggleObtained={onToggleObtained}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetail={onOpenDetail}
                  />

                  {/* 4. Galaxy Slot */}
                  <VariantSlot
                    sprite={galaxySprite}
                    obtainedIds={obtainedIds}
                    favoriteIds={favoriteIds}
                    onToggleObtained={onToggleObtained}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetail={onOpenDetail}
                  />

                  {/* 5. Holofoil Slot */}
                  <VariantSlot
                    sprite={holofoilSprite}
                    obtainedIds={obtainedIds}
                    favoriteIds={favoriteIds}
                    onToggleObtained={onToggleObtained}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetail={onOpenDetail}
                  />

                  {/* 6. Gem Slot */}
                  <VariantSlot
                    sprite={gemSprite}
                    obtainedIds={obtainedIds}
                    favoriteIds={favoriteIds}
                    onToggleObtained={onToggleObtained}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetail={onOpenDetail}
                  />
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
  favoriteIds: string[];
  onToggleObtained: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (sprite: Sprite) => void;
  compact?: boolean;
}

const VariantSlot: React.FC<VariantSlotProps> = ({
  sprite,
  obtainedIds,
  favoriteIds,
  onToggleObtained,
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

  const handleSlotClick = (e: React.MouseEvent) => {
    if (isComingSoon) return;
    
    // Prevent standard toggle obtained if a long press just occurred
    if (isLongPressActive.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressActive.current = false;
      return;
    }

    // Also guard against double-click or quick release touch issues
    if (Date.now() - touchStartTime.current > 500 && touchStartTime.current !== 0) {
      touchStartTime.current = 0;
      return;
    }

    onToggleObtained(id);
  };

  return (
    <div
      onTouchStart={isComingSoon ? undefined : handleTouchStart}
      onTouchEnd={isComingSoon ? undefined : handleTouchEnd}
      onTouchMove={isComingSoon ? undefined : handleTouchMove}
      onClick={handleSlotClick}
      className={`group relative aspect-square rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none w-16 sm:w-full flex-shrink-0 ${
        compact ? 'p-0.5 sm:p-1' : 'p-1 sm:p-1.5'
      } ${
        isComingSoon
          ? 'bg-[#FFE4B5]/5 dark:bg-zinc-900/30 border-[#F1E4C6]/40 dark:border-zinc-800/20 opacity-40 cursor-not-allowed'
          : isObtained
          ? 'bg-white dark:bg-zinc-900/50 border-[#F59E0B]/30 dark:border-white/10 hover:border-[#F59E0B] dark:hover:border-white/20 active:scale-[0.96]'
          : 'bg-[#FFFDFA] dark:bg-white/[0.02] border-[#F1E4C6] dark:border-white/5 hover:bg-[#FFF6E6] dark:hover:bg-white/[0.05] hover:border-[#F59E0B]/50 dark:hover:border-white/15 active:scale-[0.96]'
      }`}
      style={{
        boxShadow: !isComingSoon && isObtained
          ? `0 6px 16px -8px ${features.glowColor}, inset 0 1px 1px rgba(255,255,255,0.15)`
          : undefined,
      }}
      title={`${name} (${variant})`}
    >
      {/* Sprite ID / Number & Obtained status dot (Top-Left) */}
      {!compact && (
        <span className="absolute top-1 left-1.5 text-[7px] sm:text-[9px] font-mono text-[#A38F72] dark:text-zinc-500 font-bold opacity-75 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
          #{id.replace(/[a-z]/gi, '').padStart(3, '0')}
          {isObtained && !isComingSoon && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </span>
      )}

      {/* Top right actions row */}
      {!isComingSoon && (
        <div className="absolute top-1 right-1 flex items-center gap-0.5 z-30">
          {/* Inspect Button (Disabled for now) */}

          {/* Favorite Button (Always Available) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id);
            }}
            className={`flex items-center justify-center w-5 h-5 rounded border shadow-xs transition-all cursor-pointer ${
              isFavorite
                ? 'bg-[#FFE4B5]/60 dark:bg-[#F5B335]/20 border-[#F5B335] dark:border-[#F5B335]/50 text-[#F5B335] dark:text-[#FFD977]'
                : 'bg-[#FFFDFA]/40 dark:bg-[#1D1813]/40 hover:bg-[#FFE4B5]/40 dark:hover:bg-[#F5B335]/10 text-[#A38F72] dark:text-[#9F8F75] hover:text-[#F5B335] dark:hover:text-[#FFD977] border-[#F1E4C6]/50 dark:border-[#4A3B2A]/50 hover:border-[#F5B335]/30'
            }`}
            title={isFavorite ? "Remove Favorite" : "Favorite Sprite"}
          >
            <Icons.Star className={`w-2.5 h-2.5 ${isFavorite ? 'fill-[#F5B335] dark:fill-[#FFD977]' : ''}`} />
          </button>
        </div>
      )}

      {/* Coming Soon Lock */}
      {isComingSoon && (
        <Icons.Lock className="w-3.5 h-3.5 text-[#F59E0B]/50 dark:text-rose-400/60 animate-pulse" />
      )}

      {/* Central Sprite Art */}
      {!isComingSoon && (
        <div className={`flex items-center justify-center transition-transform duration-300 group-hover:scale-110 pb-2 ${
          compact ? 'w-7 h-7 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-11 sm:h-11'
        } ${
          !isObtained ? 'opacity-30 filter grayscale-[15%] dark:opacity-25' : ''
        }`}>
          <ProceduralSprite features={features} obtained={isObtained} size={compact ? "xs" : "sm"} />
        </div>
      )}

      {/* Variant Name centered at the bottom */}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-mono font-black text-[#A38F72] dark:text-zinc-500 uppercase tracking-tighter text-center w-full truncate px-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
        {variant}
      </span>
    </div>
  );
};

// Clean Placeholder for Non-existent slots
const EmptySlot: React.FC = () => {
  return (
    <div className="w-16 sm:w-full flex-shrink-0 aspect-square rounded-xl sm:rounded-2xl border border-dashed border-[#F1E4C6]/60 dark:border-zinc-800/30 bg-transparent flex items-center justify-center opacity-25 pointer-events-none select-none">
      <span className="text-[10px] font-mono font-bold text-[#A38F72] dark:text-zinc-600">-</span>
    </div>
  );
};
