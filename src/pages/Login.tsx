import React, { useState } from 'react';
import { Button, Card, Typography, Space, Input, Form, message } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const fromPath = (location.state as { from?: string })?.from || '/';

  // 处理登录请求
  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        message.success(t('login_success'));
        navigate(fromPath);
      } else {
        message.error(t('login_failed'));
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error(t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
            {t('login_welcome')}
          </Title>
          <div style={{ color: '#666' }}>{t('login_subtitle')}</div>
        </div>
        
        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: t('required_username') }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder={t('username')} 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('required_password') }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder={t('password')} 
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
              {t('login_button')}
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#666', fontSize: 14 }}>
            <p style={{ marginBottom: 8 }}>{t('login_subtitle')}</p>
            <p style={{ opacity: 0.7 }}>无需记忆多个密码，一次登录，全平台访问</p>
          </div>
        </div>
        
        <Space style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 32 }}>
          <Link to="/forgot-password" style={{ color: '#1890ff' }}>{t('forgot_password')}</Link>
          <span style={{ color: '#666' }}>|</span>
          <Link to="/register" style={{ color: '#1890ff' }}>{t('register_account')}</Link>
        </Space>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;