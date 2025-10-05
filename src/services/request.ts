import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { clearAuthInfo, getToken } from '@/utils/auth';
import { message, notification } from 'antd';

export interface BaseResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 获取访问令牌的辅助函数
const getAccessToken = (): string | null => {
  return getToken();
};

request.interceptors.request.use(
  (config: any) => {
    // 跳过认证的API（如认证API本身）
    if (config.url?.includes('/api/auth/')) {
      return config;
    }
    
    // 获取访问令牌
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: any) => {
    const res = response.data;
    if (!res.success) {
      message.error(res.message || '操作失败，请重试');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any & { _retry?: boolean };
    
    // 处理401错误（Token过期或无效）
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (originalRequest) {
        originalRequest._retry = true;
      }

      try {
        // 清除过期的认证信息
        clearAuthInfo();
        
        // 跳转到登录页面
        window.location.href = '/login';
        return Promise.reject(new Error('Token已过期，请重新登录'));
      } catch (refreshError) {
        clearAuthInfo();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 处理网络错误（后端不可用）
    if (!error.response) {
      // 网络错误，后端可能不可用
      message.warning('无法连接到服务器，部分功能可能受限');
      // 返回一个模拟的响应，以便前端可以继续运行
      return Promise.resolve({
        data: {
          success: true,
          data: null,
          message: '模拟响应'
        }
      });
    }

    const errorMsg = error.response?.data?.message || '网络错误，请稍后重试';
    if (error.response?.status === 403) {
      notification.error({
        message: '权限不足',
        description: '您没有访问该功能的权限'
      });
    } else {
      message.error(errorMsg);
    }
    
    // 返回一个模拟的响应，以便前端可以继续运行
    return Promise.resolve({
      data: {
        success: false,
        data: null,
        message: errorMsg
      }
    });
  }
);

export default request;