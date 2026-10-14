import React, { useState } from 'react';
import { 
  FileText, 
  Image, 
  Calculator, 
  Code2, 
  Wand2, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Star, 
  CheckCircle, 
  Zap, 
  Lock, 
  Layers, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Bookmark,
  Trash2,
  Plus
} from 'lucide-react';
import { CATEGORIES, TOOLS, getPopularTools, getToolById } from '../../data/tools';
import { ToolCategory, ToolDefinition } from '../../types';
import { filterTools } from '../../utils/search';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

const STORAGE_KEY = 'toolnest_favorites';

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Load favorites from localStorage (initialize with popular defaults if first visit)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('toolsnest_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
    }
    // Default favorites for new users
    return ['merge-pdf', 'image-compressor', 'target-kb-resizer', 'percentage-calculator'];
  });

  const popularTools = getPopularTools();

  // Toggle favorite status and persist to localStorage
  const toggleFavorite = (toolId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setFavorites(prev => {
      const isFav = prev.includes(toolId);
      const updated = isFav ? prev.filter(id => id !== toolId) : [...prev, toolId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save favorites to localStorage', err);
      }
      return updated;
    });
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  // Map favorite IDs to actual tool objects
  const favoriteTools = favorites
    .map(id => getToolById(id))
    .filter((t): t is ToolDefinition => Boolean(t));

  const filteredTools = filterTools(TOOLS, searchQuery, selectedCategory);

  const getCategoryIcon = (id: ToolCategory) => {
    switch (id) {
      case 'pdf': return <FileText className="w-5 h-5 text-rose-500" />;
      case 'image': return <Image className="w-5 h-5 text-emerald-500" />;
      case 'calculators': return <Calculator className="w-5 h-5 text-blue-500" />;
      case 'text-dev': return <Code2 className="w-5 h-5 text-purple-500" />;
      case 'generators': return <Wand2 className="w-5 h-5 text-amber-500" />;
    }
  };

  const platformFaqs = [
    {
      q: 'Do you upload my PDF documents or photos to external cloud servers?',
      a: 'No. ToolNest operates on a 100% client-side execution model. All PDF merging, splitting, image compression, formatting, and calculations run locally inside your browser memory via WebAssembly and HTML5 Web APIs. Your private data never leaves your device.'
    },
    {
      q: 'Are all tools on ToolNest truly free to use without registration?',
      a: 'Yes! Every single tool is completely free with no limits, hidden paywalls, or account registration requirements.'
    },
    {
      q: 'Does ToolNest work on mobile phones and tablets?',
      a: 'Yes. Every tool is built with a responsive mobile-first architecture, including touch-friendly canvas signing, exam photo resizing, and calculators that work seamlessly on iOS and Android.'
    },
    {
      q: 'How does ToolNest compare to other platforms like iLovePDF?',
      a: 'Unlike services that queue your files on remote server farms with privacy risks and rate limits, ToolNest executes all algorithms instantly in your browser with zero latency and absolute privacy.'
    }
  ];

  // Render a standardized tool card with favorite toggle and dark mode support
  const renderToolCard = (tool: ToolDefinition, highlightFavorite = false) => {
    const isFav = isFavorite(tool.id);
    return (
      <div
        key={tool.id}
        onClick={() => onNavigate(tool.path)}
        className={`p-5 bg-white dark:bg-slate-900 border rounded-2xl text-left transition-all group cursor-pointer flex flex-col justify-between relative ${
          highlightFavorite && isFav
            ? 'border-amber-200/90 dark:border-amber-900/60 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md'
            : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              highlightFavorite && isFav
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white'
            }`}>
              {getCategoryIcon(tool.category)}
            </div>

            <div className="flex items-center gap-1.5">
              {tool.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {tool.badge}
                </span>
              )}
              {/* Favorite Toggle Button */}
              <button
                type="button"
                onClick={(e) => toggleFavorite(tool.id, e)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isFav
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:scale-110 shadow-2xs'
                    : 'text-slate-300 dark:text-slate-600 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isFav ? "Remove from My Favorites" : "Add to My Favorites"}
                aria-label={isFav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
              >
                <Star className={`w-4 h-4 transition-colors ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
            {tool.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {tool.shortDesc}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <span className="capitalize">{tool.category.replace('-', ' & ')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Privacy Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Private & Client-Side • Zero Server File Uploads</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Free Online <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300 bg-clip-text text-transparent">PDF, Image, Calculator</span> & Developer Tools
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The high-speed digital utility platform for students, developers, creators, and professionals. Merge PDFs, compress images by target KB, calculate EMIs, test regex, and build invoices — with zero latency.
          </p>

          {/* Interactive Search Bar in Hero */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/60 dark:shadow-none border border-slate-200 dark:border-slate-800 p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by tool name or category keywords (e.g. pdf, dev, photo, emi, qr)..."
                className="w-full px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mr-1.5 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            {/* Quick search shortcuts */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-semibold text-slate-400 dark:text-slate-500">Try keywords:</span>
              {['PDF', 'Image', 'Calculators', 'Dev', 'Merge PDF', 'EMI', 'QR Code'].map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className={`px-2 py-0.5 rounded-md text-xs transition-colors cursor-pointer ${
                    searchQuery.toLowerCase() === term.toLowerCase()
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MY FAVORITES SECTION (Top of Homepage) */}
      {!searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">My Favorites</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200/60 dark:border-amber-800">
                    {favoriteTools.length} {favoriteTools.length === 1 ? 'tool' : 'tools'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your personalized quick-access tools saved locally in your browser</p>
              </div>
            </div>

            {favoriteTools.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setFavorites([]);
                  try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
                  } catch (e) {}
                }}
                className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Favorites</span>
              </button>
            )}
          </div>

          {favoriteTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteTools.map(tool => renderToolCard(tool, true))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-dashed border-amber-200 dark:border-amber-900/40 rounded-2xl bg-gradient-to-r from-amber-50/20 via-white to-amber-50/20 dark:from-amber-950/10 dark:via-slate-900 dark:to-amber-950/10">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No favorite tools saved yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Click the star icon <Star className="w-3.5 h-3.5 inline text-amber-500 fill-amber-400 mx-0.5 align-text-bottom" /> on any tool card below to pin your frequently used utilities right here for instant access.
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const sample = ['merge-pdf', 'image-compressor', 'percentage-calculator', 'qr-code-generator'];
                    setFavorites(sample);
                    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sample)); } catch (e) {}
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pin Suggested Daily Tools</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Popular Tools Showcase */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Most Popular Tools</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Frequently used utilities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.slice(0, 8).map(tool => renderToolCard(tool))}
          </div>
        </section>
      )}

      {/* Main Tool Catalog with Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Explore All Tools</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Showing {filteredTools.length} tools available in browser</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = TOOLS.filter(t => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="shrink-0">{getCategoryIcon(cat.id)}</span>
                  <span>{cat.name} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">No tools found matching &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try resetting the category filter or searching for another term.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map(tool => renderToolCard(tool))}
          </div>
        )}
      </section>

      {/* Privacy & Technical Manifesto Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-slate-900 dark:bg-slate-900/90 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Technical Security Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Why We Process Everything in Your Web Browser
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Traditional online converters upload your personal tax forms, resumes, identity cards, and contracts to remote server farms where they can be cached, leaked, or logged. ToolNest does the complete opposite: all heavy processing executes on your device using HTML5 Web APIs and WebAssembly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="bg-slate-800/80 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-700/80">
                <span className="font-bold text-white block mb-1">Zero Cloud Uploads</span>
                <span className="text-slate-400">Files never touch an external server or database.</span>
              </div>
              <div className="bg-slate-800/80 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-700/80">
                <span className="font-bold text-white block mb-1">Zero Latency</span>
                <span className="text-slate-400">Instant processing without file upload or queue wait times.</span>
              </div>
              <div className="bg-slate-800/80 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-700/80">
                <span className="font-bold text-white block mb-1">100% Free Forever</span>
                <span className="text-slate-400">No subscriptions, no artificial size caps, no credit cards.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Platform FAQ</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Frequently asked questions about ToolNest</p>
        </div>

        <div className="space-y-3">
          {platformFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 dark:text-slate-200 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
