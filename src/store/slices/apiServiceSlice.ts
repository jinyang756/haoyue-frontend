// 重新导入以避免可能的重复声明
import { createSlice as reduxCreateSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getApiEndpoints,
  getApiMonitoringData,
  getApiStats,
  getApiPermissions,
  createApiEndpoint,
  updateApiEndpoint,
  deleteApiEndpoint,
  updateApiPermissions
} from '@/services/apiService';
import type {
  ApiEndpoint,
  ApiMonitoringData,
  ApiStats,
  ApiPermission,
  ApiQueryParams
} from '@/services/apiService';
import { RootState } from '@/store';

// 定义API服务状态接口
interface ApiServiceState {
  endpoints: { 
    data: ApiEndpoint[];
    loading: boolean;
    error: string | null;
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
  monitoring: {
    data: ApiMonitoringData[];
    loading: boolean;
    error: string | null;
  };
  stats: {
    data: ApiStats | null;
    loading: boolean;
    error: string | null;
  };
  permissions: {
    data: ApiPermission[];
    loading: boolean;
    error: string | null;
  };
  filters: ApiQueryParams;
}

// 初始状态
const initialState: ApiServiceState = {
  endpoints: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    }
  },
  monitoring: {
    data: [],
    loading: false,
    error: null
  },
  stats: {
    data: null,
    loading: false,
    error: null
  },
  permissions: {
    data: [],
    loading: false,
    error: null
  },
  filters: {
    page: 1,
    pageSize: 10
  }
};

// 异步Thunks

// 获取API端点列表
export const fetchApiEndpoints = createAsyncThunk(
  'apiService/fetchApiEndpoints',
  async (params?: ApiQueryParams) => {
    const response = await getApiEndpoints(params);
    return response;
  }
);

// 获取API监控数据
export const fetchApiMonitoringData = createAsyncThunk(
  'apiService/fetchApiMonitoringData',
  async (params?: {
    startDate?: string;
    endDate?: string;
    endpoint?: string;
    statusCode?: number;
    limit?: number;
  }) => {
    const response = await getApiMonitoringData(params);
    return response;
  }
);

