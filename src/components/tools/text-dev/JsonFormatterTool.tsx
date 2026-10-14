import React, { useState } from 'react';
import { Braces, Copy, Check, Minimize2, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const [inputJson, setInputJson] = useState(`{"platform":"ToolNest","features":["PDF Tools","Image Optimizer","Calculators","Dev Utilities"],"stats":{"toolsCount":38,"privacyPercent":100,"pricing":"Free forever"},"clientSide":true}`);
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number) => {
    setError(null);
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, spaces);
      setOutputJson(formatted);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax.');
    }
  };

  const minifyJson = () => {
    setError(null);
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputJson || inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const textToDownload = outputJson || inputJson;
    const blob = new Blob([textToDownload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => formatJson(2)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
          >
            Prettify (2 Spaces)
          </button>
          <button
            onClick={() => formatJson(4)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
          >
            Prettify (4 Spaces)
          </button>
          <button
            onClick={minifyJson}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify / Compact</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={downloadJson}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>JSON Syntax Error: {error}</span>
        </div>
      )}

      {/* Side-by-side Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Raw JSON Input
          </label>
          <textarea
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
            rows={14}
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Formatted Output
          </label>
          <textarea
            readOnly
            value={outputJson || inputJson}
            rows={14}
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 focus:outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
