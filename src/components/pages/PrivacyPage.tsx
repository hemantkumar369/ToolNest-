import React from 'react';
import { ShieldCheck, Lock, Cpu, Globe, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs toolName="Privacy Guarantee & Technical Architecture" onNavigate={onNavigate} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Privacy Guarantee & Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              How ToolNest protects your documents, data, and sensitive information.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">100% Client-Side</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Files uploaded to tools are processed entirely in your web browser memory via HTML5 APIs and WebAssembly.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">No Server Storage</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              We operate zero backend databases or file storage buckets. Your documents are never uploaded to any remote server.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Netlify CDN Hosting</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Static assets (HTML, CSS, JS) are delivered securely through Netlify edge global CDN without data harvesting.
            </p>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Technical Data Processing Details</h2>
          <p>
            When you select a PDF file in <strong>Merge PDF</strong>, <strong>Split PDF</strong>, or <strong>Compress PDF</strong>, your browser reads the binary file using standard <code>FileReader</code> and <code>ArrayBuffer</code> primitives. The file manipulation is performed by client-side WebAssembly and pure TypeScript libraries (<code>pdf-lib</code>, <code>jsPDF</code>). The result is converted to an in-memory <code>Blob URL</code> for direct browser download.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Image Tools & Photos</h2>
          <p>
            Images processed in <strong>Image Compressor</strong>, <strong>Photo & Signature Resizer (KB)</strong>, and <strong>Favicon Generator</strong> are rendered onto sandboxed <code>HTML5 &lt;canvas&gt;</code> elements. No image data is ever transmitted across the internet.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Third-Party Disclosures</h2>
          <p>
            ToolNest does not use tracking cookies, behavioral ad pixels, or third-party user fingerprinting tools.
          </p>
        </div>
      </div>
    </div>
  );
};
