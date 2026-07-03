export interface SpriteFeatures {
  shape: 'round' | 'star' | 'cube' | 'diamond' | 'cloud' | 'ghost';
  eyes: 'cute' | 'cool' | 'wink' | 'sleepy' | 'star' | 'glasses';
  accessory: 'none' | 'crown' | 'hat' | 'bow' | 'headphones' | 'halo';
  glowColor: string;
  bodyColor: string;
  accentColor: string;
  scale?: number;
  particles?: 'sparkle' | 'bubble' | 'orbit' | 'float' | 'none';
  customId?: string;
  imageUrl?: string;
}

export type SpriteCategory = 'Basic' | 'Gold' | 'Gummy' | 'Galaxy' | 'Holofoil' | 'Gem';

export type SpriteRarity = 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Special';

export type SpriteVariant = 'Basic' | 'Gold' | 'Gummy' | 'Galaxy' | 'Holofoil' | 'Gem';

export interface Sprite {
  id: string;
  name: string;
  category: SpriteCategory;
  number: string;
  rarity: SpriteRarity;
  variant: SpriteVariant;
  description: string;
  features: SpriteFeatures;
  unreleased?: boolean;
}

export interface CategoryDetail {
  id: SpriteCategory;
  name: string;
  iconName: string;
  description: string;
  themeColor: string; // Tailwind color, e.g. "emerald", "amber"
  gradientFrom: string;
  gradientTo: string;
}

export interface ChecklistState {
  obtained: string[];
  favorites: string[];
  notes: Record<string, string>;
  obtainedDates: Record<string, string>;
}

export interface Filters {
  search: string;
  category: string; // 'All' or SpriteCategory
  rarity: string; // 'All' or SpriteRarity
  variant: string; // 'All' or SpriteVariant
  obtainedState: 'all' | 'obtained' | 'missing';
  sortBy: 'number-asc' | 'number-desc' | 'name-asc' | 'name-desc' | 'rarity-desc' | 'rarity-asc';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category?: string;
}
