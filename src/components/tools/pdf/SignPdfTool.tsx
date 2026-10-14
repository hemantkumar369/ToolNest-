import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, PenTool, Type, Eraser, Download, AlertCircle, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

export const SignPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [signMode, setSignMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [fontFamily, setFontFamily] = useState<'cursive' | 'serif' | 'sans-serif'>('cursive');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-center' | 'bottom-left'>('bottom-right');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (signMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [signMode, file]);

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
      setSelectedPage(doc.getPageCount()); // usually last page
    } catch (err: any) {
      setError(err?.message || 'Failed to open PDF document.');
    }
    e.target.value = '';
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const getSignaturePngBlob = async (): Promise<Blob | null> => {
    if (signMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return null;
      return new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
    } else {
      if (!typedName.trim()) return null;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 400;
      offCanvas.height = 150;
      const ctx = offCanvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#1e3a8a';
      ctx.font = `italic 36px ${fontFamily === 'cursive' ? 'cursive, "Brush Script MT", "Segoe Script"' : fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName, 200, 75);

      return new Promise<Blob | null>(res => offCanvas.toBlob(res, 'image/png'));
    }
  };

  const handleSign = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const sigBlob = await getSignaturePngBlob();
      if (!sigBlob) {
        setError('Please draw or type your signature before applying.');
        setIsProcessing(false);
        return;
      }

      const sigBuffer = await sigBlob.arrayBuffer();
      const pdfBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const sigImage = await pdfDoc.embedPng(sigBuffer);

      const pageIndex = Math.max(0, Math.min(pageCount - 1, selectedPage - 1));
      const page = pdfDoc.getPage(pageIndex);
      const { width } = page.getSize();

      const sigWidth = 160;
      const sigHeight = (sigImage.height / sigImage.width) * sigWidth;
      const margin = 40;

      let x = width - margin - sigWidth;
      let y = margin + 20;

      if (position === 'bottom-center') {
        x = (width - sigWidth) / 2;
      } else if (position === 'bottom-left') {
        x = margin;
      }

      page.drawImage(sigImage, {
        x,
        y,
        width: sigWidth,
        height: sigHeight,
      });

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to sign PDF document.');
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
            id="sign-pdf-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="sign-pdf-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PenTool className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select PDF document to sign
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Draw or type your signature and embed it into contracts or forms. 100% private.
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

          {/* Mode Switcher */}
          <div className="flex gap-2 border-b border-slate-100 pb-3">
            <button
              onClick={() => setSignMode('draw')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                signMode === 'draw' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Draw Signature</span>
            </button>
            <button
              onClick={() => setSignMode('type')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                signMode === 'type' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Type Signature</span>
            </button>
          </div>

          {/* Canvas or Type inputs */}
          {signMode === 'draw' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Draw with finger, stylus, or mouse:</label>
                <button
                  onClick={clearCanvas}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="border-2 border-slate-300 rounded-2xl overflow-hidden bg-slate-50">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 bg-white cursor-crosshair touch-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Type Your Full Legal Name</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={e => setTypedName(e.target.value)}
                  placeholder="e.g. Johnathan Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              {typedName && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs text-slate-400 block mb-2">Signature Preview:</span>
                  <div className="text-3xl font-cursive text-blue-900 tracking-wide italic">
                    {typedName}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placement settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Page</label>
              <select
                value={selectedPage}
                onChange={e => setSelectedPage(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium"
              >
                {Array.from({ length: pageCount }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Page {i + 1} {i + 1 === pageCount ? '(Last Page)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Position on Page</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium"
              >
                <option value="bottom-right">Bottom Right (Standard Sign Area)</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
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
              onClick={handleSign}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing Document...</span>
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" />
                  <span>Sign & Stamp PDF</span>
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
              <p className="font-bold text-slate-900 text-sm">Document Signed Successfully!</p>
              <p className="text-xs text-slate-600">Signature stamped on page {selectedPage}.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="signed_document_toolnest.pdf"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Signed PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};
