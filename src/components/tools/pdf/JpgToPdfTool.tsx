import React, { useState } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { Upload, ArrowUp, ArrowDown, Trash2, Download, AlertCircle, RefreshCw, FileImage, CheckCircle2 } from 'lucide-react';
import { createPdfBlob } from '../../../utils/pdf';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

export const JpgToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'large'>('small');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setDownloadUrl(null);

    const newItems: ImageItem[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image file.`);
        continue;
      }
      newItems.push({
        id: `${file.name}-${Date.now()}-${i}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name
      });
    }

    setImages(prev => [...prev, ...newItems]);
    e.target.value = '';
  };

  const moveImage = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setImages(next);
    setDownloadUrl(null);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/jpeg' || item.file.type === 'image/jpg') {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // For WebP or other formats, convert to PNG in-memory via canvas
          const img = new Image();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = item.previewUrl;
          });
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngBlob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
          if (!pngBlob) throw new Error('Failed to process image format.');
          const pngBuffer = await pngBlob.arrayBuffer();
          embeddedImage = await pdfDoc.embedPng(pngBuffer);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === 'Fit') {
          pageWidth = imgWidth;
          pageHeight = imgHeight;
        } else {
          const standardSize = pageSize === 'A4' ? PageSizes.A4 : PageSizes.Letter;
          pageWidth = orientation === 'portrait' ? standardSize[0] : standardSize[1];
          pageHeight = orientation === 'portrait' ? standardSize[1] : standardSize[0];
        }

        const marginVal = margin === 'none' ? 0 : margin === 'small' ? 24 : 48;
        const availWidth = pageWidth - marginVal * 2;
        const availHeight = pageHeight - marginVal * 2;

        const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
        const finalWidth = imgWidth * scale;
        const finalHeight = imgHeight * scale;

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(embeddedImage, {
          x,
          y,
          width: finalWidth,
          height: finalHeight
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = createPdfBlob(pdfBytes);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error occurred while converting images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30 group">
        <input
          type="file"
          id="jpg-to-pdf-upload"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
          className="hidden"
        />
        <label htmlFor="jpg-to-pdf-upload" className="cursor-pointer block">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <p className="text-base font-semibold text-slate-800">
            Click to upload JPG, PNG, or WebP images
          </p>
          <p className="text-xs text-slate-500 mt-1.5">
            Convert photos, scanned documents, receipts into a multi-page PDF document.
          </p>
          <span className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
            Select Images
          </span>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Page Size</label>
              <select
                value={pageSize}
                onChange={e => setPageSize(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
              >
                <option value="A4">A4 (Standard 210 x 297 mm)</option>
                <option value="Letter">US Letter</option>
                <option value="Fit">Fit to Image Size</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Orientation</label>
              <select
                value={orientation}
                onChange={e => setOrientation(e.target.value as any)}
                disabled={pageSize === 'Fit'}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium disabled:opacity-50"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Margins</label>
              <select
                value={margin}
                onChange={e => setMargin(e.target.value as any)}
                disabled={pageSize === 'Fit'}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium disabled:opacity-50"
              >
                <option value="none">No Margin (Full Bleed)</option>
                <option value="small">Small Margin (Clean)</option>
                <option value="large">Large Margin</option>
              </select>
            </div>
          </div>

          {/* Images Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{images.length} images added. Drag or use arrows to reorder pages.</span>
              <button onClick={() => setImages([])} className="text-rose-600 hover:underline">Clear</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {images.map((item, idx) => (
                <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col justify-between">
                  <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
                    <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-2 text-center text-xs font-medium text-slate-700 truncate">
                    Page {idx + 1}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <button
                      onClick={() => moveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                      title="Move backward"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                      title="Move forward"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeImage(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting Images to PDF...</span>
                </>
              ) : (
                <>
                  <FileImage className="w-4 h-4" />
                  <span>Convert {images.length} Image{images.length > 1 ? 's' : ''} to PDF</span>
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
              <p className="font-bold text-slate-900 text-sm">PDF Created Successfully!</p>
              <p className="text-xs text-slate-600">{images.length} pages compiled.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="converted_images_toolnest.pdf"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};
