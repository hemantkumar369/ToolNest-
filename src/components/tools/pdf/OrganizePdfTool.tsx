import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Upload, ArrowLeft, ArrowRight, RotateCw, Trash2, Download, AlertCircle, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { createPdfBlob } from '../../../utils/pdf';

interface PageItem {
  id: string;
  originalIndex: number;
  rotation: number;
}

export const OrganizePdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setDownloadUrl(null);

    const selected = e.target.files[0];
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF file.');
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      const initialPages: PageItem[] = Array.from({ length: count }, (_, i) => ({
        id: `page-${i}`,
        originalIndex: i,
        rotation: 0
      }));
      setFile(selected);
      setPages(initialPages);
    } catch (err: any) {
      setError(err?.message || 'Failed to load PDF file.');
    }
    e.target.value = '';
  };

  const movePage = (index: number, dir: 'left' | 'right') => {
    const target = dir === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= pages.length) return;
    const next = [...pages];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setPages(next);
    setDownloadUrl(null);
  };

  const rotatePage = (index: number) => {
    setPages(prev => prev.map((p, i) => i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
    setDownloadUrl(null);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      setError('Cannot delete all pages. The PDF must have at least 1 page.');
      return;
    }
    setPages(prev => prev.filter((_, i) => i !== index));
    setDownloadUrl(null);
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      for (const pageItem of pages) {
        const [copied] = await newDoc.copyPages(srcDoc, [pageItem.originalIndex]);
        if (pageItem.rotation !== 0) {
          const currentRotation = copied.getRotation().angle;
          copied.setRotation(degrees((currentRotation + pageItem.rotation) % 360));
        }
        newDoc.addPage(copied);
      }

      const bytes = await newDoc.save();
      const blob = createPdfBlob(bytes);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to rebuild organized PDF.');
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
            id="organize-pdf-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="organize-pdf-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select PDF to organize & reorder
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Reorder pages, rotate sideways sheets, or delete unneeded pages with zero server upload.
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
                <p className="text-xs text-slate-500">{pages.length} pages remaining</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setPages([]); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change File
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Visual Page Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Use arrows to move pages, rotate icon to orient, or trash to remove.</span>
              <span>{pages.length} Pages</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pages.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-slate-50 border-2 border-slate-200 hover:border-blue-400 rounded-xl p-3 flex flex-col justify-between transition-all group shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">Orig: #{p.originalIndex + 1}</span>
                  </div>

                  {/* Thumbnail Placeholder */}
                  <div className="aspect-[3/4] bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 p-2 shadow-2xs relative overflow-hidden">
                    <div 
                      className="flex flex-col items-center justify-center transition-transform"
                      style={{ transform: `rotate(${p.rotation}deg)` }}
                    >
                      <FileText className="w-8 h-8 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-500 mt-1">Page {p.originalIndex + 1}</span>
                    </div>
                    {p.rotation !== 0 && (
                      <span className="absolute bottom-1 right-1 bg-blue-100 text-blue-700 font-bold text-[9px] px-1 rounded">
                        {p.rotation}°
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center">
                      <button
                        onClick={() => movePage(idx, 'left')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                        title="Move left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => movePage(idx, 'right')}
                        disabled={idx === pages.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                        title="Move right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => rotatePage(idx)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        title="Rotate 90° clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePage(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Delete page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Document Structure...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Reordered PDF</span>
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
              <p className="font-bold text-slate-900 text-sm">PDF Reordered Successfully!</p>
              <p className="text-xs text-slate-600">{pages.length} pages structured as configured.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="reordered_document_toolnest.pdf"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Reordered PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};
