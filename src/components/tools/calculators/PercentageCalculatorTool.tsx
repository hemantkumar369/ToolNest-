import React, { useState } from 'react';
import { Percent, Copy, Check, Calculator } from 'lucide-react';

export const PercentageCalculatorTool: React.FC = () => {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<number>(15);
  const [m1Y, setM1Y] = useState<number>(200);

  // Mode 2: X is what % of Y?
  const [m2X, setM2X] = useState<number>(25);
  const [m2Y, setM2Y] = useState<number>(100);

  // Mode 3: % Increase/Decrease from X to Y?
  const [m3X, setM3X] = useState<number>(80);
  const [m3Y, setM3Y] = useState<number>(100);

  // Mode 4: Add/Subtract X% to Y
  const [m4Op, setM4Op] = useState<'add' | 'sub'>('add');
  const [m4X, setM4X] = useState<number>(18);
  const [m4Y, setM4Y] = useState<number>(500);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyVal = (id: string, val: string | number) => {
    navigator.clipboard.writeText(String(val));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const res1 = (m1X * m1Y) / 100;
  const res2 = m2Y !== 0 ? (m2X / m2Y) * 100 : 0;
  const res3 = m3X !== 0 ? ((m3Y - m3X) / Math.abs(m3X)) * 100 : 0;
  const res4 = m4Op === 'add' ? m4Y + (m4Y * m4X) / 100 : m4Y - (m4Y * m4X) / 100;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1 */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
            Mode 1: Percentage of a Number
          </span>
          <div className="text-sm text-slate-700 font-medium">What is X% of Y?</div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">What is</span>
            <input
              type="number"
              value={m1X}
              onChange={e => setM1X(Number(e.target.value))}
              className="w-20 p-2 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
            <span className="text-xs font-bold text-slate-500">% of</span>
            <input
              type="number"
              value={m1Y}
              onChange={e => setM1Y(Number(e.target.value))}
              className="w-24 p-2 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
            <span className="text-xs font-bold text-slate-500">?</span>
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
            <span className="text-xs text-slate-500">Answer:</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-blue-600">{Number(res1.toFixed(2))}</span>
              <button
                onClick={() => copyVal('m1', res1.toFixed(2))}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                {copiedId === 'm1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mode 2 */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
            Mode 2: Percentage Ratio
          </span>
          <div className="text-sm text-slate-700 font-medium">X is what percent of Y?</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={m2X}
              onChange={e => setM2X(Number(e.target.value))}
              className="w-20 p-2 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
            <span className="text-xs font-bold text-slate-500">is what % of</span>
            <input
              type="number"
              value={m2Y}
              onChange={e => setM2Y(Number(e.target.value))}
              className="w-24 p-2 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
            <span className="text-xs font-bold text-slate-500">?</span>
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
            <span className="text-xs text-slate-500">Answer:</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-indigo-600">{Number(res2.toFixed(2))}%</span>
              <button
                onClick={() => copyVal('m2', `${res2.toFixed(2)}%`)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                {copiedId === 'm2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mode 3 */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
            Mode 3: Percentage Increase / Decrease
          </span>
          <div className="text-sm text-slate-700 font-medium">% Change from X to Y?</div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">From</span>
            <input
              type="number"
              value={m3X}
              onChange={e => setM3X(Number(e.target.value))}
              className="w-20 p-2 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
            <span className="text-xs font-bold text-slate-500">to</span>
            <input
              type="number"
              value={m3Y}
              onChange={e => setM3Y(Number(e.target.value))}
              className="w-24 p-2 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
            <span className="text-xs font-bold text-slate-500">?</span>
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
            <span className="text-xs text-slate-500">Change:</span>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-black ${res3 >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {res3 >= 0 ? `+${res3.toFixed(2)}%` : `${res3.toFixed(2)}%`}
              </span>
              <button
                onClick={() => copyVal('m3', `${res3.toFixed(2)}%`)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                {copiedId === 'm3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mode 4 */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
            Mode 4: Add or Subtract Percentage
          </span>
          <div className="text-sm text-slate-700 font-medium">Add or Subtract X% from Y</div>
          <div className="flex items-center gap-2">
            <select
              value={m4Op}
              onChange={e => setM4Op(e.target.value as any)}
              className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
            >
              <option value="add">Add (+)</option>
              <option value="sub">Subtract (-)</option>
            </select>
            <input
              type="number"
              value={m4X}
              onChange={e => setM4X(Number(e.target.value))}
              className="w-16 p-2 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
            <span className="text-xs font-bold text-slate-500">% to</span>
            <input
              type="number"
              value={m4Y}
              onChange={e => setM4Y(Number(e.target.value))}
              className="w-24 p-2 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
            <span className="text-xs text-slate-500">Result:</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-purple-600">{Number(res4.toFixed(2))}</span>
              <button
                onClick={() => copyVal('m4', res4.toFixed(2))}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                {copiedId === 'm4' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
