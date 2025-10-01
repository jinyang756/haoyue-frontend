import React, { useEffect } from 'react';
import { Button, Card, Typography, Space, Spin } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
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
  const { loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  
  const fromPath = (location.state as { from?: string })?.from || '/';

  // 处理登录请求
  const handleLogin = async () => {
    try {
      // 将当前路径作为state传递，登录后可以重定向回此路径
      await loginWithRedirect({
        appState: {
          returnTo: fromPath
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
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
        
        <div style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            block 
            size="large"
            onClick={handleLogin}
            loading={isLoading}
            style={{ height: 48, fontSize: 16, marginBottom: 24 }}
          >
            {isLoading ? <Spin size="small" /> : '使用Auth0登录'}
          </Button>
          
          <div style={{ color: '#666', fontSize: 14 }}>
            <p style={{ marginBottom: 8 }}>通过Auth0安全登录</p>
            <p style={{ opacity: 0.7 }}>无需记忆多个密码，一次登录，全平台访问</p>
          </div>
        </div>
        
        {/* 为了向后兼容，我们仍然保留忘记密码和注册账号的链接，但它们的实现可能需要调整 */}
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