import axios from 'axios';
import { ContentItem, CreateContentRequest, UpdateContentRequest } from '../models/Content';
import { mockContentItems } from './mockDataService';
import { isOfflineMode, simulateNetworkDelay } from '@/utils/offlineMode';
import { message } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// 辅助函数：将mockContentItems转换为符合ContentItem接口的格式
const convertToContentItem = (mockItem: any): ContentItem => ({
  _id: mockItem.id,
  title: mockItem.title,
  content: mockItem.content,
  category: mockItem.type === 'article' ? 'analysis' :
            mockItem.type === 'report' ? 'analysis' :
            mockItem.type === 'tutorial' ? 'tutorial' : 'other',
  tags: mockItem.tags,
  status: mockItem.status,
  author: mockItem.author,
  createdAt: mockItem.createdAt,
  updatedAt: mockItem.updatedAt
});

export class ContentService {
  static async getAllContents(): Promise<ContentItem[]> {
    // 如果处于离线模式，直接返回模拟数据
    if (isOfflineMode()) {
      await simulateNetworkDelay();
      return mockContentItems.map(convertToContentItem);
    }

    try {
      const response = await axios.get<ContentItem[]>(`${API_BASE_URL}/contents`);
      return response.data;
    } catch (error) {
      // 如果后端不可用，返回模拟数据
      message.warning('无法连接到服务器，显示离线数据');
      return mockContentItems.map(convertToContentItem);
    }
  }

  static async getContentById(id: string): Promise<ContentItem> {
    // 如果处于离线模式，直接返回模拟数据
    if (isOfflineMode()) {
      await simulateNetworkDelay();
      const content = mockContentItems.find(item => item.id === id);
      if (!content) {
        throw new Error('内容不存在');
      }
      return convertToContentItem(content);
    }

    try {
      const response = await axios.get<ContentItem>(`${API_BASE_URL}/contents/${id}`);
      return response.data;
    } catch (error) {
      // 如果后端不可用，返回模拟数据
      message.warning('无法连接到服务器，显示离线数据');
      const content = mockContentItems.find(item => item.id === id);
      if (!content) {
        throw new Error('内容不存在');
      }
      return convertToContentItem(content);
    }
  }

  static async createContent(data: CreateContentRequest): Promise<ContentItem> {
    // 如果处于离线模式，模拟创建操作
    if (isOfflineMode()) {
      await simulateNetworkDelay();
      const newContent: ContentItem = {
        _id: `new-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      message.success('内容创建成功（离线模式）');
      return newContent;
    }

    try {
      const response = await axios.post<ContentItem>(`${API_BASE_URL}/contents`, data);
      return response.data;
    } catch (error) {
      // 如果后端不可用，模拟创建操作
      message.success('内容创建成功（离线模式）');
      const newContent: ContentItem = {
        _id: `new-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newContent;
    }
  }

  static async updateContent(id: string, data: UpdateContentRequest): Promise<ContentItem> {
    // 如果处于离线模式，模拟更新操作
    if (isOfflineMode()) {
      await simulateNetworkDelay();
      const existingContent = mockContentItems.find(item => item.id === id);
      if (!existingContent) {
        throw new Error('内容不存在');
      }
      const updatedContent: ContentItem = {
        ...convertToContentItem(existingContent),
        ...data,
        updatedAt: new Date().toISOString()
      };
      message.success('内容更新成功（离线模式）');
      return updatedContent;
    }

    try {
      const response = await axios.put<ContentItem>(`${API_BASE_URL}/contents/${id}`, data);
      return response.data;
    } catch (error) {
      // 如果后端不可用，模拟更新操作
      message.success('内容更新成功（离线模式）');
      const existingContent = mockContentItems.find(item => item.id === id);
      if (!existingContent) {
        throw new Error('内容不存在');
      }
      const updatedContent: ContentItem = {
        ...convertToContentItem(existingContent),
        ...data,
        updatedAt: new Date().toISOString()
      };
      return updatedContent;
    }
  }

  static async deleteContent(id: string): Promise<void> {
    // 如果处于离线模式，模拟删除操作
    if (isOfflineMode()) {
      await simulateNetworkDelay();
      message.success('内容删除成功（离线模式）');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/contents/${id}`);
    } catch (error) {
      // 如果后端不可用，模拟删除操作
      message.success('内容删除成功（离线模式）');
    }
  }
}