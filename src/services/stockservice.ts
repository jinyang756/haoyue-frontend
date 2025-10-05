import request, { BaseResponse } from './request';
import { isOfflineMode, simulateNetworkDelay } from '@/utils/offlineMode';
import { mockStockData, generateStockHistoryData, generateStockDetail, mockAnalysisTasks, generateAIAnalysisResult } from './mockDataService';
import { message } from 'antd';

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
  sector: string;
  industry: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
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
  // 如果处于离线模式，直接返回模拟数据
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    return {
      data: mockStockData.map(convertToStock),
      pagination: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        total: mockStockData.length,
        totalPages: Math.ceil(mockStockData.length / (params?.pageSize || 10))
      }
    };
  }

  try {
    const response = await request.get<BaseResponse<StockResponse>>('/api/stocks', { params });
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    return {
      data: mockStockData.map(convertToStock),
      pagination: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        total: mockStockData.length,
        totalPages: Math.ceil(mockStockData.length / (params?.pageSize || 10))
      }
    };
  }
};

export const getStockDetail = async (symbol: string): Promise<Stock> => {
  // 如果处于离线模式，直接返回模拟数据
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    const mockDetail = generateStockDetail(symbol);
    // 使用convertToStock函数确保数据符合Stock类型要求
    return convertToStock({
      id: mockDetail.id,
      symbol: mockDetail.symbol,
      name: mockDetail.name,
      price: mockDetail.price,
      changePercent: mockDetail.changePercent,
      volume: mockDetail.volume,
      marketCap: mockDetail.marketCap,
      pe: mockDetail.pe
    });
  }

  try {
    const response = await request.get<BaseResponse<Stock>>(`/api/stocks/${symbol}`);
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    const mockDetail = generateStockDetail(symbol);
    // 使用convertToStock函数确保数据符合Stock类型要求
    return convertToStock({
      id: mockDetail.id,
      symbol: mockDetail.symbol,
      name: mockDetail.name,
      price: mockDetail.price,
      changePercent: mockDetail.changePercent,
      volume: mockDetail.volume,
      marketCap: mockDetail.marketCap,
      pe: mockDetail.pe
    });
  }
};

export const getStockHistory = async (
  symbol: string,
  period: 'day' | 'week' | 'month' = 'day',
  startDate?: string,
  endDate?: string
): Promise<StockHistory[]> => {
  // 如果处于离线模式，直接返回模拟数据
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    // 根据period确定生成的天数
    const days = period === 'day' ? 30 : period === 'week' ? 90 : 365;
    return generateStockHistoryData(symbol, days).map(item => ({
      ...item,
      adjustedClose: item.close
    }));
  }

  const params = { period, startDate, endDate };
  try {
    const response = await request.get<BaseResponse<StockHistory[]>>(`/api/stocks/${symbol}/history`, { params });
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    const days = period === 'day' ? 30 : period === 'week' ? 90 : 365;
    return generateStockHistoryData(symbol, days).map(item => ({
      ...item,
      adjustedClose: item.close
    }));
  }
};

export const getTechnicalIndicators = async (symbol: string): Promise<TechnicalIndicators> => {
  // 如果处于离线模式，直接返回模拟数据
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    // 生成随机的技术指标数据
    return {
      rsi: parseFloat((30 + Math.random() * 40).toFixed(2)),
      macd: parseFloat((-2 + Math.random() * 4).toFixed(2)),
      bollinger: {
        upper: parseFloat((100 + Math.random() * 20).toFixed(2)),
        middle: parseFloat((100 + Math.random() * 10).toFixed(2)),
        lower: parseFloat((80 + Math.random() * 20).toFixed(2)),
        current: parseFloat((90 + Math.random() * 20).toFixed(2))
      },
      kdj: {
        k: parseFloat((30 + Math.random() * 40).toFixed(2)),
        d: parseFloat((30 + Math.random() * 40).toFixed(2)),
        j: parseFloat((30 + Math.random() * 40).toFixed(2))
      },
      ma: {
        ma5: parseFloat((95 + Math.random() * 10).toFixed(2)),
        ma10: parseFloat((92 + Math.random() * 10).toFixed(2)),
        ma20: parseFloat((90 + Math.random() * 10).toFixed(2)),
        ma60: parseFloat((85 + Math.random() * 10).toFixed(2))
      }
    };
  }

  try {
    const response = await request.get<BaseResponse<TechnicalIndicators>>(`/api/stocks/${symbol}/technical`);
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    return {
      rsi: parseFloat((30 + Math.random() * 40).toFixed(2)),
      macd: parseFloat((-2 + Math.random() * 4).toFixed(2)),
      bollinger: {
        upper: parseFloat((100 + Math.random() * 20).toFixed(2)),
        middle: parseFloat((100 + Math.random() * 10).toFixed(2)),
        lower: parseFloat((80 + Math.random() * 20).toFixed(2)),
        current: parseFloat((90 + Math.random() * 20).toFixed(2))
      },
      kdj: {
        k: parseFloat((30 + Math.random() * 40).toFixed(2)),
        d: parseFloat((30 + Math.random() * 40).toFixed(2)),
        j: parseFloat((30 + Math.random() * 40).toFixed(2))
      },
      ma: {
        ma5: parseFloat((95 + Math.random() * 10).toFixed(2)),
        ma10: parseFloat((92 + Math.random() * 10).toFixed(2)),
        ma20: parseFloat((90 + Math.random() * 10).toFixed(2)),
        ma60: parseFloat((85 + Math.random() * 10).toFixed(2))
      }
    };
  }
};

