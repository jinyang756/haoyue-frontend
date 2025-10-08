// 测试数据生成工具
// 提供API测试相关的模拟数据

// API测试请求类型定义
export interface TestRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string>;
  environment: string;
}

// API测试历史记录类型定义
export interface TestHistory {
  id: string;
  requestId: string;
  timestamp: string;
  response: {
    status: number;
    headers: Record<string, string>;
    body: any;
    time: number;
  };
  success: boolean;
}

// 环境配置类型定义
export interface Environment {
  id: string;
  name: string;
  baseUrl: string;
  variables: Record<string, string>;
}

// 生成随机测试数据
export function generateRandomTestData(): TestRequest {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const environments = ['开发环境', '测试环境', '生产环境'];
  
  return {
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    url: `/api/${Math.random().toString(36).substr(2, 10)}`,
    method: methods[Math.floor(Math.random() * methods.length)],
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer token-${Math.random().toString(36).substr(2, 15)}`,
      'X-Request-ID': Math.random().toString(36).substr(2, 10)
    },
    body: {
      testField1: `test-value-${Math.random().toString(36).substr(2, 5)}`,
      testField2: Math.floor(Math.random() * 1000),
      testField3: Math.random() > 0.5
    },
    queryParams: {
      page: '1',
      limit: '10',
      sort: 'createdAt:desc'
    },
    environment: environments[Math.floor(Math.random() * environments.length)]
  };
}

// 生成随机响应数据
export function generateRandomResponse(request?: TestRequest): TestHistory {
  const statusCodes = [200, 201, 400, 401, 403, 404, 500];
  const status = statusCodes[Math.floor(Math.random() * statusCodes.length)];
  const success = status >= 200 && status < 300;
  
  return {
    id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requestId: request?.id || `req-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    response: {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': `${Math.floor(Math.random() * 500)}ms`,
        'X-Powered-By': '皓月量化引擎'
      },
      body: success ? {
        success: true,
        data: {
          id: Math.random().toString(36).substr(2, 9),
          name: `Test Response ${Math.floor(Math.random() * 100)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: Array(Math.floor(Math.random() * 5) + 1).fill(0).map(() => ({
            id: Math.random().toString(36).substr(2, 7),
            value: Math.floor(Math.random() * 1000)
          }))
        },
        message: '请求成功'
      } : {
        success: false,
        error: {
          code: status,
          message: getErrorMessage(status),
          details: `Error details for status code ${status}`
        }
      },
      time: Math.floor(Math.random() * 500) + 50
    },
    success
  };
}

// 获取错误消息
export function getErrorMessage(statusCode: number): string {
  const errorMessages: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请登录',
    403: '拒绝访问',
    404: '请求的资源不存在',
    500: '服务器内部错误'
  };
  
  return errorMessages[statusCode] || '未知错误';
}

// 示例测试请求数据
export const sampleTestRequests: TestRequest[] = [
  {
    id: 'req-001',
    url: '/api/stocks',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    queryParams: {
      page: '1',
      limit: '20',
      industry: '金融'
    },
    environment: '测试环境'
  },
  {
    id: 'req-002',
    url: '/api/analysis',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token-123'
    },
    body: {
      stockCode: '600519',
      analysisType: 'AI量化分析',
      parameters: {
        timeRange: '30d',
        indicators: ['MACD', 'RSI', 'KDJ']
      }
    },
    environment: '开发环境'
  },
  {
    id: 'req-003',
    url: '/api/users/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer user-token-456'
    },
    body: {
      username: 'testuser',
      email: 'test@example.com',
      preferences: {
        theme: 'dark',
        notifications: true
      }
    },
    environment: '生产环境'
  }
];

// 示例测试历史记录
export const sampleTestHistory: TestHistory[] = [
  {
    id: 'hist-001',
    requestId: 'req-001',
    timestamp: '2024-01-14T14:30:00Z',
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': '120ms'
      },
      body: {
        success: true,
        data: {
          total: 156,
          page: 1,
          limit: 20,
          items: Array(5).fill(0).map((_, i) => ({
            code: `60000${i + 1}`,
            name: `测试股票${i + 1}`,
            price: (10 + Math.random() * 90).toFixed(2),
            change: (Math.random() * 10 - 5).toFixed(2)
          }))
        }
      },
      time: 120
    },
    success: true
  },
  {
    id: 'hist-002',
    requestId: 'req-002',
    timestamp: '2024-01-14T13:15:00Z',
    response: {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': '50ms'
      },
      body: {
        success: false,
        error: {
          code: 401,
          message: '未授权，请登录'
        }
      },
      time: 50
    },
    success: false
  }
];

// 示例环境配置
export const sampleEnvironments: Environment[] = [
  {
    id: 'env-dev',
    name: '开发环境',
    baseUrl: 'http://localhost:3000/api',
    variables: {
      'API_KEY': 'dev-api-key-123',
      'DEBUG_MODE': 'true'
    }
  },
  {
    id: 'env-test',
    name: '测试环境',
    baseUrl: 'https://test-api.haoyue.com/api',
    variables: {
      'API_KEY': 'test-api-key-456',
      'DEBUG_MODE': 'false'
    }
  },
  {
    id: 'env-prod',
    name: '生产环境',
    baseUrl: 'https://api.haoyue.com/api',
    variables: {
      'API_KEY': 'prod-api-key-789',
      'DEBUG_MODE': 'false'
    }
  }
];