import request, { BaseResponse } from './request';
import { 
  ApiEndpoint,
  ApiExample,
  ApiMonitoringData,
  ApiStats,
  ApiEndpointStats,
  ApiPermission,
  ApiQueryParams,
  ApiResponse,
  ApiTestResult,
  ApiExportConfig,
  ApiChangeHistory,
  ApiValidationResult
} from '../models/Api';
import { 
  generateMockApiEndpoints, 
  generateMockApiMonitoringData, 
  generateMockApiStats, 
  generateMockApiPermissions,
  generateMockApiHistory
} from './mockData';

// 导入BaseResponse接口
export type { BaseResponse } from './request';

// 获取所有API接口
export const getApiEndpoints = async (params?: ApiQueryParams): Promise<ApiResponse<ApiEndpoint>> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const search = params?.search || '';
  const category = params?.category || '';
  const status = params?.status || '';
  
  // 生成模拟数据
  const allEndpoints = generateMockApiEndpoints(30);
  
  // 应用过滤条件
  const filteredEndpoints = allEndpoints.filter(endpoint => {
    const matchesSearch = search === '' || 
      endpoint.path.toLowerCase().includes(search.toLowerCase()) || 
      endpoint.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === '' || endpoint.category === category;
    const matchesStatus = status === '' || endpoint.status === status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // 计算分页
  const total = filteredEndpoints.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEndpoints = filteredEndpoints.slice(startIndex, endIndex);
  
  return {
    data: paginatedEndpoints,
    pagination: {
      page,
      pageSize,
      total,
      totalPages
    }
  };
};

// 获取单个API接口详情
export const getApiEndpointById = async (id: string): Promise<ApiEndpoint> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // 生成模拟数据
  const allEndpoints = generateMockApiEndpoints(30);
  const endpoint = allEndpoints.find(e => e.id === id);
  
  if (!endpoint) {
    throw new Error('API endpoint not found');
  }
  
  return endpoint;
};

// 创建API接口
export const createApiEndpoint = async (data: Omit<ApiEndpoint, 'id' | 'lastUpdated'>): Promise<ApiEndpoint> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 创建新的API端点
  const newEndpoint: ApiEndpoint = {
    ...data,
    id: `api-${Date.now()}`,
    lastUpdated: new Date().toISOString()
  };
  
  return newEndpoint;
};

// 更新API接口
export const updateApiEndpoint = async (id: string, data: Partial<ApiEndpoint>): Promise<ApiEndpoint> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 先获取当前端点
  const endpoint = await getApiEndpointById(id);
  
  // 更新端点
  const updatedEndpoint: ApiEndpoint = {
    ...endpoint,
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  return updatedEndpoint;
};

// 删除API接口
export const deleteApiEndpoint = async (id: string): Promise<void> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 在实际环境中，这里会发送请求到后端删除接口
  console.log('Deleted endpoint with id:', id);
};

// 获取API监控数据
export const getApiMonitoringData = async (params?: {
  startDate?: string;
  endDate?: string;
  endpoint?: string;
  statusCode?: number;
  limit?: number;
}): Promise<ApiMonitoringData[]> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 生成模拟监控数据
  const count = params?.endDate ? 100 : 50; // 根据时间范围确定数据量
  return generateMockApiMonitoringData(count);
};

// 获取API统计数据
export const getApiStats = async (params?: {
  timeRange?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}): Promise<ApiStats> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const timeRange = params?.timeRange || 'day';
  
  // 生成模拟统计数据
  const apiResponse = await getApiEndpoints();
  return generateMockApiStats(apiResponse.data);
};

// 获取API权限设置
export const getApiPermissions = async (): Promise<ApiPermission[]> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 生成模拟权限数据
  const apiResponse = await getApiEndpoints();
  return generateMockApiPermissions(apiResponse.data);
};

// 更新API权限设置
export const updateApiPermissions = async (permissions: ApiPermission[]): Promise<void> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // 在实际环境中，这里会发送请求到后端更新权限
  console.log('Updated permissions:', permissions);
};

// 执行API测试调用
export const testApiEndpoint = async (endpointId: string, method: string, data?: any): Promise<any> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟测试结果
  return {
    code: 200,
    message: '测试成功',
    data: {
      statusCode: 200,
      responseTime: 150,
      response: {
        success: true,
        message: '模拟API响应'
      }
    }
  };
};

// 导出API文档
export const exportApiDocumentation = async (format: 'swagger' | 'openapi' | 'markdown'): Promise<BaseResponse<{ url: string }>> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 模拟导出结果
  return {
    success: true,
    code: 200,
    message: '导出成功',
    data: {
      url: `/api-docs/export/${format}/${Date.now()}`
    }
  };
};

// 导入API文档
export const importApiDocumentation = async (file: File): Promise<BaseResponse<{ imported: number }>> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟导入结果
  return {
    success: true,
    code: 200,
    message: '导入成功',
    data: {
      imported: Math.floor(Math.random() * 10) + 1 // 随机导入1-10个API
    }
  };
};

// 验证API请求数据
export const validateApiRequest = async (endpointId: string, data: any): Promise<BaseResponse<ApiValidationResult>> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // 模拟验证结果
  return {
    success: true,
    code: 200,
    message: '验证成功',
    data: {
      isValid: true,
      errors: [],
      warnings: []
    }
  };
};

// 导入API变更历史
export const getApiHistory = async (endpointId: string): Promise<BaseResponse<ApiChangeHistory[]>> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // 生成符合ApiChangeHistory接口的历史记录
  const mockHistory = generateMockApiHistory(5);
  
  return {
    success: true,
    code: 200,
    message: '获取历史记录成功',
    data: mockHistory
  };
};

// 重新导出API模型类型，保持向后兼容性
export type {
  ApiEndpoint,
  ApiExample,
  ApiMonitoringData,
  ApiStats,
  ApiPermission,
  ApiQueryParams,
  ApiResponse,
  ApiTestResult,
  ApiExportConfig,
  ApiChangeHistory,
  ApiValidationResult
};