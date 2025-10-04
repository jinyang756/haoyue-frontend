# 路由管理系统文档

## 概述

本项目采用现代化的路由管理系统，提供以下功能：

1. **路由配置集中管理** - 所有路由在 `src/routes/index.tsx` 中统一配置
2. **权限控制** - 基于用户角色的路由访问控制
3. **菜单生成** - 自动根据路由配置生成导航菜单
4. **路由元数据** - 支持标题、图标、排序等元信息
5. **历史记录** - 路由访问历史记录管理

## 路由配置结构

### 基本结构

```typescript
interface RouteConfig {
  path: string;           // 路由路径
  element: React.ReactNode; // 对应的组件
  meta?: {               // 路由元数据
    title?: string;      // 页面标题
    requiresAuth?: boolean; // 是否需要认证
    requiresAdmin?: boolean; // 是否需要管理员权限
    hideInMenu?: boolean;   // 是否在菜单中隐藏
    icon?: React.ReactNode; // 菜单图标
    order?: number;         // 菜单排序
  };
  children?: RouteConfig[]; // 子路由
}
```

### 示例配置

```typescript
const routes: RouteConfig[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
        meta: {
          title: '首页',
          icon: <HomeOutlined />
        }
      },
      {
        path: '/admin',
        element: <AdminPanel />,
        meta: {
          title: '管理面板',
          icon: <SettingOutlined />,
          requiresAuth: true,
          requiresAdmin: true
        }
      }
    ]
  }
];
```

## 路由管理器 (RouteManager)

路由管理器提供了一系列方法来处理路由配置：

### 主要方法

1. **getVisibleMenuItems(userRole)** - 获取用户可见的菜单项
2. **getRouteByPath(path)** - 根据路径获取路由配置
3. **getRouteTitle(path)** - 获取路由标题
4. **hasPermission(path, userRole)** - 检查用户权限
5. **getProtectedRoutes()** - 获取需要认证的路由
6. **getAdminRoutes()** - 获取管理员路由
7. **sortMenuItems(items)** - 对菜单项进行排序

### 使用示例

```typescript
import { routeManager } from '@/services/RouteManager';

// 获取可见菜单项
const menuItems = routeManager.getVisibleMenuItems('admin');

// 检查权限
const hasPermission = routeManager.hasPermission('/admin/users', 'user');
```

## 路由增强管理器 (EnhancedRouterManager)

提供额外的路由功能：

### 主要功能

1. **权限检查** - 自动检查路由访问权限
2. **路由历史** - 记录和管理路由访问历史
3. **导航增强** - 提供确认导航等功能
4. **页面离开确认** - 防止意外离开未保存的页面

### 使用示例

```typescript
import { useRouterEnhancement } from '@/components/EnhancedRouterManager';

const MyComponent = () => {
  const { enhancedNavigate, goBack } = useRouterEnhancement();
  
  const handleSaveAndLeave = () => {
    // 保存数据后导航
    enhancedNavigate('/dashboard', { confirm: true });
  };
  
  return (
    <button onClick={goBack}>返回上一页</button>
  );
};
```

## 路由管理Hook (useRouteManager)

提供在组件中使用路由功能的Hook：

### 可用功能

1. **currentPath** - 当前路径
2. **currentRouteTitle** - 当前路由标题
3. **hasPermission** - 当前路由权限检查
4. **menuItems** - 可见菜单项
5. **routeHistory** - 路由历史
6. **navigate** - 增强的导航函数
7. **goBack** - 返回上一页
8. **useBeforeUnload** - 页面离开确认

### 使用示例

```typescript
import { useRouteManager } from '@/hooks/useRouteManager';

const MyComponent = () => {
  const { 
    currentRouteTitle, 
    menuItems, 
    navigate, 
    useBeforeUnload 
  } = useRouteManager();
  
  // 启用页面离开确认
  useBeforeUnload(hasUnsavedChanges, '您有未保存的更改');
  
  return (
    <div>
      <h1>{currentRouteTitle}</h1>
      {/* 渲染菜单 */}
    </div>
  );
};
```

## 权限控制

### 认证路由

在路由配置中设置 `requiresAuth: true`：

```typescript
{
  path: '/profile',
  element: <Profile />,
  meta: {
    title: '个人中心',
    requiresAuth: true
  }
}
```

### 管理员路由

在路由配置中设置 `requiresAdmin: true`：

```typescript
{
  path: '/admin',
  element: <AdminPanel />,
  meta: {
    title: '管理面板',
    requiresAuth: true,
    requiresAdmin: true
  }
}
```

## 菜单生成

菜单会根据以下规则自动生成：

1. **隐藏菜单项** - `hideInMenu: true` 的路由不会显示在菜单中
2. **权限过滤** - 根据用户角色过滤菜单项
3. **图标显示** - 使用 `icon` 属性显示菜单图标
4. **排序** - 根据 `order` 属性对菜单项排序

## 最佳实践

### 1. 添加新页面

1. 创建页面组件
2. 在 `src/routes/index.tsx` 中添加路由配置
3. 设置适当的元数据

```typescript
// 在路由配置中添加
{
  path: '/new-page',
  element: <NewPage />,
  meta: {
    title: '新页面',
    icon: <FileOutlined />,
    requiresAuth: true
  }
}
```

### 2. 设置权限

根据需求设置 `requiresAuth` 和 `requiresAdmin`：

```typescript
// 公开页面
{
  path: '/public',
  element: <PublicPage />,
  meta: {
    title: '公开页面'
  }
}

// 需要认证的页面
{
  path: '/private',
  element: <PrivatePage />,
  meta: {
    title: '私有页面',
    requiresAuth: true
  }
}

// 管理员页面
{
  path: '/admin',
  element: <AdminPage />,
  meta: {
    title: '管理页面',
    requiresAuth: true,
    requiresAdmin: true
  }
}
```

### 3. 自定义菜单

通过设置 `hideInMenu` 来隐藏特定路由：

```typescript
{
  path: '/hidden',
  element: <HiddenPage />,
  meta: {
    title: '隐藏页面',
    hideInMenu: true
  }
}
```

## 故障排除

### 1. 路由不显示

检查：
- 路由路径是否正确
- 是否设置了 `hideInMenu: true`
- 用户是否有相应权限

### 2. 权限问题

检查：
- 用户角色是否正确
- 路由是否正确设置了权限要求
- 认证状态是否正常

### 3. 菜单图标不显示

检查：
- 是否正确导入了图标组件
- 图标组件是否正确设置在 `icon` 属性中

## 扩展功能

### 1. 添加新的元数据字段

在 `RouteConfig` 接口中添加新的元数据字段：

```typescript
interface RouteConfig {
  // ... 现有字段
  meta?: {
    // ... 现有元数据
    customField?: string; // 新的自定义字段
  };
}
```

### 2. 自定义权限检查

扩展 `RouteManager` 类添加新的权限检查方法：

```typescript
class RouteManager {
  // ... 现有方法
  
  hasCustomPermission(path: string, customRole: string): boolean {
    // 自定义权限检查逻辑
  }
}
```