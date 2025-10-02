import axios from 'axios';
import { ContentItem, CreateContentRequest, UpdateContentRequest } from '../models/Content';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export class ContentService {
  static async getAllContents(): Promise<ContentItem[]> {
    try {
      const response = await axios.get<ContentItem[]>(`${API_BASE_URL}/contents`);
      return response.data;
    } catch (error) {
      console.error('获取内容列表失败:', error);
      throw error;
    }
  }

  static async getContentById(id: string): Promise<ContentItem> {
    try {
      const response = await axios.get<ContentItem>(`${API_BASE_URL}/contents/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取内容详情失败:', error);
      throw error;
    }
  }

  static async createContent(data: CreateContentRequest): Promise<ContentItem> {
    try {
      const response = await axios.post<ContentItem>(`${API_BASE_URL}/contents`, data);
      return response.data;
    } catch (error) {
      console.error('创建内容失败:', error);
      throw error;
    }
  }

  static async updateContent(id: string, data: UpdateContentRequest): Promise<ContentItem> {
    try {
      const response = await axios.put<ContentItem>(`${API_BASE_URL}/contents/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('更新内容失败:', error);
      throw error;
    }
  }

  static async deleteContent(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/contents/${id}`);
    } catch (error) {
      console.error('删除内容失败:', error);
      throw error;
    }
  }
}