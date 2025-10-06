import React from 'react';
import { Menu, MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';
import styled from 'styled-components';

// 导航容器样式
const NavigationContainer = styled.div`
  background-color: ${theme.darkBg};
  width: 100%;
`;

// 菜单项样式
const StyledMenu = styled(Menu)`
  background-color: transparent !important;
  border-right: none !important;
  width: 100%;
  
  .ant-menu-item {
    transition: all 0.3s ease;
    border-radius: 4px;
    margin: 2px 8px;
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    
    &:hover {
      background-color: rgba(64, 169, 255, 0.1) !important;
      color: ${theme.neonBlue} !important;
    }
    
    &.ant-menu-item-selected {
      background-color: rgba(64, 169, 255, 0.2) !important;
      color: ${theme.neonBlue} !important;
    }
  }
`;

// 导航组件属性
interface EnhancedNavigationProps {
  menuItems: MenuProps['items'];
}

export const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({ menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 获取当前活动菜单项的key
  const getCurrentKey = (): string => {
    // 检查menuItems是否存在
    if (!menuItems || menuItems.length === 0) {
      return '';
    }

    // 如果当前路径在菜单项中，返回对应的key
    const matchingItem = menuItems.find(item => {
      if (!item || !item.key) return false;
      const itemKey = String(item.key);
      return itemKey === location.pathname;
    });
    
    if (matchingItem && matchingItem.key) {
      return String(matchingItem.key);
    }
    
    // 如果是子路径，返回父路径
    const parentPath = location.pathname.split('/')[1];
    const parentItem = menuItems.find(item => {
      if (!item || !item.key) return false;
      const itemKey = String(item.key);
      return itemKey.includes(parentPath);
    });
    
    if (parentItem && parentItem.key) {
      return String(parentItem.key);
    }
    
    // 默认返回第一个菜单项的key
    const firstItem = menuItems[0];
    const firstItemKey = firstItem?.key;
    return firstItemKey ? String(firstItemKey) : '';
  };

  // 处理菜单项点击事件
  const handleMenuClick = (e: any) => {
    console.log('Menu item clicked:', e.key);
    try {
      navigate(String(e.key));
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <NavigationContainer>
      <StyledMenu
        mode="inline"
        theme="dark"
        items={menuItems}
        onClick={handleMenuClick}
        selectedKeys={[getCurrentKey()]}
      />
    </NavigationContainer>
  );
};

export default EnhancedNavigation;