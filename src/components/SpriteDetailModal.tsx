import React, { useState, useEffect } from 'react';
import { Sprite } from '../types';
import { ProceduralSprite } from './ProceduralSprite';
import * as Icons from 'lucide-react';
import { SPRITES } from '../data/sprites';

interface SpriteDetailModalProps {
  sprite: Sprite | null;
  isOpen: boolean;
  onClose: () => void;
  isObtained: boolean;
  isMastered?: boolean;
  isFavorite: boolean;
  onToggleObtained: (id: string) => void;
  onToggleMastered?: (id: string) => void;
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
  isMastered = false,
  isFavorite,
  onToggleObtained,
  onToggleMastered,
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

  const displayRarity = variant === 'Basic' ? rarity : 'Special';

  // Define family patterns for dynamic/fallback rich details exactly matching screenshots
  const getSpriteRichDetails = () => {
    const fam = name.trim();
    // Find the basic sprite for this family to determine its base family rarity
    const baseSprite = SPRITES.find(s => s.name === fam && s.variant === 'Basic');
    const baseRarity = baseSprite ? baseSprite.rarity : (variant === 'Basic' ? rarity : 'Rare');

    // Basic defaults
    let perk: string | undefined = undefined;
    let desc = description;
    let powerScaling = "Increases in power at each Level Up: +5% stats bonus per level";
    let location = "Spotted in serene environments and hidden spots";
    let variantLabel = variant === "Basic" ? "Base" : variant;
    let summonCost = "100";
    let dropChance = "12.83%";
    let isUnreleased = !!sprite.unreleased;

    // Check variant defaults
    if (variant === 'Gold') {
      perk = "Gain 3x bonus XP from eliminations";
      dropChance = "0.7%";
      variantLabel = "Gold";
    } else if (variant === 'Gummy') {
      perk = "Gain 20% more Sprite Dust upon Extraction";
      dropChance = "0.28%";
      variantLabel = "Candy";
    } else if (variant === 'Galaxy') {
      perk = "Gain 30% more Ammo whenever picked up in the world";
      dropChance = "0.28%";
      variantLabel = "Galaxy";
    } else if (variant === 'Holofoil') {
      perk = "5% chance for your squad to find rare Sprite Variants from looting chests";
      dropChance = "0.15%";
      variantLabel = "Holofoil";
      isUnreleased = !!sprite.unreleased;
    } else if (variant === 'Gem') {
      perk = "Gain 15% shield capacity bonus on armor break";
      dropChance = "0.15%";
      variantLabel = "Gem";
    } else if (variant === 'Cube') {
      perk = "Gain 15% bonus building and fortification speed";
      dropChance = "0.20%";
      variantLabel = "Cube";
    }

    // Check specific family mappings
    if (fam === 'Water') {
      desc = "Replenish shields while standing in water!";
      powerScaling = "Increases in power at each Level Up: 2 Shield -> 3 Shield -> 4 Shield -> 5 Shield -> 6 Shield per tick";
      location = "Spotted near rivers and beaches";
    } else if (fam === 'Fire') {
      desc = "Ignite nearby targets and deal scorching fire damage!";
      powerScaling = "Increases in power at each Level Up: 2 Burn -> 3 Burn -> 4 Burn -> 5 Burn -> 6 Burn per tick";
      location = "Spotted near volcanic craters and lava runs";
    } else if (fam === 'Earth') {
      desc = "You have a chance to find additional rare items when opening chests.";
      powerScaling = "Chance increases at each Level Up: 10% -> 12.5% -> 15% -> 17.5% -> 20% chance to find additional rare loot";
      location = "Found wandering around forests and wooded regions";
      if (variant === 'Gem') {
        perk = "Take 30% less Fall damage";
      }
    } else if (fam === 'Duck') {
      desc = "Waddle aggressively to distract enemies and boost run speed!";
      powerScaling = "Increases in power at each Level Up: +5% Speed -> +10% Speed -> +15% Speed -> +20% Speed -> +25% Speed bonus";
      location = "Spotted near peaceful lakes and public parks";
    } else if (fam === 'Ghost') {
      desc = "Phase safely through physical doors and turn partially invisible!";
      powerScaling = "Increases in power at each Level Up: 1.5s -> 2.5s -> 3.5s -> 4.5s -> 5.5s active duration";
      location = "Spotted near forgotten tombs and twilight ruins";
    } else if (fam === 'Dream') {
      desc = "Release a pleasant sleeping mist that pacifies aggressive targets!";
      powerScaling = "Increases in power at each Level Up: 3m -> 4m -> 5m -> 6m -> 7m gas radius";
      location = "Spotted near quiet valley fields and misty peaks";
    } else if (fam === 'Demon') {
      desc = "Empower critical melee strikes with deep underworld heat!";
      powerScaling = "Increases in power at each Level Up: 1.3x -> 1.5x -> 1.7x -> 1.9x -> 2.1x crit damage multiplier";
      location = "Spotted near volcanic heat vents and magma wells";
    } else if (fam === 'Punk') {
      desc = "Unleash high-frequency guitar riffs that shock and stun targets!";
      powerScaling = "Increases in power at each Level Up: 1s -> 1.3s -> 1.6s -> 1.9s -> 2.2s pulse stun duration";
      location = "Spotted near busy subway stations and brick walls";
    } else if (fam === 'King') {
      desc = "Command a defensive guard shield of rotating gold bones!";
      powerScaling = "Increases in power at each Level Up: 1 Bone -> 2 Bones -> 3 Bones -> 4 Bones -> 5 Bones spawned";
      location = "Spotted near grand keep halls and old royal towers";
    } else if (fam === 'Burnt Peanut') {
      desc = "Launch chaotic bouncing shells that burst into small embers!";
      powerScaling = "Increases in power at each Level Up: 10 Embers -> 15 Embers -> 20 Embers -> 25 Embers -> 30 Embers per hit";
      location = "Spotted near scorched forest groves and dry hills";
    } else if (fam === 'Zero Point') {
      desc = "Manipulate quantum gravitational nodes to freeze incoming projectiles!";
      powerScaling = "Increases in power at each Level Up: 20% -> 30% -> 40% -> 50% -> 60% bullet slowdown rate";
      location = "Spotted near temporal anomalies and metal dome labs";
    } else if (fam === 'Fishy') {
      desc = "Drastically increase swimming momentum and find rare lake loot!";
      powerScaling = "Increases in power at each Level Up: +15% -> +25% -> +35% -> +45% -> +55% aquatic boost speed";
      location = "Spotted near sunlit coral reefs and shallow fishing docks";
    } else if (fam === 'Striker') {
      desc = "Slide dash and launch blazing energy balls that ricochet!";
      powerScaling = "Increases in power at each Level Up: 20 -> 28 -> 36 -> 44 -> 52 energy blast damage";
      location = "Spotted near modern sports arenas and neon cities";
    } else if (fam === 'Boss') {
      desc = "Unleash minor volcanic quakes that shock and slow enemy squad targets!";
      powerScaling = "Increases in power at each Level Up: 25 -> 35 -> 45 -> 55 -> 65 shock damage value";
      location = "Spotted near boiling craters and deep magma rifts";
    } else if (fam === 'Grim') {
      desc = "Apply a lingering shadow decay curse that drains health points!";
      powerScaling = "Increases in power at each Level Up: 2s -> 2.5s -> 3s -> 3.5s -> 4s decay active duration";
      location = "Spotted near dark cathedrals and misty crypt corridors";
    } else if (fam === 'Aura') {
      desc = "Form a beautiful protective bubble field absorbing energy beams!";
      powerScaling = "Increases in power at each Level Up: 30 -> 45 -> 60 -> 75 -> 90 protective point capacity";
      location = "Spotted near emerald crystal domes and mountain points";
    } else if (fam === 'Air') {
      desc = "Summon soft atmospheric drafts to glide smoothly over gaps!";
      powerScaling = "Increases in power at each Level Up: +2m -> +3m -> +4m -> +5m -> +6m draft flight height";
      location = "Spotted near high windswept plateaus and sky towers";
    } else if (fam === 'Seven') {
      desc = "Rift blink a short distance forward, leaving a purple vortex field!";
      powerScaling = "Increases in power at each Level Up: 5m -> 6m -> 7m -> 8m -> 9m rift jump range";
      location = "Spotted near mysterious space gates and starry rifts";
    }

    // Set summonCost and dropChance based on base family rarity and variant
    if (variant === 'Basic') {
      if (baseRarity === 'Mythic') {
        dropChance = "0.93%";
        summonCost = "1500";
      } else if (baseRarity === 'Legendary') {
        dropChance = "1.85%";
        summonCost = "1000";
      } else if (baseRarity === 'Epic') {
        dropChance = "4.25%";
        summonCost = "500";
      } else {
        dropChance = "12.83%";
        summonCost = "100";
      }
    } else {
      // Special Sprites summon cost depends on base family rarity:
      // 4000 for RARE, 6000 for EPIC, 10000 for LEGENDARY, 15000 for MYTHIC
      if (baseRarity === 'Rare') {
        summonCost = "4000";
      } else if (baseRarity === 'Epic') {
        summonCost = "6000";
      } else if (baseRarity === 'Legendary') {
        summonCost = "10000";
      } else if (baseRarity === 'Mythic') {
        summonCost = "15000";
      }
    }

    // Force exact values if unreleased
    if (isUnreleased || sprite.unreleased) {
      dropChance = "0%";
      summonCost = "0";
      isUnreleased = true;
    }

    return {
      perk,
      description: desc,
      powerScaling,
      location,
      variantLabel,
      summonCost,
      dropChance,
      isUnreleased
    };
  };

