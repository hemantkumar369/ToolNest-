import React, { useState } from 'react';
import { 
  FileText, 
  Image, 
  Calculator, 
  Code2, 
  Wand2, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown,
  Layers,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { CATEGORIES } from '../../data/tools';
import { ToolCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();

  const getCategoryIcon = (id: ToolCategory) => {
    switch (id) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'image': return <Image className="w-4 h-4 text-emerald-500" />;
      case 'calculators': return <Calculator className="w-4 h-4 text-blue-500" />;
      case 'text-dev': return <Code2 className="w-4 h-4 text-purple-500" />;
      case 'generators': return <Wand2 className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top micro banner for privacy */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-transparent dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">100% Client-Side Privacy:</span>
            <span className="hidden sm:inline text-slate-400">Files & calculations are processed entirely in your web browser. Zero server uploads.</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button 
              onClick={() => onNavigate('/privacy')}
              className="hover:text-white transition-colors cursor-pointer text-xs underline decoration-slate-600 underline-offset-2"
            >
              Privacy Guarantee
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">Free Forever</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Tool<span className="text-blue-600 dark:text-blue-400">Nest</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 tracking-wide">
                  HUB
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Fast, Private Online Toolkit</p>
            </div>
          </button>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('/')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentPath === '/' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Tools
            </button>

            {CATEGORIES.map((cat) => {
              const active = currentPath.startsWith(`/category/${cat.id}`);
              return (
                <button
                  key={cat.id}
                  onClick={() => onNavigate(`/category/${cat.id}`)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    active 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Search & Dark Mode Toggle & Quick CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
              title="Search tools (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-400" />
              <span className="hidden sm:inline">Search 38+ tools...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400 dark:text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Global Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-amber-300 transition-all cursor-pointer shadow-2xs flex items-center justify-center"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => {
                onNavigate('/');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Explore All Tools</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigate(`/category/${cat.id}`);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  {getCategoryIcon(cat.id)}
                  <span>{cat.name}</span>
                </div>
                <span className="text-xs text-slate-400">View</span>
              </button>
            ))}

            {/* Mobile Dark Mode Toggle Item */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-2 pt-3"
            >
              <div className="flex items-center gap-3">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                <span>Appearance Theme</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <button 
              onClick={() => {
                onNavigate('/privacy');
                setMobileMenuOpen(false);
              }}
              className="text-blue-600 dark:text-blue-400 font-medium"
            >
              Privacy & Security
            </button>
            <button 
              onClick={() => {
                onNavigate('/sitemap');
                setMobileMenuOpen(false);
              }}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              HTML Sitemap
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
