import React from 'react';
import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import AIAnalysis from '../pages/AIAnalysis'; // 需自行实现
import Profile from '../pages/Profile'; // 需自行实现

import StockList from '../pages/StockList';
import StockDetail from '../pages/StockDetail';
import Login from '../pages/Login';
import NoPermission from '../pages/NoPermission';
import NotFound from '../pages/NotFound';
import BackendConnectionTest from '../pages/BackendConnectionTest';

const routes: RouteObject[] = [
  // 公开路由
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/test-connection',
    element: <BackendConnectionTest />
  },
  
  // 主布局路由
  {
    path: '/',
    element: <MainLayout children={null} />,
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
      {
        path: '/ai',
        element: <AIAnalysis />
      },
      {
        path: '/profile',
        element: <Profile />
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