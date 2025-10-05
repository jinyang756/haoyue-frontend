import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getStocks, 
  getStockDetail, 
  getStockHistory, 
  getTechnicalIndicators, 
  getAIAnalysis,
  searchStocks,
  Stock,
  StockHistory,
  TechnicalIndicators,
  AIAnalysis,
  StockQueryParams,
  StockResponse
} from '@/services/stockservice';

interface StockState {
  stocks: Stock[];
  currentStock: Stock | null;
  stockHistory: StockHistory[];
  technicalIndicators: TechnicalIndicators | null;
  aiAnalysis: AIAnalysis | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  currentPeriod: 'day' | 'week' | 'month';
  searchResults: Stock[];
}

const initialState: StockState = {
  stocks: [],
  currentStock: null,
  stockHistory: [],
  technicalIndicators: null,
  aiAnalysis: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  },
  currentPeriod: 'day',
  searchResults: []
};

export const fetchStocksAsync = createAsyncThunk(
  'stocks/fetchStocks',
  async (params: StockQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await getStocks(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取股票列表失败');
    }
  }
);

export const fetchStockDetailAsync = createAsyncThunk(
  'stocks/fetchStockDetail',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const response = await getStockDetail(symbol);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取股票详情失败');
    }
  }
);

export const fetchStockHistoryAsync = createAsyncThunk(
  'stocks/fetchStockHistory',
  async (
    { symbol, period = 'day', startDate, endDate }: 
    { symbol: string; period?: 'day' | 'week' | 'month'; startDate?: string; endDate?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await getStockHistory(symbol, period, startDate, endDate);
      return { history: response, period };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取股票历史数据失败');
    }
  }
);

export const fetchTechnicalIndicatorsAsync = createAsyncThunk(
  'stocks/fetchTechnicalIndicators',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const response = await getTechnicalIndicators(symbol);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取技术指标失败');
    }
  }
);

export const fetchAIAnalysisAsync = createAsyncThunk(
  'stocks/fetchAIAnalysis',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const response = await getAIAnalysis(symbol);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取AI分析失败');
    }
  }
);

export const searchStocksAsync = createAsyncThunk(
  'stocks/searchStocks',
  async (params: StockQueryParams, { rejectWithValue }) => {
    try {
      const response = await searchStocks(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '搜索股票失败');
    }
  }
);

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setCurrentPeriod: (state, action: PayloadAction<'day' | 'week' | 'month'>) => {
      state.currentPeriod = action.payload;
    },
    clearCurrentStock: (state) => {
      state.currentStock = null;
      state.stockHistory = [];
      state.technicalIndicators = null;
      state.aiAnalysis = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocksAsync.fulfilled, (state, action: PayloadAction<StockResponse>) => {
        state.loading = false;
        state.stocks = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStocksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStockDetailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockDetailAsync.fulfilled, (state, action: PayloadAction<Stock>) => {
        state.loading = false;
        state.currentStock = action.payload;
      })
      .addCase(fetchStockDetailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStockHistoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockHistoryAsync.fulfilled, (state, action: PayloadAction<{ history: StockHistory[], period: string }>) => {
        state.loading = false;
        state.stockHistory = action.payload.history;
        state.currentPeriod = action.payload.period as 'day' | 'week' | 'month';
      })
      .addCase(fetchStockHistoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTechnicalIndicatorsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechnicalIndicatorsAsync.fulfilled, (state, action: PayloadAction<TechnicalIndicators>) => {
        state.loading = false;
        state.technicalIndicators = action.payload;
      })
      .addCase(fetchTechnicalIndicatorsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAIAnalysisAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIAnalysisAsync.fulfilled, (state, action: PayloadAction<AIAnalysis>) => {
        state.loading = false;
        state.aiAnalysis = action.payload;
      })
      .addCase(fetchAIAnalysisAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchStocksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStocksAsync.fulfilled, (state, action: PayloadAction<StockResponse>) => {
        state.loading = false;
        state.searchResults = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchStocksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setCurrentPeriod, clearCurrentStock, clearSearchResults } = stockSlice.actions;
export default stockSlice.reducer;