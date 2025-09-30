import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { GlobalStyles } from './styles/globalStyles';
import { ParticlesBackground } from './components/ParticlesBackground';
import { theme } from './styles/theme';
import routes from './routes';
import { Spin } from 'antd';

// 优化加载状态，增加骨架屏提示文本
const LoadingFallback = () => (
  <div style={{ textAlign: 'center', marginTop: '100px' }}>
    <Spin size="large" tip="正在加载应用组件..." />
  </div>
);

// 延迟创建router以避免在初始化时加载所有组件
const getRouter = () => {
  return createBrowserRouter(routes);
};

interface AppProps {
  children?: React.ReactNode;
}

export const App: React.FC<AppProps> = ({ children }) => {
  // 在组件渲染时才获取router，避免过早加载路由配置
  const router = getRouter();
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ParticlesBackground />
      <div className="app-container">
        <Suspense fallback={<LoadingFallback />}>
          {children || <RouterProvider router={router} />}
        </Suspense>
      </div>
    </ThemeProvider>
  );
};

export default App;