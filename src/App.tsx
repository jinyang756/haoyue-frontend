import React, { useState, useCallback, useEffect } from 'react';
import { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import { RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom';
import { GlobalStyles } from './styles/globalStyles';
import { EnhancedParticlesBackground } from './components/EnhancedParticlesBackground';
import { BrandShowcase } from './components/BrandShowcase';
import { BrandAnimation } from './components/BrandAnimation';
import { ContentPreloader } from './components/ContentPreloader';
import { theme } from './styles/theme';
import routes from './routes';
import { Spin, message, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import { EnhancedRouterManager } from './components/EnhancedRouterManager';
import { RouteConfig } from './services/RouteManager';
import { isOfflineMode } from './utils/offlineMode';

// 类型定义：明确路由配置结构
interface RouteConfigExtended extends RouteConfig {
  children?: RouteConfigExtended[];
}

// 加载状态组件
const LoadingFallback = () => (
  <div style={{ textAlign: 'center', marginTop: '100px' }}>
    <Spin size="large" />
    <p style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>正在加载应用组件...</p>
  </div>
);

// 后端连接失败提示组件
interface BackendConnectionErrorProps {
  onRetry: () => void;
}
const BackendConnectionError: React.FC<BackendConnectionErrorProps> = ({ onRetry }) => (
  <div style={{
    textAlign: 'center', 
    marginTop: '50px',
    padding: '40px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '24px', color: '#ff4d4f' }}>⚠️</div>
    <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>无法连接到后端服务器</h2>
    <p style={{ fontSize: '16px', marginBottom: '24px', color: '#666' }}>
      暂时无法连接到服务器，请检查您的网络连接或稍后再试。
    </p>
    <Button 
      type="primary" 
      size="large" 
      icon={<ReloadOutlined />}
      onClick={onRetry}
    >
      重新连接
    </Button>
  </div>
);

// 连接状态检查服务
const ConnectionChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(false);
  const [hasShownOfflineNotice, setHasShownOfflineNotice] = useState<boolean>(false);

  // 检查后端连接
  const checkBackendConnection = useCallback(async () => {
    // 如果处于离线模式，直接跳过连接检查
    if (isOfflineMode()) {
      setIsBackendConnected(true);
      return;
    }
    
    if (checkingConnection) return;
    
    setCheckingConnection(true);
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    
    try {
      const response = await axios.get(`${apiBaseUrl}/api/health`, {
        timeout: 5000,
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.status === 200) {
        if (!isBackendConnected) {
          message.success('已成功连接到后端服务器');
        }
        setIsBackendConnected(true);
        setHasShownOfflineNotice(false);
      }
    } catch (error) {
      // 即使连接失败，也允许前端正常显示
      // 只是显示一个提示，而不是阻止整个应用运行
      if (isBackendConnected && !hasShownOfflineNotice) {
        // 只显示一次离线提示，避免频繁弹窗
        message.warning('无法连接到后端服务器，应用将在离线模式下运行', 5);
        setHasShownOfflineNotice(true);
      }
      // 不设置isBackendConnected为false，让前端继续正常显示
    } finally {
      setCheckingConnection(false);
    }
  }, [checkingConnection, isBackendConnected, hasShownOfflineNotice]);

  // 初始化检查 + 定期检查（每30秒，无论当前状态）
  useEffect(() => {
    checkBackendConnection(); // 初始检查
    const interval = setInterval(checkBackendConnection, 60000); // 延长检查间隔到1分钟
    return () => clearInterval(interval);
  }, [checkBackendConnection]);

  // 提供连接状态上下文
  return (
    <ConnectionContext.Provider value={{ 
      isBackendConnected, 
      checkingConnection, 
      checkBackendConnection 
    }}>
      {React.Children.only(children)}
    </ConnectionContext.Provider>
  );
};

// 创建连接状态上下文
const ConnectionContext = React.createContext<{
  isBackendConnected: boolean;
  checkingConnection: boolean;
  checkBackendConnection: () => void;
}>({
  isBackendConnected: true,
  checkingConnection: false,
  checkBackendConnection: () => {}
});

// 全局布局组件：处理全局UI（如粒子背景）
const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="global-layout">
      <EnhancedParticlesBackground />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

// 首页错误处理布局
const HomePageWithErrorHandling: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isBackendConnected, checkingConnection, checkBackendConnection } = React.useContext(ConnectionContext);
  const location = useLocation();
  
  // 只在首页应用错误处理逻辑
  const isHomePage = location.pathname === '/';
  
  // 非首页直接渲染子内容
  if (!isHomePage) {
    return <div>{children}</div>;
  }
  
  // 检查中显示加载状态
  if (checkingConnection) {
    return <LoadingFallback />;
  }
  
  // 即使连接失败，也正常显示首页内容，只是显示一个提示
  return <div>{children}</div>;
};

// 品牌展示逻辑（单独组件，避免与路由逻辑混合）
const BrandWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showBrandShowcase, setShowBrandShowcase] = useState<boolean>(false);
  const [showBrandAnimation, setShowBrandAnimation] = useState<boolean>(true);
  const [contentPreloaded, setContentPreloaded] = useState<boolean>(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenBrandShowcase');
    if (!hasSeen) {
      setShowBrandShowcase(true);
    } else {
      // 检查是否显示过品牌动画
      const hasSeenAnimation = localStorage.getItem('hasSeenBrandAnimation');
      if (!hasSeenAnimation) {
        setShowBrandAnimation(true);
      }
    }
  }, []);

  const handleEnter = () => {
    setShowBrandShowcase(false);
    localStorage.setItem('hasSeenBrandShowcase', 'true');
    // 显示品牌动画
    setShowBrandAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowBrandAnimation(false);
    localStorage.setItem('hasSeenBrandAnimation', 'true');
  };

  const handleSkipAnimation = () => {
    setShowBrandAnimation(false);
    localStorage.setItem('hasSeenBrandAnimation', 'true');
  };

  const handlePreloadComplete = () => {
    setContentPreloaded(true);
  };

  // 如果正在显示品牌展示
  if (showBrandShowcase) {
    return <BrandShowcase onEnter={handleEnter} />;
  }

  // 如果正在显示品牌动画
  if (showBrandAnimation) {
    return (
      <>
        <BrandAnimation onComplete={handleAnimationComplete} onSkip={handleSkipAnimation} />
        <ContentPreloader onComplete={handlePreloadComplete} />
      </>
    );
  }

  return <div>{children}</div>;
};

