import React, { useState } from 'react';
import { Upload, FileBadge, Download, AlertCircle, RefreshCw, CheckCircle2, Sliders, Check } from 'lucide-react';

interface ExamPreset {
  name: string;
  minKb: number;
  maxKb: number;
  width?: number;
  height?: number;
  desc: string;
}

const EXAM_PRESETS: ExamPreset[] = [
  { name: 'SSC Photo (20-50 KB)', minKb: 20, maxKb: 50, width: 200, height: 230, desc: '3.5 x 4.5 cm portrait' },
  { name: 'SSC Signature (10-20 KB)', minKb: 10, maxKb: 20, width: 140, height: 60, desc: 'Standard exam signature' },
  { name: 'UPSC / PSC Photo (20-100 KB)', minKb: 20, maxKb: 100, width: 350, height: 450, desc: 'Civil Services online portal' },
  { name: 'US / Schengen Visa (Under 240 KB)', minKb: 50, maxKb: 240, width: 600, height: 600, desc: 'Square 2x2 inch 600x600 px' },
  { name: 'IBPS Banking Photo (20-50 KB)', minKb: 20, maxKb: 50, width: 200, height: 230, desc: 'PO & Clerk recruitment' },
  { name: 'Custom Target KB', minKb: 10, maxKb: 50, desc: 'Customizable target limit' },
];

export const TargetKbResizerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<ExamPreset>(EXAM_PRESETS[0]);
  const [targetMinKb, setTargetMinKb] = useState<number>(20);
  const [targetMaxKb, setTargetMaxKb] = useState<number>(50);
  const [customWidth, setCustomWidth] = useState<number>(200);
  const [customHeight, setCustomHeight] = useState<number>(230);
  const [lockDimensions, setLockDimensions] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [finalSizeKb, setFinalSizeKb] = useState<number>(0);
  const [finalDimensions, setFinalDimensions] = useState<{ w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setDownloadUrl(null);

    const selected = e.target.files[0];
    if (!selected.type.startsWith('image/')) {
      setError('Please select a photo or signature image.');
      return;
    }
    setFile(selected);
    e.target.value = '';
  };

  const handleSelectPreset = (p: ExamPreset) => {
    setSelectedPreset(p);
    setTargetMinKb(p.minKb);
    setTargetMaxKb(p.maxKb);
    if (p.width) setCustomWidth(p.width);
    if (p.height) setCustomHeight(p.height);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      let targetW = customWidth || img.width;
      let targetH = customHeight || img.height;

      if (!lockDimensions) {
        targetW = img.width;
        targetH = img.height;
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas context.');

      // Solid white background (exam portals reject transparent alpha layers)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      // Binary search / iterative quality adjustment to hit target KB bracket
      let minQ = 0.05;
      let maxQ = 0.98;
      let bestBlob: Blob | null = null;
      let bestSizeKb = 0;

      for (let iteration = 0; iteration < 8; iteration++) {
        const testQ = (minQ + maxQ) / 2;
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', testQ));
        if (!blob) break;

        const sizeKb = blob.size / 1024;
        bestBlob = blob;
        bestSizeKb = sizeKb;

        if (sizeKb > targetMaxKb) {
          maxQ = testQ; // Reduce quality
        } else if (sizeKb < targetMinKb) {
          minQ = testQ; // Increase quality
        } else {
          // Within desired bracket!
          break;
        }
      }

      if (!bestBlob) throw new Error('Failed to generate optimized image.');

      setDownloadUrl(URL.createObjectURL(bestBlob));
      setFinalSizeKb(Number(bestSizeKb.toFixed(1)));
      setFinalDimensions({ w: targetW, h: targetH });
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error occurred while resizing image to target KB.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30 group">
          <input
            type="file"
            id="target-kb-upload"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="target-kb-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileBadge className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select photo or signature image
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Strict compliance for SSC, UPSC, IBPS, Visa, and exam portal uploads (20-50 KB, 10-20 KB).
            </p>
            <span className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
              Choose Image
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 truncate pr-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileBadge className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">Current Size: {(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change File
            </button>
          </div>

          {/* Presets Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Examination / Portal Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {EXAM_PRESETS.map((p) => {
                const isSelected = selectedPreset.name === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm flex items-center justify-between">
                      <span>{p.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Bounds and Dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Target (KB)</label>
              <input
                type="number"
                min="5"
                max="500"
                value={targetMinKb}
                onChange={e => setTargetMinKb(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Target (KB)</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={targetMaxKb}
                onChange={e => setTargetMaxKb(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Width (px)</label>
              <input
                type="number"
                min="50"
                max="4000"
                value={customWidth}
                onChange={e => setCustomWidth(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Height (px)</label>
              <input
                type="number"
                min="50"
                max="4000"
                value={customHeight}
                onChange={e => setCustomHeight(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Iterating Compression to Target KB...</span>
                </>
              ) : (
                <>
                  <FileBadge className="w-4 h-4" />
                  <span>Resize to {targetMinKb}-{targetMaxKb} KB Bracket</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadUrl && finalDimensions && (
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Compliant Image Ready!</p>
              <p className="text-xs text-slate-600">
                Exact Size: <strong className="text-emerald-700">{finalSizeKb} KB</strong> • Dimensions: {finalDimensions.w} x {finalDimensions.h} px
              </p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={`exam_photo_${finalSizeKb}kb.jpg`}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Compliant Image</span>
          </a>
        </div>
      )}
    </div>
  );
};
