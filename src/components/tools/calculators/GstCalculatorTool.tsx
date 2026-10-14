import React, { useState } from 'react';
import { Receipt, Copy, Check } from 'lucide-react';

export const GstCalculatorTool: React.FC = () => {
  const [amount, setAmount] = useState<number>(5000);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [taxRate, setTaxRate] = useState<number>(18);
  const [copied, setCopied] = useState(false);

  const slabs = [0, 3, 5, 12, 18, 28];

  let netAmount = 0;
  let gstAmount = 0;
  let grossAmount = 0;

  if (mode === 'exclusive') {
    netAmount = amount;
    gstAmount = (netAmount * taxRate) / 100;
    grossAmount = netAmount + gstAmount;
  } else {
    grossAmount = amount;
    netAmount = (grossAmount * 100) / (100 + taxRate);
    gstAmount = grossAmount - netAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const copyResult = () => {
    navigator.clipboard.writeText(
      `Net: ${netAmount.toFixed(2)} | GST (${taxRate}%): ${gstAmount.toFixed(2)} (CGST: ${cgst.toFixed(2)}, SGST: ${sgst.toFixed(2)}) | Total: ${grossAmount.toFixed(2)}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Mode selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode('exclusive')}
          className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm cursor-pointer transition-all ${
            mode === 'exclusive' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          GST Exclusive (Add Tax)
        </button>
        <button
          type="button"
          onClick={() => setMode('inclusive')}
          className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm cursor-pointer transition-all ${
            mode === 'inclusive' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          GST Inclusive (Extract Base)
        </button>
      </div>

      {/* Amount input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          {mode === 'exclusive' ? 'Net Amount (Pre-Tax Price)' : 'Total Price (Including GST)'}
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold pl-4"
          />
        </div>
      </div>

      {/* Slabs */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">GST Rate (%)</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {slabs.map(rate => (
            <button
              key={rate}
              type="button"
              onClick={() => setTaxRate(rate)}
              className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer ${
                taxRate === rate ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>

      {/* Results breakdown */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Total Invoice Amount</span>
            <span className="text-3xl font-black text-slate-900">${grossAmount.toFixed(2)}</span>
          </div>
          <button
            onClick={copyResult}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-500 block">Net Base Amount</span>
            <span className="text-sm font-bold text-slate-800">${netAmount.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-blue-700 block font-semibold">Total GST ({taxRate}%)</span>
            <span className="text-sm font-bold text-blue-600">${gstAmount.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-500 block">CGST (50%)</span>
            <span className="text-sm font-bold text-slate-800">${cgst.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-500 block">SGST (50%)</span>
            <span className="text-sm font-bold text-slate-800">${sgst.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
