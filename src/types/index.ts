export type ToolCategory = 'pdf' | 'image' | 'calculators' | 'text-dev' | 'generators';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  path: string;
  category: ToolCategory;
  shortDesc: string;
  longDesc: string;
  icon: string;
  popular?: boolean;
  badge?: string;
  tags: string[];
  features: string[];
  howTo: string[];
  faqs: ToolFAQ[];
}

export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  icon: string;
  description: string;
  badgeCount?: number;
}
