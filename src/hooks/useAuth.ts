import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logout } from '@/services/authservice';
import { getToken, removeToken, setUserInfo, getUserInfo, clearAuthInfo } from '@/utils/auth';

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
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (token) {
        const userData = await getCurrentUser();
        setUser(userData);
        setUserInfo(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cachedUser = getUserInfo();
    if (cachedUser) {
      setUser(cachedUser);
    }
    fetchUser();
  }, [fetchUser]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      clearAuthInfo();
      setUser(null);
      window.location.href = '/login';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    isLogin: !!user,
    isVIP: user?.role === 'vip' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    logout: handleLogout,
    refreshUser
  };
};