import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/authservice';
import { setUserInfo, getUserInfo, clearAuthInfo, getToken } from '@/utils/auth';

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

interface UseAuthReturn {
  user: UserInfo | null;
  loading: boolean;
  isLogin: boolean;
  isVIP: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化时从缓存加载用户信息
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          // 获取用户信息
          const userData = await getCurrentUser();
          setUser(userData);
          setUserInfo(userData);
        } catch (error) {
          console.error('获取用户信息失败:', error);
          // Token可能已过期，清除认证信息
          clearAuthInfo();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // 处理登出
  const handleLogout = async () => {
    try {
      clearAuthInfo();
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setUserInfo(userData);
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      // 如果刷新失败，可能token已过期，需要重新登录
      clearAuthInfo();
      setUser(null);
    }
  };

  // 处理登录
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      // 这里应该调用登录API，获取token和用户信息
      // 为了简化，我们假设登录成功并返回用户信息
      // 实际实现中，您需要调用后端登录接口
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // 保存token和用户信息
          localStorage.setItem('TOKEN_KEY', data.data.token);
          setUser(data.data.user);
          setUserInfo(data.data.user);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    isLogin: !!user,
    isVIP: user?.role === 'vip' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    logout: handleLogout,
    refreshUser,
    login: handleLogin
  };
};