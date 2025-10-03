import type { 
  ApiEndpoint,
  ApiStats,
  ApiEndpointStats,
  ApiMonitoringData,
  ApiPermission,
  ApiChangeHistory,
  ApiExample,
  ApiValidationResult
} from '../models/Api';

// 生成随机ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// 生成随机日期
export const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 生成随机响应时间 (10-500ms)
export const generateRandomResponseTime = (): number => {
  return Math.floor(Math.random() * 490) + 10;
};

// 生成随机成功率 (80-100%)
export const generateRandomSuccessRate = (): number => {
  return Number((80 + Math.random() * 20).toFixed(1));
};

// 生成随机请求数
export const generateRandomRequests = (min: number = 100, max: number = 10000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成API端点模拟数据
export const generateMockApiEndpoints = (count: number = 10): ApiEndpoint[] => {
  const methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'> = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const categories = ['认证', '股票数据', 'AI分析', '推荐', '管理', '用户', '系统', '通知'];
  const statuses: Array<'active' | 'deprecated' | 'development'> = ['active', 'deprecated', 'development'];
  const paths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/me',
    '/api/stocks',
    '/api/stocks/{id}',
    '/api/analysis',
    '/api/analysis/{id}',
    '/api/recommendations',
    '/api/users',
    '/api/users/{id}',
    '/api/admin/users',
    '/api/admin/settings',
    '/api/system/health',
    '/api/notifications',
    '/api/preferences'
  ];
  
  const descriptions = [
    '用户登录接口',
    '用户注册接口',
    '获取当前用户信息',
    '获取股票列表',
    '获取单个股票详情',
    '创建AI分析任务',
    '获取AI分析结果',
    '获取股票推荐',
    '获取用户列表',
    '获取单个用户详情',
    '管理员获取用户列表',
    '系统设置管理',
    '系统健康检查',
    '通知管理',
    '用户偏好设置'
  ];
  
  return Array.from({ length: count }, (_, index) => {
    const pathIndex = index % paths.length;
    return {
      id: generateId(),
      path: paths[pathIndex],
      method: methods[Math.floor(Math.random() * methods.length)],
      description: descriptions[pathIndex],
      category: categories[Math.floor(Math.random() * categories.length)],
      isPublic: Math.random() > 0.7, // 30%的概率是公开接口
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: generateRandomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      responseTime: generateRandomResponseTime()
    };
  });
};

// 生成API统计数据
export const generateMockApiStats = (endpoints: ApiEndpoint[]): ApiStats => {
  const totalRequests = generateRandomRequests(10000, 50000);
  const successRate = generateRandomSuccessRate();
  const successfulRequests = Math.floor(totalRequests * (successRate / 100));
  const failedRequests = totalRequests - successfulRequests;
  
  const endpointStats: Record<string, ApiEndpointStats> = {};
  
  endpoints.forEach(endpoint => {
    const requests = generateRandomRequests(100, 10000);
    const endpointSuccessRate = generateRandomSuccessRate();
    endpointStats[endpoint.path] = {
      requests,
      successRate: endpointSuccessRate,
      avgResponseTime: endpoint.responseTime || generateRandomResponseTime(),
      errors: Math.floor(requests * ((100 - endpointSuccessRate) / 100))
    };
  });
  
  // 计算平均响应时间
  const totalResponseTime = Object.values(endpointStats).reduce((sum, stats) => 
    sum + stats.avgResponseTime * stats.requests,
    0
  );
  const averageResponseTime = Math.floor(totalResponseTime / totalRequests);
  
  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    averageResponseTime,
    endpoints: endpointStats,
    timeRange: {
      start: new Date(2024, 0, 1).toISOString(),
      end: new Date().toISOString()
    }
  };
};

