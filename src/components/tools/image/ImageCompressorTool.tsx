import React, { useState, useRef } from 'react';
import { Upload, Minimize2, Download, AlertCircle, RefreshCw, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setCompressedUrl(null);

    const selected = e.target.files[0];
    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setFile(selected);
    setOriginalSize(selected.size);
    const url = URL.createObjectURL(selected);
    setOriginalUrl(url);

    // Initial compress
    compressImage(selected, quality, format);
    e.target.value = '';
  };

  const compressImage = (sourceFile: File, q: number, fmt: string) => {
    setIsCompressing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas context failed.');
        setIsCompressing(false);
        return;
      }

      // If converting transparent PNG to JPEG, fill white background
      if (fmt === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Failed to compress image.');
            setIsCompressing(false);
            return;
          }
          if (compressedUrl) URL.revokeObjectURL(compressedUrl);
          setCompressedUrl(URL.createObjectURL(blob));
          setCompressedSize(blob.size);
          setIsCompressing(false);
        },
        fmt,
        q / 100
      );
    };
    img.src = URL.createObjectURL(sourceFile);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) compressImage(file, newQ, format);
  };

  const handleFormatChange = (newFmt: any) => {
    setFormat(newFmt);
    if (file) compressImage(file, quality, newFmt);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const savings = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50 hover:bg-emerald-50/30 group">
          <input
            type="file"
            id="image-compress-upload"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="image-compress-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select image to compress
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Supports JPG, PNG, and WebP. 100% private in-browser compression with live preview.
            </p>
            <span className="inline-block mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
              Choose Image
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">Original: {formatSize(originalSize)}</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setOriginalUrl(null); setCompressedUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change Image
            </button>
          </div>

          {/* Quality & Format Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">Compression Quality: {quality}%</label>
                <span className="text-xs font-semibold text-emerald-600">
                  {quality > 80 ? 'High Fidelity' : quality > 50 ? 'Recommended' : 'Extreme Compression'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={quality}
                onChange={e => handleQualityChange(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Smaller Size</span>
                <span>Best Quality</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Output Format</label>
              <select
                value={format}
                onChange={e => handleFormatChange(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="image/jpeg">JPG / JPEG (Best for photos)</option>
                <option value="image/webp">WebP (Modern ultra-compact)</option>
                <option value="image/png">PNG (Lossless vectors & transparent)</option>
              </select>
            </div>
          </div>

          {/* Side by side Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-xs font-bold text-slate-600 block mb-2">
                Original Image ({formatSize(originalSize)})
              </span>
              <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
                {originalUrl && <img src={originalUrl} alt="Original" className="w-full h-full object-contain" />}
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-emerald-800">
                  Compressed ({formatSize(compressedSize)})
                </span>
                <span className="text-xs font-bold text-emerald-600">-{savings}%</span>
              </div>
              <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden flex items-center justify-center border border-emerald-200">
                {compressedUrl ? (
                  <img src={compressedUrl} alt="Compressed" className="w-full h-full object-contain" />
                ) : (
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Download Bar */}
          {compressedUrl && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Size reduced from <span className="font-semibold text-slate-800">{formatSize(originalSize)}</span> to{' '}
                <span className="font-semibold text-emerald-600">{formatSize(compressedSize)}</span> ({savings}% reduction).
              </div>

              <a
                href={compressedUrl}
                download={`compressed_${file.name.replace(/\.[^.]+$/, '')}.${format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg'}`}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed Image</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
