import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Scissors, Download, AlertCircle, RefreshCw, FileText, CheckCircle } from 'lucide-react';

interface SplitResult {
  name: string;
  url: string;
  pages: string;
}

export const SplitPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<SplitResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setResults([]);

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
      setRangeInput(count > 1 ? `1-${Math.min(count, 2)}` : '1');
    } catch (err: any) {
      setError(err?.message || 'Failed to load PDF. The document might be password-protected or corrupt.');
    }
    e.target.value = '';
  };

  const parseRanges = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map(p => p.trim());

    for (const part of parts) {
      if (!part) continue;
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let p = from; p <= to; p++) {
            pages.add(p);
          }
        }
      } else {
        const single = parseInt(part, 10);
        if (!isNaN(single) && single >= 1 && single <= maxPages) {
          pages.add(single);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || pageCount === 0) return;
    setIsProcessing(true);
    setError(null);
    setResults([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);

      if (splitMode === 'range') {
        const selectedPages = parseRanges(rangeInput, pageCount);
        if (selectedPages.length === 0) {
          setError(`Please provide valid page numbers between 1 and ${pageCount}.`);
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const indices = selectedPages.map(p => p - 1);
        const copied = await newDoc.copyPages(srcDoc, indices);
        copied.forEach(page => newDoc.addPage(page));

        const bytes = await newDoc.save();
        const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResults([{
          name: `${file.name.replace(/\.pdf$/i, '')}_split_pages_${rangeInput.replace(/[^0-9-]/g, '_')}.pdf`,
          url,
          pages: selectedPages.join(', ')
        }]);
      } else {
        // Split every page into its own PDF
        const newResults: SplitResult[] = [];
        for (let i = 0; i < pageCount; i++) {
          const newDoc = await PDFDocument.create();
          const [copied] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(copied);

          const bytes = await newDoc.save();
          const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          newResults.push({
            name: `${file.name.replace(/\.pdf$/i, '')}_page_${i + 1}.pdf`,
            url,
            pages: `Page ${i + 1}`
          });
        }
        setResults(newResults);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error occurred while splitting PDF.');
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
            id="split-pdf-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="split-pdf-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select a PDF to split
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Extract page ranges or individual pages. 100% private in-browser execution.
            </p>
            <span className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
              Choose PDF File
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Selected Badge */}
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
              onClick={() => { setFile(null); setResults([]); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change File
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Split Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSplitMode('range')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  splitMode === 'range'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-sm">Custom Page Range</div>
                <div className="text-xs text-slate-500 mt-1">
                  Specify ranges like &ldquo;1-3, 5&rdquo; into a single document.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('all')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  splitMode === 'all'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-sm">Extract All Pages Individually</div>
                <div className="text-xs text-slate-500 mt-1">
                  Split every page of this PDF into its own separate file.
                </div>
              </button>
            </div>
          </div>

          {/* Range Input */}
          {splitMode === 'range' && (
            <div className="space-y-2">
              <label htmlFor="range-input" className="block text-xs font-bold text-slate-700">
                Pages to Extract (1 to {pageCount})
              </label>
              <input
                id="range-input"
                type="text"
                value={rangeInput}
                onChange={e => setRangeInput(e.target.value)}
                placeholder="e.g. 1-2, 4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-xs text-slate-500">
                Examples: <code className="bg-slate-100 px-1 py-0.5 rounded">1-3</code> (first 3 pages), <code className="bg-slate-100 px-1 py-0.5 rounded">2, 4, 6</code> (even pages)
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Process Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Pages...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Split PDF Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results Download List */}
      {results.length > 0 && (
        <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Extracted PDF Files ({results.length})</span>
          </h3>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {results.map((res, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl"
              >
                <div className="truncate pr-3">
                  <p className="text-sm font-semibold text-slate-800 truncate">{res.name}</p>
                  <p className="text-xs text-emerald-700">{res.pages}</p>
                </div>
                <a
                  href={res.url}
                  download={res.name}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
