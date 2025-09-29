import request, { BaseResponse } from './request';

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  market: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  pb: number;
  eps: number;
  dividend: number;
  updatedAt: string;
}

export interface StockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
    current: number;
  };
  kdj: {
    k: number;
    d: number;
    j: number;
  };
  ma: {
    ma5: number;
    ma10: number;
    ma20: number;
    ma60: number;
  };
}

export interface AIAnalysis {
  id: string;
  symbol: string;
  stockName: string;
  overallScore: number;
  fundamentalScore: number;
  technicalScore: number;
  sentimentScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  targetPrice: number;
  upsidePotential: number;
  recommendation: 'buy' | 'hold' | 'sell';
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface StockQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  market?: string;
  sector?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface StockResponse {
  data: Stock[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export const getStocks = async (params?: StockQueryParams): Promise<StockResponse> => {
  const response = await request.get<BaseResponse<StockResponse>>('/api/stocks', { params });
  return response;
};

export const getStockDetail = async (symbol: string): Promise<Stock> => {
  const response = await request.get<BaseResponse<Stock>>(`/api/stocks/${symbol}`);
  return response;
};

export const getStockHistory = async (
  symbol: string,
  period: 'day' | 'week' | 'month' = 'day',
  startDate?: string,
  endDate?: string
): Promise<StockHistory[]> => {
  const params = { period, startDate, endDate };
  const response = await request.get<BaseResponse<StockHistory[]>>(`/api/stocks/${symbol}/history`, { params });
  return response;
};

export const getTechnicalIndicators = async (symbol: string): Promise<TechnicalIndicators> => {
  const response = await request.get<BaseResponse<TechnicalIndicators>>(`/api/stocks/${symbol}/technical`);
  return response;
};

export const getAIAnalysis = async (symbol: string): Promise<AIAnalysis> => {
  const response = await request.get<BaseResponse<AIAnalysis>>(`/api/stocks/${symbol}/ai-ratings`);
  return response;
};

export const getStockNews = async (symbol: string): Promise<News[]> => {
  const response = await request.get<BaseResponse<News[]>>(`/api/stocks/${symbol}/news`);
  return response;
};

export const searchStocks = async (query: string): Promise<Stock[]> => {
  const response = await request.get<BaseResponse<Stock[]>>('/api/stocks/search', { params: { query } });
  return response;
};