import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, GitCompare, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface PdfDocInfo {
  name: string;
  size: number;
  pageCount: number;
  title?: string;
  author?: string;
  producer?: string;
  textSnippet: string;
}

export const ComparePdfTool: React.FC = () => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [infoA, setInfoA] = useState<PdfDocInfo | null>(null);
  const [infoB, setInfoB] = useState<PdfDocInfo | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compared, setCompared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsePdf = async (file: File): Promise<PdfDocInfo> => {
    const buffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    // Quick text snippet probe
    const textDecoder = new TextDecoder('utf-8');
    const raw = textDecoder.decode(buffer);
    const textMatches: string[] = [];
    const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
    let match;
    while ((match = tjRegex.exec(raw)) !== null && textMatches.length < 50) {
      if (match[1]?.trim()) textMatches.push(match[1]);
    }

    return {
      name: file.name,
      size: file.size,
      pageCount: doc.getPageCount(),
      title: doc.getTitle() || 'Untitled',
      author: doc.getAuthor() || 'Unknown',
      producer: doc.getProducer() || 'Standard PDF Engine',
      textSnippet: textMatches.join(' ').slice(0, 300) || 'Vector/Image payload',
    };
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) {
      setError('Please select both Original and Revised PDF files to compare.');
      return;
    }
    setIsComparing(true);
    setError(null);

    try {
      const [parsedA, parsedB] = await Promise.all([
        parsePdf(fileA),
        parsePdf(fileB)
      ]);
      setInfoA(parsedA);
      setInfoB(parsedB);
      setCompared(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error occurred while comparing documents.');
    } finally {
      setIsComparing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Upload Zone (Two Files) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50">
          <input
            type="file"
            id="compare-pdf-a"
            accept=".pdf,application/pdf"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setFileA(e.target.files[0]);
                setCompared(false);
              }
            }}
            className="hidden"
          />
          <label htmlFor="compare-pdf-a" className="cursor-pointer block">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-sm">
              {fileA ? fileA.name : 'Select Original PDF (File A)'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {fileA ? formatSize(fileA.size) : 'Upload baseline document'}
            </p>
            <span className="inline-block mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg">
              {fileA ? 'Change Document A' : 'Choose Document A'}
            </span>
          </label>
        </div>

        {/* Document B */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50">
          <input
            type="file"
            id="compare-pdf-b"
            accept=".pdf,application/pdf"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setFileB(e.target.files[0]);
                setCompared(false);
              }
            }}
            className="hidden"
          />
          <label htmlFor="compare-pdf-b" className="cursor-pointer block">
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-sm">
              {fileB ? fileB.name : 'Select Revised PDF (File B)'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {fileB ? formatSize(fileB.size) : 'Upload revised document'}
            </p>
            <span className="inline-block mt-3 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg">
              {fileB ? 'Change Document B' : 'Choose Document B'}
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Compare Action */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleCompare}
          disabled={!fileA || !fileB || isComparing}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {isComparing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Document Differences...</span>
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4" />
              <span>Compare Both Documents</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Results Table */}
      {compared && infoA && infoB && (
        <div className="mt-8 space-y-6 pt-6 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Document Comparison Audit</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="p-3 rounded-l-lg">Metric</th>
                  <th className="p-3">Original (File A)</th>
                  <th className="p-3">Revised (File B)</th>
                  <th className="p-3 rounded-r-lg">Diff Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-700">File Size</td>
                  <td className="p-3 text-slate-600">{formatSize(infoA.size)}</td>
                  <td className="p-3 text-slate-600">{formatSize(infoB.size)}</td>
                  <td className="p-3 font-bold">
                    {infoA.size === infoB.size ? (
                      <span className="text-emerald-600">Identical</span>
                    ) : (
                      <span className="text-amber-600">
                        {infoB.size > infoA.size ? `+${formatSize(infoB.size - infoA.size)} larger` : `-${formatSize(infoA.size - infoB.size)} smaller`}
                      </span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-700">Page Count</td>
                  <td className="p-3 text-slate-600">{infoA.pageCount} pages</td>
                  <td className="p-3 text-slate-600">{infoB.pageCount} pages</td>
                  <td className="p-3 font-bold">
                    {infoA.pageCount === infoB.pageCount ? (
                      <span className="text-emerald-600">Identical ({infoA.pageCount})</span>
                    ) : (
                      <span className="text-rose-600">
                        {Math.abs(infoB.pageCount - infoA.pageCount)} page diff
                      </span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-700">Document Title</td>
                  <td className="p-3 text-slate-600">{infoA.title}</td>
                  <td className="p-3 text-slate-600">{infoB.title}</td>
                  <td className="p-3 font-medium">
                    {infoA.title === infoB.title ? (
                      <span className="text-emerald-600">Match</span>
                    ) : (
                      <span className="text-slate-600">Modified</span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-700">Producer / Creator</td>
                  <td className="p-3 text-slate-600 truncate max-w-[150px]">{infoA.producer}</td>
                  <td className="p-3 text-slate-600 truncate max-w-[150px]">{infoB.producer}</td>
                  <td className="p-3 font-medium">
                    {infoA.producer === infoB.producer ? (
                      <span className="text-emerald-600">Same Engine</span>
                    ) : (
                      <span className="text-slate-600">Different Engine</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