export const getAIAnalysis = async (symbol: string): Promise<any> => {
  // 如果处于离线模式，直接返回模拟数据
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    // 为了兼容generateAIAnalysisResult函数，我们需要先找到对应的任务ID
    const task = mockAnalysisTasks.find(t => t.symbol === symbol) || mockAnalysisTasks[0];
    return generateAIAnalysisResult(task.id);
  }

  try {
    const response = await request.get<BaseResponse<any>>(`/api/stocks/${symbol}/ai-ratings`);
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    const task = mockAnalysisTasks.find(t => t.symbol === symbol) || mockAnalysisTasks[0];
    return generateAIAnalysisResult(task.id);
  }
};

export const getStockNews = async (symbol: string): Promise<any[]> => {
  // 如果处于离线模式，直接返回模拟数据
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    const stock = mockStockData.find(s => s.symbol === symbol) || mockStockData[0];
    // 生成模拟新闻数据
    return [
      {
        id: '1',
        title: `${stock.name}发布最新季度财报，业绩超出市场预期`,
        source: '财经日报',
        publishDate: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        summary: `${stock.name}今日发布最新季度财报，营收和利润均超出分析师预期，股价应声上涨。`,
        url: `https://news.example.com/${symbol}/1`
      },
      {
        id: '2',
        title: `${stock.name}宣布重大战略转型，进军${symbol === 'AAPL' ? '人工智能' : symbol === 'MSFT' ? '元宇宙' : symbol === 'TSLA' ? '机器人' : '云计算'}领域`,
        source: '科技快讯',
        publishDate: new Date(Date.now() - Math.random() * 172800000).toISOString(),
        summary: `${stock.name} CEO今日宣布公司将进行战略转型，加大对${symbol === 'AAPL' ? '人工智能' : symbol === 'MSFT' ? '元宇宙' : symbol === 'TSLA' ? '机器人' : '云计算'}领域的投入。`,
        url: `https://news.example.com/${symbol}/2`
      },
      {
        id: '3',
        title: `分析师上调${stock.name}目标价，看好长期增长前景`,
        source: '投资研究',
        publishDate: new Date(Date.now() - Math.random() * 259200000).toISOString(),
        summary: `多家投行分析师上调${stock.name}目标价，认为公司在${symbol === 'AAPL' ? '创新产品' : symbol === 'MSFT' ? '云服务' : symbol === 'TSLA' ? '新能源' : '数字经济'}领域的布局将带来长期增长。`,
        url: `https://news.example.com/${symbol}/3`
      }
    ];
  }

  try {
    const response = await request.get<BaseResponse<any[]>>(`/api/stocks/${symbol}/news`);
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    const stock = mockStockData.find(s => s.symbol === symbol) || mockStockData[0];
    return [
      {
        id: '1',
        title: `${stock.name}发布最新季度财报，业绩超出市场预期`,
        source: '财经日报',
        publishDate: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        summary: `${stock.name}今日发布最新季度财报，营收和利润均超出分析师预期，股价应声上涨。`,
        url: `https://news.example.com/${symbol}/1`
      },
      {
        id: '2',
        title: `${stock.name}宣布重大战略转型，进军${symbol === 'AAPL' ? '人工智能' : symbol === 'MSFT' ? '元宇宙' : symbol === 'TSLA' ? '机器人' : '云计算'}领域`,
        source: '科技快讯',
        publishDate: new Date(Date.now() - Math.random() * 172800000).toISOString(),
        summary: `${stock.name} CEO今日宣布公司将进行战略转型，加大对${symbol === 'AAPL' ? '人工智能' : symbol === 'MSFT' ? '元宇宙' : symbol === 'TSLA' ? '机器人' : '云计算'}领域的投入。`,
        url: `https://news.example.com/${symbol}/2`
      },
      {
        id: '3',
        title: `分析师上调${stock.name}目标价，看好长期增长前景`,
        source: '投资研究',
        publishDate: new Date(Date.now() - Math.random() * 259200000).toISOString(),
        summary: `多家投行分析师上调${stock.name}目标价，认为公司在${symbol === 'AAPL' ? '创新产品' : symbol === 'MSFT' ? '云服务' : symbol === 'TSLA' ? '新能源' : '数字经济'}领域的布局将带来长期增长。`,
        url: `https://news.example.com/${symbol}/3`
      }
    ];
  }
};

