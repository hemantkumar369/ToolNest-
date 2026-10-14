import React, { useState } from 'react';
import { Type, Copy, Check, Clock, Volume2, Trash2 } from 'lucide-react';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState(
    'ToolNest is a lightning-fast digital utility suite that processes documents, images, and calculations 100% locally in your web browser. Experience instant performance with zero latency and full privacy.'
  );
  const [copied, setCopied] = useState(false);

  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = cleanText ? (cleanText.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || 1 : 0;
  const paragraphs = cleanText ? cleanText.split(/\n+/).filter(Boolean).length : 0;

  // Reading time (~225 wpm) and speaking time (~130 wpm)
  const readingTimeMinutes = (words / 225).toFixed(1);
  const speakingTimeMinutes = (words / 130).toFixed(1);

  // Keyword density
  const getKeywordFrequency = () => {
    if (!cleanText) return [];
    const tokens = cleanText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const counts: Record<string, number> = {};
    tokens.forEach(w => counts[w] = (counts[w] || 0) + 1);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / tokens.length) * 100).toFixed(1)
      }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl">
          <span className="text-[11px] text-blue-700 font-bold block">Words</span>
          <span className="text-3xl font-black text-blue-900">{words.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[11px] text-slate-500 font-bold block">Characters</span>
          <span className="text-3xl font-black text-slate-800">{charsWithSpaces.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{charsNoSpaces} without spaces</span>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[11px] text-slate-500 font-bold block">Sentences</span>
          <span className="text-3xl font-black text-slate-800">{sentences}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{paragraphs} paragraphs</span>
        </div>
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
          <span className="text-[11px] text-emerald-700 font-bold block">Reading Time</span>
          <span className="text-2xl font-black text-emerald-800">~{readingTimeMinutes} m</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Speaking: ~{speakingTimeMinutes} m</span>
        </div>
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">Editor</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setText('')}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={9}
          placeholder="Type or paste your text here to analyze..."
          className="w-full p-4 rounded-xl border border-slate-300 text-sm leading-relaxed bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Keyword Density Table */}
      {words > 5 && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Top Keyword Density</span>
          <div className="flex flex-wrap gap-2">
            {getKeywordFrequency().map(item => (
              <span key={item.word} className="px-3 py-1 bg-slate-100 rounded-lg text-xs text-slate-700 font-medium">
                <strong className="text-slate-900">{item.word}</strong>: {item.count} ({item.density}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
