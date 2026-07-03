import React, { useRef, useState } from 'react';
import { ChecklistState } from '../types';
import * as Icons from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  state: ChecklistState;
  onImportState: (imported: ChecklistState) => void;
  onResetAll: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  state,
  onImportState,
  onResetAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `sprite-checklist-backup-${new Date().toISOString().slice(0, 10)}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Could not export checklist data', err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsed = JSON.parse(result);

        // Simple validation
        if (
          parsed &&
          Array.isArray(parsed.obtained) &&
          Array.isArray(parsed.favorites) &&
          typeof parsed.notes === 'object' &&
          typeof parsed.obtainedDates === 'object'
        ) {
          onImportState(parsed);
          setImportSuccess(true);
          setImportError('');
          setTimeout(() => {
            setImportSuccess(false);
            onClose();
          }, 2000);
        } else {
          setImportError('Invalid backup file format. Must contain valid checklist configurations.');
        }
      } catch (err) {
        setImportError('Failed to parse file. Make sure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetConfirm = () => {
    onResetAll();
    setResetConfirm(false);
    onClose();
  };

  const notesCount = Object.keys(state.notes).filter((k) => state.notes[k]?.trim() !== '').length;
  const favoritesCount = state.favorites.length;
  const obtainedCount = state.obtained.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Panel Container */}
      <div className="bg-white dark:bg-[#1D1813] border border-[#F1E4C6] dark:border-[#4A3B2A] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative z-10 flex flex-col transition-all duration-300 animate-[fadeInScale_0.25s_ease-out]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#F1E4C6] dark:border-[#4A3B2A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.Settings className="w-5 h-5 text-[#F59E0B] dark:text-[#FFD977]" />
            <h3 className="text-xl font-display font-bold text-[#221A12] dark:text-[#F7F0E3]">
              Data Management
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#A38F72] hover:text-[#221A12] dark:text-[#A89478] dark:hover:text-[#F7F0E3] hover:bg-[#FFF4DE] dark:hover:bg-[#2C231B] transition-colors cursor-pointer"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active stats */}
          <div className="p-4 bg-[#FFF8EF] dark:bg-[#241D16] rounded-xl border border-[#F1E4C6] dark:border-[#4A3B2A] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="space-y-1">
              <span className="text-[#A38F72] dark:text-[#A89478] block">Obtained</span>
              <span className="text-base font-bold text-[#221A12] dark:text-[#F7F0E3] font-mono">
                {obtainedCount}
              </span>
            </div>
            <div className="space-y-1 border-x border-[#F1E4C6] dark:border-[#4A3B2A]">
              <span className="text-[#A38F72] dark:text-[#A89478] block">Favorites</span>
              <span className="text-base font-bold text-[#F5B335] font-mono">
                {favoritesCount}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[#A38F72] dark:text-[#A89478] block">Notes Added</span>
              <span className="text-base font-bold text-[#F5B335] dark:text-[#FFD977] font-mono">
                {notesCount}
              </span>
            </div>
          </div>

          {/* Backup & Import Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A38F72] dark:text-[#A89478]">
              Checklist Backup & Restore
            </h4>
            
            <p className="text-xs text-[#6B5E48] dark:text-[#D6C8AF] leading-relaxed">
              Download your progress to your device so you can restore your checklist later or import it on another device.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Export Button */}
              <button
                onClick={handleExport}
                className="py-2.5 px-4 bg-[#F5B335] hover:bg-[#FFC95A] dark:hover:bg-[#FFD977] text-white dark:text-[#1A130D] rounded-xl text-xs font-bold transition-all shadow-[0_4px_12px_rgba(245,158,11,0.2)] dark:shadow-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icons.Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>

              {/* Import Button */}
              <button
                onClick={handleImportClick}
                className="py-2.5 px-4 bg-white hover:bg-[#FFF4DE] dark:bg-[#241D16] dark:hover:bg-[#2C231B] text-[#6B5E48] dark:text-[#D6C8AF] border border-[#F1E4C6] dark:border-[#4A3B2A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icons.Upload className="w-4 h-4" />
                <span>Import JSON</span>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFileChange}
                className="hidden"
              />
            </div>

            {/* Import Status feedback */}
            {importSuccess && (
              <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <Icons.CheckCircle2 className="w-4 h-4" />
                Checklist imported successfully!
              </div>
            )}
            {importError && (
              <div className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                <Icons.AlertTriangle className="w-4 h-4" />
                {importError}
              </div>
            )}
          </div>

          {/* Factory Reset Danger Zone */}
          <div className="space-y-3 pt-4 border-t border-[#F1E4C6] dark:border-[#4A3B2A]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Danger Zone
            </h4>

            {resetConfirm ? (
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                  <Icons.AlertTriangle className="w-4 h-4" />
                  Are you absolutely sure?
                </p>
                <p className="text-[11px] text-[#6B5E48] dark:text-[#D6C8AF]">
                  This action is permanent and will erase all checked items, favorites, notes, and achievement completion scores.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetConfirm}
                    className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setResetConfirm(false)}
                    className="flex-1 py-2 px-3 bg-[#FFF4DE] dark:bg-[#241D16] text-[#6B5E48] dark:text-[#D6C8AF] border border-[#F1E4C6] dark:border-[#4A3B2A] text-xs font-bold rounded-lg hover:bg-[#FFE9C2] dark:hover:bg-[#2C231B] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border border-rose-500/20 hover:border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Icons.Trash2 className="w-4 h-4" />
                <span>Reset All Progress</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
