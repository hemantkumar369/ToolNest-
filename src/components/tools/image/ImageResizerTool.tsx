import React, { useState } from 'react';
import { Upload, Scaling, Download, AlertCircle, RefreshCw, CheckCircle2, Lock, Unlock } from 'lucide-react';

export const ImageResizerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [unit, setUnit] = useState<'px' | 'percent'>('px');
  const [percentage, setPercentage] = useState<number>(100);

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setDownloadUrl(null);

    const selected = e.target.files[0];
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(selected);
    img.onload = () => {
      setFile(selected);
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    e.target.value = '';
  };

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (lockAspect && origWidth > 0) {
      setHeight(Math.round((w / origWidth) * origHeight));
    }
    setDownloadUrl(null);
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (lockAspect && origHeight > 0) {
      setWidth(Math.round((h / origHeight) * origWidth));
    }
    setDownloadUrl(null);
  };

  const handlePercentChange = (pct: number) => {
    setPercentage(pct);
    setWidth(Math.round((origWidth * pct) / 100));
    setHeight(Math.round((origHeight * pct) / 100));
    setDownloadUrl(null);
  };

  const handleResize = () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas context failed.');
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        if (!blob) {
          setError('Failed to resize image.');
          setIsProcessing(false);
          return;
        }
        setDownloadUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
        URL.revokeObjectURL(url);
      }, file.type || 'image/jpeg', 0.92);
    };
    img.src = url;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30 group">
          <input
            type="file"
            id="image-resize-upload"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="image-resize-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scaling className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select image to resize
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Scale by pixels or percentage with aspect ratio lock.
            </p>
            <span className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
              Choose Image
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">Original Dimensions: {origWidth} x {origHeight} px</p>
            </div>
            <button
              onClick={() => { setFile(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change Image
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setUnit('px')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${unit === 'px' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Pixels (px)
            </button>
            <button
              onClick={() => setUnit('percent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${unit === 'percent' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Percentage (%)
            </button>
          </div>

          {unit === 'px' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Width (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={e => handleWidthChange(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Height (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height}
                  onChange={e => handleHeightChange(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Scale: {percentage}%</span>
                <span>{width} x {height} px</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={percentage}
                onChange={e => handlePercentChange(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLockAspect(!lockAspect)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                lockAspect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleResize}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Resizing Image...</span>
                </>
              ) : (
                <>
                  <Scaling className="w-4 h-4" />
                  <span>Resize to {width} x {height} px</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Image Resized Successfully!</p>
              <p className="text-xs text-slate-600">New dimensions: {width} x {height} px.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={`resized_${width}x${height}_${file?.name || 'image.jpg'}`}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Resized Image</span>
          </a>
        </div>
      )}
    </div>
  );
};
