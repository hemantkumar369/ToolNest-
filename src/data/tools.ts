import { ToolDefinition, CategoryDefinition } from '../types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'pdf',
    name: 'PDF Tools',
    icon: 'FileText',
    description: 'Merge, split, compress, protect, edit, sign, and convert PDF files directly in your browser.',
  },
  {
    id: 'image',
    name: 'Image Tools',
    icon: 'Image',
    description: 'Compress photos, resize by target KB for exams, crop, convert JPG/PNG/WebP, and generate favicons.',
  },
  {
    id: 'calculators',
    name: 'Calculators',
    icon: 'Calculator',
    description: 'Financial, academic, and daily calculators for Percentage, Age, EMI, GST, CGPA, and Attendance.',
  },
  {
    id: 'text-dev',
    name: 'Text & Dev Tools',
    icon: 'Code2',
    description: 'Developer utilities including JSON formatter, Base64, SQL, Regex tester, and text transformers.',
  },
  {
    id: 'generators',
    name: 'Generators & Productivity',
    icon: 'Wand2',
    description: 'QR codes, barcodes, secure passwords, invoices with PDF download, Pomodoro timer, and resume builder.',
  },
];

export const TOOLS: ToolDefinition[] = [
  // ===================== PDF TOOLS =====================
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    path: '/tools/merge-pdf',
    category: 'pdf',
    popular: true,
    badge: 'Popular',
    icon: 'Layers',
    shortDesc: 'Combine multiple PDF files into a single unified document in seconds.',
    longDesc: 'Merge multiple PDF documents into one cleanly formatted file. Reorder pages and files with drag-and-drop ease, with zero data leaving your browser.',
    tags: ['pdf', 'merge', 'combine', 'join', 'organize'],
    features: ['100% private in-browser merging', 'Reorder documents before joining', 'No file size limit or watermarks', 'Instant download'],
    howTo: [
      'Select or drag & drop two or more PDF files.',
      'Reorder your files in the order you wish them to appear.',
      'Click "Merge PDFs" to combine them instantly.',
      'Download your merged PDF file.'
    ],
    faqs: [
      {
        question: 'Are my uploaded PDF files safe and private?',
        answer: 'Yes! All merging is performed locally on your device using client-side JavaScript (pdf-lib). Your files are never sent to external servers.'
      },
      {
        question: 'Is there a limit on how many PDFs I can merge?',
        answer: 'No arbitrary limits! You can merge as many PDF files as your device memory can accommodate.'
      }
    ]
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: 'split-pdf',
    path: '/tools/split-pdf',
    category: 'pdf',
    popular: true,
    badge: 'Essential',
    icon: 'Scissors',
    shortDesc: 'Extract specific pages or page ranges into new standalone PDF files.',
    longDesc: 'Separate one or more pages from a PDF. Specify custom page ranges (e.g. 1-3, 5, 8-12) or extract each page into individual documents.',
    tags: ['pdf', 'split', 'extract', 'separate', 'pages'],
    features: ['Custom page ranges (e.g. 1-3, 5)', 'Extract all pages into separate PDFs', 'Page count detection', 'Safe client-side extraction'],
    howTo: [
      'Upload the PDF you want to split.',
      'Enter page ranges or choose to extract individual pages.',
      'Click "Split PDF" to process the pages.',
      'Download your extracted PDF files.'
    ],
    faqs: [
      {
        question: 'How do I specify multiple ranges?',
        answer: 'You can type comma-separated values like "1-3, 5, 7-10".'
      }
    ]
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    path: '/tools/compress-pdf',
    category: 'pdf',
    popular: true,
    badge: 'Popular',
    icon: 'Minimize2',
    shortDesc: 'Reduce PDF file size while maintaining optimal text and visual quality.',
    longDesc: 'Optimize PDF streams, remove redundant metadata, and compact PDF structure with adjustable compression modes (Extreme, Recommended, Light).',
    tags: ['pdf', 'compress', 'reduce size', 'optimize', 'shrink'],
    features: ['Multiple compression presets', 'Displays original vs compressed size savings', '100% private client-side processing'],
    howTo: [
      'Upload your PDF file.',
      'Choose compression level: Recommended, Extreme, or Light.',
      'Click "Compress PDF" to optimize the file structure.',
      'Download your compressed PDF.'
    ],
    faqs: [
      {
        question: 'Will compression reduce text readability?',
        answer: 'No. Text fonts and vectors remain sharp. Structural optimization strips duplicated streams and redundant dictionaries.'
      }
    ]
  },
  {
    id: 'organize-pdf',
    name: 'Organize & Reorder PDF',
    slug: 'organize-pdf',
    path: '/tools/organize-pdf',
    category: 'pdf',
    icon: 'Grid',
    shortDesc: 'Sort, reorder, rotate, or delete specific pages of your PDF document.',
    longDesc: 'View all pages of your PDF in an interactive visual grid. Drag and drop to reorder, rotate individual pages, or delete unneeded pages before saving.',
    tags: ['pdf', 'organize', 'reorder', 'sort', 'arrange', 'rotate'],
    features: ['Visual thumbnail page grid', 'Move pages left or right', 'Delete unwanted pages', 'Rotate individual pages'],
    howTo: [
      'Upload your PDF file.',
      'Use arrow controls to move pages or delete unneeded ones.',
      'Rotate specific pages if necessary.',
      'Click "Save & Download PDF" to save the re-organized document.'
    ],
    faqs: [
      {
        question: 'Can I remove multiple pages at once?',
        answer: 'Yes, just click the trash icon on each page you want to exclude.'
      }
    ]
  },
  {
    id: 'extract-pdf',
    name: 'Extract PDF Pages',
    slug: 'extract-pdf',
    path: '/tools/extract-pdf',
    category: 'pdf',
    icon: 'FileOutput',
    shortDesc: 'Select and export only the required pages from a large PDF document.',
    longDesc: 'Extract targeted pages from any multi-page PDF document. Create a new clean PDF containing exclusively the selected pages.',
    tags: ['pdf', 'extract', 'pages', 'select'],
    features: ['Multi-page selection', 'Range input and click-to-select', 'Maintains original formatting'],
    howTo: [
      'Upload the PDF file.',
      'Check the page numbers you wish to extract or specify ranges.',
      'Click "Extract Pages" to build the new document.',
      'Download your extracted PDF.'
    ],
    faqs: [
      {
        question: 'Does extracting delete pages from my original file?',
        answer: 'No, your original file remains untouched on your computer. A new file is created with only the extracted pages.'
      }
    ]
  },
  {
    id: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    slug: 'delete-pdf-pages',
    path: '/tools/delete-pdf-pages',
    category: 'pdf',
    icon: 'Trash2',
    shortDesc: 'Remove unnecessary or blank pages from your PDF file.',
    longDesc: 'Quickly discard unwanted pages from any PDF document. Specify page numbers to remove and download the streamlined PDF instantly.',
    tags: ['pdf', 'delete', 'remove', 'strip pages'],
    features: ['Easy selection of pages to remove', 'Page counter preview', 'Instant client-side generation'],
    howTo: [
      'Upload your PDF document.',
      'Type or click the pages you want to delete.',
      'Click "Delete Pages & Generate PDF".',
      'Download the trimmed PDF document.'
    ],
    faqs: [
      {
        question: 'Can I undo page deletions?',
        answer: 'Yes, you can simply uncheck any page before clicking the download button.'
      }
    ]
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    slug: 'rotate-pdf',
    path: '/tools/rotate-pdf',
    category: 'pdf',
    icon: 'RotateCw',
    shortDesc: 'Rotate PDF pages 90°, 180°, or 270° clockwise or counter-clockwise.',
    longDesc: 'Fix upside-down or sideways scans. Rotate all pages at once or target individual pages with 90-degree increments.',
    tags: ['pdf', 'rotate', 'orient', 'turn', 'flip'],
    features: ['Rotate 90° Right, 90° Left, or 180°', 'Rotate all pages or custom selection', 'Preserves original resolution'],
    howTo: [
      'Upload your PDF file.',
      'Select rotation angle (90° Clockwise, Counter-clockwise, or 180°).',
      'Choose whether to apply to all pages or specific page range.',
      'Download the rotated PDF.'
    ],
    faqs: [
      {
        question: 'Does rotating affect print quality?',
        answer: 'Not at all. PDF rotation simply modifies the page viewport orientation metadata without degrading graphics or text.'
      }
    ]
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF Margins',
    slug: 'crop-pdf',
    path: '/tools/crop-pdf',
    category: 'pdf',
    icon: 'Crop',
    shortDesc: 'Trim margins or crop borders from your PDF pages.',
    longDesc: 'Adjust top, bottom, left, and right margins to remove white space, scanner borders, or printer marks from PDF pages.',
    tags: ['pdf', 'crop', 'trim', 'margins', 'cut'],
    features: ['Adjustable margins in points or millimeters', 'Live margin preview', 'Applies to entire document or custom pages'],
    howTo: [
      'Upload your PDF file.',
      'Configure the margin trim values for Top, Bottom, Left, and Right.',
      'Click "Apply Crop".',
      'Download the cropped PDF.'
    ],
    faqs: [
      {
        question: 'Can I crop all pages equally?',
        answer: 'Yes, the configured margin trim applies uniformly across all pages or your chosen page range.'
      }
    ]
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    path: '/tools/jpg-to-pdf',
    category: 'pdf',
    popular: true,
    badge: 'Popular',
    icon: 'FileImage',
    shortDesc: 'Convert JPG, PNG, and WebP images into a clean PDF document.',
    longDesc: 'Convert single or multiple photos and scans into a standard PDF document. Customize page orientation, margins, and page sizes (A4, Letter, Fit to Image).',
    tags: ['pdf', 'jpg to pdf', 'image to pdf', 'png to pdf', 'photos'],
    features: ['Batch convert multiple images', 'Select orientation: Portrait or Landscape', 'Margin options: No margin, Small, Big', 'A4 & Letter page formats'],
    howTo: [
      'Upload one or more JPG, PNG, or WebP images.',
      'Reorder images or adjust orientation and page size.',
      'Click "Convert to PDF".',
      'Download your generated PDF.'
    ],
    faqs: [
      {
        question: 'Can I upload multiple images into a single PDF?',
        answer: 'Yes! Every uploaded image becomes an individual page in your merged PDF.'
      }
    ]
  },
  {
    id: 'pdf-to-images',
    name: 'PDF to JPG / PNG',
    slug: 'pdf-to-images',
    path: '/tools/pdf-to-images',
    category: 'pdf',
    popular: true,
    icon: 'ImageDown',
    shortDesc: 'Extract or render PDF document pages into high-resolution JPG or PNG images.',
    longDesc: 'Turn PDF document pages into image files. Render pages to crystal-clear JPG or PNG files for sharing on social media, messaging, or web publishing.',
    tags: ['pdf', 'pdf to jpg', 'pdf to png', 'extract images'],
    features: ['Choose JPG or PNG format', 'Quality selection slider', 'Download individual pages or batch', 'Client-side rendering'],
    howTo: [
      'Upload your PDF document.',
      'Choose output format (JPG or PNG) and image quality.',
      'Click "Extract Images".',
      'Download your rendered images.'
    ],
    faqs: [
      {
        question: 'Are high-resolution pages supported?',
        answer: 'Yes, pages are rendered onto high-DPI HTML5 canvases ensuring crisp text and vector reproduction.'
      }
    ]
  },
  {
    id: 'page-numbers',
    name: 'Add PDF Page Numbers',
    slug: 'page-numbers',
    path: '/tools/page-numbers',
    category: 'pdf',
    icon: 'Hash',
    shortDesc: 'Add customizable page numbers (e.g. Page 1 of 10) to your PDF.',
    longDesc: 'Stamp page numbering onto your documents. Choose position (bottom right, bottom center, top right), format (1, Page 1, Page 1 of N), font size, and start number.',
    tags: ['pdf', 'page numbers', 'header', 'footer', 'numbering'],
    features: ['6 position placements', 'Custom numbering formats (1/N, Page 1, etc.)', 'Adjustable font size & margins', 'Start from custom page index'],
    howTo: [
      'Upload your PDF document.',
      'Select position, number format, and start number.',
      'Click "Add Page Numbers".',
      'Download your numbered PDF.'
    ],
    faqs: [
      {
        question: 'Can I omit numbering from the cover page?',
        answer: 'Yes, you can set the start page to page 2 so the first page remains unnumbered.'
      }
    ]
  },
  {
    id: 'watermark-pdf',
    name: 'Add PDF Watermark',
    slug: 'watermark-pdf',
    path: '/tools/watermark-pdf',
    category: 'pdf',
    icon: 'Stamp',
    shortDesc: 'Stamp text or image watermarks onto PDF pages with custom opacity.',
    longDesc: 'Protect your documents with diagonal or centered text watermarks (CONFIDENTIAL, DRAFT, COPY, or custom branding). Adjust angle, font size, opacity, and color.',
    tags: ['pdf', 'watermark', 'stamp', 'confidential', 'branding'],
    features: ['Text & image watermark options', 'Adjust opacity from 5% to 100%', 'Rotate 45° diagonal or horizontal', 'Custom colors and presets'],
    howTo: [
      'Upload your PDF document.',
      'Type watermark text (e.g. "CONFIDENTIAL" or "DRAFT").',
      'Tune font size, color, opacity, and rotation angle.',
      'Click "Apply Watermark" and download.'
    ],
    faqs: [
      {
        question: 'Does the watermark go over or under the text?',
        answer: 'You can choose transparent overlay so your underlying document text remains completely readable.'
      }
    ]
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF with Password',
    slug: 'protect-pdf',
    path: '/tools/protect-pdf',
    category: 'pdf',
    icon: 'Lock',
    shortDesc: 'Encrypt your PDF with standard password protection to restrict viewing.',
    longDesc: 'Add high-security password encryption to any PDF file. Prevents unauthorized opening and keeps confidential contracts, financial statements, and personal records safe.',
    tags: ['pdf', 'password', 'encrypt', 'security', 'protect'],
    features: ['Client-side encryption', 'User password protection', 'Password strength validation', 'Instant lock'],
    howTo: [
      'Upload the PDF you want to protect.',
      'Enter and confirm your chosen password.',
      'Click "Encrypt PDF".',
      'Download your password-protected PDF.'
    ],
    faqs: [
      {
        question: 'Does ToolNest know my password?',
        answer: 'Never! Encryption happens entirely inside your browser sandbox. No password or document is ever transmitted anywhere.'
      }
    ]
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    slug: 'unlock-pdf',
    path: '/tools/unlock-pdf',
    category: 'pdf',
    icon: 'Unlock',
    shortDesc: 'Remove password and restrictions from authorized PDF files.',
    longDesc: 'Unlock password-protected PDFs when you have the authorized password. Produces an unencrypted copy so you never have to re-enter the password again.',
    tags: ['pdf', 'unlock', 'decrypt', 'remove password'],
    features: ['Decrypt authorized PDFs', 'Removes view and printing locks', 'Safe client-side decryption'],
    howTo: [
      'Upload your password-protected PDF file.',
      'Enter the correct current password.',
      'Click "Unlock PDF" to strip encryption.',
      'Download your unlocked PDF.'
    ],
    faqs: [
      {
        question: 'Can I unlock a PDF without knowing the password?',
        answer: 'For security and legal compliance, you must provide the authorized password to remove protection.'
      }
    ]
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    slug: 'repair-pdf',
    path: '/tools/repair-pdf',
    category: 'pdf',
    icon: 'Wrench',
    shortDesc: 'Analyze and reconstruct corrupted or unreadable PDF document trees.',
    longDesc: 'Repair corrupted PDF headers, rebuild damaged cross-reference tables (XREFs), and re-serialize document streams into a standard PDF structure.',
    tags: ['pdf', 'repair', 'fix', 'corrupted', 'recover'],
    features: ['Rebuilds cross-reference tables', 'Recovers salvageable page trees', 'Sanitizes object streams', 'Download recovered file'],
    howTo: [
      'Upload the damaged or unreadable PDF.',
      'Our repair engine parses the object hierarchy and cleans errors.',
      'Review structural diagnostic report.',
      'Download repaired PDF.'
    ],
    faqs: [
      {
        question: 'Can all damaged PDFs be recovered?',
        answer: 'If the data payload is partially present, our client-side parser reconstructs the page streams. Completely zero-byte truncated files cannot be retrieved.'
      }
    ]
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text & Markdown',
    slug: 'pdf-to-text',
    path: '/tools/pdf-to-text',
    category: 'pdf',
    icon: 'FileCode',
    shortDesc: 'Extract readable text, paragraphs, and markdown from PDF documents.',
    longDesc: 'Extract all textual content from PDF pages without tedious manual copy-pasting. Export clean Plain Text (.txt) or Markdown (.md) formatted document.',
    tags: ['pdf', 'text', 'markdown', 'extract text', 'ocr'],
    features: ['Extract text from all pages', 'Export as TXT or Markdown (.md)', 'Word and character counts', 'One-click copy to clipboard'],
    howTo: [
      'Upload your PDF file.',
      'Extract text with one click.',
      'Review text in live editor.',
      'Copy to clipboard or download as TXT / Markdown.'
    ],
    faqs: [
      {
        question: 'Does this work on scanned PDFs?',
        answer: 'For digital PDFs with text layers, extraction is instant and 100% accurate. For pure image scans, text layers must be present or generated.'
      }
    ]
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF Document',
    slug: 'sign-pdf',
    path: '/tools/sign-pdf',
    category: 'pdf',
    popular: true,
    badge: 'Popular',
    icon: 'PenTool',
    shortDesc: 'Draw, type, or upload your signature and stamp it onto PDF pages.',
    longDesc: 'Sign agreements, invoices, and contracts online. Draw your signature on a digital canvas, type with stylish script fonts, or upload a photo of your signature, place it on any page, and download.',
    tags: ['pdf', 'sign', 'signature', 'stamp', 'contract', 'e-sign'],
    features: ['Draw signature with mouse or touch screen', 'Type with cursive handwriting styles', 'Upload PNG signature', 'Drag signature to desired position and scale'],
    howTo: [
      'Upload your PDF document.',
      'Draw your signature or choose typed signature style.',
      'Place signature on target page.',
      'Click "Sign & Download PDF".'
    ],
    faqs: [
      {
        question: 'Can I sign using my phone or tablet screen?',
        answer: 'Yes! The signature pad supports responsive touch input on iOS, Android, and stylus devices.'
      }
    ]
  },
  {
    id: 'compare-pdf',
    name: 'Compare PDF Documents',
    slug: 'compare-pdf',
    path: '/tools/compare-pdf',
    category: 'pdf',
    icon: 'GitCompare',
    shortDesc: 'Compare two PDF files side-by-side to highlight differences.',
    longDesc: 'Audit contracts, revisions, and document updates. Compare file size, page count, metadata differences, and textual content changes side-by-side.',
    tags: ['pdf', 'compare', 'diff', 'audit', 'revisions'],
    features: ['Side-by-side inspection', 'Page count and metadata comparison', 'Text stream diff analyzer', 'Visual difference breakdown'],
    howTo: [
      'Upload Original PDF (File A).',
      'Upload Revised PDF (File B).',
      'Click "Compare Documents".',
      'Inspect detailed comparison metrics and highlighted text differences.'
    ],
    faqs: [
      {
        question: 'Does it highlight deleted and added text?',
        answer: 'Yes, the textual diff algorithm highlights additions in green and deletions in red.'
      }
    ]
  },
  {
    id: 'html-to-pdf',
    name: 'HTML & Text to PDF',
    slug: 'html-to-pdf',
    path: '/tools/html-to-pdf',
    category: 'pdf',
    icon: 'FileSpreadsheet',
    shortDesc: 'Convert HTML code, rich formatted notes, or tables into a clean PDF.',
    longDesc: 'Turn HTML snippets, rich text documents, or formatted articles into printable PDF files with customizable page margins and orientation.',
    tags: ['pdf', 'html to pdf', 'convert', 'markup'],
    features: ['Rich text & HTML editor', 'Live rendering preview', 'Custom page margins and font scaling', 'Instant download'],
    howTo: [
      'Enter or paste HTML code or rich text.',
      'Customize styling and page layout.',
      'Click "Generate PDF".',
      'Download your PDF document.'
    ],
    faqs: [
      {
        question: 'Does it support CSS styling?',
        answer: 'Yes, inline CSS and standard HTML styling tags are supported.'
      }
    ]
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    slug: 'pdf-to-pdfa',
    path: '/tools/pdf-to-pdfa',
    category: 'pdf',
    icon: 'Archive',
    shortDesc: 'Convert PDF to ISO-compliant PDF/A format for long-term document archiving.',
    longDesc: 'Prepare contracts, government submissions, and legal filings for archival. Embeds standard PDF/A-1b identification metadata and ensures color profile compliance.',
    tags: ['pdf', 'pdf/a', 'archive', 'compliance', 'iso'],
    features: ['ISO 19005-1 compliance tagging', 'Embeds device-independent color intent', 'Standard archival metadata dictionary', 'Guaranteed document stability'],
    howTo: [
      'Upload standard PDF file.',
      'Configure PDF/A compliance profile.',
      'Click "Convert to PDF/A".',
      'Download archival-compliant PDF.'
    ],
    faqs: [
      {
        question: 'What is PDF/A?',
        answer: 'PDF/A is an ISO-standardized version of the PDF format specialized for preservation and long-term archiving of electronic documents.'
      }
    ]
  },
  {
    id: 'pdf-ai-assistant',
    name: 'PDF Summarizer & Translator',
    slug: 'pdf-ai-assistant',
    path: '/tools/pdf-ai-assistant',
    category: 'pdf',
    badge: 'AI Smart',
    icon: 'Bot',
    shortDesc: 'Extract key points, bullet summary, and translate PDF documents.',
    longDesc: 'Intelligent document assistant. Extracts core text from your PDF, provides executive summaries, action items, and multi-language translation.',
    tags: ['pdf', 'ai', 'summarize', 'translate', 'study', 'research'],
    features: ['Bullet point executive summary', 'Key takeaways extraction', 'Multi-language translation preview', 'Clear privacy disclosure'],
    howTo: [
      'Upload your PDF document.',
      'Choose action: Summarize, Extract Key Takeaways, or Translate.',
      'Select target translation language if applicable.',
      'View results and copy or download summary.'
    ],
    faqs: [
      {
        question: 'Is my data kept private?',
        answer: 'Yes. Processing uses client-side parsing. Any optional external assistance is clearly marked.'
      }
    ]
  },

  // ===================== IMAGE TOOLS =====================
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    path: '/tools/image-compressor',
    category: 'image',
    popular: true,
    badge: 'Popular',
    icon: 'Minimize2',
    shortDesc: 'Compress JPG, PNG, and WebP images up to 90% without losing visual clarity.',
    longDesc: 'Super-fast client-side image compression. Adjust compression quality slider, view side-by-side before/after preview, and see exact KB savings.',
    tags: ['image', 'compress', 'reduce size', 'optimize', 'jpg', 'png', 'webp'],
    features: ['Interactive quality slider (1-100%)', 'Before vs after file size comparison', 'Side-by-side zoomable visual preview', '100% private in-browser compression'],
    howTo: [
      'Upload your image (JPG, PNG, WebP).',
      'Adjust quality slider to your preferred balance of size and fidelity.',
      'Check size reduction percentage.',
      'Download your compressed image.'
    ],
    faqs: [
      {
        question: 'Does image compression upload my pictures to a server?',
        answer: 'Never! Everything runs inside your browser using HTML5 Canvas and Blob APIs. Your photos remain 100% private.'
      }
    ]
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    path: '/tools/image-resizer',
    category: 'image',
    popular: true,
    icon: 'Scaling',
    shortDesc: 'Resize photos to exact pixel width, height, or percentage while locking aspect ratio.',
    longDesc: 'Resize images for websites, social media banners, Instagram, YouTube thumbnails, and presentations. Set exact width/height or scale by percentage.',
    tags: ['image', 'resize', 'dimensions', 'pixels', 'aspect ratio'],
    features: ['Pixel or percentage scaling', 'Lock aspect ratio option', 'Supports JPG, PNG, and WebP', 'Presets for social media & banners'],
    howTo: [
      'Upload your image.',
      'Enter desired width and height in pixels, or slide percentage.',
      'Choose output format.',
      'Download your resized image.'
    ],
    faqs: [
      {
        question: 'Will my image look stretched?',
        answer: 'Keep "Lock Aspect Ratio" checked to preserve perfect natural proportions without distortion.'
      }
    ]
  },
  {
    id: 'target-kb-resizer',
    name: 'Photo & Signature Resizer (Target KB)',
    slug: 'target-kb-resizer',
    path: '/tools/target-kb-resizer',
    category: 'image',
    popular: true,
    badge: 'Exam Utility',
    icon: 'FileBadge',
    shortDesc: 'Resize photos and signatures to exact KB limits (e.g. 20KB-50KB) for government exam portals.',
    longDesc: 'The essential utility for SSC, UPSC, IBPS, State PSC, NEET, JEE, Visa, and Passport applications. Specify target size (e.g. 20-50 KB, 10-20 KB, max 100 KB) and standard dimensions (3.5x4.5cm, 200x230px).',
    tags: ['exam', 'photo resizer', 'signature resizer', 'target kb', 'ssc', 'upsc', 'visa'],
    features: ['Preset buttons: 20KB, 50KB, 100KB, 200KB', 'Custom target KB input with auto-iteration', 'Passport photo dimension presets (3.5x4.5cm)', 'Signature dimension presets (140x60px)'],
    howTo: [
      'Upload your passport photo or signature.',
      'Select a portal preset (e.g. SSC Photo 20-50KB or Signature 10-20KB) or enter target KB.',
      'Our engine optimizes compression iterations to match the exact KB bracket.',
      'Download verified file ready for portal submission.'
    ],
    faqs: [
      {
        question: 'Why do exam portals reject photos?',
        answer: 'Portals strictly enforce file size bounds (e.g. between 20KB and 50KB) and exact dimensions. Our tool iterates compression until your photo falls precisely within the allowed range.'
      }
    ]
  },
  {
    id: 'image-converter',
    name: 'Image Converter (JPG, PNG, WebP)',
    slug: 'image-converter',
    path: '/tools/image-converter',
    category: 'image',
    icon: 'RefreshCw',
    shortDesc: 'Convert images instantly between JPG, PNG, WebP, and ICO formats.',
    longDesc: 'Fast client-side image format transformation. Convert transparent PNGs to JPG with custom background color, convert JPG to lightweight modern WebP, or generate ICO.',
    tags: ['image', 'convert', 'jpg to png', 'png to jpg', 'webp', 'ico'],
    features: ['Convert to JPG, PNG, WebP, or ICO', 'Background color fill for transparent images', 'High-quality export', 'Batch file support'],
    howTo: [
      'Upload one or more images.',
      'Select target format (JPG, PNG, WebP, ICO).',
      'Click "Convert Images".',
      'Download converted files.'
    ],
    faqs: [
      {
        question: 'Why convert to WebP?',
        answer: 'WebP provides superior compression and quality compared to JPG/PNG, speeding up website loading times significantly.'
      }
    ]
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    slug: 'image-cropper',
    path: '/tools/image-cropper',
    category: 'image',
    icon: 'Crop',
    shortDesc: 'Crop photos with interactive canvas box and standard aspect ratio presets.',
    longDesc: 'Crop photos precisely. Use preset aspect ratios (1:1 Square, 4:3, 16:9, 3:2, Passport 35:45) or freehand crop with drag-handles.',
    tags: ['image', 'crop', 'cut', 'aspect ratio', 'passport'],
    features: ['Interactive drag handles', 'Preset ratios (1:1, 4:3, 16:9, Passport)', 'Zoom and pan controls', 'Instant lossless download'],
    howTo: [
      'Upload image.',
      'Drag and scale the cropping frame over target area.',
      'Click "Crop Image".',
      'Download cropped photo.'
    ],
    faqs: [
      {
        question: 'Can I crop for passport photos?',
        answer: 'Yes! Select the "Passport (35:45)" aspect ratio preset for compliant passport framing.'
      }
    ]
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    slug: 'favicon-generator',
    path: '/tools/favicon-generator',
    category: 'image',
    icon: 'Sparkles',
    shortDesc: 'Generate 16x16, 32x32, 48x48, and 180x180 favicon packages with HTML code.',
    longDesc: 'Turn any logo or picture into web-ready favicons. Generates 16x16, 32x32, 48x48 PNGs, 180x180 Apple Touch Icon, and copy-paste HTML link tags.',
    tags: ['favicon', 'icon', 'apple-touch-icon', 'website icon', 'logo'],
    features: ['Standard sizes: 16x16, 32x32, 48x48, 180x180', 'Instant preview in browser tab mockup', 'Copy-paste HTML snippet included', 'Download all icons'],
    howTo: [
      'Upload your square or landscape logo.',
      'Preview favicon appearance on light and dark browser tabs.',
      'Download generated icon sizes.',
      'Copy provided HTML meta tags into your website header.'
    ],
    faqs: [
      {
        question: 'Which sizes are needed for modern websites?',
        answer: '32x32 for standard browser tabs, 16x16 for address bars, and 180x180 for iOS home screen bookmarks.'
      }
    ]
  },

  // ===================== CALCULATORS =====================
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    path: '/tools/percentage-calculator',
    category: 'calculators',
    popular: true,
    badge: 'Popular',
    icon: 'Percent',
    shortDesc: 'Calculate percentage values, percentage increase/decrease, and ratios instantly.',
    longDesc: 'Versatile 4-in-1 percentage calculator: What is X% of Y? X is what percent of Y? Percentage increase or decrease from X to Y? And Add/Subtract X% to Y.',
    tags: ['calculator', 'percentage', 'discount', 'increase', 'math'],
    features: ['4 instant calculation modes', 'Step-by-step formula explanations', 'Copy answer button', 'Supports decimals and negative values'],
    howTo: [
      'Choose the mode matching your question.',
      'Type numbers in the input boxes.',
      'Get instant calculation with formula breakdown.'
    ],
    faqs: [
      {
        question: 'How do you calculate percentage change?',
        answer: 'Percentage change = ((New Value - Old Value) / |Old Value|) * 100.'
      }
    ]
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    path: '/tools/age-calculator',
    category: 'calculators',
    popular: true,
    badge: 'Popular',
    icon: 'Calendar',
    shortDesc: 'Calculate exact age in years, months, days, total hours, and next birthday countdown.',
    longDesc: 'Find out your exact age down to the day, hour, and minute. View total days lived, day of week you were born on, western and Chinese zodiac signs, and countdown to your next birthday.',
    tags: ['age', 'calculator', 'birthday', 'zodiac', 'countdown'],
    features: ['Years, months, and days breakdown', 'Total days, hours, and minutes lived', 'Next birthday countdown', 'Day of week and Zodiac analysis'],
    howTo: [
      'Select your birth date.',
      'Optionally change the "Age at the date of" if calculating for a specific milestone.',
      'Instantly view your comprehensive age breakdown.'
    ],
    faqs: [
      {
        question: 'Does this account for leap years?',
        answer: 'Yes! The calendar algorithm accurately handles Gregorian leap years and variable month lengths.'
      }
    ]
  },
  {
    id: 'emi-calculator',
    name: 'EMI & Loan Calculator',
    slug: 'emi-calculator',
    path: '/tools/emi-calculator',
    category: 'calculators',
    popular: true,
    badge: 'Finance',
    icon: 'Coins',
    shortDesc: 'Calculate monthly loan EMI, total interest payable, and amortization schedule.',
    longDesc: 'Plan home loans, car loans, and personal loans. Enter loan principal, annual interest rate, and tenure (months or years) to see monthly EMI, visual interest vs principal breakdown, and month-by-month repayment schedule.',
    tags: ['finance', 'loan', 'emi', 'mortgage', 'interest', 'amortization'],
    features: ['Monthly EMI calculation', 'Principal vs Interest pie chart', 'Complete amortization schedule table', 'Interactive tenure sliders'],
    howTo: [
      'Enter loan amount.',
      'Enter annual interest rate (%).',
      'Select tenure in years or months.',
      'View monthly payment, total interest, and repayment table.'
    ],
    faqs: [
      {
        question: 'What is the EMI formula used?',
        answer: 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is number of months.'
      }
    ]
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    slug: 'gst-calculator',
    path: '/tools/gst-calculator',
    category: 'calculators',
    icon: 'Receipt',
    shortDesc: 'Calculate Inclusive and Exclusive GST with standard tax slabs (5%, 12%, 18%, 28%).',
    longDesc: 'Quick goods and services tax calculator. Easily calculate GST to add (Exclusive) or find the original base amount before GST was added (Inclusive). Breaks down CGST and SGST.',
    tags: ['gst', 'tax', 'calculator', 'cgst', 'sgst', 'inclusive', 'exclusive'],
    features: ['GST Exclusive & Inclusive modes', 'Preset slab buttons: 0%, 3%, 5%, 12%, 18%, 28%', 'CGST & SGST 50-50 split', 'Custom tax percentage support'],
    howTo: [
      'Enter the base or total amount.',
      'Choose whether the amount is GST Exclusive (add tax) or Inclusive (remove tax).',
      'Pick a GST slab (e.g. 18%) or enter custom percentage.',
      'View Net Amount, Total GST, CGST, SGST, and Gross Total.'
    ],
    faqs: [
      {
        question: 'How is GST divided between state and central government?',
        answer: 'For intra-state sales, GST is split equally: 50% CGST (Central) and 50% SGST (State).'
      }
    ]
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA & GPA Calculator',
    slug: 'cgpa-calculator',
    path: '/tools/cgpa-calculator',
    category: 'calculators',
    badge: 'Students',
    icon: 'GraduationCap',
    shortDesc: 'Calculate semester GPA, cumulative CGPA, and equivalent percentage.',
    longDesc: 'Essential tool for college and university students. Add courses with credit weights and letter/number grades to calculate your Semester GPA and cumulative CGPA, plus convert CGPA to percentage.',
    tags: ['cgpa', 'gpa', 'grades', 'college', 'university', 'student', 'percentage'],
    features: ['Dynamic course rows (add/remove)', 'Grade point scales (10-point and 4.0 scale)', 'Credit hours weighting', 'Instant CGPA to Percentage conversion formula'],
    howTo: [
      'Select grading scale (10-point or 4.0).',
      'Add your course names, credit units, and grades obtained.',
      'View your calculated SGPA, cumulative CGPA, and percentage.'
    ],
    faqs: [
      {
        question: 'What is the standard formula for CGPA to Percentage?',
        answer: 'For 10-point scales (CBSE/AICTE/UGC), Percentage = CGPA * 9.5.'
      }
    ]
  },
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    slug: 'attendance-calculator',
    path: '/tools/attendance-calculator',
    category: 'calculators',
    badge: 'Students',
    icon: 'CheckSquare',
    shortDesc: 'Calculate present attendance percentage and how many classes you can bunk or must attend.',
    longDesc: 'Stay above the attendance cut-off! Enter classes attended and total classes held, plus target percentage (e.g. 75%). It calculates whether you can bunk upcoming lectures or how many consecutive classes you must attend.',
    tags: ['attendance', 'bunk', 'college', 'student', '75 percent', 'classes'],
    features: ['Calculates exact attendance %', 'Tells you how many classes you can skip without falling below cut-off', 'Tells you how many you must attend to recover', 'Target % slider (60% to 90%)'],
    howTo: [
      'Enter classes attended and total classes conducted.',
      'Set target requirement (e.g. 75%).',
      'Read your customized attendance advice.'
    ],
    faqs: [
      {
        question: 'How does the bunk calculator work?',
        answer: 'It calculates (Attended / (Total + X)) >= Target% to find the maximum classes X you can safely miss while staying compliant.'
      }
    ]
  },
  {
    id: 'average-calculator',
    name: 'Average & Statistics Calculator',
    slug: 'average-calculator',
    path: '/tools/average-calculator',
    category: 'calculators',
    icon: 'BarChart2',
    shortDesc: 'Calculate Mean, Median, Mode, Range, Variance, and Standard Deviation.',
    longDesc: 'Compute comprehensive statistical summaries for any list of numbers. Paste comma, space, or newline-separated numbers to get mean, median, mode, sample & population standard deviation, sum, and count.',
    tags: ['average', 'mean', 'median', 'mode', 'statistics', 'standard deviation'],
    features: ['Mean, Median, Mode, Range', 'Variance & Standard Deviation', 'Sort numbers ascending/descending', 'Copy statistical report'],
    howTo: [
      'Enter or paste numbers separated by commas, spaces, or lines.',
      'Instant statistical metrics calculate in real time.'
    ],
    faqs: [
      {
        question: 'What is the difference between mean and median?',
        answer: 'Mean is the sum divided by the count. Median is the middle value when sorted, which is resistant to extreme outliers.'
      }
    ]
  },
  {
    id: 'date-difference',
    name: 'Date Difference Calculator',
    slug: 'date-difference',
    path: '/tools/date-difference',
    category: 'calculators',
    icon: 'CalendarRange',
    shortDesc: 'Calculate days, weeks, months, and business working days between two dates.',
    longDesc: 'Accurately find the duration between any start and end date. View difference in total days, weeks, months, hours, and business working days (excluding Saturdays and Sundays).',
    tags: ['date', 'time', 'difference', 'days between', 'working days', 'business days'],
    features: ['Total days, weeks, and months', 'Working business days (excl. weekends)', 'Today button shortcut', 'Date addition/subtraction mode'],
    howTo: [
      'Choose Start Date and End Date.',
      'Choose whether to include the end day.',
      'View comprehensive calendar and business day breakdown.'
    ],
    faqs: [
      {
        question: 'Can I calculate business days only?',
        answer: 'Yes! The calculator provides both total calendar days and Monday-Friday business days.'
      }
    ]
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    path: '/tools/unit-converter',
    category: 'calculators',
    icon: 'ArrowLeftRight',
    shortDesc: 'Convert between Length, Weight, Temperature, Area, Volume, Speed, and Digital Storage.',
    longDesc: 'Universal multi-category measurement converter. Convert meters to feet, kilograms to pounds, Celsius to Fahrenheit, megabytes to gigabytes, and more with instant dual-way calculation.',
    tags: ['unit converter', 'length', 'weight', 'temperature', 'digital storage', 'speed'],
    features: ['7 major unit categories', 'Two-way synchronized inputs', 'Common unit quick-swap button', 'High precision decimals'],
    howTo: [
      'Select category (e.g. Length, Weight, Digital Storage).',
      'Select From Unit and To Unit.',
      'Type value to see instantaneous conversion.'
    ],
    faqs: [
      {
        question: 'Are scientific digital units (1024 base) supported?',
        answer: 'Yes, Digital Storage supports bytes, KB, MB, GB, and TB using binary (1024) computing standards.'
      }
    ]
  },

  // ===================== TEXT & DEVELOPER TOOLS =====================
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    slug: 'word-counter',
    path: '/tools/word-counter',
    category: 'text-dev',
    popular: true,
    badge: 'Popular',
    icon: 'Type',
    shortDesc: 'Count words, characters, sentences, paragraphs, reading time, and keyword frequency.',
    longDesc: 'Analyze text in real time. Displays exact words, characters with spaces, characters without spaces, syllables, sentences, paragraphs, estimated reading time, speaking time, and top repeated words.',
    tags: ['text', 'word counter', 'character count', 'reading time', 'content'],
    features: ['Real-time word & char counter', 'Reading & speaking time estimates', 'Paragraph and sentence metrics', 'Top keyword frequency density table'],
    howTo: [
      'Type or paste text into the editor.',
      'Metrics update immediately as you type.',
      'Inspect keyword frequency table below.'
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated based on an average adult reading speed of 225 words per minute.'
      }
    ]
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    path: '/tools/case-converter',
    category: 'text-dev',
    popular: true,
    icon: 'CaseSensitive',
    shortDesc: 'Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case.',
    longDesc: 'Transform text case effortlessly. Supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, CONSTANT_CASE, and Alternating cAsE with one-click copy.',
    tags: ['text', 'case converter', 'uppercase', 'lowercase', 'title case', 'camelcase'],
    features: ['8 case conversion styles', 'One-click copy to clipboard', 'Preserves punctuation and numbers', 'Clear text button'],
    howTo: [
      'Paste text into the input box.',
      'Click the button corresponding to your desired case style.',
      'Copy the converted text.'
    ],
    faqs: [
      {
        question: 'What is Title Case?',
        answer: 'Title Case capitalizes the first letter of every major word while keeping short words lowercase.'
      }
    ]
  },
  {
    id: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    slug: 'duplicate-line-remover',
    path: '/tools/duplicate-line-remover',
    category: 'text-dev',
    icon: 'CopySlash',
    shortDesc: 'Remove duplicate lines from lists, text, or data files while preserving order.',
    longDesc: 'Clean messy lists and email lists. Remove duplicate lines, trim whitespace, eliminate blank lines, and optionally sort alphabetically (A-Z or Z-A).',
    tags: ['text', 'duplicate', 'dedupe', 'lines', 'clean list', 'sort'],
    features: ['Case sensitive / insensitive toggle', 'Trim whitespace toggle', 'Remove blank empty lines', 'Alphabetical sort (A-Z, Z-A)'],
    howTo: [
      'Paste list or text with duplicate lines.',
      'Select cleanup options (Case sensitivity, trim, sort).',
      'Click "Deduplicate" and copy clean results.'
    ],
    faqs: [
      {
        question: 'Does this preserve the original line order?',
        answer: 'Yes! Unless you explicitly toggle alphabetical sorting, the first occurrence order is strictly preserved.'
      }
    ]
  },
  {
    id: 'find-and-replace',
    name: 'Find and Replace',
    slug: 'find-and-replace',
    path: '/tools/find-and-replace',
    category: 'text-dev',
    icon: 'Search',
    shortDesc: 'Find and replace words, text snippets, or regex patterns with live count and match preview.',
    longDesc: 'Powerful text replacement engine. Search with plain text or Regular Expressions (Regex), toggle Match Case and Whole Word, and see live match counts with side-by-side preview.',
    tags: ['text', 'find', 'replace', 'regex', 'search and replace'],
    features: ['Plain text and Regex mode', 'Match Case & Whole Word options', 'Live match count counter', 'Highlighted diff preview'],
    howTo: [
      'Enter or paste text.',
      'Type text to find and replacement text.',
      'Click "Replace All" or inspect highlighted matches.'
    ],
    faqs: [
      {
        question: 'Are Regular Expressions supported in Find and Replace?',
        answer: 'Yes! Check the "Regex" box to use full regular expressions like \\b\\d{4}\\b or (foo|bar).'
      }
    ]
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    path: '/tools/json-formatter',
    category: 'text-dev',
    popular: true,
    badge: 'Developer',
    icon: 'Braces',
    shortDesc: 'Validate, format, prettify, and minify JSON data with clear error syntax pointers.',
    longDesc: 'Essential tool for software engineers and API developers. Prettify unformatted JSON with 2-space or 4-space indentation, compact/minify JSON for payloads, and pinpoint syntax errors with exact line and column numbers.',
    tags: ['developer', 'json', 'formatter', 'validator', 'minify', 'prettify'],
    features: ['2-space & 4-space indent prettifier', 'Minify / Compact JSON', 'Syntax error highlighting with line/col indicator', 'Collapsible tree view & one-click copy'],
    howTo: [
      'Paste raw JSON string.',
      'Click "Prettify" to format or "Minify" to compress.',
      'If there are syntax errors, inspect the exact error line displayed.'
    ],
    faqs: [
      {
        question: 'Does this tool transmit my JSON payload to any server?',
        answer: 'No. JSON validation and formatting run 100% locally in your browser with JSON.parse(). API keys, sensitive tokens, or user data never leave your computer.'
      }
    ]
  },
  {
    id: 'base64-converter',
    name: 'Base64 Encoder & Decoder',
    slug: 'base64-converter',
    path: '/tools/base64-converter',
    category: 'text-dev',
    icon: 'Binary',
    shortDesc: 'Encode and decode text and files to and from Base64 string representations.',
    longDesc: 'Convert plain text or binary files into standard Base64 encoding, or decode Base64 strings back to readable UTF-8 text or downloadable files.',
    tags: ['developer', 'base64', 'encode', 'decode', 'binary', 'data uri'],
    features: ['Text to Base64 & Base64 to Text', 'File to Base64 Data URI', 'Safe UTF-8 handling for emojis & unicode', 'Copy and download buttons'],
    howTo: [
      'Select "Encode" or "Decode" mode.',
      'Type or paste text, or upload a file.',
      'View converted result and copy or download.'
    ],
    faqs: [
      {
        question: 'Does this handle special unicode characters and emojis?',
        answer: 'Yes! Our encoder uses full UTF-8 byte stream encoding to prevent corrupting emojis or international characters.'
      }
    ]
  },
  {
    id: 'url-converter',
    name: 'URL Encoder & Decoder',
    slug: 'url-converter',
    path: '/tools/url-converter',
    category: 'text-dev',
    icon: 'Link',
    shortDesc: 'Encode and decode URLs, URI components, and query parameters.',
    longDesc: 'Convert URLs into safe percent-encoded format or decode encoded URLs. Includes a query parameter parser table to inspect URL query keys and values.',
    tags: ['developer', 'url', 'encode', 'decode', 'uri component', 'percent encoding'],
    features: ['Full URL and component mode', 'Query parameter parser table', 'One-click copy', 'Handles UTF-8 percent characters'],
    howTo: [
      'Paste URL or string.',
      'Click "Encode" or "Decode".',
      'Inspect parsed query parameters if applicable.'
    ],
    faqs: [
      {
        question: 'What is the difference between encodeURI and encodeURIComponent?',
        answer: 'encodeURI preserves URL protocol separators like :// and ?; encodeURIComponent encodes every special character for safe use as a query param value.'
      }
    ]
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    slug: 'sql-formatter',
    path: '/tools/sql-formatter',
    category: 'text-dev',
    icon: 'Database',
    shortDesc: 'Beautify and format messy SQL queries with clean indentation and uppercase keywords.',
    longDesc: 'Turn single-line, unformatted SQL queries into clean, beautifully indented, readable SQL. Automatically capitalizes reserved keywords (SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY, etc.).',
    tags: ['developer', 'sql', 'formatter', 'beautifier', 'database', 'queries'],
    features: ['Keyword capitalization (SELECT, INSERT, UPDATE, DELETE, etc.)', 'Clause line breaking and indentation', 'Supports subqueries and commas', 'One-click copy'],
    howTo: [
      'Paste raw SQL query.',
      'Click "Format SQL".',
      'Copy the clean, beautified SQL code.'
    ],
    faqs: [
      {
        question: 'Which SQL dialects are supported?',
        answer: 'It supports standard ANSI SQL syntax common to PostgreSQL, MySQL, SQLite, Oracle, and MS SQL.'
      }
    ]
  },
  {
    id: 'code-playground',
    name: 'HTML/CSS/JS Live Playground',
    slug: 'code-playground',
    path: '/tools/code-playground',
    category: 'text-dev',
    badge: 'Interactive',
    icon: 'Laptop',
    shortDesc: 'Live sandbox editor to write HTML, CSS, and JavaScript with instant live preview.',
    longDesc: 'Rapidly test and prototype front-end web components. Separate tabs for HTML, CSS, and JavaScript with a real-time sandboxed preview iframe, console logs, and starter templates.',
    tags: ['developer', 'playground', 'html', 'css', 'javascript', 'live preview', 'codepen'],
    features: ['Separate HTML, CSS, and JS tabs', 'Sandboxed secure iframe execution', 'Built-in starter templates (Card, Button, Animation)', 'Real-time live updating preview'],
    howTo: [
      'Write or paste code in the HTML, CSS, or JS tabs.',
      'Preview renders in real-time in the output pane.',
      'Try starter templates to jumpstart your prototyping.'
    ],
    faqs: [
      {
        question: 'Is the playground code executed securely?',
        answer: 'Yes! The preview uses an isolated sandboxed iframe to prevent script leaking.'
      }
    ]
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester & Cheatsheet',
    slug: 'regex-tester',
    path: '/tools/regex-tester',
    category: 'text-dev',
    badge: 'Developer',
    icon: 'Terminal',
    shortDesc: 'Test Regular Expressions in real-time with flags, match highlights, and regex cheatsheet.',
    longDesc: 'Interactive regex debugger. Test regex patterns against sample text with flags (g, i, m, s). Highlights matching text, shows captured groups, and includes one-click presets for common patterns (Email, Phone, URL, IPv4, Hex Color, Date).',
    tags: ['developer', 'regex', 'tester', 'regular expressions', 'patterns', 'cheatsheet'],
    features: ['Real-time regex matching and highlight', 'Flags selector: Global, Case Insensitive, Multiline', 'Capture groups inspector', 'Preset regex library for Emails, URLs, Phones, IPs'],
    howTo: [
      'Enter your regex pattern and select flags.',
      'Enter or paste test string in the text area.',
      'View highlighted matches and captured group tokens.'
    ],
    faqs: [
      {
        question: 'Can I test capture groups?',
        answer: 'Yes! All capture groups ($1, $2, etc.) are separated and displayed with match indices.'
      }
    ]
  },

  // ===================== GENERATORS & PRODUCTIVITY =====================
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    path: '/tools/qr-code-generator',
    category: 'generators',
    popular: true,
    badge: 'Popular',
    icon: 'QrCode',
    shortDesc: 'Create high-resolution custom QR codes for URLs, WiFi, Plain Text, Email, and Phone.',
    longDesc: 'Generate vector-sharp QR codes with custom foreground & background colors, adjustable error correction levels (L, M, Q, H), and preset templates for Web URLs, WiFi network auto-join, Email, and Phone calls. Download as PNG or SVG.',
    tags: ['generator', 'qr code', 'barcode', 'wifi qr', 'url qr', 'download png'],
    features: ['Modes: URL, WiFi, Plain Text, Email, Phone, vCard', 'Custom color pickers (foreground & background)', 'Error correction levels (7% to 30% recovery)', 'Download as PNG or SVG'],
    howTo: [
      'Select QR code type (URL, WiFi, Text, etc.).',
      'Enter your content.',
      'Customize colors and resolution.',
      'Download your QR code image in high resolution.'
    ],
    faqs: [
      {
        question: 'Do these QR codes ever expire?',
        answer: 'Never! These are direct static QR codes. Because no redirect URL or middleman server is used, they will work forever.'
      }
    ]
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    slug: 'barcode-generator',
    path: '/tools/barcode-generator',
    category: 'generators',
    icon: 'Barcode',
    shortDesc: 'Generate standard barcodes (Code 128, EAN-13, UPC-A, Code 39) with SVG/PNG download.',
    longDesc: 'Create commercial and inventory barcodes. Supports popular standards including Code 128 (alphanumeric), EAN-13 (retail), UPC-A (US products), and Code 39. Customize bar width, height, and display text.',
    tags: ['generator', 'barcode', 'code 128', 'ean 13', 'upc', 'inventory', 'retail'],
    features: ['Supports Code 128, EAN-13, UPC, Code 39, ITF-14', 'Custom bar width and height', 'Toggle human-readable text display', 'Download as SVG or PNG'],
    howTo: [
      'Choose barcode symbology (e.g. Code 128 or EAN-13).',
      'Enter digits or alphanumeric string.',
      'Adjust height and styling.',
      'Download barcode for printing or product packaging.'
    ],
    faqs: [
      {
        question: 'Which barcode format is best for general inventory?',
        answer: 'Code 128 is the industry standard for general alphanumeric inventory and logistics.'
      }
    ]
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    slug: 'password-generator',
    path: '/tools/password-generator',
    category: 'generators',
    popular: true,
    badge: 'Security',
    icon: 'ShieldCheck',
    shortDesc: 'Generate strong, unhackable passwords with length slider and entropy meter.',
    longDesc: 'Generate cryptographically secure random passwords using browser Web Crypto APIs. Customize character sets (Uppercase, Lowercase, Numbers, Symbols), avoid ambiguous characters (l, 1, I, O, 0), and check real-time entropy strength.',
    tags: ['generator', 'password', 'security', 'random', 'crypto'],
    features: ['Cryptographically secure (window.crypto)', 'Length slider (6 to 64 characters)', 'Avoid ambiguous characters toggle', 'Live password entropy & crack-time estimator'],
    howTo: [
      'Choose desired password length (e.g. 16 chars).',
      'Toggle uppercase, lowercase, numbers, and symbols.',
      'Click "Generate New Password".',
      'Copy to clipboard with one click.'
    ],
    faqs: [
      {
        question: 'Is it safe to generate passwords in this browser?',
        answer: 'Yes! It uses window.crypto.getRandomValues(), the gold standard for cryptographic entropy. Generated passwords are never saved or sent over any network.'
      }
    ]
  },
  {
    id: 'random-picker',
    name: 'Random Number & List Picker',
    slug: 'random-picker',
    path: '/tools/random-picker',
    category: 'generators',
    icon: 'Dices',
    shortDesc: 'Pick random winners from a list, roll dice, or generate random numbers.',
    longDesc: 'Fair, transparent random selection. Pick random names or items from any list with exciting visual pick animation, or generate random numbers within any minimum and maximum range with unique items toggle.',
    tags: ['generator', 'random', 'picker', 'giveaway', 'dice', 'lottery', 'winner'],
    features: ['Random Name & Winner Picker with animation', 'Random Number Generator (Min, Max, Quantity)', 'Unique numbers toggle (no duplicates)', 'One-click copy and history log'],
    howTo: [
      'Switch between "List Picker" or "Number Generator".',
      'Paste your list of names or configure number bounds.',
      'Click "Pick Random" to draw fair selections.'
    ],
    faqs: [
      {
        question: 'Are selections truly random?',
        answer: 'Yes, random generation is powered by high-entropy pseudo-random algorithmic distributions.'
      }
    ]
  },
  {
    id: 'invoice-generator',
    name: 'Invoice Generator with PDF Export',
    slug: 'invoice-generator',
    path: '/tools/invoice-generator',
    category: 'generators',
    popular: true,
    badge: 'Business',
    icon: 'FileSpreadsheet',
    shortDesc: 'Create professional business invoices with line items, tax, and instant PDF download.',
    longDesc: 'Create clean, modern invoices for clients and freelancing. Customize company logo, invoice number, due date, itemized table, tax rates, discounts, payment terms, and export to a crisp PDF document with one click.',
    tags: ['generator', 'invoice', 'billing', 'pdf invoice', 'freelancer', 'business'],
    features: ['Itemized products and services table', 'Automatic subtotal, tax %, and discount calculations', 'Custom currency symbol ($, €, £, ₹, etc.)', 'Instant client-side PDF export'],
    howTo: [
      'Fill in your business details and client information.',
      'Add items, quantities, and rates.',
      'Specify tax or discount percentage.',
      'Click "Download Invoice PDF".'
    ],
    faqs: [
      {
        question: 'Can I add multiple line items?',
        answer: 'Yes! Click "Add Item" to add as many services or products as needed.'
      }
    ]
  },
  {
    id: 'color-palette',
    name: 'Color Palette Generator',
    slug: 'color-palette',
    path: '/tools/color-palette',
    category: 'generators',
    icon: 'Palette',
    shortDesc: 'Generate harmonious color palettes with HEX, RGB, HSL, and export to CSS.',
    longDesc: 'Design inspiration for web designers and developers. Generate color harmonies (Complementary, Analogous, Triadic, Monochromatic), lock favorite colors, test contrast accessibility, and export palette as CSS variables or JSON.',
    tags: ['generator', 'colors', 'palette', 'css', 'design', 'hex', 'rgb'],
    features: ['Harmony modes: Complementary, Analogous, Triadic, Monochromatic', 'Lock individual colors while regenerating others', 'HEX, RGB, and HSL copy formats', 'Export palette as CSS code'],
    howTo: [
      'Press Spacebar or click "Generate New Palette".',
      'Lock colors you love with the padlock icon.',
      'Copy color values in HEX, RGB, or HSL format.',
      'Export ready-to-use CSS root variables.'
    ],
    faqs: [
      {
        question: 'How do I use this palette in CSS?',
        answer: 'Click "Export CSS" to get pre-formatted :root CSS variables ready to paste into your stylesheet.'
      }
    ]
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Productivity Timer',
    slug: 'pomodoro-timer',
    path: '/tools/pomodoro-timer',
    category: 'generators',
    icon: 'Clock',
    shortDesc: 'Stay focused with customizable Pomodoro intervals, breaks, and audio chimes.',
    longDesc: 'Boost productivity with the proven Pomodoro Technique. 25-minute focus intervals followed by 5-minute short breaks and 15-minute long breaks, accompanied by pleasant Web Audio notifications and session counters.',
    tags: ['productivity', 'pomodoro', 'timer', 'focus', 'study', 'work'],
    features: ['Focus (25m), Short Break (5m), Long Break (15m)', 'Web Audio API chime notifications (no external sound file needed)', 'Completed cycle counter', 'Custom interval durations'],
    howTo: [
      'Click "Start" to begin your 25-minute focus session.',
      'Work with zero distractions until the chime rings.',
      'Take your short break and repeat!'
    ],
    faqs: [
      {
        question: 'Will the timer play a sound when finished?',
        answer: 'Yes! A gentle pleasant audio chime is synthesized in real time via the browser Web Audio API.'
      }
    ]
  },
  {
    id: 'typing-test',
    name: 'Typing Speed Test',
    slug: 'typing-test',
    path: '/tools/typing-test',
    category: 'generators',
    badge: 'Productivity',
    icon: 'Keyboard',
    shortDesc: 'Test your typing speed (WPM) and accuracy with real-time error detection.',
    longDesc: 'Measure and improve your words-per-minute (WPM) typing speed. Features 1-minute and 3-minute timed tests, real-time error tracking, accuracy percentage, and detailed performance breakdown.',
    tags: ['productivity', 'typing test', 'wpm', 'speed test', 'keyboard', 'accuracy'],
    features: ['Calculates WPM (Words Per Minute) & Accuracy %', 'Live real-time character error highlighting', '1-minute and 3-minute test options', 'Detailed summary report'],
    howTo: [
      'Select test duration (1 min or 3 min).',
      'Start typing the displayed text prompt.',
      'Watch your real-time WPM score update as you type.',
      'Review your final score and accuracy percentage.'
    ],
    faqs: [
      {
        question: 'How is WPM calculated?',
        answer: 'Standard WPM = (Total Characters Typed / 5) / Time in Minutes.'
      }
    ]
  },
  {
    id: 'resume-builder',
    name: 'ATS-Friendly Resume Builder',
    slug: 'resume-builder',
    path: '/tools/resume-builder',
    category: 'generators',
    popular: true,
    badge: 'Popular',
    icon: 'UserCheck',
    shortDesc: 'Create a clean, ATS-compliant professional resume and download as PDF.',
    longDesc: 'Build a job-winning resume in minutes. Add contact info, professional summary, work experience, education, skills, and projects with real-time preview and instant PDF export.',
    tags: ['productivity', 'resume builder', 'cv', 'job', 'ats compliant', 'pdf export'],
    features: ['ATS-optimized layout structure', 'Real-time side-by-side resume preview', 'Dynamic experience and education entries', 'Instant one-click PDF download via jsPDF'],
    howTo: [
      'Fill in your Contact Details, Experience, and Education.',
      'Preview your formatted resume in real time.',
      'Click "Download Resume PDF".'
    ],
    faqs: [
      {
        question: 'What makes a resume ATS-friendly?',
        answer: 'ATS (Applicant Tracking Systems) require clean hierarchical typography, standard headings, no obscure graphics, and pure selectable text. Our builder adheres strictly to ATS standards.'
      }
    ]
  }
];

export const getToolByPath = (path: string): ToolDefinition | undefined => {
  return TOOLS.find(t => t.path === path || t.path === path.replace(/\/$/, ''));
};

export const getToolById = (id: string): ToolDefinition | undefined => {
  return TOOLS.find(t => t.id === id);
};

export const getToolsByCategory = (category: string): ToolDefinition[] => {
  if (category === 'all') return TOOLS;
  return TOOLS.filter(t => t.category === category);
};

export const getPopularTools = (): ToolDefinition[] => {
  return TOOLS.filter(t => t.popular);
};

export const searchTools = (query: string): ToolDefinition[] => {
  const clean = query.toLowerCase().trim();
  if (!clean) return TOOLS;
  return TOOLS.filter(t => 
    t.name.toLowerCase().includes(clean) ||
    t.shortDesc.toLowerCase().includes(clean) ||
    t.tags.some(tag => tag.toLowerCase().includes(clean))
  );
};
