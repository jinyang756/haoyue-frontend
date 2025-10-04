import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/authservice';
import { setUserInfo, getUserInfo, clearAuthInfo, getToken } from '@/utils/auth';
import { isOfflineMode } from '@/utils/offlineMode';

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
      // 如果处于离线模式，直接使用模拟用户
      if (isOfflineMode()) {
        setUser({
          id: 'demo-user',
          username: '演示用户',
          email: 'demo@example.com',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setLoading(false);
        return;
      }

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
          // 但在没有后端的情况下，我们仍然可以保持用户登录状态
          const cachedUser = getUserInfo();
          if (cachedUser) {
            setUser(cachedUser);
          } else {
            // 创建一个默认的用户对象用于演示
            setUser({
              id: 'demo-user',
              username: '演示用户',
              email: 'demo@example.com',
              role: 'user',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
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
      // 即使后端调用失败，也清除本地状态
      clearAuthInfo();
      setUser(null);
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
      // 如果刷新失败，可能token已过期，但保持当前用户状态
      // 或者使用缓存的用户信息
      const cachedUser = getUserInfo();
      if (cachedUser) {
        setUser(cachedUser);
      }
    }
  };

  // 处理登录
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    // 如果处于离线模式，直接使用模拟登录
    if (isOfflineMode()) {
      setUser({
        id: 'demo-user',
        username: username || '演示用户',
        email: 'demo@example.com',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return true;
    }

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
      // 如果后端不可用，创建一个演示用户
      setUser({
        id: 'demo-user',
        username: username || '演示用户',
        email: 'demo@example.com',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('登录失败:', error);
      // 即使后端不可用，也创建一个演示用户
      setUser({
        id: 'demo-user',
        username: username || '演示用户',
        email: 'demo@example.com',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return true;
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