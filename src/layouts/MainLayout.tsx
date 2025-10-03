import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Avatar, Dropdown, Space } from 'antd';
import {
  HomeOutlined,
  LineChartOutlined,
  RobotOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { theme } from '../styles/theme';
import styled from 'styled-components';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

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

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "1") {
      navigate('/profile');
    } else if (key === "2") {
      navigate('/subscription');
    } else if (key === "3") {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

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

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: t('dashboard') },
    { key: '/about', icon: <InfoCircleOutlined />, label: t('about') },
    { key: '/stocks', icon: <LineChartOutlined />, label: t('ai_stock_selection') }, // 改为AI选股
    { key: '/ai', icon: <RobotOutlined />, label: t('ai_analysis') },
    { key: '/content', icon: <FileTextOutlined />, label: t('content_management') },
    { key: '/profile', icon: <UserOutlined />, label: t('profile') },
    { key: '/subscription', icon: <DollarOutlined />, label: t('subscription') },
  ];

  // 处理菜单项点击，进行页面跳转
  const handleMenuClick = (e: any) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ParticlesBackground />
      <StyledSider>
        <Logo>皓月量化</Logo>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 'none' }}
        />
      </StyledSider>
      <Layout>
        <StyledHeader>
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
        <Drawer
          title={t('navigation_menu')}
          placement="left"
          onClose={() => setMobileDrawer(false)}
          open={mobileDrawer}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['/']}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ width: 250 }}
          />
        </Drawer>
        <StyledContent>{children}</StyledContent>
      </Layout>
    </Layout>
  );
};

export default MainLayout;