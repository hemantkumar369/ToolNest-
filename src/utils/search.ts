import { ToolDefinition, ToolCategory } from '../types';
import { CATEGORIES, TOOLS } from '../data/tools';

export const RECENT_SEARCHES_STORAGE_KEY = 'toolnest_recent_searches';

export const CATEGORY_KEYWORDS: Record<ToolCategory, string[]> = {
  pdf: [
    'pdf', 'acrobat', 'adobe', 'document', 'documents', 'doc', 'docs',
    'merge', 'split', 'compress', 'sign', 'watermark', 'unlock', 'protect',
    'rotate', 'ocr', 'scanner', 'pages', 'paper', 'reader', 'pdf tools'
  ],
  image: [
    'image', 'images', 'photo', 'photos', 'picture', 'pictures', 'pic', 'pics',
    'graphic', 'graphics', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'favicon',
    'compress', 'resizer', 'resize', 'crop', 'converter', 'convert', 'kb', 'mb', 'target kb',
    'photography', 'camera', 'visual', 'image tools'
  ],
  calculators: [
    'calculator', 'calculators', 'calc', 'calcs', 'calculate', 'calculation', 'calculations',
    'math', 'maths', 'finance', 'financial', 'money', 'loan', 'emi', 'percentage', 'percent',
    'age', 'birthday', 'gst', 'tax', 'cgpa', 'gpa', 'grade', 'attendance', 'interest',
    'academic', 'numbers', 'rates'
  ],
  'text-dev': [
    'dev', 'developer', 'developers', 'code', 'coding', 'programming', 'programmer',
    'text', 'string', 'words', 'script', 'web', 'json', 'base64', 'sql', 'regex',
    'regexp', 'regular expression', 'markdown', 'md', 'diff', 'compare', 'slug',
    'lorem', 'ipsum', 'hash', 'sha256', 'md5', 'jwt', 'format', 'formatter', 'beautify',
    'text & dev tools'
  ],
  generators: [
    'generator', 'generators', 'generate', 'maker', 'creator', 'build', 'builder',
    'productivity', 'utility', 'utilities', 'tool', 'tools', 'qr', 'qrcode', 'barcode',
    'upc', 'password', 'passwords', 'invoice', 'billing', 'bill', 'receipt',
    'pomodoro', 'timer', 'clock', 'focus', 'resume', 'cv', 'uuid', 'guid', 'counter',
    'generators & productivity'
  ],
};

/**
 * Checks if a tool matches a search query by:
 * 1. Tool name
 * 2. Tool short description
 * 3. Tool tags
 * 4. Tool category ID/slug
 * 5. Category display name & description
 * 6. Category-specific keywords
 */
export function matchToolWithCategoryKeywords(tool: ToolDefinition, rawQuery: string): { matches: boolean; score: number } {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return { matches: true, score: 0 };

  let score = 0;
  const toolName = tool.name.toLowerCase();
  const toolDesc = tool.shortDesc.toLowerCase();
  const catSlug = tool.category.toLowerCase();
  const tags = tool.tags.map(t => t.toLowerCase());

  // 1. Tool Name matches
  if (toolName === q) {
    score += 100;
  } else if (toolName.startsWith(q)) {
    score += 60;
  } else if (toolName.includes(q)) {
    score += 40;
  }

  // 2. Tag matches
  for (const tag of tags) {
    if (tag === q) {
      score += 35;
    } else if (tag.includes(q)) {
      score += 20;
    }
  }

  // 3. Category Slug and Display Name
  const catDef = CATEGORIES.find(c => c.id === tool.category);
  const catName = catDef?.name.toLowerCase() || '';
  const catDesc = catDef?.description.toLowerCase() || '';

  if (catSlug === q || catName === q) {
    score += 30;
  } else if (catSlug.includes(q) || catName.includes(q)) {
    score += 25;
  } else if (catDesc.includes(q)) {
    score += 15;
  }

  // 4. Category Keywords
  const catKeywords = CATEGORY_KEYWORDS[tool.category] || [];
  const keywordMatch = catKeywords.some(kw => kw === q || kw.includes(q) || q.includes(kw));
  if (keywordMatch) {
    score += 20;
  }

  // 5. Short Description matches
  if (toolDesc.includes(q)) {
    score += 10;
  }

  // 6. Popular tool bonus
  if (tool.popular) {
    score += 2;
  }

  return {
    matches: score > 0,
    score,
  };
}

/**
 * Searches and ranks tools based on tool name, tags, description, and category keywords.
 */
export function searchTools(rawQuery: string, sourceTools: ToolDefinition[] = TOOLS): ToolDefinition[] {
  const q = rawQuery.trim();
  if (!q) {
    return sourceTools.slice(0, 10);
  }

  const results: { tool: ToolDefinition; score: number }[] = [];

  for (const tool of sourceTools) {
    const { matches, score } = matchToolWithCategoryKeywords(tool, q);
    if (matches) {
      results.push({ tool, score });
    }
  }

  // Sort highest score first
  results.sort((a, b) => b.score - a.score);

  return results.map(r => r.tool);
}

/**
 * Filters tools for HomePage with both category filter and keyword search.
 */
export function filterTools(
  sourceTools: ToolDefinition[],
  query: string,
  selectedCategory: string = 'all'
): ToolDefinition[] {
  const cleanQ = query.trim().toLowerCase();

  return sourceTools.filter(tool => {
    // 1. Category selector matching
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    if (!matchesCategory) return false;

    // 2. Query matching (name, tags, description, category keywords)
    if (!cleanQ) return true;
    const { matches } = matchToolWithCategoryKeywords(tool, cleanQ);
    return matches;
  });
}

/**
 * Recent searches localStorage persistence helpers.
 */
export function getRecentSearches(): string[] {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY) || localStorage.getItem('toolsnest_recent_searches');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => typeof item === 'string' && item.trim().length > 0).slice(0, 8);
      }
    }
  } catch (e) {
    console.error('Failed to load recent searches from localStorage', e);
  }
  return [];
}

export function saveRecentSearch(rawQuery: string): string[] {
  const term = rawQuery.trim();
  if (!term || term.length < 2) return getRecentSearches();

  try {
    const existing = getRecentSearches();
    // Remove if already exists (case-insensitive deduplication)
    const filtered = existing.filter(item => item.toLowerCase() !== term.toLowerCase());
    // Prepend to front, keep max 8
    const updated = [term, ...filtered].slice(0, 8);
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save recent search to localStorage', e);
    return [];
  }
}

export function removeRecentSearch(termToRemove: string): string[] {
  try {
    const existing = getRecentSearches();
    const updated = existing.filter(item => item.toLowerCase() !== termToRemove.toLowerCase());
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove recent search', e);
    return [];
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear recent searches', e);
  }
}
