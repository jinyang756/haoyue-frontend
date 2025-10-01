import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import React from 'react';
import { message, notification } from 'antd';
import { getToken, setToken, removeToken, getRefreshToken, clearAuthInfo } from '@/utils/auth';

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

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

request.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const res = response.data;
    if (!res.success) {
      message.error(res.message || '操作失败，请重试');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res.data;
  },
  async (error: AxiosError<BaseResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest?.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return request(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      if (originalRequest) {
        originalRequest._retry = true;
      }
      isRefreshing = true;

      try {
        const refreshTokenStr = getRefreshToken();
        if (!refreshTokenStr) {
          throw new Error('刷新Token不存在，请重新登录');
        }

        const response = await axios.post<BaseResponse<{ token: string }>>(
          `${process.env.REACT_APP_API_URL}/api/auth/refresh-token`,
          { refreshToken: refreshTokenStr }
        );
        
        if (response.data.success) {
          const newToken = response.data.data.token;
          setToken(newToken);
          
          processQueue(null, newToken);
          
          if (originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return request(originalRequest);
        } else {
          throw new Error(response.data.message || '刷新Token失败');
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        clearAuthInfo();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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