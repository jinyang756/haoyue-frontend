import React from 'react';
import { message, notification } from 'antd';
import { useAuth0 } from '@auth0/auth0-react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { clearAuthInfo } from '@/utils/auth';

// 创建一个可以在非React组件中使用的Auth0上下文
let auth0Context: ReturnType<typeof useAuth0> | null = null;

export const setAuth0Context = (context: ReturnType<typeof useAuth0>) => {
  auth0Context = context;
};

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
const getAccessToken = async (): Promise<string | null> => {
  if (!auth0Context?.isAuthenticated) {
    return null;
  }
  
  try {
    // 在v2版本中，getAccessTokenSilently默认返回string
    // 显式调用并确保返回string类型
    const token = await auth0Context.getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE || ''
    } as any);
    return typeof token === 'string' ? token : null;
  } catch (error) {
    console.error('获取访问令牌失败:', error);
    return null;
  }
};

// 创建一个请求队列，处理并发请求
let tokenRefreshPromise: Promise<string | null> | null = null;

request.interceptors.request.use(
  async (config: any) => {
    // 跳过认证的API（如认证API本身）
    if (config.url?.includes('/api/auth/')) {
      return config;
    }
    
    // 获取访问令牌
    const token = await getAccessToken();
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
    return res.data;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any & { _retry?: boolean };
    
    // 处理401错误（Token过期或无效）
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (tokenRefreshPromise) {
        // 如果已经有一个刷新token的请求在进行中，等待它完成
        const newToken = await tokenRefreshPromise;
        if (newToken && originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return request(originalRequest);
        }
      }

      if (originalRequest) {
        originalRequest._retry = true;
      }

      try {
        // 尝试使用Auth0的静默刷新获取新的访问令牌
        tokenRefreshPromise = getAccessToken();
        const newToken = await tokenRefreshPromise;
        tokenRefreshPromise = null;

        if (newToken && originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return request(originalRequest);
        } else {
          // 如果无法刷新token，重定向到登录页面
          throw new Error('无法刷新访问令牌');
        }
      } catch (refreshError) {
        tokenRefreshPromise = null;
        clearAuthInfo();
        
        // 跳转到登录页面
        if (auth0Context?.loginWithRedirect) {
          auth0Context.loginWithRedirect({
            appState: {
              returnTo: window.location.pathname
            }
          });
        } else {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
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
    
    return Promise.reject(error);
  }
);

export default request;