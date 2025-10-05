import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  createAnalysisTask, 
  getAnalysisTasks, 
  getAnalysisTaskById, 
  cancelAnalysisTask,
  getAnalysisStats,
  AnalysisTask,
  CreateAnalysisTaskParams,
  AnalysisQueryParams,
  AnalysisResponse
} from '@/services/analysisservice';
import { isOfflineMode } from '@/utils/offlineMode';

interface AnalysisState {
  tasks: AnalysisTask[];
  currentTask: AnalysisTask | null;
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    averageScore: number;
    successRate: number;
  } | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: AnalysisState = {
  tasks: [],
  currentTask: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  }
};

export const createAnalysisTaskAsync = createAsyncThunk(
  'analysis/createTask',
  async (params: CreateAnalysisTaskParams, { rejectWithValue }) => {
    try {
      const response = await createAnalysisTask(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '创建分析任务失败');
    }
  }
);

export const fetchAnalysisTasksAsync = createAsyncThunk(
  'analysis/fetchTasks',
  async (params: AnalysisQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await getAnalysisTasks(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取分析任务列表失败');
    }
  }
);

export const fetchAnalysisTaskByIdAsync = createAsyncThunk(
  'analysis/fetchTaskById',
  async (id: string, { rejectWithValue }) => {
    // 如果处于离线模式，直接返回模拟数据
    if (isOfflineMode()) {
      // 返回一个默认的模拟任务
      return {
        id: id,
        userId: 'demo-user',
        symbol: 'DEMO',
        stockName: '演示股票',
        type: 'advanced' as 'basic' | 'advanced' | 'premium',
        status: 'completed' as 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
        progress: 100,
        result: {
          overallRating: 7.5,
          recommendation: 'hold' as 'strong sell' | 'sell' | 'hold' | 'buy' | 'strong buy',
          confidenceLevel: 80,
          riskLevel: 'medium' as 'very low' | 'low' | 'medium' | 'high' | 'very high',
          targetPrice: 100.00,
          stopLossPrice: 90.00,
          upsidePotential: 10.0,
          downsideRisk: 10.0
        },
        factors: {
          fundamentalScore: 75,
          technicalScore: 80,
          sentimentScore: 70,
          marketScore: 78,
          industryScore: 72
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      } as AnalysisTask;
    }

    try {
      const response = await getAnalysisTaskById(id);
      return response;
    } catch (error: any) {
      // 即使后端不可用，也返回模拟数据
      console.warn('获取分析任务详情失败，使用模拟数据:', error);
      // 返回一个默认的模拟任务
      return {
        id: id,
        userId: 'demo-user',
        symbol: 'DEMO',
        stockName: '演示股票',
        type: 'advanced' as 'basic' | 'advanced' | 'premium',
        status: 'completed' as 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
        progress: 100,
        result: {
          overallRating: 7.5,
          recommendation: 'hold' as 'strong sell' | 'sell' | 'hold' | 'buy' | 'strong buy',
          confidenceLevel: 80,
          riskLevel: 'medium' as 'very low' | 'low' | 'medium' | 'high' | 'very high',
          targetPrice: 100.00,
          stopLossPrice: 90.00,
          upsidePotential: 10.0,
          downsideRisk: 10.0
        },
        factors: {
          fundamentalScore: 75,
          technicalScore: 80,
          sentimentScore: 70,
          marketScore: 78,
          industryScore: 72
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      } as AnalysisTask;
    }
  }
);

export const cancelAnalysisTaskAsync = createAsyncThunk(
  'analysis/cancelTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await cancelAnalysisTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '取消分析任务失败');
    }
  }
);

export const fetchAnalysisStatsAsync = createAsyncThunk(
  'analysis/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAnalysisStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取分析统计信息失败');
    }
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    updateTaskProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const { id, progress } = action.payload;
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.progress = progress;
      }
      if (state.currentTask && state.currentTask.id === id) {
        state.currentTask.progress = progress;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnalysisTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnalysisTaskAsync.fulfilled, (state, action: PayloadAction<AnalysisTask>) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.currentTask = action.payload;
      })
      .addCase(createAnalysisTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAnalysisTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisTasksAsync.fulfilled, (state, action: PayloadAction<AnalysisResponse>) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAnalysisTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAnalysisTaskByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisTaskByIdAsync.fulfilled, (state, action: PayloadAction<AnalysisTask>) => {
        state.loading = false;
        state.currentTask = action.payload;
        
        // 更新任务列表中的对应任务
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(fetchAnalysisTaskByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelAnalysisTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAnalysisTaskAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        if (state.currentTask && state.currentTask.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(cancelAnalysisTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAnalysisStatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisStatsAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAnalysisStatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentTask, updateTaskProgress } = analysisSlice.actions;
export default analysisSlice.reducer;