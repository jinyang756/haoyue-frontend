import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, message, Divider, Alert, Space } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import request from '../services/request';

const { Title, Text } = Typography;

const BackendConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'connected' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [portInfo, setPortInfo] = useState<{ frontendPort: string | null; backendPort: string | null }>({
    frontendPort: null,
    backendPort: null
  });

  useEffect(() => {
    // 获取环境变量中的API_URL
    if (process.env.REACT_APP_API_URL) {
      setApiUrl(process.env.REACT_APP_API_URL);
    }
  }, []);

  const testConnection = async () => {
    setStatus('testing');
    setError(null);
    setResponseTime(null);

    try {
      const startTime = performance.now();
      // 调用后端健康检查API
      const response = await request.get('/api/health');
      const endTime = performance.now();
      
      setResponseTime(Math.round(endTime - startTime));
      setStatus('connected');
      message.success('成功连接到后端服务器！');
    } catch (err: any) {
      setStatus('failed');
      setError(err.message || '连接失败，请检查后端服务是否运行。');
      message.error('连接后端服务器失败');
    }
  };

  const handlePingBackend = async () => {
    setStatus('testing');
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/health`);
      const data = await response.json();
      setStatus('connected');
      message.success('直接ping后端成功！');
    } catch (err: any) {
      setStatus('failed');
      setError(`直接ping后端失败: ${err.message}`);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'green';
      case 'failed':
        return 'red';
      case 'testing':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircleOutlined className="text-green-500" />
      case 'failed':
        return <CloseCircleOutlined className="text-red-500" />
      case 'testing':
        return <InfoCircleOutlined className="text-blue-500" />
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return '已连接';
      case 'failed':
        return '连接失败';
      case 'testing':
        return '测试中...';
      default:
        return '未测试';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>前后端连接测试</Title>
      
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>连接配置信息</Title>
          <Space direction="vertical" size="middle" style={{ display: 'block' }}>
            <div>
              <Text strong>前端API URL:</Text>
              <Text style={{ marginLeft: '8px' }}>{apiUrl || '未设置'}</Text>
            </div>
            <div>
              <Text strong>代理配置:</Text>
              <Text style={{ marginLeft: '8px' }}>/api 前缀的请求会被代理到API URL</Text>
            </div>
            <div>
              <Text strong>环境变量:</Text>
              <Text style={{ marginLeft: '8px' }}>REACT_APP_API_URL</Text>
            </div>
          </Space>
        </div>
        
        <Divider />
        
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>连接状态</Title>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
            {getStatusIcon()}
            <Text strong style={{ marginLeft: '8px', color: getStatusColor() }}>
              {getStatusText()}
            </Text>
            {responseTime && (
              <Text style={{ marginLeft: '16px', color: 'grey' }}>响应时间: {responseTime}ms</Text>
            )}
          </div>
          
          {error && (
            <Alert message="错误信息" description={error} type="error" style={{ marginTop: '16px' }} />
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<ReloadOutlined />} 
            onClick={testConnection}
            loading={status === 'testing'}
            style={{ flex: 1 }}
          >
            测试代理连接
          </Button>
          
          <Button 
            size="large" 
            onClick={handlePingBackend}
            loading={status === 'testing'}
            style={{ flex: 1 }}
          >
            直接Ping后端
          </Button>
        </div>
        
        {status === 'failed' && (
          <div style={{ marginTop: '24px' }}>
            <Alert 
              message="排查建议" 
              type="info" 
              description={
                <ul style={{ margin: 0, textAlign: 'left' }}>
                  <li>确保后端服务已启动 (运行 npm run dev)</li>
                  <li>检查后端端口是否为5000</li>
                  <li>确认.env.development中的REACT_APP_API_URL设置正确</li>
                  <li>检查防火墙是否阻止了连接</li>
                  <li>重启前端和后端服务</li>
                </ul>
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default BackendConnectionTest;