// 构建路由（保留原始结构，统一处理全局状态）
const buildRouter = () => {
  // 由于路由配置中已经包含了MainLayout，这里不再添加额外的布局包装
  // 只对根路由添加连接检查
  const wrapRoute = (route: RouteConfigExtended): RouteConfigExtended => {
    // 如果是根路由，添加连接检查
    if (route.path === '/') {
      return {
        ...route,
        element: (
          <ConnectionChecker>
            {route.element}
          </ConnectionChecker>
        )
      };
    }
    
    // 其他路由保持原样
    return route;
  };

  // 递归处理路由树
  const processRoutes = (routesToProcess: RouteConfigExtended[]): RouteConfigExtended[] => {
    return routesToProcess.map(route => {
      const wrappedRoute = wrapRoute(route);
      
      // 如果有子路由，递归处理
      if (route.children && route.children.length > 0) {
        return {
          ...wrappedRoute,
          children: processRoutes(route.children)
        };
      }
      
      return wrappedRoute;
    });
  };

  const processedRoutes = processRoutes(routes);
  return createBrowserRouter(processedRoutes as any);
};

// 主应用组件
const App: React.FC = () => {
  // 构建路由（在组件外部定义以避免重复创建）
  const router = buildRouter();

  // 路由占位组件 - 用于EnhancedRouterManager内部渲染
  const RouterContent: React.FC = () => {
    return null;
  };

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrandWrapper>
          {/* RouterProvider不接受children属性，它通过配置的路由自动渲染内容 */}
          <RouterProvider router={router} />
          
          {/* EnhancedRouterManager需要在RouterProvider之后，以便访问路由上下文 */}
          <div style={{ display: 'none' }}>
            <EnhancedRouterManager>
              <RouterContent />
            </EnhancedRouterManager>
          </div>
        </BrandWrapper>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;