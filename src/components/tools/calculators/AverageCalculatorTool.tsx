import React, { useState } from 'react';
import { BarChart2, Copy, Check } from 'lucide-react';

export const AverageCalculatorTool: React.FC = () => {
  const [inputStr, setInputStr] = useState('12, 15, 20, 24, 28, 30, 30, 42');
  const [copied, setCopied] = useState(false);

  const parseNumbers = () => {
    return inputStr
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !isNaN(Number(s)))
      .map(Number);
  };

  const nums = parseNumbers();
  const count = nums.length;

  let mean = 0;
  let median = 0;
  let mode: number[] = [];
  let min = 0;
  let max = 0;
  let range = 0;
  let variance = 0;
  let stdDev = 0;
  let sum = 0;

  if (count > 0) {
    sum = nums.reduce((a, b) => a + b, 0);
    mean = sum / count;

    const sorted = [...nums].sort((a, b) => a - b);
    min = sorted[0];
    max = sorted[count - 1];
    range = max - min;

    // Median
    const mid = Math.floor(count / 2);
    median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    nums.forEach(n => {
      freq[n] = (freq[n] || 0) + 1;
      if (freq[n] > maxFreq) maxFreq = freq[n];
    });
    if (maxFreq > 1) {
      mode = Object.keys(freq).filter(k => freq[Number(k)] === maxFreq).map(Number);
    }

    // Variance & StdDev
    variance = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    stdDev = Math.sqrt(variance);
  }

  const copyStats = () => {
    navigator.clipboard.writeText(
      `Count: ${count} | Mean: ${mean.toFixed(2)} | Median: ${median.toFixed(2)} | StdDev: ${stdDev.toFixed(2)} | Sum: ${sum}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          Enter Numbers (Separated by commas, spaces, or newlines)
        </label>
        <textarea
          value={inputStr}
          onChange={e => setInputStr(e.target.value)}
          rows={3}
          className="w-full p-4 rounded-xl border border-slate-300 font-mono text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 10, 20, 35, 42.5, 50"
        />
      </div>

      {count > 0 ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Statistical Summary ({count} numbers)
            </span>
            <button
              onClick={copyStats}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="text-[11px] text-blue-700 font-bold block">Mean (Average)</span>
              <span className="text-2xl font-black text-blue-900">{mean.toFixed(2)}</span>
            </div>
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl">
              <span className="text-[11px] text-indigo-700 font-bold block">Median (Middle)</span>
              <span className="text-2xl font-black text-indigo-900">{median.toFixed(2)}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Mode</span>
              <span className="text-xl font-black text-slate-800">
                {mode.length > 0 ? mode.join(', ') : 'None'}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Standard Deviation (σ)</span>
              <span className="text-xl font-black text-slate-800">{stdDev.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Total Sum</span>
              <span className="text-sm font-bold text-slate-800">{sum.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Minimum</span>
              <span className="text-sm font-bold text-slate-800">{min}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Maximum</span>
              <span className="text-sm font-bold text-slate-800">{max}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Range</span>
              <span className="text-sm font-bold text-slate-800">{range}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-slate-400 text-sm">
          Please enter valid numbers to view statistics.
        </div>
      )}
    </div>
  );
};
