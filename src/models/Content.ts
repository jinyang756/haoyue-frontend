export interface ContentItem {
  _id: string;
  title: string;
  content: string;
  category: 'news' | 'guide' | 'analysis' | 'tutorial' | 'other';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  author?: string;
  featuredImage?: string;
  viewCount?: number;
  likeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentRequest {
  title: string;
  content: string;
  category: 'news' | 'guide' | 'analysis' | 'tutorial' | 'other';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  author?: string;
  featuredImage?: string;
}

export interface UpdateContentRequest {
  title?: string;
  content?: string;
  category?: 'news' | 'guide' | 'analysis' | 'tutorial' | 'other';
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  author?: string;
  featuredImage?: string;
}