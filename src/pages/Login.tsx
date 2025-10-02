import React, { useState } from 'react';
import { Button, Card, Typography, Space, Input, Form, message } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import styled from 'styled-components';

const { Title } = Typography;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const fromPath = (location.state as { from?: string })?.from || '/';

  // 处理登录请求
  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        message.success('登录成功');
        navigate(fromPath);
      } else {
        message.error('登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
            皓月量化智能引擎
          </Title>
          <div style={{ color: '#666' }}>专业的AI股票分析平台</div>
        </div>
        
        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              block 
              size="large"
              loading={loading}
              style={{ height: 48, fontSize: 16, marginBottom: 24 }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#666', fontSize: 14 }}>
            <p style={{ marginBottom: 8 }}>使用皓月量化账户登录</p>
            <p style={{ opacity: 0.7 }}>无需记忆多个密码，一次登录，全平台访问</p>
          </div>
        </div>
        
        <Space style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 32 }}>
          <Link to="/forgot-password" style={{ color: '#1890ff' }}>忘记密码？</Link>
          <span style={{ color: '#666' }}>|</span>
          <Link to="/register" style={{ color: '#1890ff' }}>注册账号</Link>
        </Space>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;