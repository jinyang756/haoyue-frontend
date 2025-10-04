import React, { useState, useEffect } from 'react';
import { Menu, Drawer, Button } from 'antd';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const MobileMenuButton = styled(Button)`
  color: white;
  display: block;
  @media (min-width: 1200px) {
    display: none;
  }
`;

const StyledDrawer = styled(Drawer)`
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

const NavigationMenu = styled(Menu)`
  background-color: ${theme.darkBg};
  border-right: none;
  
  .ant-menu-item {
    margin: 0;
    height: 50px;
    line-height: 50px;
  }
  
  .ant-menu-item-selected {
    background-color: rgba(0, 240, 255, 0.1) !important;
  }
  
  .ant-menu-item:hover {
    background-color: rgba(0, 240, 255, 0.05);
  }
`;

interface EnhancedNavigationProps {
  menuItems: Array<{
    key: string;
    icon: React.ReactNode;
    label: string;
  }>;
}

export const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({ menuItems }) => {
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useTranslation();

  // 处理菜单项点击，进行页面跳转
  const handleMenuClick = (e: any) => {
    // 添加页面切换动画效果
    document.body.style.opacity = '0.8';
    document.body.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      navigate(e.key);
      document.body.style.opacity = '1';
      document.body.style.transform = 'scale(1)';
    }, 150);
    
    setMobileDrawer(false);
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

  // 添加页面切换动画的CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        transition: opacity 0.15s ease, transform 0.15s ease;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* 桌面端导航 */}
      <div style={{ display: 'none' }} className="desktop-nav">
        <NavigationMenu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </div>
      
      {/* 移动端菜单按钮 */}
      <MobileMenuButton
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setMobileDrawer(true)}
      />
      
      {/* 移动端抽屉菜单 */}
      <StyledDrawer
        title={t('navigation_menu')}
        placement="left"
        onClose={() => setMobileDrawer(false)}
        open={mobileDrawer}
      >
        <NavigationMenu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </StyledDrawer>
    </>
  );
};

export default EnhancedNavigation;