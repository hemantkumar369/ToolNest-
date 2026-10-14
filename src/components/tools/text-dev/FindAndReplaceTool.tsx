import React, { useState } from 'react';
import { Search, Copy, Check, Replace } from 'lucide-react';

export const FindAndReplaceTool: React.FC = () => {
  const [content, setContent] = useState(
    'The quick brown fox jumps over the lazy dog. The fox was quick, clever, and alert.'
  );
  const [findText, setFindText] = useState('fox');
  const [replaceText, setReplaceText] = useState('cat');
  const [isRegex, setIsRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [copied, setCopied] = useState(false);

  const calculateMatches = () => {
    if (!findText) return { count: 0, replaced: content };
    try {
      let pattern = isRegex ? findText : findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (wholeWord && !isRegex) pattern = `\\b${pattern}\\b`;

      const flags = matchCase ? 'g' : 'gi';
      const regex = new RegExp(pattern, flags);
      const matches = content.match(regex);
      const count = matches ? matches.length : 0;
      const replaced = content.replace(regex, replaceText);
      return { count, replaced };
    } catch {
      return { count: 0, replaced: content };
    }
  };

  const { count, replaced } = calculateMatches();

  const handleApply = () => {
    setContent(replaced);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(replaced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Search & Replace Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Find
          </label>
          <div className="relative">
            <input
              type="text"
              value={findText}
              onChange={e => setFindText(e.target.value)}
              placeholder="Search text or pattern"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium pl-9"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <span className="absolute right-3 top-2.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {count} {count === 1 ? 'match' : 'matches'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Replace With
          </label>
          <input
            type="text"
            value={replaceText}
            onChange={e => setReplaceText(e.target.value)}
            placeholder="Replacement string"
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
          />
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={e => setMatchCase(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Match Case</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={e => setWholeWord(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Match Whole Word</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRegex}
              onChange={e => setIsRegex(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Regular Expression (Regex)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApply}
            disabled={count === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Replace className="w-3.5 h-3.5" />
            <span>Replace All ({count})</span>
          </button>
        </div>
      </div>

      {/* Side by side Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Current Document Text
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preview Result
            </label>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={replaced}
            rows={8}
            className="w-full p-3 font-mono text-xs rounded-xl border border-emerald-200 bg-emerald-50/30 text-slate-800 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
