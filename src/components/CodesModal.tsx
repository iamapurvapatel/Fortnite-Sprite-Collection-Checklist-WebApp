import React, { useState, useMemo } from 'react';
import { REWARD_CODES, CheatCode } from '../data/codes';
import * as Icons from 'lucide-react';

interface CodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimedCodes: string[];
  onToggleClaimed: (codeId: string) => void;
  onSelectSprite?: (spriteId: string) => void;
}

export const CodesModal: React.FC<CodesModalProps> = ({
  isOpen,
  onClose,
  claimedCodes,
  onToggleClaimed,
  onSelectSprite,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bulkCopied, setBulkCopied] = useState(false);

  const categories = useMemo(() => {
    return ['All', 'Sprite Unlock', 'XP & Dust', 'Gameplay Buffs', 'Cosmetics', 'Transforms'];
  }, []);

  const filteredCodes = useMemo(() => {
    return REWARD_CODES.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const searchLower = search.toLowerCase().trim();
      const matchesSearch =
        searchLower === '' ||
        item.code.toLowerCase().includes(searchLower) ||
        item.reward.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        item.category.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const claimedCount = useMemo(() => {
    return REWARD_CODES.filter((c) => claimedCodes.includes(c.id)).length;
  }, [claimedCodes]);

  const handleCopy = (item: CheatCode) => {
    navigator.clipboard.writeText(item.code);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const list = filteredCodes.map((c) => `${c.code} -> ${c.reward}`).join('\n');
    navigator.clipboard.writeText(list);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#15102A] rounded-xl sm:rounded-2xl border border-[#E9D5FF] dark:border-[#2A2147] shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3 sm:p-4.5 border-b border-[#E9D5FF]/80 dark:border-[#2A2147] bg-linear-to-r from-purple-50/80 via-white to-pink-50/40 dark:from-[#1E1738] dark:via-[#15102A] dark:to-[#22163B] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-linear-to-tr from-amber-500 to-purple-600 text-white shadow-sm shadow-amber-500/20 shrink-0">
              <Icons.KeyRound className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-display font-black text-[#1E1A34] dark:text-[#F3E8FF] truncate">
                  Secret Codes & Rewards Vault
                </h2>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black uppercase bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 shrink-0">
                  C7S4
                </span>
              </div>
              <p className="text-[10.5px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">
                Redeem at in-match terminal prompt for sprites, XP, and items.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            <Icons.X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>

        {/* Progress & Quick Actions Bar */}
        <div className="px-3 sm:px-4.5 py-2 bg-[#FAF5FF] dark:bg-[#1A1435]/60 border-b border-[#E9D5FF]/60 dark:border-[#2A2147] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-1 font-bold text-[#5B21B6] dark:text-[#C084FC] text-[11px] sm:text-xs">
              <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                Claimed: <strong className="text-[#1E1A34] dark:text-[#F3E8FF] font-mono">{claimedCount}</strong>/{REWARD_CODES.length}
              </span>
            </div>
            <div className="w-16 sm:w-28 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${(claimedCount / REWARD_CODES.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-[#20183E] text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 text-[10px] sm:text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
            >
              {bulkCopied ? (
                <>
                  <Icons.Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                  <span>All Copied!</span>
                </>
              ) : (
                <>
                  <Icons.Copy className="w-3 h-3" />
                  <span>Copy List</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="p-2.5 sm:px-4.5 pb-1.5 space-y-2 bg-white dark:bg-[#15102A]">
          <div className="relative">
            <Icons.Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search codes or rewards..."
              className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#1A1435] text-xs text-[#1E1A34] dark:text-[#F3E8FF] placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-[#A855F7]/40 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <Icons.X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? REWARD_CODES.length
                  : REWARD_CODES.filter((c) => c.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[10.5px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-[#A855F7] text-white shadow-2xs shadow-purple-500/30'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[8.5px] px-1 py-0.1 rounded font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Codes List */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:px-4.5 space-y-1.5 sm:space-y-2">
          {filteredCodes.length > 0 ? (
            filteredCodes.map((item) => {
              const isClaimed = claimedCodes.includes(item.id);
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`group relative p-2 sm:p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-2.5 ${
                    isClaimed
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-300/40 dark:border-emerald-800/30 opacity-75'
                      : 'bg-zinc-50/80 dark:bg-[#1A1435]/70 border-zinc-200 dark:border-[#2A2147] hover:border-purple-300 dark:hover:border-purple-800/80 hover:shadow-2xs'
                  }`}
                >
                  {/* Left info */}
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    {/* Icon Badge */}
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${
                        item.iconType === 'sprite'
                          ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                          : item.iconType === 'xp'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                          : item.iconType === 'dust'
                          ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                          : item.iconType === 'transform'
                          ? 'bg-pink-500/15 text-pink-600 dark:text-pink-300 border border-pink-500/30'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.iconType === 'sprite' && <Icons.Gamepad2 className="w-3.5 h-3.5" />}
                      {item.iconType === 'xp' && <Icons.Zap className="w-3.5 h-3.5" />}
                      {item.iconType === 'dust' && <Icons.Sparkles className="w-3.5 h-3.5" />}
                      {item.iconType === 'transform' && <Icons.Box className="w-3.5 h-3.5" />}
                      {item.iconType === 'buff' && <Icons.ShieldAlert className="w-3.5 h-3.5" />}
                      {item.iconType === 'cosmetic' && <Icons.Image className="w-3.5 h-3.5" />}
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* The Code Badge */}
                        <div className="flex items-center gap-1 bg-white dark:bg-[#20183E] px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-900/60 shadow-2xs">
                          <code className="text-[11px] sm:text-xs font-mono font-black text-[#5B21B6] dark:text-[#C084FC] tracking-wide select-all">
                            {item.code}
                          </code>
                          <button
                            onClick={() => handleCopy(item)}
                            className="p-0.5 text-zinc-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                            title="Click to copy code"
                          >
                            {isCopied ? (
                              <Icons.Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                            ) : (
                              <Icons.Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Category tag */}
                        <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight hidden sm:inline">
                          {item.category}
                        </span>

                        {isClaimed && (
                          <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                            <Icons.Check className="w-2.5 h-2.5 stroke-[3]" />
                            Redeemed
                          </span>
                        )}
                      </div>

                      {/* Reward text */}
                      <p className="text-[11px] sm:text-xs font-bold text-[#1E1A34] dark:text-[#F3E8FF] truncate">
                        {item.reward}
                      </p>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(item)}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10.5px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-purple-100/80 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Icons.Check className="w-3 h-3 stroke-[3]" />
                          <span className="hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <>
                          <Icons.Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Claimed checkbox */}
                    <button
                      onClick={() => onToggleClaimed(item.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                        isClaimed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1F173C] text-zinc-400 hover:border-emerald-400 hover:text-emerald-500'
                      }`}
                      title={isClaimed ? "Mark as unredeemed" : "Mark as redeemed in Fortnite"}
                    >
                      <Icons.Check className={`w-3 h-3 ${isClaimed ? 'stroke-[3]' : 'opacity-30'}`} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 space-y-1.5">
              <Icons.HelpCircle className="w-6 h-6 text-zinc-400 mx-auto" />
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                No codes found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Tip */}
        <div className="p-2.5 sm:px-4.5 bg-zinc-50 dark:bg-[#120D24] border-t border-zinc-200/80 dark:border-[#2A2147] flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 truncate mr-2">
            <Icons.Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              Redeem at arcade terminal in Chapter 7 Season 4 matches.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-[11px] transition-colors cursor-pointer shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
