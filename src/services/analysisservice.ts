import request, { BaseResponse } from './request';

export interface AnalysisTask {
  id: string;
  userId: string;
  symbol: string;
  stockName: string;
  type: 'basic' | 'advanced' | 'premium';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: AnalysisResult;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AnalysisResult {
  overallScore: number;
  fundamentalAnalysis: {
    score: number;
    factors: {
      name: string;
      value: number;
      weight: number;
    }[];
    conclusion: string;
  };
  technicalAnalysis: {
    score: number;
    indicators: {
      name: string;
      value: number;
      interpretation: string;
    }[];
    conclusion: string;
  };
  sentimentAnalysis: {
    score: number;
    newsCount: number;
    positiveRatio: number;
    conclusion: string;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigation: string;
  };
  priceTarget: {
    targetPrice: number;
    upsidePotential: number;
    confidence: number;
    timeHorizon: string;
  };
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  summary: string;
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
  return response;
};

export const getAnalysisTasks = async (params?: AnalysisQueryParams): Promise<AnalysisResponse> => {
  const response = await request.get<BaseResponse<AnalysisResponse>>('/api/analysis', { params });
  return response;
};

export const getAnalysisTaskById = async (id: string): Promise<AnalysisTask> => {
  const response = await request.get<BaseResponse<AnalysisTask>>(`/api/analysis/${id}`);
  return response;
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
  const response = await request.get<BaseResponse<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    averageScore: number;
    successRate: number;
  }>>('/api/analysis/stats');
  return response;
};

export const getAnalysisHistory = async (symbol: string): Promise<AnalysisTask[]> => {
  const response = await request.get<BaseResponse<AnalysisTask[]>>(`/api/analysis/history/${symbol}`);
  return response;
};