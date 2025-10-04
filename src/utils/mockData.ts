// 模拟分析任务数据，用于后端不可用时的演示

export interface MockAnalysisTask {
  id: string;
  userId: string;
  symbol: string;
  stockName: string;
  type: 'basic' | 'advanced' | 'premium';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: MockAnalysisResult;
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

export interface MockAnalysisResult {
  overallRating: number;
  recommendation: 'strong sell' | 'sell' | 'hold' | 'buy' | 'strong buy';
  confidenceLevel: number;
  riskLevel: 'very low' | 'low' | 'medium' | 'high' | 'very high';
  targetPrice: number;
  stopLossPrice: number;
  upsidePotential: number;
  downsideRisk: number;
}

// 模拟分析任务数据
export const mockAnalysisTasks: MockAnalysisTask[] = [
  {
    id: 'mock-task-1',
    userId: 'demo-user',
    symbol: 'AAPL',
    stockName: '苹果公司',
    type: 'advanced',
    status: 'completed',
    progress: 100,
    result: {
      overallRating: 8.5,
      recommendation: 'buy',
      confidenceLevel: 85,
      riskLevel: 'low',
      targetPrice: 195.50,
      stopLossPrice: 175.20,
      upsidePotential: 12.5,
      downsideRisk: 8.2
    },
    factors: {
      fundamentalScore: 88,
      technicalScore: 82,
      sentimentScore: 79,
      marketScore: 85,
      industryScore: 87
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString()
  },
  {
    id: 'mock-task-2',
    userId: 'demo-user',
    symbol: 'MSFT',
    stockName: '微软公司',
    type: 'advanced',
    status: 'processing',
    progress: 65,
    result: {
      overallRating: 7.2,
      recommendation: 'hold',
      confidenceLevel: 78,
      riskLevel: 'medium',
      targetPrice: 425.30,
      stopLossPrice: 395.80,
      upsidePotential: 8.7,
      downsideRisk: 10.3
    },
    factors: {
      fundamentalScore: 75,
      technicalScore: 70,
      sentimentScore: 72,
      marketScore: 78,
      industryScore: 74
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'mock-task-3',
    userId: 'demo-user',
    symbol: 'GOOGL',
    stockName: '谷歌公司',
    type: 'basic',
    status: 'pending',
    progress: 0,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// 根据ID获取模拟分析任务
export const getMockAnalysisTaskById = (id: string): MockAnalysisTask | undefined => {
  return mockAnalysisTasks.find(task => task.id === id);
};

// 模拟分析统计信息
export const mockAnalysisStats = {
  totalTasks: 156,
  completedTasks: 124,
  pendingTasks: 18,
  averageScore: 7.2,
  successRate: 92
};