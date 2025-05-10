import { Timestamp } from 'firebase/firestore';

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  relatedSections?: string[];
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  imageUrl?: string;
  videoUrl?: string;
  authorId?: string;
  authorName?: string;
  requiredPlan?: 'basic' | 'pro' | 'enterprise';
}

export interface HelpRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  screenshotUrl?: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  agentId?: string;
  agentName?: string;
  solution?: string;
}

export interface HelpFeedback {
  userId: string;
  articleId: string;
  liked: boolean;
  timestamp: Timestamp;
  comment?: string;
}

export interface UserHelpStats {
  articlesRead: number;
  problemsSolved: number;
  searchCount: number;
  lastActivity: Timestamp;
  satisfaction: number; // 0-100
  recentSearches?: string[];
  recentArticles?: string[];
  badges?: string[];
  points?: number;
}

export interface SystemStatusItem {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  message?: string;
  updatedAt: Timestamp;
}

export interface SearchResult {
  articles: HelpArticle[];
  loading: boolean;
  query: string;
}

export interface HelpContextData {
  currentSection?: string;
  recentActions?: string[];
  searchHistory?: string[];
  viewedArticles?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  likes: number;
  dislikes: number;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // en segundos
  tags: string[];
  requiredPlan: 'basic' | 'pro' | 'enterprise';
}

export interface QuickNote {
  id: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  color: string;
}