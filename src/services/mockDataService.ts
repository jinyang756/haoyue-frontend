// 模拟数据服务 - 为所有页面提供虚拟数据

// 模拟股票数据
export const mockStockData = [
  { id: '1', symbol: 'AAPL', name: '苹果公司', price: 182.52, changePercent: 1.24, volume: 45678900, marketCap: 2850000000000, pe: 30.5 },
  { id: '2', symbol: 'MSFT', name: '微软公司', price: 378.45, changePercent: -0.35, volume: 28901200, marketCap: 2250000000000, pe: 32.7 },
  { id: '3', symbol: 'TSLA', name: '特斯拉', price: 175.32, changePercent: 2.78, volume: 89567400, marketCap: 560000000000, pe: 75.2 },
  { id: '4', symbol: 'AMZN', name: '亚马逊', price: 152.87, changePercent: 0.89, volume: 32145600, marketCap: 1540000000000, pe: 48.3 },
  { id: '5', symbol: 'GOOG', name: '谷歌A', price: 142.34, changePercent: -0.56, volume: 12345600, marketCap: 1850000000000, pe: 28.6 },
  { id: '6', symbol: 'META', name: '元宇宙', price: 427.89, changePercent: 1.34, volume: 18976500, marketCap: 890000000000, pe: 31.2 },
  { id: '7', symbol: 'NVDA', name: '英伟达', price: 945.67, changePercent: 3.45, volume: 45678900, marketCap: 2450000000000, pe: 42.8 },
  { id: '8', symbol: 'BABA', name: '阿里巴巴', price: 78.34, changePercent: -1.23, volume: 56789000, marketCap: 210000000000, pe: 15.4 },
  { id: '9', symbol: 'PDD', name: '拼多多', price: 156.78, changePercent: 2.34, volume: 23456700, marketCap: 180000000000, pe: 28.9 },
  { id: '10', symbol: 'NFLX', name: '奈飞', price: 658.90, changePercent: -0.87, volume: 8901200, marketCap: 260000000000, pe: 45.6 },
];

// 模拟股票历史数据
export const generateStockHistoryData = (symbol: string, days: number = 30) => {
  const data = [];
  let basePrice = 100 + Math.random() * 100;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.5) * 10;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const volume = Math.floor(10000 + Math.random() * 90000);
    
    basePrice = close;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume: volume,
    });
  }
  
  return data;
};

// 模拟股票详情数据
export const generateStockDetail = (symbol: string) => {
  const stock = mockStockData.find(s => s.symbol === symbol) || mockStockData[0];
  
  return {
    ...stock,
    description: `${stock.name}是一家全球领先的科技公司，主要从事${symbol === 'AAPL' ? '消费电子' : symbol === 'MSFT' ? '软件服务' : symbol === 'TSLA' ? '电动汽车' : '互联网服务'}业务。`,
    industry: symbol === 'AAPL' ? '消费电子' : symbol === 'MSFT' ? '软件' : symbol === 'TSLA' ? '汽车' : '互联网',
    sector: '科技',
    employees: 100000 + Math.floor(Math.random() * 200000),
    headquarters: '美国',
    founded: 1980 + Math.floor(Math.random() * 20),
    website: `https://www.${symbol.toLowerCase()}.com`,
    dividendYield: parseFloat((Math.random() * 3).toFixed(2)),
    beta: parseFloat((0.8 + Math.random() * 0.8).toFixed(2)),
    '52WeekHigh': parseFloat((stock.price * (1 + Math.random() * 0.3)).toFixed(2)),
    '52WeekLow': parseFloat((stock.price * (0.7 + Math.random() * 0.3)).toFixed(2)),
    marketCap: stock.marketCap,
    volume: stock.volume,
    avgVolume: stock.volume * (0.8 + Math.random() * 0.4),
    eps: parseFloat((Math.random() * 10).toFixed(2)),
    peRatio: stock.pe,
    technicalIndicators: {
      rsi: parseFloat((30 + Math.random() * 40).toFixed(2)),
      macd: parseFloat((-2 + Math.random() * 4).toFixed(2)),
      bollingerBands: {
        upper: parseFloat((stock.price * 1.1).toFixed(2)),
        middle: parseFloat(stock.price.toFixed(2)),
        lower: parseFloat((stock.price * 0.9).toFixed(2))
      },
      stochastic: parseFloat((40 + Math.random() * 30).toFixed(2))
    }
  };
};

