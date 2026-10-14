import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { FileSpreadsheet, Download, RefreshCw, AlertCircle, CheckCircle2, Eye } from 'lucide-react';

export const HtmlToPdfTool: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState(`<h2>Project Scope & Terms</h2>
<p>This is a formatted agreement generated using <strong>ToolNest HTML to PDF</strong>.</p>
<ul>
  <li>Fast client-side rendering with zero server uploads</li>
  <li>Supports headings, lists, tables, and styling</li>
  <li>Export directly to clean printable PDF</li>
</ul>
<table border="1" style="width:100%; border-collapse: collapse; margin-top: 15px;">
  <tr style="background:#f1f5f9;">
    <th style="padding: 8px;">Milestone</th>
    <th style="padding: 8px;">Deliverable</th>
    <th style="padding: 8px;">Status</th>
  </tr>
  <tr>
    <td style="padding: 8px;">Phase 1</td>
    <td style="padding: 8px;">Core Architecture</td>
    <td style="padding: 8px; color: green;">Completed</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Phase 2</td>
    <td style="padding: 8px;">PDF & Image Suite</td>
    <td style="padding: 8px; color: green;">Completed</td>
  </tr>
</table>`);

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePdf = () => {
    setIsProcessing(true);
    setError(null);

    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });

      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.width = '550px';
      element.style.padding = '20px';
      element.style.fontFamily = 'Helvetica, Arial, sans-serif';
      element.style.color = '#1e293b';
      document.body.appendChild(element);

      doc.html(element, {
        callback: (pdf) => {
          document.body.removeChild(element);
          const blob = pdf.output('blob');
          setDownloadUrl(URL.createObjectURL(blob));
          setIsProcessing(false);
        },
        x: 20,
        y: 20,
        width: 550,
        windowWidth: 600,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to convert HTML to PDF.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Enter HTML Code or Formatted Notes
          </label>
          <textarea
            value={htmlContent}
            onChange={e => {
              setHtmlContent(e.target.value);
              setDownloadUrl(null);
            }}
            rows={10}
            className="w-full p-4 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Live HTML Preview Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Rendered HTML Preview</span>
          </label>
          <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className="p-6 bg-white border border-slate-200 rounded-xl min-h-[140px] prose prose-sm max-w-none shadow-2xs"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGeneratePdf}
            disabled={isProcessing || !htmlContent.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                <span>Convert HTML to PDF</span>
              </>
            )}
          </button>
        </div>

        {downloadUrl && (
          <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">PDF Generated Successfully!</p>
                <p className="text-xs text-slate-600">Printable A4 document is ready to download.</p>
              </div>
            </div>

            <a
              href={downloadUrl}
              download="html_document_toolnest.pdf"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
