import React, { lazy } from 'react';
import {
  HomeOutlined,
  LineChartOutlined,
  RobotOutlined,
  UserOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';

// 使用React.lazy进行组件懒加载，处理命名导出
const MainLayout = lazy(() => import('../layouts/MainLayout').then(module => ({ default: module.MainLayout })));
const Home = lazy(() => import('../pages/Home'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AIAnalysis = lazy(() => import('../pages/AIAnalysis'));
const Profile = lazy(() => import('../pages/Profile'));
const StockList = lazy(() => import('../pages/StockList'));
const StockDetail = lazy(() => import('../pages/StockDetail'));
const Login = lazy(() => import('../pages/Login'));
const Subscription = lazy(() => import('../pages/Subscription'));
const NoPermission = lazy(() => import('../pages/NoPermission'));
const NotFound = lazy(() => import('../pages/NotFound'));
const About = lazy(() => import('../pages/About'));
const ContentManagement = lazy(() => import('../pages/ContentManagement'));
const ApiService = lazy(() => import('../pages/ApiService'));
const Disclaimer = lazy(() => import('../pages/Disclaimer'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const FeatureGuide = lazy(() => import('../pages/FeatureGuide'));
const Settings = lazy(() => import('../pages/Settings'));

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

// 路由配置
const routes: RouteConfig[] = [
  // 公开路由
  {
    path: '/login',
    element: <Login />,
    meta: {
      title: '登录',
      hideInMenu: true
    }
  },
  
  // 主布局路由
  {
    path: '/',
    element: <MainLayout />,
    meta: {
      requiresAuth: false
    },
    children: [
      // 首页
      {
        path: '/',
        element: <Home />,
        meta: {
          title: '首页',
          icon: <HomeOutlined />
        }
      },
      
      // 关于我们
      {
        path: '/about',
        element: <About />,
        meta: {
          title: '关于我们',
          icon: <InfoCircleOutlined />
        }
      },
      
      // 股票列表
      {
        path: '/stocks',
        element: <StockList />,
        meta: {
          title: 'AI选股',
          icon: <LineChartOutlined />
        }
      },
      
      // 股票详情
      {
        path: '/stocks/:symbol',
        element: <StockDetail />,
        meta: {
          title: '股票详情',
          hideInMenu: true
        }
      },
      
      // AI分析
      {
        path: '/ai',
        element: <AIAnalysis />,
        meta: {
          title: 'AI分析',
          icon: <RobotOutlined />,
          requiresAuth: true
        }
      },
      
      // 用户相关路由
      {
        path: '/profile',
        element: <Profile />,
        meta: {
          title: '个人中心',
          icon: <UserOutlined />,
          requiresAuth: true
        }
      },
      
      {
        path: '/subscription',
        element: <Subscription />,
        meta: {
          title: '订阅服务',
          icon: <DollarOutlined />,
          requiresAuth: true
        }
      },
      
      // 内容管理（仅管理员）
      {
        path: '/content',
        element: <ContentManagement />,
        meta: {
          title: '内容管理',
          icon: <FileTextOutlined />,
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      
      // API服务（仅管理员）
      {
        path: '/api-service',
        element: <ApiService />,
        meta: {
          title: 'API服务',
          icon: <FileTextOutlined />,
          requiresAuth: true,
          requiresAdmin: true,
          hideInMenu: true
        }
      },
      
      // 法律相关页面
      {
        path: '/disclaimer',
        element: <Disclaimer />,
        meta: {
          title: '免责声明',
          icon: <FileTextOutlined />,
          hideInMenu: true
        }
      },
      
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
        meta: {
          title: '隐私政策',
          icon: <FileTextOutlined />,
          hideInMenu: true
        }
      },
      
      // 功能指南
      {
        path: '/feature-guide',
        element: <FeatureGuide />,
        meta: {
          title: '功能指南',
          icon: <InfoCircleOutlined />,
          hideInMenu: true
        }
      },
      
      // 系统设置
      {
        path: '/settings',
        element: <Settings />,
        meta: {
          title: '系统设置',
          icon: <InfoCircleOutlined />,
          requiresAuth: true
        }
      },
      
      // 错误页面
      {
        path: '/no-permission',
        element: <NoPermission />,
        meta: {
          title: '无权限',
          hideInMenu: true
        }
      }
    ]
  },
  
  // 404页面
  {
    path: '*',
    element: <NotFound />,
    meta: {
      title: '页面未找到',
      hideInMenu: true
    }
  }
];

export default routes;