// 生成API监控数据
export const generateMockApiMonitoringData = (count: number = 50): ApiMonitoringData[] => {
  const endpoints = generateMockApiEndpoints(10);
  const statusCodes = [200, 201, 400, 401, 403, 404, 500, 502, 503];
  
  return Array.from({ length: count }, () => {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const responseTime = generateRandomResponseTime();
    const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    const timestamp = generateRandomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());
    
    return {
      id: generateId(),
      endpoint: endpoint.path,
      method: endpoint.method,
      timestamp: timestamp.toISOString(),
      statusCode,
      responseTime,
      requestSize: Math.floor(Math.random() * 10000) + 100,
      responseSize: Math.floor(Math.random() * 100000) + 1000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
      ipAddress: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// 生成API权限数据
export const generateMockApiPermissions = (endpoints: ApiEndpoint[]): ApiPermission[] => {
  const roles = ['admin', 'user', 'analyst', 'guest', 'premium'];
  
  return endpoints.map(endpoint => ({
    id: generateId(),
    endpointId: endpoint.id,
    roles: roles.filter(() => Math.random() > 0.5), // 随机选择一些角色
    isPublic: endpoint.isPublic,
    rateLimit: Math.floor(Math.random() * 1000) + 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

// 生成API变更历史
export const generateMockApiHistory = (count: number = 20): ApiChangeHistory[] => {
  const endpoints = generateMockApiEndpoints(10);
  const users = ['admin', 'developer1', 'developer2', 'qa1', 'system'];
  const changeFields = ['description', 'category', 'isPublic', 'status', 'responseTime'];
  
  return Array.from({ length: count }, () => {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const timestamp = generateRandomDate(new Date(2024, 0, 1), new Date());
    const changedField = changeFields[Math.floor(Math.random() * changeFields.length)];
    
    let oldValue: any;
    let newValue: any;
    let comment = '';
    
    switch (changedField) {
      case 'description':
        oldValue = endpoint.description;
        newValue = `${oldValue} (更新于 ${new Date().toLocaleDateString()})`;
        comment = '更新了API描述';
        break;
      case 'category':
        oldValue = endpoint.category;
        newValue = Math.random() > 0.5 ? '用户管理' : '数据分析';
        comment = '调整了API分类';
        break;
      case 'isPublic':
        oldValue = endpoint.isPublic;
        newValue = !oldValue;
        comment = newValue ? '将API设为公开' : '将API设为私有';
        break;
      case 'status':
        oldValue = endpoint.status;
        const statuses: ('active' | 'deprecated' | 'development')[] = ['active', 'deprecated', 'development'];
        newValue = statuses[Math.floor(Math.random() * statuses.length)];
        comment = `状态从${oldValue}变更为${newValue}`;
        break;
      case 'responseTime':
        oldValue = endpoint.responseTime || 100;
        newValue = Math.floor(Math.random() * 300) + 50;
        comment = '优化了响应时间';
        break;
      default:
        oldValue = '原值';
        newValue = '新值';
        comment = '更新了API属性';
    }
    
    const changes: Record<string, { oldValue: any; newValue: any }> = {};
    changes[changedField] = { oldValue, newValue };
    
    return {
      id: generateId(),
      timestamp: timestamp.toISOString(),
      user: users[Math.floor(Math.random() * users.length)],
      changes,
      comment
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// 生成API示例
export const generateMockApiExamples = (endpoints: ApiEndpoint[]): ApiExample[] => {
  return endpoints.map(endpoint => ({
    id: generateId(),
    name: `${endpoint.method} ${endpoint.path} 示例`,
    description: `这是 ${endpoint.path} 接口的使用示例`,
    requestData: endpoint.method === 'GET' ? undefined : {
      "example": "这是请求体示例"
    },
    responseData: {
      "status": "success",
      "data": "这是响应体示例"
    }
  }));
};

// 生成API验证结果
export const generateMockValidationResult = (isValid: boolean = true): ApiValidationResult => {
  if (isValid) {
    return {
      isValid: true
    };
  }
  
  const errorTypes = [
    '参数格式错误',
    '缺少必需参数',
    '参数值超出范围',
    '数据类型不匹配',
    '参数验证失败'
  ];
  
  const errors = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
    errorTypes[Math.floor(Math.random() * errorTypes.length)]
  );
  
  return {
    isValid: false,
    errors
  };
};