import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Switch, Typography } from 'antd';
import { setOfflineMode, isOfflineMode } from '@/utils/offlineMode';

const { Title, Paragraph } = Typography;

const OfflineModeToggle: React.FC = () => {
  const [offlineMode, setOfflineModeState] = useState(isOfflineMode());
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setOfflineModeState(isOfflineMode());
  }, []);

  const toggleOfflineMode = () => {
    const newMode = !offlineMode;
    setOfflineMode(newMode);
    setOfflineModeState(newMode);
    setStatusMessage(newMode ? '已切换到离线模式' : '已切换到在线模式');
    
    // 2秒后清除状态消息
    setTimeout(() => {
      setStatusMessage('');
    }, 2000);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="离线模式设置" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ marginRight: '12px' }}>离线模式:</span>
          <Switch 
            checked={offlineMode} 
            onChange={toggleOfflineMode} 
            checkedChildren="开启" 
            unCheckedChildren="关闭" 
          />
        </div>
        
        <Paragraph>
          离线模式允许您在没有后端连接的情况下测试前端功能。
          在此模式下，所有API调用将返回模拟数据。
        </Paragraph>
        
        <div style={{ marginTop: '16px' }}>
          <Button 
            type="primary" 
            onClick={handleRefresh}
            style={{ marginRight: '12px' }}
          >
            刷新页面
          </Button>
          <Button onClick={toggleOfflineMode}>
            {offlineMode ? '关闭离线模式' : '开启离线模式'}
          </Button>
        </div>
      </Card>
      
      {statusMessage && (
        <Alert 
          message={statusMessage} 
          type="success" 
          showIcon 
          style={{ marginBottom: '24px' }}
        />
      )}
      
      <Card title="使用说明">
        <ul>
          <li>开启离线模式后，前端将完全独立运行，不依赖后端服务</li>
          <li>所有数据将使用模拟数据展示</li>
          <li>您可以测试所有前端功能，包括登录、分析等</li>
          <li>刷新页面以应用模式更改</li>
        </ul>
      </Card>
    </div>
  );
};

export default OfflineModeToggle;