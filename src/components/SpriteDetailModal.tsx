import React, { useState, useEffect } from 'react';
import { Sprite } from '../types';
import { ProceduralSprite } from './ProceduralSprite';
import * as Icons from 'lucide-react';

interface SpriteDetailModalProps {
  sprite: Sprite | null;
  isOpen: boolean;
  onClose: () => void;
  isObtained: boolean;
  isFavorite: boolean;
  onToggleObtained: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  obtainedDate?: string;
  notes?: string;
  onSaveNotes: (id: string, notes: string) => void;
}

export const SpriteDetailModal: React.FC<SpriteDetailModalProps> = ({
  sprite,
  isOpen,
  onClose,
  isObtained,
  isFavorite,
  onToggleObtained,
  onToggleFavorite,
  obtainedDate,
  notes = '',
  onSaveNotes,
}) => {
  const [localNotes, setLocalNotes] = useState(notes);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (sprite) {
      setLocalNotes(notes);
      setIsSaved(false);
    }
  }, [sprite, notes]);

  if (!isOpen || !sprite) return null;

  const { id, name, category, rarity, variant, description, features } = sprite;

  // Generate deterministic stats for the sprite based on its characteristics/ID
  const getStats = () => {
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hp = 40 + (sum % 61); // 40 - 100
    const attack = 35 + ((sum * 3) % 66); // 35 - 100
    const defense = 30 + ((sum * 7) % 71); // 30 - 100
    const speed = 45 + ((sum * 13) % 56); // 45 - 100
    const magic = 50 + ((sum * 17) % 51); // 50 - 100
    return { hp, attack, defense, speed, magic };
  };

  const stats = getStats();
  const totalStats = stats.hp + stats.attack + stats.defense + stats.speed + stats.magic;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(e.target.value);
    setIsSaved(false);
  };

  const handleSaveNotes = () => {
    onSaveNotes(id, localNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Color mapping for Variants (matching bottom row of style guide)
  const variantColors: Record<string, { bg: string; text: string; icon: string }> = {
    Basic: { bg: 'bg-[#94A3B8]/10 border-[#94A3B8]/20', text: 'text-[#94A3B8] dark:text-[#94A3B8]', icon: 'Sparkles' },
    Gold: { bg: 'bg-[#F5B335]/10 border-[#F5B335]/20', text: 'text-[#F5B335] dark:text-[#F5B335]', icon: 'Crown' },
    Gummy: { bg: 'bg-[#F97316]/10 border-[#F97316]/20', text: 'text-[#F97316] dark:text-[#F97316]', icon: 'Candy' },
    Galaxy: { bg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20', text: 'text-[#8B5CF6] dark:text-[#8B5CF6]', icon: 'Orbit' },
    Holofoil: { bg: 'bg-[#EC4899]/10 border-[#EC4899]/20', text: 'text-[#EC4899] dark:text-[#EC4899]', icon: 'Layers' },
    Gem: { bg: 'bg-[#06B6D4]/10 border-[#06B6D4]/20', text: 'text-[#06B6D4] dark:text-[#06B6D4]', icon: 'Gem' },
  };

  const variantStyle = variantColors[variant] || { bg: 'bg-slate-500/10 border-transparent', text: 'text-slate-600', icon: 'HelpCircle' };

  const rarityColors: Record<string, string> = {
    Rare: 'bg-[#274488] text-[#69adfd] border-transparent font-bold',
    Epic: 'bg-[#421979] text-[#b55bfa] border-transparent font-bold',
    Legendary: 'bg-[#c3710f] text-[#f8e8d0] border-transparent font-bold',
    Mythic: 'bg-[#b59830] text-[#fae26b] border-transparent font-bold uppercase',
    Special: 'rarity-special-animated border-transparent font-bold tracking-wide uppercase',
  };

  const renderVariantIcon = () => {
    const IconComponent = (Icons as any)[variantStyle.icon];
    if (IconComponent) {
      return <IconComponent className="w-4 h-4" />;
    }
    return <Icons.HelpCircle className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop with heavy blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div
        className="bg-[#FFFDFA] dark:bg-zinc-950/95 border border-[#F1E4C6] dark:border-zinc-800/50 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] transition-all duration-300 animate-[fadeInScale_0.3s_ease-out]"
        style={{
          boxShadow: isObtained
            ? `0 25px 50px -12px rgba(180, 120, 20, 0.12), 0 0 30px -5px ${features.glowColor}40`
            : `0 25px 50px -12px rgba(180, 120, 20, 0.08)`,
        }}
      >
        {/* Left column: Sprite Display */}
        <div
          className="p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden md:w-2/5 border-b md:border-b-0 md:border-r border-[#F1E4C6] dark:border-zinc-800/50 group"
          style={{
            background: `radial-gradient(circle at center, ${features.glowColor}10 0%, transparent 70%)`,
          }}
        >
          {/* Hexagonal decorative lattice backdrop */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

          {/* Star Favorite icon at Top-Right of visualizer */}
          <button
            onClick={() => onToggleFavorite(id)}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 cursor-pointer ${
              isFavorite
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-[#6B5E48] hover:text-[#221A12] dark:hover:text-zinc-300 bg-[#FFF6E6]/60 dark:bg-zinc-900'
            }`}
          >
            <Icons.Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Centered big visualizer */}
          <div className="my-6">
            <ProceduralSprite features={features} obtained={isObtained} size="lg" />
          </div>

          {/* Quick status indicator */}
          <div className="text-center space-y-2 mt-2 w-full">
            <button
              onClick={() => onToggleObtained(id)}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isObtained
                  ? 'bg-[#16A34A] hover:bg-[#15803D] dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#FFF6E6] hover:bg-[#FFE4B5] border border-[#F1E4C6] dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#6B5E48] dark:text-zinc-300'
              }`}
            >
              {isObtained ? (
                <>
                  <Icons.CheckCircle2 className="w-4 h-4" />
                  <span>Collected & Registered</span>
                </>
              ) : (
                <>
                  <Icons.Circle className="w-4 h-4 text-[#F59E0B]" />
                  <span>Register to Checklist</span>
                </>
              )}
            </button>

            {isObtained && obtainedDate && (
              <p className="text-[10px] font-mono text-gray-400 dark:text-zinc-500 flex items-center justify-center gap-1">
                <Icons.Calendar className="w-3.5 h-3.5" />
                <span>Added on {new Date(obtainedDate).toLocaleDateString()}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right column: Info & Custom notes */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-[#221A12] dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Icons.X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* Title / Description */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#F59E0B] dark:text-amber-400">
                {category} Collection
              </span>
              <h3 className="text-2xl font-display font-bold text-[#221A12] dark:text-white">
                {name}
              </h3>
              
              {/* Variant and Rarity Pills */}
              <div className="flex gap-2 pt-1">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl border ${variantStyle.bg} ${variantStyle.text}`}>
                  {renderVariantIcon()}
                  {variant}
                </span>
                <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-xl border ${rarityColors[rarity] || 'bg-[#FFF6E6] dark:bg-zinc-800 text-[#6B5E48] dark:text-zinc-400 border-[#F1E4C6] dark:border-zinc-700'}`}>
                  {rarity} Tier
                </span>
              </div>
            </div>

            {/* Lore Bio */}
            <div className="space-y-2 border-l-2 border-[#F1E4C6] dark:border-zinc-800 pl-4 py-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A38F72] dark:text-zinc-500 flex items-center gap-1">
                <Icons.BookOpen className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Field Lore & Biology</span>
              </h4>
              <p className="text-sm text-[#221A12]/85 dark:text-zinc-300 leading-relaxed italic">
                "{description}"
              </p>
            </div>

            {/* Deterministic Stats bar grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A38F72] dark:text-zinc-500 flex items-center gap-1">
                <Icons.Palette className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Calculated Combat Stats (Total: {totalStats})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* HP */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#6B5E48] dark:text-zinc-400 font-medium">
                    <span>Vitality (HP)</span>
                    <span className="font-mono font-bold">{stats.hp}/100</span>
                  </div>
                  <div className="h-2 bg-[#FFF6E6] dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.hp}%` }} />
                  </div>
                </div>

                {/* Attack */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#6B5E48] dark:text-zinc-400 font-medium">
                    <span>Power (ATK)</span>
                    <span className="font-mono font-bold">{stats.attack}/100</span>
                  </div>
                  <div className="h-2 bg-[#FFF6E6] dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.attack}%` }} />
                  </div>
                </div>

                {/* Defense */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#6B5E48] dark:text-zinc-400 font-medium">
                    <span>Fortitude (DEF)</span>
                    <span className="font-mono font-bold">{stats.defense}/100</span>
                  </div>
                  <div className="h-2 bg-[#FFF6E6] dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.defense}%` }} />
                  </div>
                </div>

                {/* Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#6B5E48] dark:text-zinc-400 font-medium">
                    <span>Agility (SPD)</span>
                    <span className="font-mono font-bold">{stats.speed}/100</span>
                  </div>
                  <div className="h-2 bg-[#FFF6E6] dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.speed}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Collector Notes Section */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800/50">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Icons.FileText className="w-3.5 h-3.5" />
                  <span>Collector Notes</span>
                </h4>
                {isSaved && (
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 animate-pulse">
                    <Icons.Check className="w-3 h-3" /> Notes Saved!
                  </span>
                )}
              </div>
              <div className="relative">
                <textarea
                  value={localNotes}
                  onChange={handleNotesChange}
                  placeholder="Where did you find this sprite? What does it smell like? Document your custom logs here..."
                  className="w-full h-24 p-3 rounded-xl border border-[#F1E4C6] dark:border-zinc-800 bg-[#FFF6E6]/60 dark:bg-black/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/15 focus:border-[#F59E0B]/50 text-xs text-[#221A12] dark:text-zinc-200 placeholder-[#A38F72] resize-none transition-all"
                />
                <button
                  onClick={handleSaveNotes}
                  className="absolute right-2.5 bottom-2.5 px-3 py-1.5 bg-[#F59E0B] hover:bg-[#E6A23C] text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Icons.Download className="w-3 h-3" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
