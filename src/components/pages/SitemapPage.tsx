import React from 'react';
import { Layers, ArrowRight, ExternalLink } from 'lucide-react';
import { CATEGORIES, getToolsByCategory } from '../../data/tools';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface SitemapPageProps {
  onNavigate: (path: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs toolName="HTML Sitemap & Index" onNavigate={onNavigate} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8 transition-colors duration-200">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ToolNest Complete Site Index
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Complete index of all 38+ live online tools, calculators, and converters.
            </p>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            <span>View XML Sitemap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Categories Breakdown */}
        <div className="space-y-8">
          {CATEGORIES.map(category => {
            const categoryTools = getToolsByCategory(category.id);
            return (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/category/${category.id}`)}
                    className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">({categoryTools.length} tools)</span>
                  </button>
                  <button
                    onClick={() => onNavigate(`/category/${category.id}`)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    View Category &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categoryTools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => onNavigate(tool.path)}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-blue-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate block">
                          {tool.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate block">
                          {tool.path}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
