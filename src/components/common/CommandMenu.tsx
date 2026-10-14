import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  CornerDownLeft, 
  FileText, 
  Image as ImageIcon, 
  Calculator, 
  Code2, 
  Wand2, 
  Clock, 
  Trash2, 
  Sparkles,
  TrendingUp,
  Tag
} from 'lucide-react';
import { ToolDefinition, ToolCategory } from '../../types';
import { 
  searchTools, 
  getRecentSearches, 
  saveRecentSearch, 
  removeRecentSearch, 
  clearRecentSearches 
} from '../../utils/search';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (path: string) => void;
}

const POPULAR_SUGGESTIONS = [
  'Merge PDF',
  'Image Compressor',
  'Target KB Resizer',
  'EMI Calculator',
  'JSON Formatter',
  'QR Code Generator'
];

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K toggle handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Filter tools using enhanced category keywords & name search
  const filteredTools = searchTools(query);

  const handleSelect = (tool: ToolDefinition) => {
    if (query.trim()) {
      saveRecentSearch(query);
    } else {
      saveRecentSearch(tool.name);
    }
    setRecentSearches(getRecentSearches());
    onSelectTool(tool.path);
    onClose();
  };

  const handleApplyRecentSearch = (term: string) => {
    setQuery(term);
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  const handleRemoveRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = removeRecentSearch(term);
    setRecentSearches(updated);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex]);
      } else if (query.trim()) {
        saveRecentSearch(query);
        setRecentSearches(getRecentSearches());
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (category: ToolCategory) => {
    switch (category) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'image': return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case 'calculators': return <Calculator className="w-4 h-4 text-blue-500" />;
      case 'text-dev': return <Code2 className="w-4 h-4 text-purple-500" />;
      case 'generators': return <Wand2 className="w-4 h-4 text-amber-500" />;
    }
  };

  const getCategoryBadge = (category: ToolCategory) => {
    switch (category) {
      case 'pdf': return <span className="text-[10px] bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 font-semibold px-2 py-0.5 rounded border border-rose-200/50 dark:border-rose-900/50">PDF</span>;
      case 'image': return <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-900/50">Image</span>;
      case 'calculators': return <span className="text-[10px] bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded border border-blue-200/50 dark:border-blue-900/50">Calc</span>;
      case 'text-dev': return <span className="text-[10px] bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 font-semibold px-2 py-0.5 rounded border border-purple-200/50 dark:border-purple-900/50">Dev</span>;
      case 'generators': return <span className="text-[10px] bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/50">Productivity</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 sm:px-6">
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3 bg-white dark:bg-slate-900">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search by tool name or category keyword (e.g. pdf, emi, photo, dev, password)..."
            className="w-full text-slate-900 dark:text-slate-100 text-sm sm:text-base outline-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {query && (
            <button 
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }} 
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Modal Body */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          
          {/* Recent Searches Section (Shown when query is empty and recent searches exist) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-3 bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Recent Searches
                </span>
                <button
                  onClick={handleClearAllRecent}
                  className="text-[11px] font-medium text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 px-1">
                {recentSearches.map((term, i) => (
                  <div
                    key={i}
                    onClick={() => handleApplyRecentSearch(term)}
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all shadow-2xs"
                  >
                    <Clock className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span>{term}</span>
                    <button
                      onClick={(e) => handleRemoveRecentSearch(e, term)}
                      className="ml-0.5 p-0.5 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Quick Keywords (When search query is empty) */}
          {!query.trim() && (
            <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Popular Quick Searches
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyRecentSearch(sug)}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="p-2 divide-y divide-slate-50 dark:divide-slate-800/40">
            {filteredTools.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                No matching tools or category keywords found for &ldquo;<span className="text-slate-900 dark:text-white font-medium">{query}</span>&rdquo;.
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                  Try broader terms like <span className="font-semibold text-slate-600 dark:text-slate-300">&ldquo;pdf&rdquo;</span>, <span className="font-semibold text-slate-600 dark:text-slate-300">&ldquo;image&rdquo;</span>, <span className="font-semibold text-slate-600 dark:text-slate-300">&ldquo;calculator&rdquo;</span>, or <span className="font-semibold text-slate-600 dark:text-slate-300">&ldquo;developer&rdquo;</span>.
                </p>
              </div>
            ) : (
              <div>
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>{query.trim() ? 'Matching Tools' : 'Recommended Utilities'}</span>
                  <span className="text-[10px] font-normal">{filteredTools.length} tools</span>
                </div>

                {filteredTools.map((tool, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleSelect(tool)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-50/80 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 ring-1 ring-blue-200 dark:ring-blue-800' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {getCategoryIcon(tool.category)}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {tool.name}
                            </span>
                            {getCategoryBadge(tool.category)}
                            {tool.popular && (
                              <span className="text-[10px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded border border-amber-200/50 dark:border-amber-900/40 hidden sm:inline-block">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {tool.shortDesc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected ? (
                          <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold">
                            Open <CornerDownLeft className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span>Navigate with <kbd className="font-mono bg-white dark:bg-slate-900 px-1 border border-slate-200 dark:border-slate-800 rounded">↑</kbd> <kbd className="font-mono bg-white dark:bg-slate-900 px-1 border border-slate-200 dark:border-slate-800 rounded">↓</kbd></span>
            <span>Select with <kbd className="font-mono bg-white dark:bg-slate-900 px-1 border border-slate-200 dark:border-slate-800 rounded">↵</kbd></span>
          </div>
          <span>Press <kbd className="font-mono bg-white dark:bg-slate-900 px-1 border border-slate-200 dark:border-slate-800 rounded">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
