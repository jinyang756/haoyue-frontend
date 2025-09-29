import request, { BaseResponse } from './request';

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
  const response = await request.post<BaseResponse<LoginResponse>>('/api/auth/login', params);
  return response;
};

export const register = async (params: RegisterParams): Promise<void> => {
  await request.post<BaseResponse<void>>('/api/auth/register', params);
};

export const getCurrentUser = async (): Promise<UserInfo> => {
  const response = await request.get<BaseResponse<UserInfo>>('/api/auth/me');
  return response;
};

export const logout = async (): Promise<void> => {
  await request.post<BaseResponse<void>>('/api/auth/logout');
};

export const forgotPassword = async (params: ForgotPasswordParams): Promise<void> => {
  await request.post<BaseResponse<void>>('/api/auth/forgot-password', params);
};

export const resetPassword = async (params: ResetPasswordParams): Promise<void> => {
  await request.post<BaseResponse<void>>(`/api/auth/reset-password/${params.token}`, {
    password: params.password,
    confirmPassword: params.confirmPassword
  });
};

export const verifyEmail = async (token: string): Promise<void> => {
  await request.get<BaseResponse<void>>(`/api/auth/verify-email/${token}`);
};

export const updateProfile = async (userData: Partial<UserInfo>): Promise<UserInfo> => {
  const response = await request.put<BaseResponse<UserInfo>>('/api/auth/profile', userData);
  return response;
};

export const changePassword = async (params: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> => {
  await request.post<BaseResponse<void>>('/api/auth/change-password', params);
};