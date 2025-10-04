import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { routeManager } from '../services/RouteManager';

const { confirm } = Modal;

interface RouteHistoryItem {
  path: string;
  timestamp: number;
  title?: string;
}

export const EnhancedRouterManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLogin } = useAuth();
  
  // 路由历史记录
  const [routeHistory, setRouteHistory] = useState<RouteHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem('routeHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // 获取路由保护配置
  const protectedRoutes = routeManager.getProtectedRoutes();
  const adminRoutes = routeManager.getAdminRoutes();

  // 路由保护配置
  const routeProtectionConfig = {
    protectedRoutes,
    adminRoutes,
    redirectPath: '/login',
    adminRedirectPath: '/no-permission'
  };

  // 保存路由历史到本地存储
  const saveRouteHistory = useCallback((history: RouteHistoryItem[]) => {
    try {
      localStorage.setItem('routeHistory', JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save route history to localStorage:', error);
    }
  }, []);

  // 添加路由到历史记录
  const addToRouteHistory = useCallback((path: string, title?: string) => {
    setRouteHistory(prev => {
      // 过滤掉相同的路径
      const filtered = prev.filter(item => item.path !== path);
      // 添加新路径到开头
      const newHistory = [
        { path, timestamp: Date.now(), title },
        ...filtered.slice(0, 9) // 保留最多10条记录
      ];
      saveRouteHistory(newHistory);
      return newHistory;
    });
  }, [saveRouteHistory]);

  // 检查路由权限
  const checkRoutePermission = useCallback((pathname: string) => {
    // 检查是否需要认证
    const isProtectedRoute = routeProtectionConfig.protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    // 检查是否是管理员路由
    const isAdminRoute = routeProtectionConfig.adminRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    // 如果是受保护路由但未认证
    if (isProtectedRoute && !isLogin) {
      message.warning('请先登录以访问此页面');
      navigate(routeProtectionConfig.redirectPath, { replace: true });
      return false;
    }
    
    // 如果是管理员路由但不是管理员
    if (isAdminRoute && user?.role !== 'admin') {
      message.warning('您没有权限访问此页面');
      navigate(routeProtectionConfig.adminRedirectPath, { replace: true });
      return false;
    }
    
    return true;
  }, [isLogin, user, navigate]);

  // 路由变化监听
  useEffect(() => {
    // 检查权限
    const hasPermission = checkRoutePermission(location.pathname);
    
    if (hasPermission) {
      // 添加到路由历史
      addToRouteHistory(location.pathname, document.title);
    }
  }, [location.pathname, checkRoutePermission, addToRouteHistory]);

  // 页面离开确认（用于有未保存更改的页面）
  const useBeforeUnload = (when: boolean, message?: string) => {
    useEffect(() => {
      if (!when) return;
      
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = message || '您确定要离开此页面吗？未保存的更改将会丢失。';
        return event.returnValue;
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [when, message]);
  };

  // 确认导航到其他页面
  const confirmNavigation = (targetPath: string, callback: () => void) => {
    confirm({
      title: '确认离开',
      icon: <ExclamationCircleOutlined />,
      content: '您确定要离开此页面吗？未保存的更改将会丢失。',
      onOk() {
        callback();
      },
      onCancel() {
        // 取消导航
      }
    });
  };

  // 编程式导航增强
  const enhancedNavigate = (path: string, options?: { replace?: boolean; confirm?: boolean }) => {
    // 检查权限
    if (!routeManager.hasPermission(path, user?.role || null)) {
      message.warning('您没有权限访问此页面');
      return;
    }
    
    if (options?.confirm) {
      confirmNavigation(path, () => navigate(path, { replace: options.replace }));
    } else {
      navigate(path, { replace: options?.replace });
    }
  };

  // 返回上一页
  const goBack = () => {
    if (routeHistory.length > 1) {
      const previousRoute = routeHistory[1];
      navigate(previousRoute.path);
    } else {
      navigate('/');
    }
  };

  // 获取路由历史
  const getRouteHistory = () => routeHistory;

  // 清除路由历史
  const clearRouteHistory = () => {
    setRouteHistory([]);
    localStorage.removeItem('routeHistory');
  };

  // 提供增强的路由功能上下文
  return (
    <RouterEnhancementContext.Provider 
      value={{ 
        enhancedNavigate,
        goBack,
        getRouteHistory,
        clearRouteHistory,
        useBeforeUnload
      }}
    >
      {children}
    </RouterEnhancementContext.Provider>
  );
};

// 创建路由增强上下文
export const RouterEnhancementContext = React.createContext({
  enhancedNavigate: (path: string, options?: { replace?: boolean; confirm?: boolean }) => {},
  goBack: () => {},
  getRouteHistory: () => [] as RouteHistoryItem[],
  clearRouteHistory: () => {},
  useBeforeUnload: (when: boolean, message?: string) => {}
});

// 路由增强Hook
export const useRouterEnhancement = () => {
  const context = React.useContext(RouterEnhancementContext);
  if (!context) {
    throw new Error('useRouterEnhancement must be used within RouterEnhancementContext');
  }
  return context;
};

export default EnhancedRouterManager;