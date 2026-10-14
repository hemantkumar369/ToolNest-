import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Upload, RotateCw, RotateCcw, Download, AlertCircle, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { createPdfBlob } from '../../../utils/pdf';

export const RotatePdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [targetScope, setTargetScope] = useState<'all' | 'custom'>('all');
  const [customPages, setCustomPages] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setDownloadUrl(null);

    const selected = e.target.files[0];
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile(selected);
      setPageCount(doc.getPageCount());
      setCustomPages(`1-${doc.getPageCount()}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to open PDF document.');
    }
    e.target.value = '';
  };

  const handleRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const total = doc.getPageCount();

      let targetIndices: number[] = [];
      if (targetScope === 'all') {
        targetIndices = Array.from({ length: total }, (_, i) => i);
      } else {
        const parts = customPages.split(',').map(s => s.trim());
        const set = new Set<number>();
        for (const part of parts) {
          if (part.includes('-')) {
            const [a, b] = part.split('-').map(Number);
            if (!isNaN(a) && !isNaN(b)) {
              for (let i = Math.max(1, a); i <= Math.min(total, b); i++) set.add(i - 1);
            }
          } else {
            const n = Number(part);
            if (!isNaN(n) && n >= 1 && n <= total) set.add(n - 1);
          }
        }
        targetIndices = Array.from(set);
      }

      if (targetIndices.length === 0) {
        setError('No valid pages selected to rotate.');
        setIsProcessing(false);
        return;
      }

      for (const idx of targetIndices) {
        const page = doc.getPage(idx);
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + rotationAngle) % 360));
      }

      const bytes = await doc.save();
      const blob = createPdfBlob(bytes);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to rotate PDF.');
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
            id="rotate-pdf-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="rotate-pdf-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RotateCw className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select PDF to rotate
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Permanently rotate sideways or upside down pages. 100% private in-browser.
            </p>
            <span className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
              Choose PDF File
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 truncate pr-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{pageCount} total pages</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change File
            </button>
          </div>

          {/* Angle choice */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Rotation Direction
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { angle: 90, label: '90° Clockwise', icon: RotateCw },
                { angle: 270, label: '90° Counter-Clockwise', icon: RotateCcw },
                { angle: 180, label: '180° Flip Upside-Down', icon: RotateCw },
              ].map(opt => (
                <button
                  key={opt.angle}
                  type="button"
                  onClick={() => setRotationAngle(opt.angle)}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    rotationAngle === opt.angle
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <opt.icon className="w-5 h-5 mx-auto mb-1.5 text-blue-600" />
                  <div className="font-bold text-xs sm:text-sm">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Page scope */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Apply To
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  checked={targetScope === 'all'}
                  onChange={() => setTargetScope('all')}
                  className="text-blue-600"
                />
                <span>All Pages ({pageCount})</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  checked={targetScope === 'custom'}
                  onChange={() => setTargetScope('custom')}
                  className="text-blue-600"
                />
                <span>Specific Page Range</span>
              </label>
            </div>

            {targetScope === 'custom' && (
              <input
                type="text"
                value={customPages}
                onChange={e => setCustomPages(e.target.value)}
                placeholder="e.g. 1, 3-5"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-mono"
              />
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
              onClick={handleRotate}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rotating Pages...</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4" />
                  <span>Rotate PDF</span>
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
              <p className="font-bold text-slate-900 text-sm">PDF Rotated Successfully!</p>
              <p className="text-xs text-slate-600">The orientation has been saved.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="rotated_document_toolnest.pdf"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Rotated PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};
