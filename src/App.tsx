import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { GlobalStyles } from './styles/globalStyles';
import { ParticlesBackground } from './components/ParticlesBackground';
import { theme } from './styles/theme';
import routes from './routes';
import { Spin } from 'antd';
import { Auth0Provider, useAuth0, type CacheLocation } from '@auth0/auth0-react';
import { setAuth0Context } from './services/request';
import { HelmetProvider } from 'react-helmet-async';

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

// 创建一个Auth0Provider的子组件，用于设置Auth0上下文
const Auth0ProviderWithConfig: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const auth0 = useAuth0();
  
  // 设置Auth0上下文到request.ts
  useEffect(() => {
    setAuth0Context(auth0);
  }, [auth0]);
  
  return <>{children}</>;
};

export const App: React.FC<AppProps> = ({ children }) => {
  // 在组件渲染时才获取router，避免过早加载路由配置
  const router = getRouter();

  // Auth0配置
  const auth0Config = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN || '',
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
    authorizationParams: {
      redirect_uri: process.env.REACT_APP_AUTH0_CALLBACK_URL || window.location.origin,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE || ''
    },
    logoutParams: {
      returnTo: process.env.REACT_APP_AUTH0_LOGOUT_URL || window.location.origin
    },
    useRefreshTokens: true,
    cacheLocation: 'localstorage' as CacheLocation
  };
  
  return (
    <Auth0Provider {...auth0Config}>
      <Auth0ProviderWithConfig>
        <HelmetProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <ParticlesBackground />
            <div className="app-container">
              <Suspense fallback={<LoadingFallback />}>
                {children || <RouterProvider router={router} />}
              </Suspense>
            </div>
          </ThemeProvider>
        </HelmetProvider>
      </Auth0ProviderWithConfig>
    </Auth0Provider>
  );
};

export default App;