import React, { useState } from 'react';
import { Upload, RefreshCw, Download, AlertCircle, CheckCircle2, RefreshCcw } from 'lucide-react';

export const ImageConverterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp' | 'image/x-icon'>('image/webp');
  const [fillBackground, setFillBackground] = useState<boolean>(true);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setDownloadUrl(null);

    const selected = e.target.files[0];
    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setFile(selected);
    e.target.value = '';
  };

  const handleConvert = () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas context failed.');
        setIsProcessing(false);
        return;
      }

      if (targetFormat === 'image/jpeg' || (fillBackground && targetFormat !== 'image/png')) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = targetFormat === 'image/x-icon' ? 'image/png' : targetFormat;
      canvas.toBlob(blob => {
        if (!blob) {
          setError('Failed to convert image.');
          setIsProcessing(false);
          return;
        }
        setDownloadUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
        URL.revokeObjectURL(url);
      }, mimeType, 0.95);
    };
    img.src = url;
  };

  const getExtension = () => {
    switch (targetFormat) {
      case 'image/jpeg': return 'jpg';
      case 'image/png': return 'png';
      case 'image/webp': return 'webp';
      case 'image/x-icon': return 'ico';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30 group">
          <input
            type="file"
            id="image-convert-upload"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="image-convert-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RefreshCcw className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select image to convert format
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Convert between JPG, PNG, WebP, and ICO. 100% private in-browser transformation.
            </p>
            <span className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
              Choose Image
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
            <button
              onClick={() => { setFile(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change File
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Target Output Format</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'image/webp', label: 'WebP (Modern & Small)' },
                  { id: 'image/png', label: 'PNG (Lossless Transparency)' },
                  { id: 'image/jpeg', label: 'JPG / JPEG (Standard)' },
                  { id: 'image/x-icon', label: 'ICO (Favicon icon)' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTargetFormat(opt.id as any)}
                    className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                      targetFormat === opt.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {targetFormat === 'image/jpeg' && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <input
                  type="color"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <span className="text-xs text-slate-600">Background fill color for transparent areas (default white)</span>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting Image...</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4" />
                  <span>Convert to {getExtension().toUpperCase()}</span>
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
              <p className="font-bold text-slate-900 text-sm">Image Converted Successfully!</p>
              <p className="text-xs text-slate-600">Converted to .{getExtension()}</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={`converted_${file?.name.replace(/\.[^.]+$/, '')}.${getExtension()}`}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Converted Image</span>
          </a>
        </div>
      )}
    </div>
  );
};
