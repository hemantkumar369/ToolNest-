import React, { useState } from 'react';
import { Palette, Lock, Unlock, RefreshCw, Copy, Check, Download } from 'lucide-react';

interface ColorCard {
  id: string;
  hex: string;
  locked: boolean;
}

export const ColorPaletteTool: React.FC = () => {
  const [colors, setColors] = useState<ColorCard[]>([
    { id: '1', hex: '#2563EB', locked: false },
    { id: '2', hex: '#3B82F6', locked: false },
    { id: '3', hex: '#60A5FA', locked: false },
    { id: '4', hex: '#93C5FD', locked: false },
    { id: '5', hex: '#1E40AF', locked: false },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCss, setCopiedCss] = useState(false);

  const getRandomHex = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generatePalette = () => {
    setColors(prev => prev.map(c => (c.locked ? c : { ...c, hex: getRandomHex() })));
  };

  const toggleLock = (id: string) => {
    setColors(prev => prev.map(c => c.id === id ? { ...c, locked: !c.locked } : c));
  };

  const copyHex = (id: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getCssVariables = () => {
    return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
  };

  const copyCss = () => {
    navigator.clipboard.writeText(getCssVariables());
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Press &ldquo;Generate&rdquo; or lock colors you love
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCss}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCss ? 'CSS Copied!' : 'Export CSS Variables'}</span>
          </button>
          <button
            onClick={generatePalette}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>
        </div>
      </div>

      {/* Palette Colors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {colors.map((color, index) => (
          <div
            key={color.id}
            className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col"
          >
            {/* Color Swatch */}
            <div
              style={{ backgroundColor: color.hex }}
              className="h-36 sm:h-52 w-full flex items-start justify-end p-3 transition-colors"
            >
              <button
                onClick={() => toggleLock(color.id)}
                className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-lg backdrop-blur-xs cursor-pointer transition-colors"
                title={color.locked ? 'Unlock color' : 'Lock color'}
              >
                {color.locked ? <Lock className="w-4 h-4 text-amber-300" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>

            {/* Details & Copy */}
            <div className="p-3 bg-white flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-800">{color.hex}</span>
              <button
                onClick={() => copyHex(color.id, color.hex)}
                className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                title="Copy HEX"
              >
                {copiedId === color.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
