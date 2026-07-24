import React, { useState } from 'react';
import { Filters, SpriteCategory, SpriteVariant, SpriteRarity } from '../types';
import * as Icons from 'lucide-react';

interface FiltersBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  viewMode: 'grid' | 'matrix';
  setViewMode: (mode: 'grid' | 'matrix') => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  activeCategory,
  setActiveCategory,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const rarities: SpriteRarity[] = ['Rare', 'Epic', 'Legendary', 'Mythic', 'Special'];
  const variants: SpriteVariant[] = ['Basic', 'Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Gem', 'Cube'];
  const categories: SpriteCategory[] = ['Basic', 'Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Gem', 'Cube'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleSelectChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      rarity: 'All',
      variant: 'All',
      obtainedState: 'all',
      sortBy: 'number-asc',
    });
    setActiveCategory('All');
  };

  const isFiltered =
    filters.search !== '' ||
    filters.rarity !== 'All' ||
    filters.variant !== 'All' ||
    filters.obtainedState !== 'all' ||
    filters.sortBy !== 'number-asc' ||
    activeCategory !== 'All';

  return (
    <div className="w-full space-y-5">
      {/* 1. Full-Width Search Bar */}
      <div className="relative w-full">
        <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F59E0B] dark:text-zinc-500" />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search sprites by name, variant, rarity, or tags..."
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-[#F1E4C6] dark:border-white/5 bg-white dark:bg-white/[0.03] shadow-xs focus:bg-white focus:outline-none focus:ring-[4px] focus:ring-[#F59E0B]/12 focus:border-[#F59E0B]/50 text-sm placeholder-[#A38F72] dark:placeholder-zinc-500 transition-all text-[#221A12] dark:text-zinc-100"
        />
        {filters.search && (
          <button
            onClick={() => handleSelectChange('search', '')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A38F72] hover:text-[#221A12] dark:hover:text-zinc-300 cursor-pointer"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Horizontal Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/60 dark:bg-zinc-950/40 border border-[#F1E4C6] dark:border-white/5 p-1.5 rounded-xl shadow-xs">
        {/* Left Side: Segmented Status Chips */}
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <div className="flex bg-[#FFF6E6]/50 dark:bg-zinc-900/60 p-0.5 rounded-lg border border-[#F1E4C6]/40 dark:border-white/5">
            <button
              onClick={() => handleSelectChange('obtainedState', 'all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                filters.obtainedState === 'all'
                  ? 'bg-[#F59E0B] text-white shadow-[0_4px_12px_rgba(245,158,11,0.2)] dark:bg-white/10 dark:text-white dark:shadow-none'
                  : 'text-[#6B5E48] hover:text-[#221A12] hover:bg-[#FFE4B5]/30 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleSelectChange('obtainedState', 'obtained')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                filters.obtainedState === 'obtained'
                  ? 'bg-[#F59E0B] text-white shadow-[0_4px_12px_rgba(245,158,11,0.2)] dark:bg-white/10 dark:text-white dark:shadow-none'
                  : 'text-[#6B5E48] hover:text-[#221A12] hover:bg-[#FFE4B5]/30 dark:text-zinc-400 dark:hover:text-purple-400'
              }`}
            >
              <Icons.CheckCircle2 className="w-3.5 h-3.5" />
              Obtained
            </button>
            <button
              onClick={() => handleSelectChange('obtainedState', 'missing')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                filters.obtainedState === 'missing'
                  ? 'bg-[#F59E0B] text-white shadow-[0_4px_12px_rgba(245,158,11,0.2)] dark:bg-white/10 dark:text-white dark:shadow-none'
                  : 'text-[#6B5E48] hover:text-[#221A12] hover:bg-[#FFE4B5]/30 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Icons.CircleDot className="w-3.5 h-3.5" />
              Missing
            </button>
          </div>
        </div>

        {/* Right Side: Interactive actions (Filters + View Mode + Reset) - Side by Side and Centered on Mobile */}
        <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-auto">
          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${
              showAdvanced || filters.rarity !== 'All' || filters.variant !== 'All' || activeCategory !== 'All'
                ? 'bg-[#FFE4B5] border-[#F59E0B] text-[#221A12] dark:bg-white/10 dark:border-white/15 dark:text-white shadow-[0_2px_8px_rgba(245,158,11,0.1)]'
                : 'bg-white dark:bg-white/5 border-[#F1E4C6] dark:border-white/5 text-[#6B5E48] dark:text-zinc-400 hover:bg-[#FFF6E6] dark:hover:bg-white/10 shadow-xs'
            }`}
          >
            <Icons.SlidersHorizontal className="w-3.5 h-3.5 text-[#F59E0B] dark:text-zinc-400" />
            <span>Filters</span>
            {(filters.rarity !== 'All' || filters.variant !== 'All' || activeCategory !== 'All') && (
              <span className="w-1.5 h-1.5 bg-[#F59E0B] dark:bg-purple-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-[#FFF6E6]/50 dark:bg-zinc-900/60 p-0.5 rounded-lg border border-[#F1E4C6]/40 dark:border-white/5">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#F59E0B] text-white shadow-[0_4px_12px_rgba(245,158,11,0.2)] dark:bg-white/10 dark:text-white dark:shadow-none'
                  : 'text-[#6B5E48] hover:text-[#221A12] hover:bg-[#FFE4B5]/30 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Icons.Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#F59E0B] text-white shadow-[0_4px_12px_rgba(245,158,11,0.2)] dark:bg-white/10 dark:text-white dark:shadow-none'
                  : 'text-[#6B5E48] hover:text-[#221A12] hover:bg-[#FFE4B5]/30 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Icons.LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Reset Filters Icon Button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
            >
              <Icons.RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Expandable Advanced Option Panel */}
      {showAdvanced && (
        <div className="p-4 bg-white dark:bg-zinc-900/20 border border-[#F1E4C6] dark:border-white/5 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInScale shadow-[0_8px_24px_rgba(180,120,20,0.06)]">
          {/* Rarity Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#A38F72] dark:text-zinc-500 uppercase tracking-wider">
              Rarity Tier
            </label>
            <div className="relative">
              <select
                value={filters.rarity}
                onChange={(e) => handleSelectChange('rarity', e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#F1E4C6] dark:border-white/5 bg-white dark:bg-[#0c0c0e] text-xs text-[#221A12] dark:text-zinc-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/10"
              >
                <option value="All">All Rarities</option>
                {rarities.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Icons.ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B5E48] pointer-events-none" />
            </div>
          </div>

          {/* Variant Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#A38F72] dark:text-zinc-500 uppercase tracking-wider">
              Sprite Variant
            </label>
            <div className="relative">
              <select
                value={filters.variant}
                onChange={(e) => handleSelectChange('variant', e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#F1E4C6] dark:border-white/5 bg-white dark:bg-[#0c0c0e] text-xs text-[#221A12] dark:text-zinc-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/10"
              >
                <option value="All">All Variants</option>
                {variants.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <Icons.ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B5E48] pointer-events-none" />
            </div>
          </div>

          {/* Sort By Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#A38F72] dark:text-zinc-500 uppercase tracking-wider">
              Sort Sequence
            </label>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSelectChange('sortBy', e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#F1E4C6] dark:border-white/5 bg-white dark:bg-[#0c0c0e] text-xs text-[#221A12] dark:text-zinc-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/10"
              >
                <option value="number-asc">Default (Number Asc)</option>
                <option value="number-desc">Number Descending</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="rarity-desc">Rarity High-Low</option>
                <option value="rarity-asc">Rarity Low-High</option>
              </select>
              <Icons.ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B5E48] pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
