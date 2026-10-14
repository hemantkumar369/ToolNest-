import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Barcode, Download, AlertCircle } from 'lucide-react';

export const BarcodeGeneratorTool: React.FC = () => {
  const [format, setFormat] = useState<'CODE128' | 'EAN13' | 'UPC' | 'CODE39'>('CODE128');
  const [value, setValue] = useState('TOOLNEST-2026');
  const [height, setHeight] = useState(80);
  const [width, setWidth] = useState(2);
  const [displayValue, setDisplayValue] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;
    setError(null);
    try {
      JsBarcode(svgRef.current, value, {
        format,
        width,
        height,
        displayValue,
        lineColor: '#0f172a',
        background: '#ffffff',
        font: 'monospace',
        fontSize: 14,
        textMargin: 4,
      });
    } catch (err: any) {
      setError(`Invalid format: ${err?.message || 'Check input compatibility with selected barcode standard.'}`);
    }
  }, [format, value, height, width, displayValue]);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode_${value}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `barcode_${value}.png`;
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Barcode Standard
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'CODE128', label: 'Code 128 (Alphanumeric - Standard)' },
                { id: 'EAN13', label: 'EAN-13 (12-13 Digits Retail)' },
                { id: 'UPC', label: 'UPC (11-12 Digits US)' },
                { id: 'CODE39', label: 'Code 39' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setFormat(opt.id as any);
                    if (opt.id === 'EAN13') setValue('123456789012');
                    else if (opt.id === 'UPC') setValue('12345678901');
                    else setValue('TOOLNEST-2026');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer text-center transition-all ${
                    format === opt.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Barcode Value / Data
            </label>
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bar Height ({height}px)</label>
              <input
                type="range"
                min="40"
                max="140"
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bar Width ({width}px)</label>
              <input
                type="range"
                min="1"
                max="4"
                value={width}
                onChange={e => setWidth(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={displayValue}
              onChange={e => setDisplayValue(e.target.checked)}
              className="rounded text-blue-600 w-4 h-4"
            />
            <span>Show text digits below barcode</span>
          </label>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Barcode Render Pane */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-md border border-slate-200 overflow-x-auto max-w-full">
            <svg ref={svgRef}></svg>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={downloadPng}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={downloadSvg}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