  const richDetails = getSpriteRichDetails();
  const { perk, description: richDesc, powerScaling, location, variantLabel, summonCost, dropChance, isUnreleased } = richDetails;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(e.target.value);
    setIsSaved(false);
  };

  const handleSaveNotes = () => {
    onSaveNotes(id, localNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop with dark heavy blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Premium Full-Width Landscape Modal Container */}
      <div
        className="bg-[#121214] border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative z-10 flex flex-col md:grid md:grid-cols-12 md:h-[600px] text-white animate-[fadeInScale_0.3s_ease-out] max-h-[92vh] md:max-h-[600px]"
        style={{
          boxShadow: isMastered
            ? `0 25px 50px -12px rgba(245, 158, 11, 0.25), 0 0 45px -5px ${features.glowColor}50, 0 0 15px rgba(251, 191, 36, 0.3)`
            : isObtained
            ? `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 35px -5px ${features.glowColor}30`
            : `0 25px 50px -12px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-gray-400 hover:text-white hover:bg-black/60 transition-colors cursor-pointer z-50"
        >
          <Icons.X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Card/Stage */}
        <div
          className="md:col-span-5 flex flex-col items-center justify-center p-8 bg-zinc-950/70 relative overflow-hidden select-none h-60 md:h-full border-b md:border-b-0 md:border-r border-white/5"
          style={{
            background: `radial-gradient(circle at center, ${features.glowColor}25 0%, transparent 70%)`,
          }}
        >
          {/* Decorative Grid Patterns */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

          {/* Mastered Button */}
          <button
            onClick={() => onToggleMastered && onToggleMastered(id)}
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer z-40 border ${
              isMastered
                ? 'text-amber-400 bg-amber-400/20 border-amber-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-white bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            title={isMastered ? "Unmark Mastered" : "Mark as Mastered"}
          >
            <Icons.Sparkles className={`w-3.5 h-3.5 ${isMastered ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isMastered ? 'Mastered' : 'Master'}</span>
          </button>

          {/* Beautiful Ambient Background Circle */}
          <div
            className="absolute w-44 h-44 rounded-full blur-[48px] opacity-25"
            style={{ backgroundColor: features.glowColor || '#0ea5e9' }}
          />

          {/* Large Sprite Visualizer */}
          <div className="relative z-10 transition-transform duration-300 hover:scale-105">
            <ProceduralSprite features={features} obtained={isObtained} mastered={isMastered} size="lg" />
          </div>
        </div>

        {/* Right Column: Premium Game Database Details */}
        <div className="md:col-span-7 p-6 sm:p-8 overflow-y-auto space-y-4 bg-[#121214] scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="space-y-3">
            {/* Main Header Title */}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-display leading-none">
              {variantLabel === "Base" ? "" : variantLabel} {name} Sprite
            </h2>

            {/* Rarity, Drop Chance & Unreleased Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-xs tracking-wider uppercase ${
                displayRarity === 'Special' ? 'bg-gradient-to-r from-teal-300 via-pink-300 to-indigo-300 text-zinc-900 font-black' :
                displayRarity === 'Mythic' ? 'bg-[#b59830] text-[#fae26b]' :
                displayRarity === 'Legendary' ? 'bg-[#c3710f] text-[#f8e8d0]' :
                displayRarity === 'Epic' ? 'bg-[#421979] text-[#b55bfa]' :
                'bg-[#274488] text-[#69adfd]'
              }`}>
                {displayRarity.toUpperCase()}
              </span>

              <span className="text-[9px] font-mono font-bold bg-[#1E1B4B]/30 text-zinc-400 border border-zinc-800/60 px-2 py-0.5 rounded-xs">
                {dropChance}
              </span>

              {isUnreleased && (
                <span className="text-[9px] font-black tracking-widest bg-[#EC4899] text-white px-2 py-0.5 rounded-xs uppercase">
                  UNRELEASED
                </span>
              )}
            </div>
          </div>

          {/* Gradient Perk Banner (If Perk Exists) */}
          {perk && (
            <div className="bg-gradient-to-r from-teal-200 via-pink-200 to-indigo-200 text-zinc-900 font-extrabold text-xs sm:text-xs px-4 py-2 rounded-lg leading-tight shadow-md border border-white/10">
              {perk}
            </div>
          )}

          {/* Description & Leveling Scaling */}
          <div className="space-y-1.5">
            <p className="text-zinc-200 text-sm font-medium leading-relaxed">
              {richDesc}
            </p>
            <p className="text-zinc-400 text-[11px] leading-tight font-sans tracking-tight">
              {powerScaling}
            </p>
          </div>

          {/* 2x2 Info Grid Box */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Location Box */}
            <div className="bg-zinc-900/40 border border-white/5 p-3.5 rounded-xl flex flex-col justify-between min-h-[68px]">
              <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">LOCATION</span>
              <span className="text-xs font-black text-white leading-tight mt-1">{location}</span>
            </div>

            {/* Variant Box */}
            <div className="bg-zinc-900/40 border border-white/5 p-3.5 rounded-xl flex flex-col justify-between min-h-[68px]">
              <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">VARIANT</span>
              <span className="text-xs font-black text-white leading-tight mt-1">{variantLabel}</span>
            </div>

            {/* Summon Cost Box */}
            <div className="bg-zinc-900/40 border border-white/5 p-3.5 rounded-xl flex flex-col justify-between min-h-[68px]">
              <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">SUMMON COST</span>
              <span className="text-sm font-black text-white leading-none mt-1">{Number(summonCost).toLocaleString()}</span>
            </div>

            {/* Drop Chances Box */}
            <div className="bg-zinc-900/40 border border-white/5 p-3.5 rounded-xl flex flex-col justify-between min-h-[68px]">
              <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">DROP CHANCES</span>
              <div className="flex flex-col mt-1">
                <span className="text-[8px] font-mono font-black text-zinc-500 uppercase leading-none">SPRITE CHEST</span>
                <span className="text-xs font-black text-white leading-tight mt-0.5">{dropChance}</span>
              </div>
            </div>
          </div>

          {/* Checklist controls section */}
          <div className="border-t border-white/10 pt-4 mt-1 space-y-3.5">
            <div className="flex gap-2">
              {/* Collected & Registered Toggle Button */}
              <button
                onClick={() => onToggleObtained(id)}
                className={`flex-1 py-2 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  isObtained
                    ? 'bg-emerald-500 hover:bg-emerald-600 border-transparent text-white'
                    : 'bg-[#1E1B4B]/20 border-white/10 hover:bg-white/5 text-zinc-300'
                }`}
              >
                {isObtained ? (
                  <>
                    <Icons.CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Collected & Registered</span>
                  </>
                ) : (
                  <>
                    <Icons.Circle className="w-4 h-4 text-zinc-500" />
                    <span>Register to Checklist</span>
                  </>
                )}
              </button>

              {/* Mastered Toggle Button */}
              <button
                disabled={!isObtained}
                onClick={() => onToggleMastered && onToggleMastered(id)}
                className={`flex-1 py-2 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                  !isObtained
                    ? 'bg-zinc-900/20 border-zinc-800/40 text-zinc-600 cursor-not-allowed opacity-40'
                    : isMastered
                    ? 'bg-amber-500 hover:bg-amber-600 border-transparent text-white shadow-md font-black cursor-pointer'
                    : 'bg-[#1E1B4B]/20 border-white/10 hover:bg-white/5 text-zinc-300 cursor-pointer'
                }`}
              >
                {isMastered ? (
                  <>
                    <Icons.Sparkle className="w-4 h-4 fill-white text-white animate-spin-slow" />
                    <span>Sprite Mastered!</span>
                  </>
                ) : (
                  <>
                    <Icons.Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Mark as Mastered</span>
                  </>
                )}
              </button>
            </div>

            {/* Personal Lore/Explorer Notes Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                  <Icons.FileText className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Personal Explorer Notes</span>
                </label>
                {isSaved && (
                  <span className="text-[10px] font-mono font-black text-emerald-400 animate-pulse">Saved!</span>
                )}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={localNotes}
                  onChange={handleNotesChange}
                  placeholder="Add coordinates, custom lore, or battle strategies..."
                  className="flex-1 min-h-[42px] max-h-[80px] bg-zinc-950/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/25 transition-colors resize-none scrollbar-none"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-3.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-200 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Calendar catalog entry date */}
            {isObtained && obtainedDate && (
              <p className="text-[9px] font-mono text-zinc-600 flex items-center justify-center gap-1 pt-1">
                <Icons.Calendar className="w-3.5 h-3.5 text-zinc-600" />
                <span>Cataloged on {new Date(obtainedDate).toLocaleDateString()}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
