/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CommandMenu } from './components/common/CommandMenu';
import { ToolLayout } from './components/common/ToolLayout';

import { HomePage } from './components/pages/HomePage';
import { CategoryPage } from './components/pages/CategoryPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { SitemapPage } from './components/pages/SitemapPage';

import { getToolByPath, TOOLS } from './data/tools';
import { ToolCategory } from './types';
import { updatePageSEO } from './utils/seo';
import { ThemeProvider } from './context/ThemeContext';

// PDF Tools
import { MergePdfTool } from './components/tools/pdf/MergePdfTool';
import { SplitPdfTool } from './components/tools/pdf/SplitPdfTool';
import { CompressPdfTool } from './components/tools/pdf/CompressPdfTool';
import { OrganizePdfTool } from './components/tools/pdf/OrganizePdfTool';
import { ExtractPdfTool } from './components/tools/pdf/ExtractPdfTool';
import { DeletePdfPagesTool } from './components/tools/pdf/DeletePdfPagesTool';
import { RotatePdfTool } from './components/tools/pdf/RotatePdfTool';
import { CropPdfTool } from './components/tools/pdf/CropPdfTool';
import { JpgToPdfTool } from './components/tools/pdf/JpgToPdfTool';
import { PdfToImagesTool } from './components/tools/pdf/PdfToImagesTool';
import { PageNumbersTool } from './components/tools/pdf/PageNumbersTool';
import { WatermarkPdfTool } from './components/tools/pdf/WatermarkPdfTool';
import { ProtectPdfTool } from './components/tools/pdf/ProtectPdfTool';
import { UnlockPdfTool } from './components/tools/pdf/UnlockPdfTool';
import { RepairPdfTool } from './components/tools/pdf/RepairPdfTool';
import { PdfToTextTool } from './components/tools/pdf/PdfToTextTool';
import { SignPdfTool } from './components/tools/pdf/SignPdfTool';
import { ComparePdfTool } from './components/tools/pdf/ComparePdfTool';
import { HtmlToPdfTool } from './components/tools/pdf/HtmlToPdfTool';
import { PdfToPdfATool } from './components/tools/pdf/PdfToPdfATool';
import { PdfAiAssistantTool } from './components/tools/pdf/PdfAiAssistantTool';

// Image Tools
import { ImageCompressorTool } from './components/tools/image/ImageCompressorTool';
import { ImageResizerTool } from './components/tools/image/ImageResizerTool';
import { TargetKbResizerTool } from './components/tools/image/TargetKbResizerTool';
import { ImageConverterTool } from './components/tools/image/ImageConverterTool';
import { ImageCropperTool } from './components/tools/image/ImageCropperTool';
import { FaviconGeneratorTool } from './components/tools/image/FaviconGeneratorTool';

// Calculators
import { PercentageCalculatorTool } from './components/tools/calculators/PercentageCalculatorTool';
import { AgeCalculatorTool } from './components/tools/calculators/AgeCalculatorTool';
import { EmiCalculatorTool } from './components/tools/calculators/EmiCalculatorTool';
import { GstCalculatorTool } from './components/tools/calculators/GstCalculatorTool';
import { CgpaCalculatorTool } from './components/tools/calculators/CgpaCalculatorTool';
import { AttendanceCalculatorTool } from './components/tools/calculators/AttendanceCalculatorTool';
import { AverageCalculatorTool } from './components/tools/calculators/AverageCalculatorTool';
import { DateDifferenceTool } from './components/tools/calculators/DateDifferenceTool';
import { UnitConverterTool } from './components/tools/calculators/UnitConverterTool';

