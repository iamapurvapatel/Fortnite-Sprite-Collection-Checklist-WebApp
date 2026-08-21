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
  onExportImage?: () => void;
  isExporting?: boolean;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  activeCategory,
  setActiveCategory,
  onExportImage,
  isExporting,
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
    <div className="w-full space-y-3 sm:space-y-5">
      {/* 1. Full-Width Search Bar */}
      <div className="relative w-full">
        <Icons.Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7] dark:text-[#C084FC]" />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search sprites by name, variant, rarity, or tags..."
          className="w-full pl-9 sm:pl-11 pr-9 sm:pr-10 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B]/80 shadow-xs focus:bg-white focus:outline-none focus:ring-[4px] focus:ring-[#A855F7]/15 focus:border-[#A855F7] text-xs sm:text-sm placeholder-[#7C3AED] dark:placeholder-[#A78BFA] transition-all text-[#1E1A34] dark:text-[#F3E8FF]"
        />
        {filters.search && (
          <button
            onClick={() => handleSelectChange('search', '')}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#7C3AED] hover:text-[#1E1A34] dark:hover:text-[#F3E8FF] cursor-pointer"
          >
            <Icons.X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* 2. Horizontal Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/80 dark:bg-[#18132B]/80 border border-[#E9D5FF] dark:border-[#2A2147] p-1.5 rounded-xl shadow-xs">
        {/* Left Side: Segmented Status Chips */}
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <div className="flex bg-[#F3E8FF]/60 dark:bg-[#0D0B18]/60 p-0.5 rounded-lg border border-[#E9D5FF] dark:border-[#2A2147]">
            <button
              onClick={() => handleSelectChange('obtainedState', 'all')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                filters.obtainedState === 'all'
                  ? 'bg-[#A855F7] text-white shadow-[0_4px_12px_rgba(168,85,247,0.3)] dark:bg-[#A855F7]'
                  : 'text-[#5B21B6] hover:text-[#1E1A34] hover:bg-[#F3E8FF] dark:text-[#C084FC] dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleSelectChange('obtainedState', 'obtained')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                filters.obtainedState === 'obtained'
                  ? 'bg-[#A855F7] text-white shadow-[0_4px_12px_rgba(168,85,247,0.3)] dark:bg-[#A855F7]'
                  : 'text-[#5B21B6] hover:text-[#1E1A34] hover:bg-[#F3E8FF] dark:text-[#C084FC] dark:hover:text-white'
              }`}
            >
              <Icons.CheckCircle2 className="w-4 h-4" />
              Collected
            </button>
            <button
              onClick={() => handleSelectChange('obtainedState', 'missing')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                filters.obtainedState === 'missing'
                  ? 'bg-[#A855F7] text-white shadow-[0_4px_12px_rgba(168,85,247,0.3)] dark:bg-[#A855F7]'
                  : 'text-[#5B21B6] hover:text-[#1E1A34] hover:bg-[#F3E8FF] dark:text-[#C084FC] dark:hover:text-white'
              }`}
            >
              <Icons.CircleDot className="w-4 h-4" />
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
                ? 'bg-[#F3E8FF] border-[#A855F7] text-[#1E1A34] dark:bg-[#251E44] dark:border-[#A855F7] dark:text-white shadow-[0_2px_8px_rgba(168,85,247,0.2)]'
                : 'bg-white dark:bg-[#18132B] border-[#E9D5FF] dark:border-[#2A2147] text-[#5B21B6] dark:text-[#C084FC] hover:bg-[#FAF5FF] dark:hover:bg-[#251E44] shadow-xs'
            }`}
          >
            <Icons.SlidersHorizontal className="w-3.5 h-3.5 text-[#A855F7] dark:text-[#C084FC]" />
            <span>Filters</span>
            {(filters.rarity !== 'All' || filters.variant !== 'All' || activeCategory !== 'All') && (
              <span className="w-1.5 h-1.5 bg-[#A855F7] dark:bg-[#C084FC] rounded-full animate-pulse" />
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-[#F3E8FF]/60 dark:bg-[#0D0B18]/60 p-0.5 rounded-lg border border-[#E9D5FF] dark:border-[#2A2147]">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#A855F7] text-white shadow-[0_4px_12px_rgba(168,85,247,0.3)] dark:bg-[#A855F7]'
                  : 'text-[#5B21B6] hover:text-[#1E1A34] hover:bg-[#F3E8FF] dark:text-[#C084FC] dark:hover:text-white'
              }`}
            >
              <Icons.Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#A855F7] text-white shadow-[0_4px_12px_rgba(168,85,247,0.3)] dark:bg-[#A855F7]'
                  : 'text-[#5B21B6] hover:text-[#1E1A34] hover:bg-[#F3E8FF] dark:text-[#C084FC] dark:hover:text-white'
              }`}
            >
              <Icons.LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Export Poster Button (Placed right next to View Mode Toggle) */}
          {onExportImage && (
            <button
              onClick={onExportImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer bg-white dark:bg-[#18132B] border-[#E9D5FF] dark:border-[#2A2147] text-[#1E1A34] dark:text-[#F3E8FF] hover:bg-[#FAF5FF] dark:hover:bg-[#251E44] shadow-xs disabled:opacity-50"
              title="Export obtained sprites as high-res poster image"
            >
              {isExporting ? (
                <>
                  <Icons.Loader2 className="w-3.5 h-3.5 text-[#A855F7] dark:text-[#C084FC] animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Icons.Download className="w-3.5 h-3.5 text-[#A855F7] dark:text-[#C084FC]" />
                  <span>Export</span>
                </>
              )}
            </button>
          )}

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
        <div className="p-4 bg-white dark:bg-[#18132B] border border-[#E9D5FF] dark:border-[#2A2147] rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInScale shadow-xs">
          {/* Rarity Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider">
              Rarity Tier
            </label>
            <div className="relative">
              <select
                value={filters.rarity}
                onChange={(e) => handleSelectChange('rarity', e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B] text-xs text-[#1E1A34] dark:text-[#F3E8FF] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A855F7]/20"
              >
                <option value="All">All Rarities</option>
                {rarities.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Icons.ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5B21B6] dark:text-[#C084FC] pointer-events-none" />
            </div>
          </div>

          {/* Variant Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider">
              Sprite Variant
            </label>
            <div className="relative">
              <select
                value={filters.variant}
                onChange={(e) => handleSelectChange('variant', e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B] text-xs text-[#1E1A34] dark:text-[#F3E8FF] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A855F7]/20"
              >
                <option value="All">All Variants</option>
                {variants.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <Icons.ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5B21B6] dark:text-[#C084FC] pointer-events-none" />
            </div>
          </div>

          {/* Sort By Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider">
              Sort Sequence
            </label>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSelectChange('sortBy', e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#E9D5FF] dark:border-[#2A2147] bg-white dark:bg-[#18132B] text-xs text-[#1E1A34] dark:text-[#F3E8FF] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A855F7]/20"
              >
                <option value="number-asc">Default (Number Asc)</option>
                <option value="number-desc">Number Descending</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="rarity-desc">Rarity High-Low</option>
                <option value="rarity-asc">Rarity Low-High</option>
              </select>
              <Icons.ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5B21B6] dark:text-[#C084FC] pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
