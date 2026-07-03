import React from 'react';
import { Sprite } from '../types';
import { ProceduralSprite } from './ProceduralSprite';
import * as Icons from 'lucide-react';

interface SpriteCardProps {
  sprite: Sprite;
  isObtained: boolean;
  isFavorite: boolean;
  obtainedDate?: string;
  onToggleObtained: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetail?: (sprite: Sprite) => void;
}

export const SpriteCard: React.FC<SpriteCardProps> = ({
  sprite,
  isObtained,
  isFavorite,
  obtainedDate,
  onToggleObtained,
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
      className={`glass-card rounded-[20px] border transition-all duration-300 relative group overflow-hidden flex flex-col justify-between select-none ${
        isUnreleased
          ? 'bg-[#FFFDFA]/40 dark:bg-zinc-900/40 border-[#F1E4C6]/40 dark:border-zinc-800/40 opacity-50 cursor-not-allowed'
          : isObtained
          ? 'bg-[#FFFFFF] dark:bg-zinc-900/40 border-[#F59E0B]/40 dark:border-white/10 hover:border-[#F59E0B] cursor-pointer active:scale-[0.98] shadow-[0_8px_24px_rgba(180,120,20,0.08)] hover:shadow-[0_12px_28px_rgba(245,158,11,0.15)] hover:-translate-y-1'
          : 'bg-[#FFFDFA] dark:bg-white/[0.02] border-[#F1E4C6] dark:border-white/5 hover:bg-[#FFF6E6] dark:hover:bg-white/[0.06] hover:border-[#F59E0B]/40 dark:hover:border-white/10 opacity-95 hover:opacity-100 cursor-pointer active:scale-[0.98] shadow-[0_4px_12px_rgba(180,120,20,0.04)] hover:shadow-[0_8px_24px_rgba(180,120,20,0.08)] hover:-translate-y-0.5'
      }`}
      style={{
        boxShadow: !isUnreleased && isObtained
          ? `0 12px 28px -8px rgba(245, 158, 11, 0.15), 0 8px 24px rgba(180,120,20,0.08), inset 0 1px 2px rgba(255,255,255,0.9)`
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

      {/* Top action row */}
      <div className="p-3 flex items-center justify-between relative z-20">
        {/* ID tag */}
        <span className="font-mono text-[9px] font-extrabold text-[#A38F72] dark:text-zinc-500 opacity-80">
          #{id.replace(/[a-z]/gi, '').padStart(3, '0')}
        </span>

        {isUnreleased ? (
          <span className="inline-flex items-center gap-1 text-[8px] font-black tracking-wider text-rose-500 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 px-2 py-0.5 rounded-md">
            <Icons.Lock className="w-2.5 h-2.5" /> COMING SOON
          </span>
        ) : (
          <div className="flex items-center gap-1">
            {/* Details Button (Disabled for now) */}

            {/* Favorite Button (Always Available) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(id);
              }}
              className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer border ${
                isFavorite
                  ? 'text-[#F59E0B] dark:text-[#FFD977] bg-[#FFE4B5]/60 dark:bg-[#F5B335]/20 border-[#F59E0B] dark:border-[#F5B335]/50'
                  : 'text-[#A38F72] dark:text-[#9F8F75] hover:text-[#F59E0B] dark:hover:text-[#FFD977] hover:bg-[#FFF6E6]/40 dark:hover:bg-[#F5B335]/10 border-transparent hover:border-[#F1E4C6]/40 dark:hover:border-[#4A3B2A]/40'
              }`}
              title={isFavorite ? "Remove Favorite" : "Favorite Sprite"}
            >
              <Icons.Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#F59E0B] dark:fill-[#FFD977]' : ''}`} />
            </button>

            {/* Obtained Toggle Icon */}
            <div
              className={`p-1.5 rounded-lg transition-all duration-200 border border-transparent ${
                isObtained
                  ? 'text-emerald-600 bg-[#E6F9EC]'
                  : 'text-[#D6C9AA] group-hover:text-emerald-500'
              }`}
            >
              {isObtained ? (
                <Icons.CheckCircle2 className="w-4 h-4" />
              ) : (
                <Icons.Circle className="w-4 h-4" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sprite Procedural Visual Render */}
      <div className={`flex flex-col items-center justify-center py-2.5 relative z-10 select-none ${isUnreleased ? 'filter blur-[3px] opacity-40 grayscale group-hover:blur-none group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300' : ''}`}>
        <ProceduralSprite features={features} obtained={isObtained} size="md" />
      </div>

      {/* Footer Details */}
      <div className="p-3 border-t border-[#F1E4C6]/40 dark:border-white/5 bg-[#FFFDF7]/50 dark:bg-white/[0.02] flex flex-col gap-1.5 relative z-10 flex-1 justify-end">
        <div>
          <h4 className={`text-xs font-black text-[#221A12] dark:text-gray-200 transition-colors truncate ${!isUnreleased ? 'group-hover:text-[#F59E0B]' : ''}`}>
            {name}
          </h4>
          <span className="text-[9px] text-[#6B5E48] dark:text-gray-500 font-extrabold tracking-tight uppercase">
            {category} Collection
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {/* Variant Tag */}
          <span className={`inline-flex items-center gap-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md border ${variantStyle.bg} ${variantStyle.text}`}>
            {renderVariantIcon()}
            {variant}
          </span>
          {/* Rarity Tag */}
          <span className={`inline-flex items-center text-[8px] font-extrabold px-1.5 py-0.5 rounded-md border ${rarityColors[rarity]}`}>
            {rarity}
          </span>
        </div>

        {/* Obtained Date badge */}
        {!isUnreleased && isObtained && obtainedDate && (
          <div className="flex items-center gap-1 text-[8px] text-[#A38F72] dark:text-gray-500 font-mono mt-0.5 pt-0.5 border-t border-[#F1E4C6]/40 dark:border-gray-800/10">
            <Icons.Calendar className="w-2.5 h-2.5" />
            <span>Obtained: {formatObtainedDate(obtainedDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
