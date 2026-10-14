import React, { useState } from 'react';
import { Link, Copy, Check, Table } from 'lucide-react';

export const UrlConverterTool: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('https://toolnest-hub.netlify.app/tools/merge-pdf?utm_source=google&ref=digital_utility&category=pdf');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const getConverted = () => {
    try {
      if (mode === 'encode') {
        return encodeURIComponent(inputUrl);
      } else {
        return decodeURIComponent(inputUrl);
      }
    } catch {
      return inputUrl;
    }
  };

  const getQueryParams = () => {
    try {
      const url = new URL(inputUrl);
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((val, key) => {
        params.push({ key, value: val });
      });
      return params;
    } catch {
      return [];
    }
  };

  const converted = getConverted();
  const queryParams = getQueryParams();

  const handleCopy = () => {
    navigator.clipboard.writeText(converted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex gap-2 pb-3 border-b border-slate-100">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'encode' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Encode URL (Percent Encoding)
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'decode' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Decode URL
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Input URL / String
          </label>
          <textarea
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            rows={6}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
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
            value={converted}
            rows={6}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 focus:outline-none"
          />
        </div>
      </div>

      {queryParams.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-blue-600" />
            <span>Parsed URL Query Parameters ({queryParams.length})</span>
          </span>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Parameter Key</th>
                  <th className="p-3">Decoded Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {queryParams.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-blue-600">{p.key}</td>
                    <td className="p-3 text-slate-700">{p.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
