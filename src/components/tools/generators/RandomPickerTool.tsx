import React, { useState } from 'react';
import { Dices, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';

export const RandomPickerTool: React.FC = () => {
  const [tab, setTab] = useState<'list' | 'numbers'>('list');

  // List Picker
  const [itemsText, setItemsText] = useState('Sarah\nMichael\nDavid\nEmma\nAlex\nJessica\nDaniel\nSophia');
  const [pickedWinner, setPickedWinner] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  // Number Generator
  const [minNum, setMinNum] = useState(1);
  const [maxNum, setMaxNum] = useState(100);
  const [numCount, setNumCount] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);

  const [copied, setCopied] = useState(false);

  const handlePickWinner = () => {
    const list = itemsText.split('\n').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return;

    setIsPicking(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * list.length);
      setPickedWinner(list[randomIdx]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsPicking(false);
      }
    }, 80);
  };

  const handleGenerateNumbers = () => {
    const min = Math.min(minNum, maxNum);
    const max = Math.max(minNum, maxNum);
    const range = max - min + 1;

    if (!allowDuplicates && numCount > range) {
      alert(`Cannot generate ${numCount} unique numbers in a range of ${range}.`);
      return;
    }

    const results: number[] = [];
    if (!allowDuplicates) {
      const set = new Set<number>();
      while (set.size < numCount) {
        const n = Math.floor(Math.random() * range) + min;
        set.add(n);
      }
      results.push(...Array.from(set));
    } else {
      for (let i = 0; i < numCount; i++) {
        results.push(Math.floor(Math.random() * range) + min);
      }
    }
    setGeneratedNumbers(results);
  };

  const copyResults = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex gap-2 pb-3 border-b border-slate-100">
        <button
          onClick={() => setTab('list')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'list' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Random Name / List Picker
        </button>
        <button
          onClick={() => setTab('numbers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'numbers' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Random Number Generator
        </button>
      </div>

      {tab === 'list' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Enter Items / Names (One per line)
              </label>
              <textarea
                value={itemsText}
                onChange={e => setItemsText(e.target.value)}
                rows={9}
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-slate-400 mt-1">
                {itemsText.split('\n').filter(s => s.trim()).length} total items in draw pool.
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[240px]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Winner</span>
              <div className={`text-3xl sm:text-4xl font-black text-slate-900 transition-transform ${isPicking ? 'scale-110 text-blue-600' : ''}`}>
                {pickedWinner || 'Click Pick to Draw'}
              </div>

              <button
                onClick={handlePickWinner}
                disabled={isPicking || !itemsText.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isPicking ? 'Drawing Winner...' : 'Pick Random Item'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Minimum (Min)</label>
              <input
                type="number"
                value={minNum}
                onChange={e => setMinNum(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Maximum (Max)</label>
              <input
                type="number"
                value={maxNum}
                onChange={e => setMaxNum(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Count of Numbers</label>
              <input
                type="number"
                min="1"
                max="500"
                value={numCount}
                onChange={e => setNumCount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={e => setAllowDuplicates(e.target.checked)}
                className="rounded text-blue-600 w-4 h-4"
              />
              <span>Allow Duplicates</span>
            </label>

            <button
              onClick={handleGenerateNumbers}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Dices className="w-4 h-4" />
              <span>Generate Numbers</span>
            </button>
          </div>

          {generatedNumbers.length > 0 && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Generated Results ({generatedNumbers.length})
                </span>
                <button
                  onClick={() => copyResults(generatedNumbers.join(', '))}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {generatedNumbers.map((n, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-sm font-bold text-blue-700 shadow-2xs"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
