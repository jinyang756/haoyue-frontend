// API接口数据模型
export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  category: string;
  isPublic: boolean;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  examples?: ApiExample[];
  status: 'active' | 'deprecated' | 'development';
  lastUpdated: string;
  responseTime?: number; // 毫秒
}

// API示例数据
export interface ApiExample {
  id: string;
  name: string;
  requestData?: Record<string, any>;
  responseData?: Record<string, any>;
  description?: string;
}

// API监控数据模型
export interface ApiMonitoringData {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  requestSize: number;
  responseSize: number;
  error?: string;
  userAgent?: string;
}

// API统计数据模型
export interface ApiStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  endpoints: { [key: string]: ApiEndpointStats };
  timeRange: { start: string; end: string };
}

export interface ApiEndpointStats {
  requests: number;
  successRate: number;
  avgResponseTime: number;
  errors: number;
}

// API权限数据模型
export interface ApiPermission {
  endpointId: string;
  roles: string[];
  rateLimits?: {
    limit: number;
    period: string; // e.g., '1m', '1h', '1d'
  };
}

// API查询参数
export interface ApiQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  status?: 'active' | 'deprecated' | 'development';
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  isPublic?: boolean;
}

// API响应格式
export interface ApiResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// API测试结果
export interface ApiTestResult {
  success: boolean;
  statusCode: number;
  responseTime: number;
  response: any;
  request: any;
  error?: string;
}

// API文档导出配置
export interface ApiExportConfig {
  format: 'swagger' | 'openapi' | 'markdown';
  version?: string;
  title?: string;
  description?: string;
  includeExamples?: boolean;
  includeDeprecated?: boolean;
}

// API变更历史
export interface ApiChangeHistory {
  id: string;
  timestamp: string;
  user: string;
  changes: Record<string, { oldValue: any; newValue: any }>;
  comment?: string;
}

// API验证结果
export interface ApiValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}