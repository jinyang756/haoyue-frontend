import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  login, 
  register, 
  getCurrentUser, 
  logout, 
  UserInfo, 
  LoginResponse 
} from '@/services/authservice';
import { 
  setToken, 
  setRefreshToken, 
  setUserInfo, 
  clearAuthInfo 
} from '@/utils/auth';

interface AuthState {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (params: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '登录失败');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (params: { username: string; email: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      await register(params);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '注册失败');
    }
  }
);

export const fetchUserAsync = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取用户信息失败');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      clearAuthInfo();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '登出失败');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        setToken(action.payload.token);
        setRefreshToken(action.payload.refreshToken);
        setUserInfo(action.payload.user);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        setUserInfo(action.payload);
      })
      .addCase(fetchUserAsync.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        clearAuthInfo();
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;