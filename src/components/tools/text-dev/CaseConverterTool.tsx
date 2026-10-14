import React, { useState } from 'react';
import { CaseSensitive, Copy, Check, Trash2 } from 'lucide-react';

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState('ToolNest transforms online productivity with instant client-side execution');
  const [copied, setCopied] = useState(false);

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/(?:^|\s|-)\w/g, match => match.toUpperCase());
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map((word, i) => (i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
      .join('');
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const toAlternatingCase = (str: string) => {
    return str
      .split('')
      .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
      .join('');
  };

  const applyCase = (type: string) => {
    switch (type) {
      case 'upper': setText(text.toUpperCase()); break;
      case 'lower': setText(text.toLowerCase()); break;
      case 'title': setText(toTitleCase(text)); break;
      case 'sentence': setText(toSentenceCase(text)); break;
      case 'camel': setText(toCamelCase(text)); break;
      case 'snake': setText(toSnakeCase(text)); break;
      case 'kebab': setText(toKebabCase(text)); break;
      case 'constant': setText(toConstantCase(text)); break;
      case 'alt': setText(toAlternatingCase(text)); break;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Transformation buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Choose Case Style</span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'upper', label: 'UPPERCASE' },
            { id: 'lower', label: 'lowercase' },
            { id: 'title', label: 'Title Case' },
            { id: 'sentence', label: 'Sentence case' },
            { id: 'camel', label: 'camelCase' },
            { id: 'snake', label: 'snake_case' },
            { id: 'kebab', label: 'kebab-case' },
            { id: 'constant', label: 'CONSTANT_CASE' },
            { id: 'alt', label: 'aLtErNaTiNg' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => applyCase(opt.id)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Copy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">Output Text</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setText('')}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          className="w-full p-4 rounded-xl border border-slate-300 font-mono text-sm leading-relaxed bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
