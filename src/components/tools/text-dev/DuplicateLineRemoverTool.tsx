import React, { useState } from 'react';
import { CopySlash, Copy, Check, Trash2, ArrowDownAZ } from 'lucide-react';

export const DuplicateLineRemoverTool: React.FC = () => {
  const [text, setText] = useState(`apple\nbanana\norange\napple\ngrapes\nbanana\nwatermelon\napple`);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sortAlpha, setSortAlpha] = useState(false);
  const [copied, setCopied] = useState(false);

  const processLines = () => {
    let lines = text.split('\n');

    if (trimWhitespace) {
      lines = lines.map(l => l.trim());
    }

    if (removeEmpty) {
      lines = lines.filter(l => l.length > 0);
    }

    const seen = new Set<string>();
    const unique: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }

    if (sortAlpha) {
      unique.sort((a, b) => a.localeCompare(b));
    }

    return {
      originalCount: lines.length,
      uniqueCount: unique.length,
      removedCount: lines.length - unique.length,
      resultText: unique.join('\n')
    };
  };

  const { originalCount, uniqueCount, removedCount, resultText } = processLines();

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={e => setCaseSensitive(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Case Sensitive</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimWhitespace}
            onChange={e => setTrimWhitespace(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Trim Whitespace</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeEmpty}
            onChange={e => setRemoveEmpty(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Remove Empty Lines</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sortAlpha}
            onChange={e => setSortAlpha(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Sort Alphabetically (A-Z)</span>
        </label>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-slate-500 block">Original Lines</span>
          <span className="text-lg font-bold text-slate-800">{originalCount}</span>
        </div>
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <span className="text-rose-700 block font-semibold">Duplicates Removed</span>
          <span className="text-lg font-bold text-rose-600">-{removedCount}</span>
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-emerald-700 block font-semibold">Unique Lines Remaining</span>
          <span className="text-lg font-bold text-emerald-600">{uniqueCount}</span>
        </div>
      </div>

      {/* Editor & Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Input Raw List
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Deduplicated Result
            </label>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={resultText}
            rows={10}
            className="w-full p-3 font-mono text-xs rounded-xl border border-emerald-200 bg-emerald-50/30 text-slate-800 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