// 模拟AI分析任务数据
export const mockAnalysisTasks = [
  { id: '1', symbol: 'AAPL', stockName: '苹果公司', type: 'advanced', status: 'completed', createdAt: '2024-01-15T10:30:00Z', completedAt: '2024-01-15T10:45:00Z', confidence: 85 },
  { id: '2', symbol: 'MSFT', stockName: '微软公司', type: 'basic', status: 'processing', createdAt: '2024-01-15T11:00:00Z', confidence: 0 },
  { id: '3', symbol: 'TSLA', stockName: '特斯拉', type: 'premium', status: 'pending', createdAt: '2024-01-15T12:15:00Z', confidence: 0 },
  { id: '4', symbol: 'AMZN', stockName: '亚马逊', type: 'advanced', status: 'failed', createdAt: '2024-01-15T09:45:00Z', completedAt: '2024-01-15T10:00:00Z', confidence: 0 },
  { id: '5', symbol: 'GOOG', stockName: '谷歌A', type: 'basic', status: 'completed', createdAt: '2024-01-14T16:30:00Z', completedAt: '2024-01-14T16:40:00Z', confidence: 78 },
];

// 模拟AI分析结果
export const generateAIAnalysisResult = (taskId: string) => {
  const task = mockAnalysisTasks.find(t => t.id === taskId) || mockAnalysisTasks[0];
  const stock = mockStockData.find(s => s.symbol === task.symbol) || mockStockData[0];
  const recommendation = Math.random() > 0.5 ? '买入' : Math.random() > 0.5 ? '持有' : '卖出';
  
  return {
    taskId: task.id,
    symbol: task.symbol,
    stockName: task.stockName,
    analysisType: task.type,
    createdAt: task.createdAt,
    completedAt: task.completedAt || new Date().toISOString(),
    confidence: task.confidence || parseFloat((70 + Math.random() * 30).toFixed(2)),
    recommendation: recommendation,
    priceTarget: parseFloat((stock.price * (1 + (recommendation === '买入' ? 0.1 + Math.random() * 0.2 : recommendation === '卖出' ? -0.1 - Math.random() * 0.2 : -0.05 + Math.random() * 0.1))).toFixed(2)),
    keyFindings: [
      `技术指标显示${task.symbol}处于${recommendation === '买入' ? '强势上涨' : recommendation === '卖出' ? '弱势下跌' : '盘整'}趋势`,
      `基本面分析表明公司${task.symbol}的${recommendation === '买入' ? '盈利能力和增长前景' : recommendation === '卖出' ? '估值和现金流' : '整体状况'}${recommendation === '买入' ? '良好' : recommendation === '卖出' ? '存在风险' : '稳定'}`,
      `市场情绪对${task.symbol}${recommendation === '买入' ? '积极乐观' : recommendation === '卖出' ? '趋于谨慎' : '保持中性'}`,
    ],
    detailedAnalysis: `这是一份针对${task.symbol}（${task.stockName}）的${task.type === 'basic' ? '基础' : task.type === 'advanced' ? '高级' : '尊享'}AI分析报告。通过对历史价格数据、交易量、技术指标和市场情绪的综合分析，我们得出${recommendation}的结论。

技术面分析显示，${task.symbol}的均线系统${recommendation === '买入' ? '呈多头排列' : recommendation === '卖出' ? '空头排列明显' : '处于纠结状态'}，RSI指标${recommendation === '买入' ? '处于强势区域' : recommendation === '卖出' ? '已经超卖' : '趋于中性'}。

基本面来看，公司${recommendation === '买入' ? '近期业绩超出市场预期' : recommendation === '卖出' ? '面临增长放缓和成本上升的压力' : '经营状况稳定但缺乏明显增长点'}。

综合评估，我们${recommendation === '买入' ? '强烈建议投资者考虑买入' : recommendation === '卖出' ? '建议投资者谨慎对待，考虑减持' : '认为当前价位适合持有观察'}。`,
    charts: [
      { title: '价格走势预测', type: 'line' },
      { title: '风险收益分析', type: 'scatter' },
      { title: '行业对比', type: 'bar' },
    ],
    riskAssessment: {
      overallRisk: parseFloat((3 + Math.random() * 4).toFixed(2)),
      marketRisk: parseFloat((2 + Math.random() * 3).toFixed(2)),
      companyRisk: parseFloat((1 + Math.random() * 3).toFixed(2)),
      liquidityRisk: parseFloat((1 + Math.random() * 2).toFixed(2)),
    }
  };
};

