import request, { BaseResponse } from './request';
import { mockAnalysisTasks, getMockAnalysisTaskById, mockAnalysisStats } from '@/utils/mockData';
import { isOfflineMode, simulateNetworkDelay } from '@/utils/offlineMode';

export interface AnalysisTask {
  id: string;
  userId: string;
  symbol: string;
  stockName: string;
  type: 'basic' | 'advanced' | 'premium';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: AnalysisResult;
  factors?: {
    fundamentalScore: number;
    technicalScore: number;
    sentimentScore: number;
    marketScore: number;
    industryScore: number;
  };
  technicalIndicators?: any;
  fundamentalAnalysis?: any;
  sentimentAnalysis?: any;
  marketAnalysis?: any;
  riskAnalysis?: any;
  aiExplanation?: any;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AnalysisResult {
  overallRating: number;
  recommendation: 'strong sell' | 'sell' | 'hold' | 'buy' | 'strong buy';
  confidenceLevel: number;
  riskLevel: 'very low' | 'low' | 'medium' | 'high' | 'very high';
  targetPrice: number;
  stopLossPrice: number;
  upsidePotential: number;
  downsideRisk: number;
}

export interface CreateAnalysisTaskParams {
  symbol: string;
  type: 'basic' | 'advanced' | 'premium';
}

export interface AnalysisQueryParams {
  page?: number;
  pageSize?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  type?: 'basic' | 'advanced' | 'premium';
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface AnalysisResponse {
  data: AnalysisTask[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export const createAnalysisTask = async (params: CreateAnalysisTaskParams): Promise<AnalysisTask> => {
  const response = await request.post<BaseResponse<AnalysisTask>>('/api/analysis', params);
  return response.data.data;
};

export const getAnalysisTasks = async (params?: AnalysisQueryParams): Promise<AnalysisResponse> => {
  try {
    const response = await request.get<BaseResponse<AnalysisResponse>>('/api/analysis', { params });
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    return {
      data: mockAnalysisTasks as AnalysisTask[],
      pagination: {
        page: 1,
        pageSize: 10,
        total: mockAnalysisTasks.length,
        totalPages: 1
      }
    };
  }
};

export const getAnalysisTaskById = async (id: string): Promise<AnalysisTask> => {
  // 如果处于离线模式，直接返回模拟数据
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    const mockTask = getMockAnalysisTaskById(id);
    if (mockTask) {
      return mockTask as AnalysisTask;
    }
    throw new Error('未找到分析任务');
  }

  try {
    const response = await request.get<BaseResponse<AnalysisTask>>(`/api/analysis/${id}`);
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    const mockTask = getMockAnalysisTaskById(id);
    if (mockTask) {
      return mockTask as AnalysisTask;
    }
    throw error;
  }
};

export const cancelAnalysisTask = async (id: string): Promise<void> => {
  await request.put<BaseResponse<void>>(`/api/analysis/${id}/cancel`);
};

export const getAnalysisStats = async (): Promise<{
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  averageScore: number;
  successRate: number;
}> => {
  // 如果处于离线模式，直接返回模拟数据
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    return mockAnalysisStats;
  }

  try {
    const response = await request.get<BaseResponse<{
      totalTasks: number;
      completedTasks: number;
      pendingTasks: number;
      averageScore: number;
      successRate: number;
    }>>('/api/analysis/stats');
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    return mockAnalysisStats;
  }
};

export const getAnalysisHistory = async (symbol: string): Promise<AnalysisTask[]> => {
  const response = await request.get<BaseResponse<AnalysisTask[]>>(`/api/analysis/history/${symbol}`);
  return response.data.data;
};