export const searchStocks = async (params: StockQueryParams): Promise<StockResponse> => {
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    // 如果没有搜索关键词，返回前5条数据
    if (!params.search || params.search.trim() === '') {
      return {
        data: mockStockData.slice(0, 5).map(convertToStock),
        pagination: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          total: mockStockData.length,
          totalPages: Math.ceil(mockStockData.length / (params?.pageSize || 10))
        }
      };
    }
    // 过滤匹配搜索关键词的数据
    const searchTerm = params.search.toLowerCase();
    const filteredData = mockStockData
      .filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm) || 
        stock.name.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10)
      .map(convertToStock);
    return {
      data: filteredData,
      pagination: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / (params?.pageSize || 10))
      }
    };
  }

  try {
    const response = await request.get<BaseResponse<StockResponse>>('/stocks/search', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
        market: params.market,
        sector: params.sector,
        sortBy: params.sortBy,
        order: params.order
      }
    });
    return response.data.data;
  } catch (error) {
    message.warning('搜索股票失败，显示模拟数据');
    // 搜索失败时返回模拟数据
    if (!params.search || params.search.trim() === '') {
      return {
        data: mockStockData.slice(0, 5).map(convertToStock),
        pagination: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          total: mockStockData.length,
          totalPages: Math.ceil(mockStockData.length / (params?.pageSize || 10))
        }
      };
    }
    const searchTerm = params.search.toLowerCase();
    const filteredData = mockStockData
      .filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm) || 
        stock.name.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10)
      .map(convertToStock);
    return {
      data: filteredData,
      pagination: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / (params?.pageSize || 10))
      }
    };
  }
}

// 辅助函数：将mockStockData转换为符合Stock接口的格式
const convertToStock = (mockItem: any): Stock => ({
  id: mockItem.id,
  symbol: mockItem.symbol,
  name: mockItem.name,
  market: 'NASDAQ', // 默认市场
  price: mockItem.price,
  change: mockItem.price * (mockItem.changePercent / 100), // 计算价格变动
  changePercent: mockItem.changePercent,
  volume: mockItem.volume,
  marketCap: mockItem.marketCap,
  pe: mockItem.pe,
  pb: parseFloat((mockItem.pe * 0.5 + Math.random() * 3).toFixed(2)), // 模拟市净率
  eps: parseFloat((mockItem.price / mockItem.pe).toFixed(2)), // 模拟每股收益
  dividend: parseFloat((Math.random() * 3).toFixed(2)), // 模拟股息
  sector: '科技', // 默认行业
  industry: mockItem.symbol === 'AAPL' ? '消费电子' :
            mockItem.symbol === 'MSFT' ? '软件服务' :
            mockItem.symbol === 'TSLA' ? '汽车' :
            mockItem.symbol === 'AMZN' ? '电子商务' :
            mockItem.symbol === 'GOOG' ? '互联网服务' :
            mockItem.symbol === 'META' ? '社交媒体' :
            mockItem.symbol === 'NVDA' ? '半导体' :
            mockItem.symbol === 'BABA' ? '电子商务' :
            mockItem.symbol === 'PDD' ? '电子商务' :
            '其他',
  description: `${mockItem.name}是一家全球领先的${mockItem.symbol === 'AAPL' ? '消费电子' : mockItem.symbol === 'MSFT' ? '软件服务' : mockItem.symbol === 'TSLA' ? '电动汽车' : '互联网服务'}公司。`,
  isActive: true,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天前
  updatedAt: new Date().toISOString()
});