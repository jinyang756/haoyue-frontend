import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Layout from '@/components/layout/Layout';

// 懒加载组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const StockList = lazy(() => import('@/pages/StockList'));
const StockDetail = lazy(() => import('@/pages/StockDetail'));
const AIAnalysis = lazy(() => import('@/pages/AIAnalysis'));
const Profile = lazy(() => import('@/pages/Profile'));
const NoPermission = lazy(() => import('@/pages/NoPermission'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const routes: RouteObject[] = [
  // 公开路由
  {
    path: '/login',
    element: <Login />
  },
  
  // 主布局路由
  {
    path: '/',
    element: <Layout />,
    children: [
      // 公开路由（登录/未登录均可访问）
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/stocks',
        element: <StockList />
      },
      {
        path: '/stocks/:symbol',
        element: <StockDetail />
      },
      
      // 需登录路由
      {
        path: '/ai-analysis',
        element: (
          <PrivateRoute requireAuth={true}>
            <AIAnalysis />
          </PrivateRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute requireAuth={true}>
            <Profile />
          </PrivateRoute>
        )
      },
      
      // 错误页面
      {
        path: '/no-permission',
        element: <NoPermission />
      }
    ]
  },
  
  // 404页面
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;