import React from 'react';
import { Layers, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../../data/tools';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Tool<span className="text-blue-500">Nest</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              ToolNest is a modern, high-speed suite of free web utilities. We prioritize your privacy above all: all PDF merges, image compressions, conversions, and calculations run 100% locally on your browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-2 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero server file uploads • No trackers • Free forever</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Compatible with modern browsers (Chrome, Firefox, Safari, Edge) & mobile devices.
            </p>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Popular PDF Tools
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/tools/merge-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/split-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/compress-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Compress PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/jpg-to-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  JPG to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/sign-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Sign PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/protect-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Protect PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/pdf')} className="text-blue-400 hover:text-blue-300 font-medium">
                  View all 15+ PDF tools &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Everyday & Dev Tools */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Images & Utilities
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/tools/image-compressor')} className="hover:text-white transition-colors cursor-pointer">
                  Image Compressor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/target-kb-resizer')} className="hover:text-white transition-colors cursor-pointer">
                  Photo & Signature Resizer (KB)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/qr-code-generator')} className="hover:text-white transition-colors cursor-pointer">
                  QR Code Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/barcode-generator')} className="hover:text-white transition-colors cursor-pointer">
                  Barcode Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/password-generator')} className="hover:text-white transition-colors cursor-pointer">
                  Password Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/invoice-generator')} className="hover:text-white transition-colors cursor-pointer">
                  Invoice Generator with PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Calculators & Navigation */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Calculators & Links
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/tools/percentage-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  Percentage Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/age-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  Age Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/emi-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  EMI & Loan Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/cgpa-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  CGPA & GPA Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/attendance-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  Attendance Calculator
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <button onClick={() => onNavigate('/privacy')} className="text-slate-300 hover:text-white font-medium">
                  Privacy Policy & Technical Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sitemap')} className="text-slate-300 hover:text-white font-medium">
                  Complete Tools Index
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ToolNest. All rights reserved. Free online digital utilities platform.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/privacy')} className="hover:text-slate-300 cursor-pointer">Privacy Guarantee</button>
            <button onClick={() => onNavigate('/sitemap')} className="hover:text-slate-300 cursor-pointer">HTML Sitemap</button>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1">
              <span>sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
