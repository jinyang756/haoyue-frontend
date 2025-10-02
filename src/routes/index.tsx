import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

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

const routes: RouteObject[] = [
  // 公开路由
  {
    path: '/login',
    element: <Login />
  },
  
  // 主布局路由
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 公开路由（登录/未登录均可访问）
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/stocks',
        element: <StockList />
      },
      {
        path: '/stocks/:symbol',
        element: <StockDetail />
      },
      {
        path: '/ai',
        element: <AIAnalysis />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/subscription',
        element: <Subscription />
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