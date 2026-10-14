import React, { useState } from 'react';
import { Laptop, Play, RotateCcw, Eye } from 'lucide-react';

export const CodePlaygroundTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [html, setHtml] = useState(`<div class="card">
  <h2>Welcome to ToolNest Sandbox</h2>
  <p>Test HTML, CSS, and JS components with real-time browser preview.</p>
  <button id="action-btn">Click Me!</button>
</div>`);

  const [css, setCss] = useState(`body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background: #f8fafc;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 360px;
}

h2 {
  color: #0f172a;
  margin-top: 0;
}

p {
  color: #64748b;
  font-size: 14px;
}

button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
}

button:active {
  transform: scale(0.95);
}`);

  const [js, setJs] = useState(`document.getElementById('action-btn').addEventListener('click', () => {
  alert('Hello from ToolNest Interactive Playground!');
});`);

  const combinedSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
      {/* Tab bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'html' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'css' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'js' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            JavaScript
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>Real-time Live Sandbox</span>
        </span>
      </div>

      {/* Editor & Preview Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="relative">
          {activeTab === 'html' && (
            <textarea
              value={html}
              onChange={e => setHtml(e.target.value)}
              rows={16}
              className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 bg-slate-900 text-slate-100 focus:outline-none leading-relaxed"
            />
          )}
          {activeTab === 'css' && (
            <textarea
              value={css}
              onChange={e => setCss(e.target.value)}
              rows={16}
              className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 bg-slate-900 text-blue-300 focus:outline-none leading-relaxed"
            />
          )}
          {activeTab === 'js' && (
            <textarea
              value={js}
              onChange={e => setJs(e.target.value)}
              rows={16}
              className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 bg-slate-900 text-amber-300 focus:outline-none leading-relaxed"
            />
          )}
        </div>

        {/* Live Preview Iframe */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <iframe
            srcDoc={combinedSrcDoc}
            title="Preview"
            sandbox="allow-scripts allow-modals"
            className="w-full h-full min-h-[380px] border-none"
          />
        </div>
      </div>
    </div>
  );
};
