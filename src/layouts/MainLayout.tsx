import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Avatar, Dropdown, Space } from 'antd';
import {
  HomeOutlined,
  LineChartOutlined,
  RobotOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { theme } from '../styles/theme';
import styled from 'styled-components';
import { ParticlesBackground } from '../components/ParticlesBackground';

const { Header, Sider, Content } = Layout;

const StyledSider = styled(Sider)`
  background-color: ${theme.darkBg};
  border-right: ${theme.border};
  box-shadow: ${theme.glow};
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState(false);

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
    { key: '/stocks', icon: <LineChartOutlined />, label: '股票分析' },
    { key: '/ai', icon: <RobotOutlined />, label: 'AI分析' },
    { key: '/profile', icon: <UserOutlined />, label: '个人中心' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ParticlesBackground />
      <StyledSider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Logo>皓月量化</Logo>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
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
            <Dropdown menu={{ items: userMenuItems }}>
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
            style={{ width: 250 }}
          />
        </Drawer>
        <StyledContent>{children}</StyledContent>
      </Layout>
    </Layout>
  );
};