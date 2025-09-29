import React from 'react';
import { Layout as AntLayout, Menu, Typography, Avatar, Dropdown, Button, Row, Col } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '@/store/slices/authSlice';
import { toggleSidebar } from '@/store/slices/uiSlice';
import {
  StockOutlined,
  LineChartOutlined,
  UserOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  DashboardOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = AntLayout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  requireVIP?: boolean;
  requireAdmin?: boolean;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { user, isVIP, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      dispatch(logoutAsync());
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ];

  const menuItems: MenuItem[] = [
    { key: '/', icon: <DashboardOutlined />, label: <Link to="/">仪表盘</Link> },
    { key: '/stocks', icon: <StockOutlined />, label: <Link to="/stocks">股票列表</Link> },
    { key: '/ai-analysis', icon: <LineChartOutlined />, label: <Link to="/ai-analysis">AI分析</Link> }
  ];

  if (isVIP) {
    menuItems.push({
      key: '/ai-analysis/premium',
      icon: <LineChartOutlined />,
      label: <Link to="/ai-analysis/premium">高级分析</Link>,
      requireVIP: true
    });
  }

  if (isAdmin) {
    menuItems.push(
      {
        key: '/admin',
        icon: <DashboardOutlined />,
        label: <Link to="/admin">管理中心</Link>,
        requireAdmin: true
      },
      {
        key: '/admin/users',
        icon: <UserOutlined />,
        label: <Link to="/admin/users">用户管理</Link>,
        requireAdmin: true
      }
    );
  }

  const filteredMenuItems = menuItems.filter(item => {
    if (item.requireVIP && !isVIP) return false;
    if (item.requireAdmin && !isAdmin) return false;
    return true;
  });

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        style={{
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          color: 'white',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <Typography.Title 
            level={5} 
            style={{ color: 'white', margin: 0, marginLeft: collapsed ? 0 : 8 }}
          >
            {collapsed ? '皓月' : '皓月量化'}
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={filteredMenuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
          theme="dark"
          style={{ borderRight: 0 }}
        />
      </Sider>
      <AntLayout>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          
          {user && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography.Text style={{ marginRight: 16 }}>
                欢迎, {user.username} ({user.role})
              </Typography.Text>
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: ({ key }) => handleMenuClick(key as string)
                }}
                placement="bottomRight"
              >
                <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          minHeight: 280,
          borderRadius: 8
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;