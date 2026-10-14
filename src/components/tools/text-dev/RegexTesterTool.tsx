import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

interface Preset {
  name: string;
  pattern: string;
  flags: string;
  sample: string;
}

const REGEX_PRESETS: Preset[] = [
  { name: 'Email Address', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g', sample: 'Contact support@toolnest.com or admin@example.org for inquiries.' },
  { name: 'URL / Web Address', pattern: 'https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+', flags: 'g', sample: 'Visit https://toolnest-hub.netlify.app/ or https://example.com/test?q=123' },
  { name: 'IPv4 Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g', sample: 'Gateway: 192.168.1.1, DNS: 8.8.8.8 and fallback 127.0.0.1' },
  { name: 'Hex Color', pattern: '#(?:[a-fA-F0-9]{3}){1,2}\\b', flags: 'g', sample: 'Colors: #2563eb, #ffffff, #000, and #10b981' },
  { name: 'Phone Number', pattern: '\\+?\\d{1,3}?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', flags: 'g', sample: 'Call +1 (555) 234-5678 or 555-890-1234.' },
];

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState(REGEX_PRESETS[0].pattern);
  const [flags, setFlags] = useState(REGEX_PRESETS[0].flags);
  const [testString, setTestString] = useState(REGEX_PRESETS[0].sample);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (p: Preset) => {
    setPattern(p.pattern);
    setFlags(p.flags);
    setTestString(p.sample);
    setError(null);
  };

  const getMatches = () => {
    if (!pattern) return [];
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { text: string; index: number; groups: string[] }[] = [];
      let match;
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (!regex.global) break;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      return matches;
    } catch (err: any) {
      return [];
    }
  };

  const matches = getMatches();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Presets */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Preset Patterns</span>
        <div className="flex flex-wrap gap-2">
          {REGEX_PRESETS.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Regex Input Bar */}
      <div className="p-4 bg-slate-900 rounded-2xl text-slate-100 space-y-3">
        <label className="block text-xs font-mono text-slate-400">Regular Expression Pattern</label>
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono text-slate-500">/</span>
          <input
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            className="flex-1 bg-transparent border-b border-slate-700 font-mono text-sm text-emerald-400 outline-none pb-1"
            placeholder="Regex pattern"
          />
          <span className="text-xl font-mono text-slate-500">/</span>
          <input
            type="text"
            value={flags}
            onChange={e => setFlags(e.target.value)}
            className="w-16 bg-transparent border-b border-slate-700 font-mono text-sm text-amber-400 outline-none pb-1 text-center"
            placeholder="flags"
          />
        </div>
        <div className="flex gap-4 text-[11px] font-mono text-slate-400 pt-1">
          <span>Flags: <code className="text-amber-400">g</code> (global), <code className="text-amber-400">i</code> (case-insensitive), <code className="text-amber-400">m</code> (multiline)</span>
        </div>
      </div>

      {/* Test String Area */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          Test String
        </label>
        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          rows={5}
          className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
        />
      </div>

      {/* Matches Inspection Card */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Matches Found ({matches.length})
          </span>
          <span className="text-xs text-slate-500">{pattern ? `Evaluated cleanly` : 'Enter a regex pattern'}</span>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {matches.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs">
                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  Match #{idx + 1}: &ldquo;{m.text}&rdquo;
                </span>
                <span className="text-slate-400 text-[10px]">Index: {m.index}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">No matches in current test string.</div>
        )}
      </div>
    </div>
  );
};
