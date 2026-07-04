import { useState, useEffect, useMemo, useRef } from 'react';
import { Sprite, ChecklistState, Filters } from './types';
import { SPRITES, CUSTOM_FAMILY_ORDER, VARIANT_ORDER } from './data/sprites';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { FiltersBar } from './components/FiltersBar';
import { SpriteCard } from './components/SpriteCard';
import { SpriteMatrix } from './components/SpriteMatrix';
import { SpriteDetailModal } from './components/SpriteDetailModal';
import { SettingsPanel } from './components/SettingsPanel';
import { ProceduralSprite } from './components/ProceduralSprite';
import * as Icons from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [checklist, setChecklist] = useState<ChecklistState>(() => {
    try {
      const savedObtained = localStorage.getItem('sprite_obtained');
      const savedFavorites = localStorage.getItem('sprite_favorites');
      const savedNotes = localStorage.getItem('sprite_notes');
      const savedDates = localStorage.getItem('sprite_obtained_dates');

      return {
        obtained: savedObtained ? JSON.parse(savedObtained) : [],
        favorites: savedFavorites ? JSON.parse(savedFavorites) : [],
        notes: savedNotes ? JSON.parse(savedNotes) : {},
        obtainedDates: savedDates ? JSON.parse(savedDates) : {},
      };
    } catch {
      return { obtained: [], favorites: [], notes: {}, obtainedDates: {} };
    }
  });

  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'All',
    rarity: 'All',
    variant: 'All',
    obtainedState: 'all',
    sortBy: 'number-asc',
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('sprite_dark_mode');
      if (savedTheme !== null) {
        return savedTheme === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true;
    }
  });

  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>(() => {
    try {
      const savedMode = localStorage.getItem('sprite_view_mode');
      if (savedMode === 'matrix') return 'matrix';
      return 'grid';
    } catch {
      return 'grid';
    }
  });

  const [selectedSprite, setSelectedSprite] = useState<Sprite | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ title: string; description: string } | null>(null);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    try {
      localStorage.setItem('sprite_obtained', JSON.stringify(checklist.obtained));
      localStorage.setItem('sprite_favorites', JSON.stringify(checklist.favorites));
      localStorage.setItem('sprite_notes', JSON.stringify(checklist.notes));
      localStorage.setItem('sprite_obtained_dates', JSON.stringify(checklist.obtainedDates));
    } catch (err) {
      console.error('Could not save checklist state to localStorage', err);
    }
  }, [checklist]);

  // --- THEME EFFECT ---
  useEffect(() => {
    try {
      localStorage.setItem('sprite_dark_mode', String(darkMode));
    } catch (err) {
      console.error('Could not save theme preference to localStorage', err);
    }

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- VIEW MODE PERSISTENCE ---
  useEffect(() => {
    try {
      localStorage.setItem('sprite_view_mode', viewMode);
    } catch (err) {
      console.error('Could not save view mode preference to localStorage', err);
    }
  }, [viewMode]);

  // --- IMAGE POSTER EXPORT ENGINE (1080x1080 1:1) ---
  const handleExportImage = async () => {
    const checkedIds = checklist.obtained;
    const checkedSprites = SPRITES.filter((s) => checkedIds.includes(s.id));
    if (checkedSprites.length === 0) {
      setToastNotification({
        title: 'Export Failed',
        description: 'Please check/obtain at least one sprite to export your collection!',
      });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }

    setIsExporting(true);
    setToastNotification({
      title: 'Generating Poster',
      description: 'Assembling your 1080x1080 1:1 high-resolution sprite collection card...',
    });

    try {
      // Small pause to guarantee DOM nodes in our hidden renderer are complete
      await new Promise((resolve) => setTimeout(resolve, 600));

      const loadPromises = checkedSprites.map((sprite) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const container = document.getElementById(`export-sprite-${sprite.id}`);
          if (!container) {
            reject(new Error(`Container not found for sprite ${sprite.id}`));
            return;
          }
          const svgEl = container.querySelector('svg');
          const imgEl = container.querySelector('img');

          const img = new Image();
          img.crossOrigin = 'anonymous';

          if (imgEl) {
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image for ${sprite.name}`));
            img.src = imgEl.src;
          } else if (svgEl) {
            try {
              const svgString = new XMLSerializer().serializeToString(svgEl);
              const svgWithDimensions = svgString
                .replace('<svg', '<svg width="128" height="128"')
                .replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '')
                .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

              const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgWithDimensions);
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error(`Failed to load SVG for ${sprite.name}`));
              img.src = svgDataUrl;
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`No graphics found for sprite ${sprite.id}`));
          }
        });
      });

      const loadedImages = await Promise.all(loadPromises);

      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to capture canvas 2D render context.');

      // Beautiful gradient background matching current active theme
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
      if (darkMode) {
        bgGrad.addColorStop(0, '#16120E'); // deep warm charcoal
        bgGrad.addColorStop(0.5, '#1D1813'); // mid brown-black
        bgGrad.addColorStop(1, '#100D0A'); // rich dark abyss
      } else {
        bgGrad.addColorStop(0, '#FFFDFA'); // warm light cream
        bgGrad.addColorStop(0.5, '#FFF8EB'); // soft custard
        bgGrad.addColorStop(1, '#FBF4E3'); // elegant sand cream
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Ambient color glows
      if (darkMode) {
        ctx.fillStyle = 'rgba(245, 179, 53, 0.04)'; // warm amber glow
        ctx.beginPath();
        ctx.arc(200, 200, 450, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 217, 119, 0.03)'; // soft golden highlight
        ctx.beginPath();
        ctx.arc(880, 880, 550, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(245, 179, 53, 0.05)'; // warm amber glow for light mode
        ctx.beginPath();
        ctx.arc(200, 200, 450, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 217, 119, 0.04)';
        ctx.beginPath();
        ctx.arc(880, 880, 550, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top title
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const titleGrad = ctx.createLinearGradient(350, 45, 730, 45);
      if (darkMode) {
        titleGrad.addColorStop(0, '#F5B335'); // golden amber
        titleGrad.addColorStop(0.5, '#FFD977'); // soft gold
        titleGrad.addColorStop(1, '#FFF2D4'); // light golden reflection
      } else {
        titleGrad.addColorStop(0, '#B45309'); // rich deep amber-700
        titleGrad.addColorStop(0.5, '#78350F'); // deep bronze amber-900
        titleGrad.addColorStop(1, '#D97706'); // vibrant amber-600
      }
      ctx.fillStyle = titleGrad;
      ctx.font = '900 38px "Inter", system-ui, sans-serif';
      ctx.fillText('MY SPRITE COLLECTION', 540, 45);

      // Subtitle
      ctx.fillStyle = darkMode ? '#9F8F75' : '#6B5E48';
      ctx.font = 'bold 16px "Inter", system-ui, sans-serif';
      ctx.fillText(`${checkedSprites.length} of 74 Sprites Collected • Sprite Checklist`, 540, 96);

      // Arrange dynamic grid
      const N = checkedSprites.length;
      const cols = Math.ceil(Math.sqrt(N));
      const rows = Math.ceil(N / cols);

      const gridW = 980;
      const gridH = 830;
      const cellW = Math.floor(gridW / cols);
      const cellH = Math.floor(gridH / rows);
      const cellSize = Math.min(cellW, cellH);

      // Calculate starting coords to perfectly center grid
      const startX = 540 - (cols * cellSize) / 2;
      const startY = 150 + (830 - rows * cellSize) / 2;

      loadedImages.forEach((img, idx) => {
        const sprite = checkedSprites[idx];
        const c = idx % cols;
        const r = Math.floor(idx / cols);

        const x = startX + c * cellSize;
        const y = startY + r * cellSize;

        const margin = Math.max(2, Math.floor(cellSize * 0.06));
        const cardX = x + margin;
        const cardY = y + margin;
        const cardW = cellSize - margin * 2;
        const cardH = cellSize - margin * 2;

        // Draw card plate
        ctx.fillStyle = darkMode ? 'rgba(29, 24, 19, 0.75)' : 'rgba(255, 253, 250, 0.85)';
        ctx.strokeStyle = darkMode ? 'rgba(241, 228, 198, 0.08)' : 'rgba(107, 94, 72, 0.12)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, Math.min(10, Math.max(4, cellSize * 0.08)));
        ctx.fill();
        ctx.stroke();

        // Sprite bloom glow
        ctx.shadowColor = sprite.features.glowColor || (darkMode ? 'rgba(245, 179, 53, 0.35)' : 'rgba(245, 179, 53, 0.2)');
        ctx.shadowBlur = Math.max(8, cellSize * 0.12);

        // Draw sprite
        const spriteSize = cardW * 0.62;
        const spriteX = cardX + (cardW - spriteSize) / 2;
        const spriteY = cardY + (cardH - spriteSize) / 2 - (cardH * 0.08);
        ctx.drawImage(img, spriteX, spriteY, spriteSize, spriteSize);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Draw text label inside card
        if (cardH > 52) {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          // Name
          const nameSize = Math.max(8, Math.floor(cardH * 0.095));
          ctx.font = `bold ${nameSize}px "Inter", system-ui, sans-serif`;
          ctx.fillStyle = darkMode ? '#F7F0E3' : '#221A12';
          ctx.fillText(sprite.name, cardX + cardW / 2, cardY + cardH - (cardH * 0.18));

          // Variant subtitle
          const subSize = Math.max(7, Math.floor(cardH * 0.075));
          ctx.font = `600 ${subSize}px "Inter", system-ui, sans-serif`;

          const catColors: Record<string, string> = {
            Basic: darkMode ? '#A38F72' : '#6B5E48',
            Gold: '#F5B335',
            Gummy: '#ec4899',
            Galaxy: '#818cf8',
            Holofoil: '#22d3ee',
            Gem: '#10b981',
          };
          ctx.fillStyle = catColors[sprite.category] || (darkMode ? '#9F8F75' : '#8A7A5F');
          ctx.fillText(sprite.variant, cardX + cardW / 2, cardY + cardH - (cardH * 0.06));
        }
      });

      // Bottom footer branding
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = darkMode ? '#4A3B2A' : '#BDB099';
      ctx.font = 'bold 11px "Courier New", Courier, monospace';
      ctx.fillText('v1.2.0 • SPRITE CHECKLIST • POWERED BY SLEEK ASSISTANT', 540, 1055);

      // Trigger automatic save
      const link = document.createElement('a');
      link.download = `my-sprites-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setToastNotification({
        title: 'Export Complete!',
        description: `Exported ${N} obtained sprites on a high-res 1080x1080 PNG poster!`,
      });
      setTimeout(() => setToastNotification(null), 5000);
    } catch (err: any) {
      console.error(err);
      setToastNotification({
        title: 'Export Failed',
        description: err.message || 'An error occurred during canvas drawing.',
      });
      setTimeout(() => setToastNotification(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  // --- ACTIONS ---
  const handleToggleObtained = (id: string) => {
    const sprite = SPRITES.find((s) => s.id === id);
    if (sprite?.unreleased) return;

    setChecklist((prev) => {
      const isObtained = prev.obtained.includes(id);
      const newObtained = isObtained
        ? prev.obtained.filter((item) => item !== id)
        : [...prev.obtained, id];

      const newDates = { ...prev.obtainedDates };
      if (!isObtained) {
        newDates[id] = new Date().toISOString();
      } else {
        delete newDates[id];
      }

      return {
        ...prev,
        obtained: newObtained,
        obtainedDates: newDates,
      };
    });
  };

  const handleToggleFavorite = (id: string) => {
    const sprite = SPRITES.find((s) => s.id === id);
    if (sprite?.unreleased) return;

    setChecklist((prev) => {
      const isFav = prev.favorites.includes(id);
      const newFavorites = isFav
        ? prev.favorites.filter((item) => item !== id)
        : [...prev.favorites, id];

      return {
        ...prev,
        favorites: newFavorites,
      };
    });
  };

  const handleSaveNotes = (id: string, notesText: string) => {
    setChecklist((prev) => {
      const newNotes = { ...prev.notes };
      if (notesText.trim() === '') {
        delete newNotes[id];
      } else {
        newNotes[id] = notesText;
      }

      return {
        ...prev,
        notes: newNotes,
      };
    });
  };

  const handleImportChecklist = (imported: ChecklistState) => {
    setChecklist(imported);
  };

  const handleResetProgress = () => {
    setChecklist({
      obtained: [],
      favorites: [],
      notes: {},
      obtainedDates: {},
    });
    localStorage.removeItem('sprite_obtained');
    localStorage.removeItem('sprite_favorites');
    localStorage.removeItem('sprite_notes');
    localStorage.removeItem('sprite_obtained_dates');
  };

  // --- FILTERED & SORTED DATA ---
  const filteredSprites = useMemo(() => {
    let result = [...SPRITES];

    // Filter by category selection
    if (activeCategory !== 'All') {
      result = result.filter((s) => s.category === activeCategory);
    }

    // Filter by Advanced Filters in the filter bar
    if (filters.rarity !== 'All') {
      result = result.filter((s) => s.rarity === filters.rarity);
    }

    if (filters.variant !== 'All') {
      result = result.filter((s) => s.variant === filters.variant);
    }

    // Filter by search query
    if (filters.search.trim() !== '') {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.number.toLowerCase().includes(query) ||
          s.variant.toLowerCase().includes(query) ||
          s.rarity.toLowerCase().includes(query)
      );
    }

    // Filter by Obtained status
    if (filters.obtainedState === 'obtained') {
      result = result.filter((s) => checklist.obtained.includes(s.id));
    } else if (filters.obtainedState === 'missing') {
      result = result.filter((s) => !checklist.obtained.includes(s.id));
    }

    // Sorting
    const rarityWeights: Record<string, number> = {
      Rare: 1,
      Epic: 2,
      Legendary: 3,
      Mythic: 4,
      Special: 5,
    };

    const getCustomOrderIndex = (name: string): number => {
      const idx = CUSTOM_FAMILY_ORDER.findIndex(
        (n) => n.toLowerCase() === name.toLowerCase()
      );
      return idx === -1 ? 999 : idx;
    };

    const getVariantOrderIndex = (variant: string): number => {
      const idx = VARIANT_ORDER.indexOf(variant);
      return idx === -1 ? 999 : idx;
    };

    result.sort((a, b) => {
      // Prioritize putting unreleased ("Coming") versions at the bottom of the list
      if (a.unreleased && !b.unreleased) return 1;
      if (!a.unreleased && b.unreleased) return -1;

      switch (filters.sortBy) {
        case 'number-asc': {
          const familyDiff = getCustomOrderIndex(a.name) - getCustomOrderIndex(b.name);
          if (familyDiff !== 0) return familyDiff;
          return getVariantOrderIndex(a.variant) - getVariantOrderIndex(b.variant);
        }
        case 'number-desc': {
          const familyDiff = getCustomOrderIndex(b.name) - getCustomOrderIndex(a.name);
          if (familyDiff !== 0) return familyDiff;
          return getVariantOrderIndex(b.variant) - getVariantOrderIndex(a.variant);
        }
        case 'name-asc': {
          const nameDiff = a.name.localeCompare(b.name);
          if (nameDiff !== 0) return nameDiff;
          return getVariantOrderIndex(a.variant) - getVariantOrderIndex(b.variant);
        }
        case 'name-desc': {
          const nameDiff = b.name.localeCompare(a.name);
          if (nameDiff !== 0) return nameDiff;
          return getVariantOrderIndex(b.variant) - getVariantOrderIndex(a.variant);
        }
        case 'rarity-desc': {
          const rarityDiff = (rarityWeights[b.rarity] || 0) - (rarityWeights[a.rarity] || 0);
          if (rarityDiff !== 0) return rarityDiff;
          const familyDiff = getCustomOrderIndex(a.name) - getCustomOrderIndex(b.name);
          if (familyDiff !== 0) return familyDiff;
          return getVariantOrderIndex(a.variant) - getVariantOrderIndex(b.variant);
        }
        case 'rarity-asc': {
          const rarityDiff = (rarityWeights[a.rarity] || 0) - (rarityWeights[b.rarity] || 0);
          if (rarityDiff !== 0) return rarityDiff;
          const familyDiff = getCustomOrderIndex(a.name) - getCustomOrderIndex(b.name);
          if (familyDiff !== 0) return familyDiff;
          return getVariantOrderIndex(a.variant) - getVariantOrderIndex(b.variant);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [checklist.obtained, activeCategory, filters]);

  return (
    <div className="min-h-screen bg-[#FFFDFA] dark:bg-[#16120E] dark:bg-gradient-to-tr dark:from-[#16120E] dark:via-[#1D1813] dark:to-[#16120E] transition-colors duration-500 relative overflow-hidden pb-12 font-sans text-[#221A12] dark:text-[#F7F0E3]">
      {/* Decorative backdrop blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F5B335]/5 dark:bg-[#5C4017]/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#FFD978]/5 dark:bg-[#C98B1F]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Sticky Header with Backdrop Blur */}
      <div className="sticky top-0 z-50 w-full bg-[#FFFDFA]/80 dark:bg-[#16120E]/80 backdrop-blur-md border-b border-[#F1E4C6] dark:border-[#4A3B2A] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onExportImage={handleExportImage}
            isExporting={isExporting}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6 relative z-10">

        {/* Dynamic Global Completion Bar */}
        <StatsDashboard
          sprites={SPRITES}
          obtainedIds={checklist.obtained}
        />

        {/* Filter Toolbar */}
        <FiltersBar
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Category specific description when category is filtered */}
        {activeCategory !== 'All' && (
          <div className="bg-white/70 dark:bg-[#1D1813]/30 px-5 py-3.5 rounded-xl flex items-center justify-between gap-4 border border-[#F1E4C6] dark:border-[#4A3B2A] shadow-xs animate-fadeInScale">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F5B335] dark:bg-[#FFD977] animate-pulse" />
              <p className="text-xs text-[#221A12]/90 dark:text-[#D6C8AF]">
                Displaying sprites from the <span className="font-bold text-[#F5B335] dark:text-[#FFD977]">{activeCategory}</span> category.
              </p>
            </div>
            <button
              onClick={() => setActiveCategory('All')}
              className="text-xs font-bold text-[#F5B335] hover:text-[#FFC95A] dark:text-[#FFD977] cursor-pointer flex items-center gap-1"
            >
              Show All Categories <Icons.X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Sprite Grid or Matrix */}
        {filteredSprites.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fadeInScale">
              {filteredSprites.map((sprite) => (
                <SpriteCard
                  key={sprite.id}
                  sprite={sprite}
                  isObtained={checklist.obtained.includes(sprite.id)}
                  isFavorite={checklist.favorites.includes(sprite.id)}
                  obtainedDate={checklist.obtainedDates[sprite.id]}
                  onToggleObtained={handleToggleObtained}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenDetail={setSelectedSprite}
                />
              ))}
            </div>
          ) : (
            <SpriteMatrix
              sprites={filteredSprites}
              obtainedIds={checklist.obtained}
              favoriteIds={checklist.favorites}
              onToggleObtained={handleToggleObtained}
              onToggleFavorite={handleToggleFavorite}
              onOpenDetail={setSelectedSprite}
            />
          )
        ) : (
          <div className="glass-panel p-12 text-center rounded-3xl space-y-4 max-w-lg mx-auto border border-gray-200/50 dark:border-zinc-800/50 animate-fadeInScale">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-gray-400 dark:text-zinc-600">
              <Icons.HelpCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-800 dark:text-zinc-100">
                No Sprites Found
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                We couldn't find any sprites matching the active filter criteria. Try clearing filters or tweaking your search terms.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCategory('All');
                setFilters({
                  search: '',
                  category: 'All',
                  rarity: 'All',
                  variant: 'All',
                  obtainedState: 'all',
                  sortBy: 'number-asc',
                });
              }}
              className="py-2.5 px-4 bg-[#F5B335] hover:bg-[#FFC95A] dark:hover:bg-[#FFD977] text-white dark:text-[#1A130D] font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8 text-center relative z-10">
        <div className="pt-6 border-t border-[#F1E4C6]/60 dark:border-[#4A3B2A]/40">
          <p className="text-xs font-mono tracking-widest text-[#221A12]/40 dark:text-[#F7F0E3]/30 uppercase">
            AP© | July 2026
          </p>
        </div>
      </footer>

      {/* --- FLOATING MODALS & OVERLAYS --- */}

      {/* Detailed View Modal */}
      <SpriteDetailModal
        sprite={selectedSprite}
        isOpen={selectedSprite !== null}
        onClose={() => setSelectedSprite(null)}
        isObtained={selectedSprite ? checklist.obtained.includes(selectedSprite.id) : false}
        isFavorite={selectedSprite ? checklist.favorites.includes(selectedSprite.id) : false}
        onToggleObtained={handleToggleObtained}
        onToggleFavorite={handleToggleFavorite}
        obtainedDate={selectedSprite ? checklist.obtainedDates[selectedSprite.id] : undefined}
        notes={selectedSprite ? checklist.notes[selectedSprite.id] : ''}
        onSaveNotes={handleSaveNotes}
      />

      {/* Hidden pipeline for off-screen sprite rendering during high-res canvas exports */}
      <div 
        id="hidden-export-container" 
        className="absolute pointer-events-none opacity-0 invisible overflow-hidden" 
        style={{ left: -9999, top: -9999, width: 1, height: 1 }}
      >
        {SPRITES.filter((s) => checklist.obtained.includes(s.id)).map((sprite) => (
          <div key={sprite.id} id={`export-sprite-${sprite.id}`}>
            <ProceduralSprite features={sprite.features} obtained={true} size="md" />
          </div>
        ))}
      </div>

      {/* Settings Data Management Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        state={checklist}
        onImportState={handleImportChecklist}
        onResetAll={handleResetProgress}
      />

      {/* --- SYSTEM NOTIFICATION TOAST --- */}
      {toastNotification && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl text-white shadow-2xl flex items-center gap-4 animate-[fadeInScale_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)] border max-w-sm ${
          toastNotification.title.includes('Failed') || toastNotification.title.includes('Error')
            ? 'bg-linear-to-r from-red-500 to-rose-600 border-rose-400/30'
            : 'bg-linear-to-r from-[#5C4017] to-[#F5B335] border-[#F5B335]/30'
        }`}>
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
            {toastNotification.title.includes('Failed') || toastNotification.title.includes('Error') ? (
              <Icons.AlertCircle className="w-5 h-5 text-white" />
            ) : (
              <Icons.Sparkles className="w-5 h-5 text-white animate-pulse" />
            )}
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="text-[9px] font-bold tracking-widest uppercase text-white/80 block">
              System Notification
            </span>
            <h4 className="text-sm font-black truncate text-white">{toastNotification.title}</h4>
            <p className="text-[11px] text-white/90 leading-tight">
              {toastNotification.description}
            </p>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-white/60 hover:text-white transition-colors p-1 ml-auto"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