// Text and Developer Tools
import { WordCounterTool } from './components/tools/text-dev/WordCounterTool';
import { CaseConverterTool } from './components/tools/text-dev/CaseConverterTool';
import { DuplicateLineRemoverTool } from './components/tools/text-dev/DuplicateLineRemoverTool';
import { FindAndReplaceTool } from './components/tools/text-dev/FindAndReplaceTool';
import { JsonFormatterTool } from './components/tools/text-dev/JsonFormatterTool';
import { Base64ConverterTool } from './components/tools/text-dev/Base64ConverterTool';
import { UrlConverterTool } from './components/tools/text-dev/UrlConverterTool';
import { SqlFormatterTool } from './components/tools/text-dev/SqlFormatterTool';
import { CodePlaygroundTool } from './components/tools/text-dev/CodePlaygroundTool';
import { RegexTesterTool } from './components/tools/text-dev/RegexTesterTool';

// Generators and Productivity Tools
import { QrCodeGeneratorTool } from './components/tools/generators/QrCodeGeneratorTool';
import { BarcodeGeneratorTool } from './components/tools/generators/BarcodeGeneratorTool';
import { PasswordGeneratorTool } from './components/tools/generators/PasswordGeneratorTool';
import { RandomPickerTool } from './components/tools/generators/RandomPickerTool';
import { InvoiceGeneratorTool } from './components/tools/generators/InvoiceGeneratorTool';
import { ColorPaletteTool } from './components/tools/generators/ColorPaletteTool';
import { PomodoroTimerTool } from './components/tools/generators/PomodoroTimerTool';
import { TypingTestTool } from './components/tools/generators/TypingTestTool';
import { ResumeBuilderTool } from './components/tools/generators/ResumeBuilderTool';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle client-side routing & popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync SEO on route changes
  useEffect(() => {
    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    if (cleanPath === '/') {
      updatePageSEO(
        'ToolNest - Free Online PDF, Image, Developer & Productivity Tools',
        'Fast, 100% private in-browser digital utility platform for PDF tools, image optimization, smart calculators, developer utilities, and productivity generators.',
        '/'
      );
    } else if (cleanPath === '/privacy') {
      updatePageSEO(
        'Privacy Guarantee & Technical Architecture',
        'Learn how ToolNest processes all files and data 100% locally on your browser with zero server uploads.',
        '/privacy'
      );
    } else if (cleanPath === '/sitemap') {
      updatePageSEO(
        'Tools Index & HTML Sitemap',
        'Complete index of all 38+ free online tools, calculators, and converters available on ToolNest.',
        '/sitemap'
      );
    } else if (cleanPath.startsWith('/category/')) {
      const catId = cleanPath.replace('/category/', '') as ToolCategory;
      updatePageSEO(
        `${catId.toUpperCase()} Tools Suite`,
        `Explore all free client-side ${catId} utilities on ToolNest with zero upload latency.`,
        cleanPath
      );
    } else {
      const tool = getToolByPath(cleanPath);
      if (tool) {
        updatePageSEO(
          `${tool.name} - Free Online Tool`,
          tool.shortDesc,
          tool.path,
          tool
        );
      }
    }
  }, [currentPath]);

  // Render Tool Component mapping
  const renderToolComponent = (toolId: string) => {
    switch (toolId) {
      // PDF
      case 'merge-pdf': return <MergePdfTool />;
      case 'split-pdf': return <SplitPdfTool />;
      case 'compress-pdf': return <CompressPdfTool />;
      case 'organize-pdf': return <OrganizePdfTool />;
      case 'extract-pdf': return <ExtractPdfTool />;
      case 'delete-pdf-pages': return <DeletePdfPagesTool />;
      case 'rotate-pdf': return <RotatePdfTool />;
      case 'crop-pdf': return <CropPdfTool />;
      case 'jpg-to-pdf': return <JpgToPdfTool />;
      case 'pdf-to-images': return <PdfToImagesTool />;
      case 'page-numbers': return <PageNumbersTool />;
      case 'watermark-pdf': return <WatermarkPdfTool />;
      case 'protect-pdf': return <ProtectPdfTool />;
      case 'unlock-pdf': return <UnlockPdfTool />;
      case 'repair-pdf': return <RepairPdfTool />;
      case 'pdf-to-text': return <PdfToTextTool />;
      case 'sign-pdf': return <SignPdfTool />;
      case 'compare-pdf': return <ComparePdfTool />;
      case 'html-to-pdf': return <HtmlToPdfTool />;
      case 'pdf-to-pdfa': return <PdfToPdfATool />;
      case 'pdf-ai-assistant': return <PdfAiAssistantTool />;

      // Images
      case 'image-compressor': return <ImageCompressorTool />;
      case 'image-resizer': return <ImageResizerTool />;
      case 'target-kb-resizer': return <TargetKbResizerTool />;
      case 'image-converter': return <ImageConverterTool />;
      case 'image-cropper': return <ImageCropperTool />;
      case 'favicon-generator': return <FaviconGeneratorTool />;

      // Calculators
      case 'percentage-calculator': return <PercentageCalculatorTool />;
      case 'age-calculator': return <AgeCalculatorTool />;
      case 'emi-calculator': return <EmiCalculatorTool />;
      case 'gst-calculator': return <GstCalculatorTool />;
      case 'cgpa-calculator': return <CgpaCalculatorTool />;
      case 'attendance-calculator': return <AttendanceCalculatorTool />;
      case 'average-calculator': return <AverageCalculatorTool />;
      case 'date-difference': return <DateDifferenceTool />;
      case 'unit-converter': return <UnitConverterTool />;

      // Text and Developer
      case 'word-counter': return <WordCounterTool />;
      case 'case-converter': return <CaseConverterTool />;
      case 'duplicate-line-remover': return <DuplicateLineRemoverTool />;
      case 'find-and-replace': return <FindAndReplaceTool />;
      case 'json-formatter': return <JsonFormatterTool />;
      case 'base64-converter': return <Base64ConverterTool />;
      case 'url-converter': return <UrlConverterTool />;
      case 'sql-formatter': return <SqlFormatterTool />;
      case 'code-playground': return <CodePlaygroundTool />;
      case 'regex-tester': return <RegexTesterTool />;

      // Generators and Productivity
      case 'qr-code-generator': return <QrCodeGeneratorTool />;
      case 'barcode-generator': return <BarcodeGeneratorTool />;
      case 'password-generator': return <PasswordGeneratorTool />;
      case 'random-picker': return <RandomPickerTool />;
      case 'invoice-generator': return <InvoiceGeneratorTool />;
      case 'color-palette': return <ColorPaletteTool />;
      case 'pomodoro-timer': return <PomodoroTimerTool />;
      case 'typing-test': return <TypingTestTool />;
      case 'resume-builder': return <ResumeBuilderTool />;

      default: return null;
    }
  };

  const renderContent = () => {
    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    if (cleanPath === '/') {
      return <HomePage onNavigate={navigate} onOpenSearch={() => setSearchOpen(true)} />;
    }

    if (cleanPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }

    if (cleanPath === '/sitemap') {
      return <SitemapPage onNavigate={navigate} />;
    }

    if (cleanPath.startsWith('/category/')) {
      const catId = cleanPath.replace('/category/', '') as ToolCategory;
      return <CategoryPage categoryId={catId} onNavigate={navigate} />;
    }

    // Check if it's a tool route
    const currentTool = getToolByPath(cleanPath);
    if (currentTool) {
      return (
        <ToolLayout tool={currentTool} onNavigate={navigate}>
          {renderToolComponent(currentTool.id)}
        </ToolLayout>
      );
    }

    // Fallback 404
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900">404 - Tool Not Found</h1>
        <p className="text-sm text-slate-600">The requested tool or page does not exist or has been moved.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
        >
          Return to ToolNest Home
        </button>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-blue-600 selection:text-white">
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <div className="flex-1">
          {renderContent()}
        </div>

        <Footer onNavigate={navigate} />

        <CommandMenu
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectTool={navigate}
        />
      </div>
    </ThemeProvider>
  );
}
