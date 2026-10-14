import React, { useState } from 'react';
import { Database, Copy, Check, Sparkles } from 'lucide-react';

export const SqlFormatterTool: React.FC = () => {
  const [sql, setSql] = useState(
    'select u.id, u.name, u.email, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.active = 1 and u.created_at >= "2026-01-01" group by u.id, u.name order by total_orders desc limit 50;'
  );
  const [formattedSql, setFormattedSql] = useState('');
  const [copied, setCopied] = useState(false);

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'INSERT INTO', 'VALUES',
    'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'AND', 'OR', 'NOT',
    'IN', 'AS', 'ON', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'BETWEEN', 'LIKE', 'IS NULL',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ];

  const formatSql = () => {
    let clean = sql.trim();

    // Capitalize keywords
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(regex, kw);
    });

    // Line break on major clauses
    const majorClauses = ['FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'VALUES', 'SET'];
    majorClauses.forEach(clause => {
      const regex = new RegExp(`\\s+(${clause})\\s+`, 'g');
      clean = clean.replace(regex, `\n$1 `);
    });

    // Indent sub-clauses and commas
    const lines = clean.split('\n').map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('FROM') || trimmed.startsWith('WHERE') || trimmed.startsWith('ORDER') || trimmed.startsWith('GROUP') || trimmed.startsWith('LIMIT') || trimmed.startsWith('UPDATE') || trimmed.startsWith('INSERT')) {
        return trimmed;
      }
      return `  ${trimmed}`;
    });

    setFormattedSql(lines.join('\n'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedSql || sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          onClick={formatSql}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Format & Capitalize SQL</span>
        </button>

        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy SQL'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Raw SQL Query
          </label>
          <textarea
            value={sql}
            onChange={e => setSql(e.target.value)}
            rows={12}
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Beautified SQL
          </label>
          <textarea
            readOnly
            value={formattedSql || sql}
            rows={12}
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 focus:outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
