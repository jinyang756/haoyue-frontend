import React, { Suspense, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { GlobalStyles } from './styles/globalStyles';
import { EnhancedParticlesBackground } from './components/EnhancedParticlesBackground';
import { BrandShowcase } from './components/BrandShowcase';
import { theme } from './styles/theme';
import routes from './routes';
import { Spin } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import { ChatWidget } from './components/support/ChatWidget';

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
  const [showBrandShowcase, setShowBrandShowcase] = useState(false);
  
  // 检查是否已经显示过品牌展示
  useEffect(() => {
    const hasSeenBrandShowcase = localStorage.getItem('hasSeenBrandShowcase');
    if (!hasSeenBrandShowcase) {
      setShowBrandShowcase(true);
    }
  }, []);
  
  const handleEnterApp = () => {
    setShowBrandShowcase(false);
    localStorage.setItem('hasSeenBrandShowcase', 'true');
  };
  
  if (showBrandShowcase) {
    return (
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <BrandShowcase onEnter={handleEnterApp} />
        </ThemeProvider>
      </HelmetProvider>
    );
  }
  
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <EnhancedParticlesBackground />
        <ChatWidget />
        <div className="app-container">
          <Suspense fallback={<LoadingFallback />}>
            {children || <RouterProvider router={router} />}
          </Suspense>
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;