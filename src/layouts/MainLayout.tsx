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
} from '@ant-design/icons';
import { theme } from '../styles/theme';
import styled from 'styled-components';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Link, useNavigate } from 'react-router-dom';

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
`;

const StyledContent = styled(Content)`
  padding: 20px;
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

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "1") {
      navigate('/profile');
    } else if (key === "2") {
      // 实现退出登录逻辑
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      navigate('/login');
    }
  };

  const userMenuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "个人中心"
    },
    {
      key: "2",
      icon: <LogoutOutlined />,
      label: "退出登录"
    }
  ];

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '仪表盘' },
    { key: '/about', icon: <InfoCircleOutlined />, label: '关于' },
    { key: '/stocks', icon: <LineChartOutlined />, label: '股票分析' },
    { key: '/ai', icon: <RobotOutlined />, label: 'AI分析' },
    { key: '/profile', icon: <UserOutlined />, label: '个人中心' },
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
            皓月量化智能引擎
          </div>
          <Space>
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
              <Avatar icon={<UserOutlined />} size="large" />
            </Dropdown>
          </Space>
        </StyledHeader>
        <Drawer
          title="导航菜单"
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