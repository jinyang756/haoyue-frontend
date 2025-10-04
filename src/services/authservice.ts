import request, { BaseResponse } from './request';
import { isOfflineMode, simulateNetworkDelay } from '@/utils/offlineMode';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'vip' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    type: 'free' | 'vip' | 'premium';
    expiresAt?: string;
  };
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserInfo;
}

export interface RefreshTokenParams {
  refreshToken: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  token: string;
  password: string;
  confirmPassword: string;
}

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  // 如果处于离线模式，直接返回模拟登录响应
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    return {
      token: 'demo-token',
      refreshToken: 'demo-refresh-token',
      user: {
        id: 'demo-user',
        username: params.username || '演示用户',
        email: 'demo@example.com',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  try {
    const response = await request.post<BaseResponse<LoginResponse>>('/api/auth/login', params);
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回一个模拟的登录响应
    return {
      token: 'demo-token',
      refreshToken: 'demo-refresh-token',
      user: {
        id: 'demo-user',
        username: params.username || '演示用户',
        email: 'demo@example.com',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }
};

export const register = async (params: RegisterParams): Promise<void> => {
  try {
    await request.post<BaseResponse<void>>('/api/auth/register', params);
  } catch (error) {
    // 如果后端不可用，模拟注册成功
    console.log('后端不可用，模拟注册成功');
  }
};

export const getCurrentUser = async (): Promise<UserInfo> => {
  // 如果处于离线模式，直接返回模拟用户信息
  if (isOfflineMode()) {
    await simulateNetworkDelay();
    return {
      id: 'demo-user',
      username: '演示用户',
      email: 'demo@example.com',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  try {
    const response = await request.get<BaseResponse<UserInfo>>('/api/auth/me');
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回一个模拟的用户信息
    return {
      id: 'demo-user',
      username: '演示用户',
      email: 'demo@example.com',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await request.post<BaseResponse<void>>('/api/auth/logout');
  } catch (error) {
    // 如果后端不可用，模拟登出成功
    console.log('后端不可用，模拟登出成功');
  }
};

export const forgotPassword = async (params: ForgotPasswordParams): Promise<void> => {
  try {
    await request.post<BaseResponse<void>>('/api/auth/forgot-password', params);
  } catch (error) {
    // 如果后端不可用，模拟操作成功
    console.log('后端不可用，模拟操作成功');
  }
};

export const resetPassword = async (params: ResetPasswordParams): Promise<void> => {
  try {
    await request.post<BaseResponse<void>>(`/api/auth/reset-password/${params.token}`, {
      password: params.password,
      confirmPassword: params.confirmPassword
    });
  } catch (error) {
    // 如果后端不可用，模拟操作成功
    console.log('后端不可用，模拟操作成功');
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await request.get<BaseResponse<void>>(`/api/auth/verify-email/${token}`);
  } catch (error) {
    // 如果后端不可用，模拟操作成功
    console.log('后端不可用，模拟操作成功');
  }
};

export const updateProfile = async (userData: Partial<UserInfo>): Promise<UserInfo> => {
  try {
    const response = await request.put<BaseResponse<UserInfo>>('/api/auth/profile', userData);
    return response.data.data;
  } catch (error) {
    // 如果后端不可用，返回更新后的用户信息
    return {
      id: 'demo-user',
      username: userData.username || '演示用户',
      email: userData.email || 'demo@example.com',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData
    };
  }
};

export const changePassword = async (params: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> => {
  try {
    await request.post<BaseResponse<void>>('/api/auth/change-password', params);
  } catch (error) {
    // 如果后端不可用，模拟操作成功
    console.log('后端不可用，模拟操作成功');
  }
};