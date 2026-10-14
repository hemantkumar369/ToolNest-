import React, { useState } from 'react';
import { Upload, Sparkles, Download, Copy, Check, CheckCircle2 } from 'lucide-react';

interface GeneratedFavicon {
  size: number;
  label: string;
  url: string;
}

export const FaviconGeneratorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([]);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = e.target.files[0];
    setFile(selected);

    const img = new Image();
    const url = URL.createObjectURL(selected);
    img.onload = () => {
      const sizes = [
        { size: 16, label: '16x16 (Browser Tab Standard)' },
        { size: 32, label: '32x32 (Retina & Desktop Shortcut)' },
        { size: 48, label: '48x48 (Windows Site Icon)' },
        { size: 180, label: '180x180 (Apple Touch Icon / iOS)' },
      ];

      const results: GeneratedFavicon[] = [];
      for (const item of sizes) {
        const canvas = document.createElement('canvas');
        canvas.width = item.size;
        canvas.height = item.size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, item.size, item.size);
          const iconUrl = canvas.toDataURL('image/png');
          results.push({ size: item.size, label: item.label, url: iconUrl });
        }
      }
      setFavicons(results);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    e.target.value = '';
  };

  const htmlSnippet = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30 group">
          <input
            type="file"
            id="favicon-upload"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="favicon-upload" className="cursor-pointer block">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Click to select logo or image for Favicon generation
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Generates 16x16, 32x32, 48x48, and 180x180 icons with ready-to-use HTML code.
            </p>
            <span className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
              Choose Logo Image
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
            <button
              onClick={() => { setFile(null); setFavicons([]); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change Logo
            </button>
          </div>

          {/* Favicons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favicons.map((item) => (
              <div key={item.size} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 shadow-2xs">
                  <img src={item.url} alt={`${item.size}x${item.size}`} className="max-w-full max-h-full" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800">{item.size} x {item.size} px</div>
                  <div className="text-[10px] text-slate-500">{item.label}</div>
                </div>
                <a
                  href={item.url}
                  download={`favicon-${item.size}x${item.size}.png`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>

          {/* HTML Code Snippet */}
          <div className="p-4 bg-slate-900 rounded-xl text-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Paste in &lt;head&gt; of your website:</span>
              <button
                onClick={copyHtml}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedHtml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHtml ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs overflow-x-auto text-emerald-300 p-2 bg-slate-950/60 rounded-lg">
              {htmlSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