// 模拟内容管理数据
export const mockContentItems = [
  { id: '1', title: '如何使用AI分析工具提升投资决策', type: 'article', status: 'published', author: '系统管理员', createdAt: '2024-01-10T10:30:00Z', updatedAt: '2024-01-12T14:15:00Z', tags: ['AI分析', '投资决策'], content: '<p>这是一篇关于如何使用AI分析工具提升投资决策的文章...</p>' },
  { id: '2', title: '2024年投资策略展望', type: 'report', status: 'draft', author: '分析师张三', createdAt: '2024-01-15T09:00:00Z', updatedAt: '2024-01-15T11:30:00Z', tags: ['投资策略', '年度展望'], content: '<p>2024年投资策略展望报告...</p>' },
  { id: '3', title: '技术指标详解：RSI的正确使用方法', type: 'tutorial', status: 'published', author: '技术专家李四', createdAt: '2024-01-05T16:45:00Z', updatedAt: '2024-01-05T16:45:00Z', tags: ['技术指标', 'RSI'], content: '<p>本教程详细讲解RSI指标的原理和使用方法...</p>' },
];

// 模拟用户数据
export const mockUserProfile = {
  id: '1',
  username: 'demoUser',
  email: 'demo@example.com',
  fullName: '演示用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demoUser',
  role: 'user',
  subscription: 'basic',
  joinDate: '2023-12-15T08:30:00Z',
  lastLogin: '2024-01-15T14:20:00Z',
  preferences: {
    theme: 'dark',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  },
  watchlist: ['AAPL', 'MSFT', 'TSLA'],
  recentActivities: [
    { id: '1', type: 'login', timestamp: '2024-01-15T14:20:00Z', description: '用户登录成功' },
    { id: '2', type: 'analysis', timestamp: '2024-01-15T11:00:00Z', description: '创建AI分析任务：MSFT' },
    { id: '3', type: 'view', timestamp: '2024-01-15T10:30:00Z', description: '查看股票详情：AAPL' },
  ]
};

// 模拟API端点数据
export const mockApiEndpoints = [
  { id: '1', path: '/api/auth/login', method: 'POST', description: '用户登录接口', category: '认证', isPublic: true, status: 'active', lastUpdated: '2024-01-15T10:30:00Z', responseTime: 120 },
  { id: '2', path: '/api/stocks', method: 'GET', description: '获取股票列表', category: '股票数据', isPublic: false, status: 'active', lastUpdated: '2024-01-10T14:20:00Z', responseTime: 85 },
  { id: '3', path: '/api/analysis', method: 'POST', description: '创建AI分析任务', category: 'AI分析', isPublic: false, status: 'active', lastUpdated: '2024-01-20T09:45:00Z', responseTime: 250 },
  { id: '4', path: '/api/admin/users', method: 'GET', description: '获取用户列表（管理员）', category: '管理', isPublic: false, status: 'active', lastUpdated: '2024-01-05T16:10:00Z', responseTime: 180 },
  { id: '5', path: '/api/recommendations', method: 'GET', description: '获取股票推荐', category: '推荐', isPublic: false, status: 'development', lastUpdated: '2024-01-25T11:30:00Z' },
];

