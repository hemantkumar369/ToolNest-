import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileCode, Copy, Download, AlertCircle, RefreshCw, Check, FileText } from 'lucide-react';

export const PdfToTextTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setExtractedText('');

    const selected = e.target.files[0];
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }
    setFile(selected);
    e.target.value = '';
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      // Parse raw streams to extract text tokens
      const textDecoder = new TextDecoder('utf-8');
      const rawString = textDecoder.decode(buffer);

      // Extract BT (Begin Text) ... ET (End Text) blocks or TJ / Tj string tokens
      const textMatches: string[] = [];
      const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
      let match;
      while ((match = tjRegex.exec(rawString)) !== null) {
        if (match[1] && match[1].trim().length > 0) {
          textMatches.push(match[1]);
        }
      }

      // Also parse array glyphs like [(H) 10 (e) 10 (llo)] TJ
      const arrayTjRegex = /\[([^\]]+)\]\s*TJ/g;
      while ((match = arrayTjRegex.exec(rawString)) !== null) {
        const inner = match[1];
        const stringParts = inner.match(/\(([^)]+)\)/g);
        if (stringParts) {
          const joined = stringParts.map(s => s.replace(/[()]/g, '')).join('');
          if (joined.trim()) textMatches.push(joined);
        }
      }

      let parsed = '';
      if (textMatches.length > 0) {
        parsed = textMatches.join(' ')
          .replace(/\\r/g, '\n')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\([()\\])/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();
      }

      if (!parsed) {
        parsed = `# Extracted Content from ${file.name}\n\n[Note: This document contains vector paths or scanned bitmap imagery without embedded unencrypted text streams. If this is a digital document, text might be encoded in compressed object streams.]`;
      } else {
        parsed = `# Document: ${file.name}\n\n${parsed}`;
      }

      setExtractedText(parsed);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to extract text from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTextFile = (ext: 'txt' | 'md') => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace(/\.pdf$/i, '') || 'extracted'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30 group">
          <input
            type="file"
            id="pdf-to-text-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="pdf-to-text-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCode className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select PDF to extract text & markdown
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Extract plain text, paragraphs, and markdown format. 100% private.
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
              onClick={() => { setFile(null); setExtractedText(''); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change File
            </button>
          </div>

          {!extractedText && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleExtract}
                disabled={isProcessing}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Text Streams...</span>
                  </>
                ) : (
                  <>
                    <FileCode className="w-4 h-4" />
                    <span>Extract Text Now</span>
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {extractedText && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{charCount} characters</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => downloadTextFile('txt')}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .TXT</span>
                  </button>

                  <button
                    onClick={() => downloadTextFile('md')}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .MD</span>
                  </button>
                </div>
              </div>

              <textarea
                value={extractedText}
                onChange={e => setExtractedText(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
