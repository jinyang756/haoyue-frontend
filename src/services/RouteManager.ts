import routes from '../routes';

// 路由配置类型定义
interface RouteConfig {
  path: string;
  element: React.ReactNode;
  // 路由元数据
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
    hideInMenu?: boolean;
    icon?: React.ReactNode;
    order?: number;
  };
  children?: RouteConfig[];
}

/**
 * 路由管理器
 * 提供路由配置处理、权限检查、导航等功能
 */
class RouteManager {
  private routes: RouteConfig[];

  constructor(routes: RouteConfig[]) {
    this.routes = routes;
  }

  /**
   * 获取所有可见的菜单项
   * @param userRole 用户角色
   * @returns 可见的菜单项数组
   */
  getVisibleMenuItems(userRole: 'user' | 'vip' | 'admin' | null): RouteConfig[] {
    const menuItems: RouteConfig[] = [];

    const processRoutes = (routes: RouteConfig[], parentPath = '') => {
      routes.forEach(route => {
        const fullPath = parentPath + route.path;
        
        // 检查路由是否应该在菜单中显示
        if (this.shouldShowInMenu(route, userRole)) {
          menuItems.push({
            ...route,
            path: fullPath
          });
        }

        // 递归处理子路由
        if (route.children) {
          processRoutes(route.children, fullPath);
        }
      });
    };

    processRoutes(this.routes);
    return menuItems;
  }

  /**
   * 检查路由是否应该在菜单中显示
   * @param route 路由配置
   * @param userRole 用户角色
   * @returns 是否显示
   */
  private shouldShowInMenu(route: RouteConfig, userRole: 'user' | 'vip' | null | 'admin'): boolean {
    // 隐藏标记为hideInMenu的路由
    if (route.meta?.hideInMenu) {
      return false;
    }

    // 检查认证要求
    if (route.meta?.requiresAuth && !userRole) {
      return false;
    }

    // 检查管理员要求
    if (route.meta?.requiresAdmin && userRole !== 'admin') {
      return false;
    }

    return true;
  }

  /**
   * 根据路径获取路由配置
   * @param path 路径
   * @returns 路由配置
   */
  getRouteByPath(path: string): RouteConfig | undefined {
    const findRoute = (routes: RouteConfig[]): RouteConfig | undefined => {
      for (const route of routes) {
        if (route.path === path) {
          return route;
        }
        
        if (route.children) {
          const childRoute = findRoute(route.children);
          if (childRoute) {
            return childRoute;
          }
        }
      }
      
      return undefined;
    };

    return findRoute(this.routes);
  }

  /**
   * 获取路由标题
   * @param path 路径
   * @returns 路由标题
   */
  getRouteTitle(path: string): string {
    const route = this.getRouteByPath(path);
    return route?.meta?.title || '皓月量化';
  }

  /**
   * 检查用户是否有权限访问路由
   * @param path 路径
   * @param userRole 用户角色
   * @returns 是否有权限
   */
  hasPermission(path: string, userRole: 'user' | 'vip' | 'admin' | null): boolean {
    const route = this.getRouteByPath(path);
    
    if (!route) {
      return false;
    }

    // 检查认证要求
    if (route.meta?.requiresAuth && !userRole) {
      return false;
    }

    // 检查管理员要求
    if (route.meta?.requiresAdmin && userRole !== 'admin') {
      return false;
    }

    return true;
  }

  /**
   * 获取需要认证的路由路径
   * @returns 需要认证的路由路径数组
   */
  getProtectedRoutes(): string[] {
    const protectedRoutes: string[] = [];

    const collectProtectedRoutes = (routes: RouteConfig[], parentPath = '') => {
      routes.forEach(route => {
        const fullPath = parentPath + route.path;
        
        if (route.meta?.requiresAuth) {
          protectedRoutes.push(fullPath);
        }

        if (route.children) {
          collectProtectedRoutes(route.children, fullPath);
        }
      });
    };

    collectProtectedRoutes(this.routes);
    return protectedRoutes;
  }

  /**
   * 获取管理员路由路径
   * @returns 管理员路由路径数组
   */
  getAdminRoutes(): string[] {
    const adminRoutes: string[] = [];

    const collectAdminRoutes = (routes: RouteConfig[], parentPath = '') => {
      routes.forEach(route => {
        const fullPath = parentPath + route.path;
        
        if (route.meta?.requiresAdmin) {
          adminRoutes.push(fullPath);
        }

        if (route.children) {
          collectAdminRoutes(route.children, fullPath);
        }
      });
    };

    collectAdminRoutes(this.routes);
    return adminRoutes;
  }

  /**
   * 按照指定顺序对菜单项进行排序
   * @param menuItems 菜单项数组
   * @returns 排序后的菜单项数组
   */
  sortMenuItems(menuItems: RouteConfig[]): RouteConfig[] {
    return [...menuItems].sort((a, b) => {
      const orderA = a.meta?.order || 0;
      const orderB = b.meta?.order || 0;
      return orderA - orderB;
    });
  }
}

// 创建路由管理器实例
const routeManager = new RouteManager(routes);

export default RouteManager;
export { routeManager };
export type { RouteConfig };