// 获取API统计数据
export const fetchApiStats = createAsyncThunk(
  'apiService/fetchApiStats',
  async (params?: {
    timeRange?: 'day' | 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await getApiStats(params);
    return response;
  }
);

// 获取API权限设置
export const fetchApiPermissions = createAsyncThunk(
  'apiService/fetchApiPermissions',
  async () => {
    const response = await getApiPermissions();
    return response;
  }
);

// 创建API端点
export const addApiEndpoint = createAsyncThunk(
  'apiService/addApiEndpoint',
  async (endpoint: Omit<ApiEndpoint, 'id' | 'lastUpdated'>) => {
    const response = await createApiEndpoint(endpoint);
    return response;
  }
);

// 更新API端点
export const editApiEndpoint = createAsyncThunk(
  'apiService/editApiEndpoint',
  async ({ id, data }: { id: string; data: Partial<ApiEndpoint> }) => {
    const response = await updateApiEndpoint(id, data);
    return response;
  }
);

// 删除API端点
export const removeApiEndpoint = createAsyncThunk(
  'apiService/removeApiEndpoint',
  async (id: string) => {
    await deleteApiEndpoint(id);
    return id;
  }
);

// 更新API权限设置
export const saveApiPermissions = createAsyncThunk(
  'apiService/saveApiPermissions',
  async (permissions: ApiPermission[]) => {
    await updateApiPermissions(permissions);
    return permissions;
  }
);

// 创建slice
const apiServiceSlice = reduxCreateSlice({
  name: 'apiService',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ApiQueryParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        pageSize: 10
      };
    },
    // 更新分页信息
    updatePagination: (state, action: PayloadAction<Partial<ApiServiceState['endpoints']['pagination']>>) => {
      state.endpoints.pagination = { ...state.endpoints.pagination, ...action.payload };
    },
    // 清除所有状态
    clearAll: (state) => {
      state.endpoints.data = [];
      state.monitoring.data = [];
      state.stats.data = null;
      state.permissions.data = [];
      state.endpoints.error = null;
      state.monitoring.error = null;
      state.stats.error = null;
      state.permissions.error = null;
    }
  },
  extraReducers: (builder) => {
    // 处理fetchApiEndpoints
    builder.addCase(fetchApiEndpoints.pending, (state) => {
      state.endpoints.loading = true;
      state.endpoints.error = null;
    });
    builder.addCase(fetchApiEndpoints.fulfilled, (state, action) => {
      state.endpoints.loading = false;
      state.endpoints.data = action.payload.data || [];
      state.endpoints.pagination = action.payload.pagination || {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      };
    });
    builder.addCase(fetchApiEndpoints.rejected, (state, action) => {
      state.endpoints.loading = false;
      state.endpoints.error = action.error.message || '获取API端点失败';
    });

    // 处理fetchApiMonitoringData
    builder.addCase(fetchApiMonitoringData.pending, (state) => {
      state.monitoring.loading = true;
      state.monitoring.error = null;
    });
    builder.addCase(fetchApiMonitoringData.fulfilled, (state, action) => {
      state.monitoring.loading = false;
      state.monitoring.data = action.payload || [];
    });
    builder.addCase(fetchApiMonitoringData.rejected, (state, action) => {
      state.monitoring.loading = false;
      state.monitoring.error = action.error.message || '获取API监控数据失败';
    });

    // 处理fetchApiStats
    builder.addCase(fetchApiStats.pending, (state) => {
      state.stats.loading = true;
      state.stats.error = null;
    });
    builder.addCase(fetchApiStats.fulfilled, (state, action) => {
      state.stats.loading = false;
      state.stats.data = action.payload;
    });
    builder.addCase(fetchApiStats.rejected, (state, action) => {
      state.stats.loading = false;
      state.stats.error = action.error.message || '获取API统计数据失败';
    });

    // 处理fetchApiPermissions
    builder.addCase(fetchApiPermissions.pending, (state) => {
      state.permissions.loading = true;
      state.permissions.error = null;
    });
    builder.addCase(fetchApiPermissions.fulfilled, (state, action) => {
      state.permissions.loading = false;
      state.permissions.data = action.payload || [];
    });
    builder.addCase(fetchApiPermissions.rejected, (state, action) => {
      state.permissions.loading = false;
      state.permissions.error = action.error.message || '获取API权限设置失败';
    });

    // 处理addApiEndpoint
    builder.addCase(addApiEndpoint.pending, (state) => {
      state.endpoints.loading = true;
      state.endpoints.error = null;
    });
    builder.addCase(addApiEndpoint.fulfilled, (state, action) => {
      state.endpoints.loading = false;
      state.endpoints.data.push(action.payload);
      state.endpoints.pagination.total += 1;
    });
    builder.addCase(addApiEndpoint.rejected, (state, action) => {
      state.endpoints.loading = false;
      state.endpoints.error = action.error.message || '创建API端点失败';
    });

    // 处理editApiEndpoint
    builder.addCase(editApiEndpoint.pending, (state) => {
      state.endpoints.loading = true;
      state.endpoints.error = null;
    });
    builder.addCase(editApiEndpoint.fulfilled, (state, action) => {
      state.endpoints.loading = false;
      const index = state.endpoints.data.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.endpoints.data[index] = action.payload;
      }
    });
    builder.addCase(editApiEndpoint.rejected, (state, action) => {
      state.endpoints.loading = false;
      state.endpoints.error = action.error.message || '更新API端点失败';
    });

    // 处理removeApiEndpoint
    builder.addCase(removeApiEndpoint.pending, (state) => {
      state.endpoints.loading = true;
      state.endpoints.error = null;
    });
    builder.addCase(removeApiEndpoint.fulfilled, (state, action) => {
      state.endpoints.loading = false;
      state.endpoints.data = state.endpoints.data.filter(item => item.id !== action.payload);
      state.endpoints.pagination.total -= 1;
    });
    builder.addCase(removeApiEndpoint.rejected, (state, action) => {
      state.endpoints.loading = false;
      state.endpoints.error = action.error.message || '删除API端点失败';
    });

    // 处理saveApiPermissions
    builder.addCase(saveApiPermissions.pending, (state) => {
      state.permissions.loading = true;
      state.permissions.error = null;
    });
    builder.addCase(saveApiPermissions.fulfilled, (state, action) => {
      state.permissions.loading = false;
      state.permissions.data = action.payload;
    });
    builder.addCase(saveApiPermissions.rejected, (state, action) => {
      state.permissions.loading = false;
      state.permissions.error = action.error.message || '保存API权限设置失败';
    });
  }
});

// 导出actions
export const { setFilters, resetFilters, clearAll } = apiServiceSlice.actions;

// 导出selectors
export const selectApiService = (state: RootState) => state.apiService;
export const selectApiEndpoints = (state: RootState) => state.apiService.endpoints;
export const selectApiMonitoring = (state: RootState) => state.apiService.monitoring;
export const selectApiStats = (state: RootState) => state.apiService.stats;
export const selectApiPermissions = (state: RootState) => state.apiService.permissions;
export const selectApiFilters = (state: RootState) => state.apiService.filters;

// 导出reducer
export default apiServiceSlice.reducer;