import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES } from '../../data/tools';
import { ToolCategory } from '../../types';

interface BreadcrumbsProps {
  category?: ToolCategory;
  toolName?: string;
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ category, toolName, onNavigate }) => {
  const catDef = category ? CATEGORIES.find(c => c.id === category) : null;

  return (
    <nav className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 py-3" aria-label="Breadcrumb">
      <button 
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {catDef && (
        <>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-300 dark:text-slate-600 shrink-0" />
          <button
            onClick={() => onNavigate(`/category/${catDef.id}`)}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer capitalize"
          >
            {catDef.name}
          </button>
        </>
      )}

      {toolName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-300 dark:text-slate-600 shrink-0" />
          <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px] sm:max-w-none">
            {toolName}
          </span>
        </>
      )}
    </nav>
  );
};
