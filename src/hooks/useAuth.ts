import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getCurrentUser } from '@/services/authservice';
import { setUserInfo, getUserInfo, clearAuthInfo } from '@/utils/auth';

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
  login: (options?: any) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { isAuthenticated, user: auth0User, isLoading, loginWithRedirect, logout: auth0Logout, getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 从Auth0用户信息同步到本地用户信息
  useEffect(() => {
    const syncUserInfo = async () => {
      if (isAuthenticated && auth0User) {
        try {
          // 获取访问令牌
          const token = await getAccessTokenSilently();
          
          // 设置令牌到localStorage（如果需要与旧系统兼容）
          localStorage.setItem('TOKEN_KEY', token);
          
          // 获取或创建本地用户信息
          const userData = await getCurrentUser();
          setUser(userData);
          setUserInfo(userData);
        } catch (error) {
          console.error('同步用户信息失败:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    syncUserInfo();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  // 初始化时从缓存加载用户信息
  useEffect(() => {
    const cachedUser = getUserInfo();
    if (cachedUser && !isLoading) {
      setUser(cachedUser);
    }
  }, [isLoading]);

  // 处理登出
  const handleLogout = async () => {
    try {
      // 由于在App.tsx的Auth0Provider配置中已设置returnTo，这里不需要再传递
      await auth0Logout();
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      clearAuthInfo();
      setUser(null);
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    if (isAuthenticated && auth0User) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setUserInfo(userData);
      } catch (error) {
        console.error('刷新用户信息失败:', error);
      }
    }
  };

  return {
    user,
    loading: loading || isLoading,
    isLogin: isAuthenticated && !!user,
    isVIP: user?.role === 'vip' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    logout: handleLogout,
    refreshUser,
    login: loginWithRedirect // 提供Auth0的登录方法
  };
};