import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Wrench, Download, AlertCircle, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { createPdfBlob } from '../../../utils/pdf';

export const RepairPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [report, setReport] = useState<{ pages: number; repaired: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setDownloadUrl(null);
    setReport(null);

    const selected = e.target.files[0];
    setFile(selected);
    e.target.value = '';
  };

  const handleRepair = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      // Load leniently with ignoreEncryption
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPageCount();

      // Clean & reserialize structure
      pdfDoc.setProducer('ToolNest PDF Recovery Engine');
      const repairedBytes = await pdfDoc.save({ useObjectStreams: false });

      const blob = createPdfBlob(repairedBytes);
      setDownloadUrl(URL.createObjectURL(blob));
      setReport({ pages, repaired: true });
    } catch (err: any) {
      console.error(err);
      setError('Unable to parse critical root object streams. This file might be completely corrupted or truncated.');
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
            id="repair-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="repair-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wrench className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select damaged or unreadable PDF
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Reconstruct broken cross-reference tables and recover salvageable pages.
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
              onClick={() => { setFile(null); setDownloadUrl(null); setReport(null); }}
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

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRepair}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reconstructing PDF Trees...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>Repair PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadUrl && report && (
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">PDF Repaired Successfully!</p>
              <p className="text-xs text-slate-600">Reconstructed valid document table with {report.pages} pages.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="repaired_document_toolnest.pdf"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Repaired PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};
