import React, { useState } from 'react';
import { Binary, Copy, Check, Upload, Download, AlertCircle } from 'lucide-react';

export const Base64ConverterTool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState('ToolNest is fast, private, and 100% client-side!');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = (input: string, currentMode: 'encode' | 'decode') => {
    setError(null);
    try {
      if (currentMode === 'encode') {
        // UTF-8 safe encode
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutputText(encoded);
      } else {
        // UTF-8 safe decode
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        setOutputText(decoded);
      }
    } catch (err: any) {
      setError(currentMode === 'decode' ? 'Invalid Base64 encoded string.' : err?.message);
    }
  };

  const handleModeSwitch = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInputText(outputText || inputText);
    handleConvert(outputText || inputText, newMode);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setInputText(result);
      if (mode === 'encode') {
        const base64Part = result.includes(',') ? result.split(',')[1] : result;
        setOutputText(base64Part);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex gap-2">
          <button
            onClick={() => handleModeSwitch('encode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'encode' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => handleModeSwitch('decode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'decode' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <label className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
          </label>
          <textarea
            value={inputText}
            onChange={e => {
              setInputText(e.target.value);
              handleConvert(e.target.value, mode);
            }}
            rows={10}
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text Output'}
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
            value={outputText}
            rows={10}
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 focus:outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
