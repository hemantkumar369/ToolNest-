import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Trash2, Download, AlertCircle, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { createPdfBlob } from '../../../utils/pdf';

export const DeletePdfPagesTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesToDelete, setPagesToDelete] = useState<number[]>([]);
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
      const count = doc.getPageCount();
      setFile(selected);
      setPageCount(count);
      setPagesToDelete([]);
    } catch (err: any) {
      setError(err?.message || 'Failed to open PDF.');
    }
    e.target.value = '';
  };

  const togglePageToDelete = (pageNum: number) => {
    setPagesToDelete(prev =>
      prev.includes(pageNum) ? prev.filter(p => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
    );
    setDownloadUrl(null);
  };

  const handleDelete = async () => {
    if (!file) return;
    if (pagesToDelete.length >= pageCount) {
      setError('Cannot delete all pages in the PDF.');
      return;
    }
    if (pagesToDelete.length === 0) {
      setError('Please mark at least one page to delete.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      const pagesToKeep: number[] = [];
      for (let i = 1; i <= pageCount; i++) {
        if (!pagesToDelete.includes(i)) {
          pagesToKeep.push(i - 1);
        }
      }

      const copiedPages = await newDoc.copyPages(srcDoc, pagesToKeep);
      copiedPages.forEach(p => newDoc.addPage(p));

      const bytes = await newDoc.save();
      const blob = createPdfBlob(bytes);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to delete pages.');
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
            id="delete-pdf-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="delete-pdf-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trash2 className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select PDF to delete pages
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Discard blank pages, covers, or obsolete sections from documents.
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
              <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
            </div>
            <button
              onClick={() => { setFile(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change File
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-700">
                Click pages to DELETE ({pagesToDelete.length} marked)
              </span>
              <span className="text-slate-500">{pageCount - pagesToDelete.length} pages will remain</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => {
                const isMarked = pagesToDelete.includes(pageNum);
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => togglePageToDelete(pageNum)}
                    className={`p-3 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                      isMarked
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs line-through'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Page {pageNum}
                  </button>
                );
              })}
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
              onClick={handleDelete}
              disabled={isProcessing || pagesToDelete.length === 0}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Deleting Pages...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete {pagesToDelete.length} Marked Page{pagesToDelete.length > 1 ? 's' : ''}</span>
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
              <p className="font-bold text-slate-900 text-sm">Pages Deleted Successfully!</p>
              <p className="text-xs text-slate-600">Updated document with {pageCount - pagesToDelete.length} pages ready.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="trimmed_document_toolnest.pdf"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Trimmed PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};
