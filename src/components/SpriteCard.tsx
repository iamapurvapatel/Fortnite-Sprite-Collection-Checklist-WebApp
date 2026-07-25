import React from 'react';
import { Sprite } from '../types';
import { ProceduralSprite } from './ProceduralSprite';
import * as Icons from 'lucide-react';

interface SpriteCardProps {
  sprite: Sprite;
  isObtained: boolean;
  isMastered?: boolean;
  isFavorite: boolean;
  obtainedDate?: string;
  onToggleObtained: (id: string) => void;
  onToggleMastered?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetail?: (sprite: Sprite) => void;
}

export const SpriteCard: React.FC<SpriteCardProps> = ({
  sprite,
  isObtained,
  isMastered = false,
  isFavorite,
  obtainedDate,
  onToggleObtained,
  onToggleMastered,
  onToggleFavorite,
  onOpenDetail,
}) => {
  const { id, name, category, rarity, variant, features } = sprite;

  // Honey Glow color mapping for Variants (matching the bottom row of the style guide)
  const variantColors: Record<string, { bg: string; text: string; icon: string }> = {
    Basic: { bg: 'bg-[#94A3B8]/10 border-[#94A3B8]/20', text: 'text-[#94A3B8] dark:text-[#94A3B8]', icon: 'Sparkles' },
    Gold: { bg: 'bg-[#F5B335]/10 border-[#F5B335]/20', text: 'text-[#F5B335] dark:text-[#F5B335]', icon: 'Crown' },
    Gummy: { bg: 'bg-[#F97316]/10 border-[#F97316]/20', text: 'text-[#F97316] dark:text-[#F97316]', icon: 'Candy' },
    Galaxy: { bg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20', text: 'text-[#8B5CF6] dark:text-[#8B5CF6]', icon: 'Orbit' },
    Holofoil: { bg: 'bg-[#EC4899]/10 border-[#EC4899]/20', text: 'text-[#EC4899] dark:text-[#EC4899]', icon: 'Layers' },
    Gem: { bg: 'bg-[#06B6D4]/10 border-[#06B6D4]/20', text: 'text-[#06B6D4] dark:text-[#06B6D4]', icon: 'Gem' },
    Cube: { bg: 'bg-[#A855F7]/10 border-[#A855F7]/20', text: 'text-[#A855F7] dark:text-[#A855F7]', icon: 'Box' },
  };

  const rarityColors: Record<string, string> = {
    Rare: 'bg-[#274488] text-[#69adfd] border-transparent font-bold',
    Epic: 'bg-[#421979] text-[#b55bfa] border-transparent font-bold',
    Legendary: 'bg-[#c3710f] text-[#f8e8d0] border-transparent font-bold tracking-tight',
    Mythic: 'bg-[#b59830] text-[#fae26b] border-transparent font-black uppercase tracking-wider',
    Special: 'rarity-special-animated border-transparent font-extrabold tracking-wide uppercase',
  };

  const variantStyle = variantColors[variant] || { bg: 'bg-slate-500/10', text: 'text-slate-600', icon: 'HelpCircle' };

  // Render Variant Icon dynamically
  const renderVariantIcon = () => {
    const iconName = variantStyle.icon;
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-3 h-3" />;
    }
    return <Icons.HelpCircle className="w-3 h-3" />;
  };

  // Humanize obtained date
  const formatObtainedDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' });
    } catch {
      return '';
    }
  };

  const isUnreleased = !!sprite.unreleased;

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
      /*
      if (onOpenDetail) {
        onOpenDetail(sprite);
      }
      */
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

  const handleCardClick = (e: React.MouseEvent) => {
    if (isUnreleased) return;

    // Prevent standard toggle obtained if a long press just occurred
    if (isLongPressActive.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressActive.current = false;
      return;
    }

    // Guard against double clicks or quick releases of touch triggers
    if (Date.now() - touchStartTime.current > 500 && touchStartTime.current !== 0) {
      touchStartTime.current = 0;
      return;
    }

    onToggleObtained(id);
  };

  return (
    <div
      onTouchStart={isUnreleased ? undefined : handleTouchStart}
      onTouchEnd={isUnreleased ? undefined : handleTouchEnd}
      onTouchMove={isUnreleased ? undefined : handleTouchMove}
      onClick={handleCardClick}
      className={`glass-card rounded-[20px] border border-transparent transition-all duration-300 relative group overflow-hidden flex flex-col justify-between select-none ${
        isUnreleased
          ? 'bg-[#F6F4FE]/40 dark:bg-[#18132B]/40 opacity-50 cursor-not-allowed'
          : isMastered
          ? 'bg-[#FFFFFF] dark:bg-[#18132B]/90 cursor-pointer active:scale-[0.98] shadow-[0_12px_32px_rgba(168,85,247,0.18)] hover:shadow-[0_16px_36px_rgba(168,85,247,0.28)] hover:-translate-y-1'
          : isObtained
          ? 'bg-[#FFFFFF] dark:bg-[#18132B]/80 cursor-pointer active:scale-[0.98] shadow-[0_8px_24px_rgba(168,85,247,0.08)] hover:shadow-[0_12px_28px_rgba(168,85,247,0.18)] hover:-translate-y-1'
          : 'bg-[#FFFFFF]/80 dark:bg-[#18132B]/50 hover:bg-[#FAF5FF]/80 dark:hover:bg-[#251E44]/60 opacity-95 hover:opacity-100 cursor-pointer active:scale-[0.98] shadow-[0_4px_12px_rgba(168,85,247,0.04)] hover:shadow-[0_8px_24px_rgba(168,85,247,0.1)] hover:-translate-y-0.5'
      }`}
      style={{
        boxShadow: !isUnreleased && isMastered
          ? `0 16px 36px -8px rgba(168, 85, 247, 0.22), 0 8px 24px rgba(168, 85, 247, 0.12), inset 0 1px 3px rgba(192, 132, 252, 0.3)`
          : !isUnreleased && isObtained
          ? `0 12px 28px -8px rgba(168, 85, 247, 0.15), 0 8px 24px rgba(168, 85, 247, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.8)`
          : undefined,
      }}
    >
      {/* Category banner gradient at background */}
      {!isUnreleased && isObtained && (
        <div
          className="absolute top-0 right-0 w-32 h-32 bg-radial opacity-[0.08] rounded-full blur-2xl pointer-events-none -z-10"
          style={{ backgroundColor: features.glowColor }}
        />
      )}

      {/* Top action row with Collect (top-left) & Master (top-right) Icon Buttons */}
      <div className="p-2.5 flex items-center justify-between relative z-20">
        {isUnreleased ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-wider text-rose-500 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 px-2 py-1 rounded-md">
            <Icons.Lock className="w-3 h-3" /> COMING SOON
          </span>
        ) : (
          <div className="flex items-center justify-between w-full">
            {/* Top-Left: Collect Checkmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleObtained(id);
              }}
              className={`w-9 h-9 rounded-xl transition-all duration-200 cursor-pointer border select-none flex items-center justify-center ${
                isObtained
                  ? 'bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-600 dark:text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-white/90 dark:bg-[#18132B]/90 text-slate-400 dark:text-zinc-400 border-[#E9D5FF] dark:border-[#2A2147] hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30'
              }`}
              title={isObtained ? "Collected (Click to unmark)" : "Click to mark as Collected"}
            >
              <Icons.Check className={`w-5 h-5 ${isObtained ? 'stroke-[3] text-emerald-600 dark:text-emerald-300' : 'stroke-[2.5]'}`} />
            </button>

            {/* Top-Right: Master Star Button */}
            <button
              disabled={!isObtained}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleMastered && isObtained) onToggleMastered(id);
              }}
              className={`w-9 h-9 rounded-xl transition-all duration-200 border select-none flex items-center justify-center ${
                !isObtained
                  ? 'opacity-30 cursor-not-allowed bg-gray-100/40 dark:bg-zinc-900/40 text-gray-400 border-transparent'
                  : isMastered
                  ? 'bg-amber-500/20 dark:bg-amber-500/30 text-amber-500 dark:text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.4)] cursor-pointer'
                  : 'bg-white/90 dark:bg-[#18132B]/90 text-slate-400 dark:text-zinc-400 border-[#E9D5FF] dark:border-[#2A2147] hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 cursor-pointer'
              }`}
              title={!isObtained ? "Collect sprite first to master" : isMastered ? "Mastered (Click to unmark)" : "Click to mark as Mastered"}
            >
              <Icons.Star className={`w-5 h-5 ${isMastered ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400' : 'stroke-[2]'}`} />
            </button>
          </div>
        )}
      </div>

      {/* Sprite Procedural Visual Render */}
      <div
        onClick={(e) => {
          if (onOpenDetail && !isUnreleased) {
            e.stopPropagation();
            onOpenDetail(sprite);
          }
        }}
        className={`flex flex-col items-center justify-center py-2.5 relative z-10 select-none group-hover:scale-105 transition-transform duration-300 ${onOpenDetail ? 'cursor-pointer' : ''} ${isUnreleased ? 'filter blur-[3px] opacity-40 grayscale group-hover:blur-none group-hover:opacity-100 group-hover:grayscale-0' : ''}`}
        title={onOpenDetail ? "Click sprite to view details" : undefined}
      >
        <ProceduralSprite features={features} obtained={isObtained} mastered={isMastered} size="md" />
      </div>

      {/* Footer Details */}
      <div className="p-3 border-t border-[#E9D5FF]/60 dark:border-[#2A2147] bg-[#FAF5FF]/50 dark:bg-[#18132B]/60 flex flex-col gap-1.5 relative z-10 flex-1 justify-end">
        <div>
          <h4 className={`text-xs font-black text-[#1E1A34] dark:text-[#F3E8FF] transition-colors truncate ${!isUnreleased ? 'group-hover:text-[#A855F7] dark:group-hover:text-[#C084FC]' : ''}`}>
            {name}
          </h4>
          <span className="text-[9px] text-[#5B21B6] dark:text-[#A78BFA] font-extrabold tracking-tight uppercase">
            {category} Collection
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {/* Variant Tag */}
          <span className={`inline-flex items-center gap-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md border border-transparent ${variantStyle.bg} ${variantStyle.text}`}>
            {renderVariantIcon()}
            {variant}
          </span>
          {/* Rarity Tag */}
          <span className={`inline-flex items-center text-[8px] font-extrabold px-1.5 py-0.5 rounded-md border border-transparent ${rarityColors[rarity]}`}>
            {rarity}
          </span>
        </div>

        {/* Obtained Date badge */}
        {!isUnreleased && isObtained && obtainedDate && (
          <div className="flex items-center gap-1 text-[8px] text-[#5B21B6] dark:text-[#A78BFA] font-mono mt-0.5 pt-0.5 border-t border-transparent">
            <Icons.Calendar className="w-2.5 h-2.5" />
            <span>Obtained: {formatObtainedDate(obtainedDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
