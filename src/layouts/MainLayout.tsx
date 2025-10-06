import React, { useState } from 'react';
import { Layout, Button, Drawer, Avatar, Dropdown, Space, Menu } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { theme } from '../styles/theme';
import styled from 'styled-components';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { EnhancedNavigation } from '../components/EnhancedNavigation';
import { routeManager } from '../services/RouteManager';

const { Header, Sider, Content } = Layout;

const StyledSider = styled(Sider)`
  background-color: ${theme.darkBg};
  border-right: ${theme.border};
  box-shadow: ${theme.glow};
  @media (max-width: 1200px) {
    display: none;
  }
`;

const StyledHeader = styled(Header)`
  background-color: ${theme.darkBg};
  border-bottom: ${theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  
  @media (max-width: 768px) {
      padding: 0 10px;
  }
`;

const StyledContent = styled(Content)`
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Logo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.neonBlue};
  font-size: 18px;
  font-weight: bold;
  text-shadow: ${theme.glow};
  
  @media (max-width: 768px) {
    font-size: 16px;
    height: 50px;
  }
`;

// 移动端标题
const MobileTitle = styled.div`
  color: ${theme.neonBlue};
  font-size: 16px;
  font-weight: bold;
  text-shadow: ${theme.glow};
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// 用户角色标签
const UserRoleLabel = styled.span`
  margin-right: 10px;
  display: none;
  
  @media (min-width: 768px) {
    display: inline;
  }
`;

// 创建响应式的移动端菜单按钮
const MobileMenuButton = styled(Button)`
  color: white;
  display: block;
  @media (min-width: 1200px) {
    display: none;
  }
`;

// 移动端抽屉样式
const MobileDrawer = styled(Drawer)`
  .ant-drawer-content {
    background-color: ${theme.darkBg};
  }
  
  .ant-drawer-header {
    background-color: ${theme.darkBg};
    border-bottom: ${theme.border};
  }
  
  .ant-drawer-body {
    padding: 0;
  }
`;

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "1") {
      navigate('/profile');
    } else if (key === "2") {
      navigate('/subscription');
    } else if (key === "3") {
      handleLogout();
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 用户菜单配置
  const userMenuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: t('profile')
    },
    {
      key: "2",
      icon: <DollarOutlined />,
      label: t('subscription')
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: t('logout')
    }
  ];

  // 使用路由管理器获取可见的菜单项
  const menuItems = routeManager.getVisibleMenuItems(user?.role || null).map(route => ({
    key: route.path,
    icon: route.meta?.icon,
    label: route.meta?.title || route.path
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ParticlesBackground />
      <StyledSider>
        <Logo>皓月量化</Logo>
        {/* 桌面端导航 */}
        <EnhancedNavigation menuItems={menuItems} />
      </StyledSider>
      <Layout>
        <StyledHeader>
          {/* 移动端菜单按钮 */}
          <MobileMenuButton
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileDrawer(true)}
          />
          <div className="neon-text" style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {t('home_title')}
          </div>
          
          {/* 移动端标题简化 */}
          <MobileTitle className="neon-text">
            皓月量化
          </MobileTitle>
          
          {/* 用户信息和下拉菜单 */}
          <Space>
            {user && (
              <UserRoleLabel>
                {user.role === 'vip' ? t('vip_user') : t('regular_user')}
              </UserRoleLabel>
            )}
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
              <Avatar icon={<UserOutlined />} size="large" />
            </Dropdown>
          </Space>
        </StyledHeader>
        
        {/* 移动端抽屉菜单 */}
        <MobileDrawer
          title={t('navigation_menu')}
          placement="left"
          onClose={() => setMobileDrawer(false)}
          open={mobileDrawer}
        >
          <div style={{ padding: '16px' }}>
            <EnhancedNavigation menuItems={menuItems} />
          </div>
        </MobileDrawer>
        
        {/* 主内容区域 */}
        <StyledContent>{children}</StyledContent>
      </Layout>
    </Layout>
  );
};

export default MainLayout;