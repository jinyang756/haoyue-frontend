// 测试数据生成工具

// API测试请求配置示例
export const sampleTestRequests = [
  {
    id: 'req-001',
    url: 'https://httpbin.org/get',
    method: 'GET' as const,
    headers: {} as Record<string, string>,
    body: '',
    queryParams: {} as Record<string, string>,
    environment: 'default'
  },
  {
    id: 'req-002',
    url: 'https://httpbin.org/post',
    method: 'POST' as const,
    headers: {
      'Content-Type': 'application/json'
    } as Record<string, string>,
    body: JSON.stringify({
      name: 'test',
      value: 123
    }, null, 2),
    queryParams: {
      test: 'true'
    } as Record<string, string>,
    environment: 'default'
  },
  {
    id: 'req-003',
    url: 'https://httpbin.org/headers',
    method: 'GET' as const,
    headers: {
      'X-Custom-Header': 'test-value',
      'Authorization': 'Bearer token123'
    } as Record<string, string>,
    body: '',
    queryParams: {} as Record<string, string>,
    environment: 'default'
  }
];

// API测试响应示例
export const sampleTestResponses = [
  {
    statusCode: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': '1234'
    },
    body: JSON.stringify({
      "args": {},
      "headers": {
        "Accept": "*/*",
        "Host": "httpbin.org",
        "User-Agent": "axios/0.21.1"
      },
      "origin": "1.2.3.4",
      "url": "https://httpbin.org/get"
    }, null, 2),
    responseTime: 150,
    timestamp: new Date().toISOString()
  },
  {
    statusCode: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': '5678'
    },
    body: JSON.stringify({
      "args": {
        "test": "true"
      },
      "data": {
        "name": "test",
        "value": 123
      },
      "files": {},
      "form": {},
      "headers": {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Host": "httpbin.org",
        "User-Agent": "axios/0.21.1"
      },
      "json": {
        "name": "test",
        "value": 123
      },
      "origin": "1.2.3.4",
      "url": "https://httpbin.org/post?test=true"
    }, null, 2),
    responseTime: 220,
    timestamp: new Date().toISOString()
  }
];

// API测试历史记录示例
export const sampleTestHistory = [
  {
    id: 'hist-001',
    request: sampleTestRequests[0],
    response: sampleTestResponses[0],
    success: true
  },
  {
    id: 'hist-002',
    request: sampleTestRequests[1],
    response: sampleTestResponses[1],
    success: true
  }
];

// API环境配置示例
export const sampleEnvironments = [
  {
    id: 'env-001',
    name: '开发环境',
    baseUrl: 'https://dev-api.example.com',
    variables: {
      'API_VERSION': 'v1',
      'CLIENT_ID': 'dev-client-123'
    }
  },
  {
    id: 'env-002',
    name: '测试环境',
    baseUrl: 'https://test-api.example.com',
    variables: {
      'API_VERSION': 'v1',
      'CLIENT_ID': 'test-client-456'
    }
  },
  {
    id: 'env-003',
    name: '生产环境',
    baseUrl: 'https://api.example.com',
    variables: {
      'API_VERSION': 'v1',
      'CLIENT_ID': 'prod-client-789'
    }
  }
];

// 常用Headers模板
export const commonHeaders = [
  {
    name: 'Content-Type',
    values: [
      'application/json',
      'application/xml',
      'text/plain',
      'text/html'
    ]
  },
  {
    name: 'Accept',
    values: [
      'application/json',
      'application/xml',
      'text/plain',
      '*/*'
    ]
  },
  {
    name: 'Authorization',
    values: [
      'Bearer ',
      'Basic ',
      'APIKey '
    ]
  }
];

// 常用HTTP状态码
export const commonStatusCodes = [
  { code: 200, description: 'OK' },
  { code: 201, description: 'Created' },
  { code: 204, description: 'No Content' },
  { code: 400, description: 'Bad Request' },
  { code: 401, description: 'Unauthorized' },
  { code: 403, description: 'Forbidden' },
  { code: 404, description: 'Not Found' },
  { code: 500, description: 'Internal Server Error' },
  { code: 502, description: 'Bad Gateway' },
  { code: 503, description: 'Service Unavailable' }
];

// 测试用的JSON数据模板
export const jsonTemplates = [
  {
    name: '用户信息',
    template: {
      id: 1,
      name: '用户名',
      email: 'user@example.com',
      createdAt: '2023-01-01T00:00:00Z'
    }
  },
  {
    name: '产品信息',
    template: {
      id: 1,
      name: '产品名称',
      price: 99.99,
      category: '分类',
      inStock: true
    }
  },
  {
    name: '订单信息',
    template: {
      id: 1,
      userId: 1,
      items: [
        {
          productId: 1,
          quantity: 2,
          price: 99.99
        }
      ],
      total: 199.98,
      status: 'pending'
    }
  }
];

// 生成随机测试数据的工具函数
export const generateRandomTestData = () => {
  const methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'> = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const urls = [
    'https://api.example.com/users',
    'https://api.example.com/products',
    'https://api.example.com/orders',
    'https://httpbin.org/get',
    'https://httpbin.org/post'
  ];
  
  return {
    id: `req-${Date.now()}`,
    url: urls[Math.floor(Math.random() * urls.length)],
    method: methods[Math.floor(Math.random() * methods.length)],
    headers: {},
    body: '',
    queryParams: {},
    environment: 'default'
  };
};

// 生成随机响应数据的工具函数
export const generateRandomResponse = () => {
  const statusCodes = [200, 201, 400, 401, 404, 500];
  const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
  
  return {
    statusCode,
    statusText: commonStatusCodes.find(s => s.code === statusCode)?.description || 'Unknown',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': String(Math.floor(Math.random() * 10000))
    },
    body: JSON.stringify({
      message: `Sample response for status ${statusCode}`,
      timestamp: new Date().toISOString()
    }, null, 2),
    responseTime: Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString()
  };
};