// 模拟API统计数据
export const mockApiStats = {
  totalRequests: 15428,
  successfulRequests: 14892,
  failedRequests: 536,
  averageResponseTime: 128,
  endpoints: {
    '/api/stocks': { requests: 5432, successRate: 98.2, avgResponseTime: 85, errors: 98 },
    '/api/analysis': { requests: 2156, successRate: 94.7, avgResponseTime: 245, errors: 114 },
    '/api/auth/login': { requests: 3245, successRate: 99.1, avgResponseTime: 112, errors: 29 },
    '/api/admin/users': { requests: 876, successRate: 97.8, avgResponseTime: 178, errors: 19 },
    '/api/recommendations': { requests: 456, successRate: 89.2, avgResponseTime: 320, errors: 50 },
  },
  timeRange: { start: '2024-01-01T00:00:00Z', end: '2024-01-31T23:59:59Z' },
};

// 模拟订阅计划数据
export const mockSubscriptionPlans = {
  free: {
    name: '免费版',
    price: 0,
    originalPrice: 0,
    period: '终身',
    billingCycles: { lifetime: { price: 0, discount: 0 } },
    features: [
      { name: '基础股票分析', included: true },
      { name: '每日AI分析 1次', included: true },
      { name: '3个技术指标', included: true },
      { name: '基础数据可视化', included: true },
      { name: '数据导出', included: false },
      { name: '优先技术支持', included: false },
      { name: '自定义指标', included: false },
      { name: '专属分析师', included: false },
    ],
    description: '基础功能免费使用',
    limitations: ['无数据导出', '无优先支持'],
  },
  basic: {
    name: '基础版',
    price: 99,
    originalPrice: 99,
    period: '月',
    billingCycles: {
      monthly: { price: 99, discount: 0 },
      quarterly: { price: 267, discount: 10 },
      yearly: { price: 950, discount: 20 },
    },
    features: [
      { name: '股票查询', included: true },
      { name: '每日AI分析 5次', included: true },
      { name: '8个技术指标', included: true },
      { name: '数据导出', included: true },
      { name: '基础支持', included: true },
      { name: '优先技术支持', included: false },
      { name: '自定义指标', included: false },
      { name: '专属分析师', included: false },
    ],
    description: '包含AI推荐功能',
    limitations: ['无优先支持'],
  },
  premium: {
    name: '高级版',
    price: 299,
    originalPrice: 299,
    period: '月',
    billingCycles: {
      monthly: { price: 299, discount: 0 },
      quarterly: { price: 807, discount: 10 },
      yearly: { price: 2870, discount: 20 },
    },
    features: [
      { name: '全部股票数据', included: true },
      { name: '每日AI分析 20次', included: true },
      { name: '全部技术指标', included: true },
      { name: '高级数据可视化', included: true },
      { name: '数据导出', included: true },
      { name: '优先技术支持', included: true },
      { name: '自定义指标', included: false },
      { name: '专属分析师', included: false },
    ],
    description: '专业投资者首选',
    limitations: ['无专属分析师'],
  },
  enterprise: {
    name: '企业版',
    price: 999,
    originalPrice: 999,
    period: '月',
    billingCycles: {
      monthly: { price: 999, discount: 0 },
      quarterly: { price: 2697, discount: 10 },
      yearly: { price: 9590, discount: 20 },
    },
    features: [
      { name: '全部功能', included: true },
      { name: '无限AI分析', included: true },
      { name: 'API接口', included: true },
      { name: '专属分析师', included: true },
      { name: '定制化报表', included: true },
      { name: '团队账号', included: true },
      { name: '数据导出', included: true },
      { name: '24小时技术支持', included: true },
    ],
    description: '为专业机构量身定制',
    limitations: [],
  },
};

// 模拟系统状态数据
export const mockSystemStatus = {
  backend: { status: 'online', lastChecked: new Date().toISOString(), responseTime: 120 },
  database: { status: 'online', lastChecked: new Date().toISOString(), responseTime: 50 },
  apiService: { status: 'online', lastChecked: new Date().toISOString(), responseTime: 80 },
  aiService: { status: 'online', lastChecked: new Date().toISOString(), responseTime: 250 },
  uptime: '15天 8小时 30分钟',
  version: 'v1.2.0',
  maintenanceSchedule: null,
};