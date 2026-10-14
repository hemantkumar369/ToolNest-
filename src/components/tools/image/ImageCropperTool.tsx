import React, { useState, useRef, useEffect } from 'react';
import { Upload, Crop, Download, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ImageCropperTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState<string>('free');
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, width: 250, height: 250 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setDownloadUrl(null);

    const selected = e.target.files[0];
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image.');
      return;
    }

    setFile(selected);
    setImageUrl(URL.createObjectURL(selected));
    e.target.value = '';
  };

  const handleAspectChange = (ratioStr: string) => {
    setAspect(ratioStr);
    if (ratioStr === '1:1') {
      const size = Math.min(cropBox.width, cropBox.height);
      setCropBox(prev => ({ ...prev, width: size, height: size }));
    } else if (ratioStr === '4:3') {
      const h = Math.round((cropBox.width * 3) / 4);
      setCropBox(prev => ({ ...prev, height: h }));
    } else if (ratioStr === '16:9') {
      const h = Math.round((cropBox.width * 9) / 16);
      setCropBox(prev => ({ ...prev, height: h }));
    } else if (ratioStr === 'passport') {
      const h = Math.round((cropBox.width * 45) / 35);
      setCropBox(prev => ({ ...prev, height: h }));
    }
  };

  const handleCrop = () => {
    if (!file || !imageRef.current) return;
    setIsProcessing(true);
    setError(null);

    const img = imageRef.current;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const displayW = img.clientWidth;
    const displayH = img.clientHeight;

    const scaleX = naturalW / displayW;
    const scaleY = naturalH / displayH;

    const actualX = cropBox.x * scaleX;
    const actualY = cropBox.y * scaleY;
    const actualW = cropBox.width * scaleX;
    const actualH = cropBox.height * scaleY;

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, actualW);
    canvas.height = Math.max(1, actualH);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Canvas context error.');
      setIsProcessing(false);
      return;
    }

    ctx.drawImage(img, actualX, actualY, actualW, actualH, 0, 0, actualW, actualH);

    canvas.toBlob(blob => {
      if (!blob) {
        setError('Failed to crop image.');
        setIsProcessing(false);
        return;
      }
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
    }, file.type || 'image/jpeg', 0.95);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30 group">
          <input
            type="file"
            id="image-crop-upload"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="image-crop-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Crop className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select image to crop
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Supports Square (1:1), 4:3, 16:9, and official Passport aspect ratio presets.
            </p>
            <span className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
              Choose Image
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
            <button
              onClick={() => { setFile(null); setImageUrl(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change Image
            </button>
          </div>

          {/* Aspect presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'free', label: 'Free Aspect' },
                { id: '1:1', label: '1:1 Square (Instagram)' },
                { id: '4:3', label: '4:3 Standard' },
                { id: '16:9', label: '16:9 Landscape (YouTube)' },
                { id: 'passport', label: 'Passport (35:45)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleAspectChange(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspect === opt.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Container */}
          <div ref={containerRef} className="relative max-w-lg mx-auto bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2">
            {imageUrl && (
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Source"
                className="max-h-96 w-auto object-contain block select-none pointer-events-none"
              />
            )}
            {/* Visual Crop Box overlay */}
            <div
              style={{
                position: 'absolute',
                left: `${cropBox.x}px`,
                top: `${cropBox.y}px`,
                width: `${cropBox.width}px`,
                height: `${cropBox.height}px`,
              }}
              className="border-2 border-blue-400 bg-blue-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move pointer-events-auto"
            >
              <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] px-1 font-bold rounded">
                Crop Area
              </span>
            </div>
          </div>

          {/* Crop dimension sliders */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
            <div>
              <label className="block text-slate-600 mb-1">X Position</label>
              <input
                type="range"
                min="0"
                max="250"
                value={cropBox.x}
                onChange={e => setCropBox(prev => ({ ...prev, x: Number(e.target.value) }))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Y Position</label>
              <input
                type="range"
                min="0"
                max="250"
                value={cropBox.y}
                onChange={e => setCropBox(prev => ({ ...prev, y: Number(e.target.value) }))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Crop Width</label>
              <input
                type="range"
                min="80"
                max="350"
                value={cropBox.width}
                onChange={e => {
                  const w = Number(e.target.value);
                  let h = cropBox.height;
                  if (aspect === '1:1') h = w;
                  else if (aspect === '4:3') h = Math.round((w * 3) / 4);
                  else if (aspect === '16:9') h = Math.round((w * 9) / 16);
                  else if (aspect === 'passport') h = Math.round((w * 45) / 35);
                  setCropBox(prev => ({ ...prev, width: w, height: h }));
                }}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Crop Height</label>
              <input
                type="range"
                min="80"
                max="350"
                value={cropBox.height}
                disabled={aspect !== 'free'}
                onChange={e => setCropBox(prev => ({ ...prev, height: Number(e.target.value) }))}
                className="w-full accent-blue-600 disabled:opacity-40"
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
              onClick={handleCrop}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Cropping Image...</span>
                </>
              ) : (
                <>
                  <Crop className="w-4 h-4" />
                  <span>Crop Image Now</span>
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
              <p className="font-bold text-slate-900 text-sm">Image Cropped Successfully!</p>
              <p className="text-xs text-slate-600">Framed precisely to your selection.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={`cropped_${file?.name || 'photo.jpg'}`}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Cropped Image</span>
          </a>
        </div>
      )}
    </div>
  );
};
