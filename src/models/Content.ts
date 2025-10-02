export interface ContentItem {
  _id: string;
  title: string;
  content: string;
  category: 'news' | 'guide' | 'other';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentRequest {
  title: string;
  content: string;
  category: 'news' | 'guide' | 'other';
  status: 'draft' | 'published' | 'archived';
}

export interface UpdateContentRequest {
  title?: string;
  content?: string;
  category?: 'news' | 'guide' | 'other';
  status?: 'draft' | 'published' | 'archived';
}