import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { routeManager } from '../services/RouteManager';
import { useRouterEnhancement } from '../components/EnhancedRouterManager';
import { useAuth } from './useAuth';

/**
 * 路由管理Hook
 * 提供路由相关的功能和信息
 */
export const useRouteManager = () => {
  const location = useLocation();
  const { user } = useAuth();
  const routerEnhancement = useRouterEnhancement();

  /**
   * 获取当前路由的标题
   * @returns 路由标题
   */
  const getCurrentRouteTitle = useCallback(() => {
    return routeManager.getRouteTitle(location.pathname);
  }, [location.pathname]);

  /**
   * 检查当前用户是否有权限访问当前路由
   * @returns 是否有权限
   */
  const hasPermissionForCurrentRoute = useCallback(() => {
    return routeManager.hasPermission(location.pathname, user?.role || null);
  }, [location.pathname, user]);

  /**
   * 获取所有可见的菜单项
   * @returns 可见的菜单项数组
   */
  const getVisibleMenuItems = useCallback(() => {
    return routeManager.getVisibleMenuItems(user?.role || null);
  }, [user]);

  /**
   * 获取路由历史
   * @returns 路由历史数组
   */
  const getRouteHistory = useCallback(() => {
    return routerEnhancement.getRouteHistory();
  }, [routerEnhancement]);

  /**
   * 清除路由历史
   */
  const clearRouteHistory = useCallback(() => {
    routerEnhancement.clearRouteHistory();
  }, [routerEnhancement]);

  /**
   * 返回上一页
   */
  const goBack = useCallback(() => {
    routerEnhancement.goBack();
  }, [routerEnhancement]);

  /**
   * 增强的导航函数
   */
  const enhancedNavigate = routerEnhancement.enhancedNavigate;

  /**
   * 页面离开确认Hook
   */
  const useBeforeUnload = routerEnhancement.useBeforeUnload;

  return {
    // 当前路由信息
    currentPath: location.pathname,
    currentRouteTitle: getCurrentRouteTitle(),
    hasPermission: hasPermissionForCurrentRoute(),
    
    // 菜单相关
    menuItems: getVisibleMenuItems(),
    
    // 路由历史
    routeHistory: getRouteHistory(),
    clearRouteHistory,
    goBack,
    
    // 导航功能
    navigate: enhancedNavigate,
    
    // 页面离开确认
    useBeforeUnload
  };
};