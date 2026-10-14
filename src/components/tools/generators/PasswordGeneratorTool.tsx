import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, Key } from 'lucide-react';

export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+~|}{[]:;?><,.-=';

    if (avoidAmbiguous) {
      upper = upper.replace(/[IO]/g, '');
      lower = lower.replace(/[lo]/g, '');
      numbers = numbers.replace(/[01]/g, '');
    }

    let charPool = '';
    if (useUpper) charPool += upper;
    if (useLower) charPool += lower;
    if (useNumbers) charPool += numbers;
    if (useSymbols) charPool += symbols;

    if (!charPool) {
      setPassword('');
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charPool[randomValues[i] % charPool.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generate();
  }, [length, useUpper, useLower, useNumbers, useSymbols, avoidAmbiguous]);

  const getStrength = () => {
    let poolSize = 0;
    if (useUpper) poolSize += 26;
    if (useLower) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 25;

    const entropy = length * Math.log2(Math.max(1, poolSize));

    if (entropy < 40) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600', crack: 'Seconds' };
    if (entropy < 60) return { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-600', crack: 'A few months' };
    if (entropy < 85) return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600', crack: 'Thousands of years' };
    return { label: 'Unbreakable', color: 'bg-indigo-600', text: 'text-indigo-600', crack: 'Trillions of centuries' };
  };

  const strength = getStrength();

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Generated Password Box */}
      <div className="p-5 bg-slate-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-mono text-lg sm:text-2xl text-emerald-400 font-bold tracking-wider break-all text-center sm:text-left select-all">
          {password || 'Select at least one character type'}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={generate}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer transition-colors"
            title="Generate new"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Password'}</span>
          </button>
        </div>
      </div>

      {/* Strength Indicator */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700">Security Entropy: <strong className={strength.text}>{strength.label}</strong></span>
          <span className="text-slate-500">Estimated Crack Time: <strong className="text-slate-800">{strength.crack}</strong></span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: `${Math.min(100, (length / 32) * 100)}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Password Length</span>
            <span className="text-blue-600 font-extrabold text-sm">{length} characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={e => setUseUpper(e.target.checked)}
              className="rounded text-blue-600 w-4 h-4"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={useLower}
              onChange={e => setUseLower(e.target.checked)}
              className="rounded text-blue-600 w-4 h-4"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={e => setUseNumbers(e.target.checked)}
              className="rounded text-blue-600 w-4 h-4"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={e => setUseSymbols(e.target.checked)}
              className="rounded text-blue-600 w-4 h-4"
            />
            <span>Special Symbols (!@#$%)</span>
          </label>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 pt-1">
          <input
            type="checkbox"
            checked={avoidAmbiguous}
            onChange={e => setAvoidAmbiguous(e.target.checked)}
            className="rounded text-blue-600 w-4 h-4"
          />
          <span>Avoid ambiguous characters (e.g. 1, l, I, 0, O)</span>
        </label>
      </div>
    </div>
  );
};
