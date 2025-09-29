import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import styled from 'styled-components';

const { Title } = Typography;

interface LoginParams {
  username: string;
  password: string;
}

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
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const fromPath = (location.state as { from?: string })?.from || '/';

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (values: LoginParams) => {
    try {
      await dispatch(loginAsync(values)).unwrap();
      message.success('登录成功');
      navigate(fromPath, { replace: true });
    } catch (err) {
      // 错误已在reducer中处理
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
        
        {error && (
          <div style={{ marginBottom: 16, color: '#f5222d', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <Form
          form={form}
          name="login_form"
          onFinish={handleSubmit}
          initialValues={{ username: '', password: '' }}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名/邮箱"
            rules={[
              { required: true, message: '请输入用户名或邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名或邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能少于6位' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入密码"
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
              style={{ height: 48, fontSize: 16 }}
            >
              {loading ? <Spin size="small" /> : '登录'}
            </Button>
          </Form.Item>

          <Space style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 16 }}>
            <Link to="/forgot-password" style={{ color: '#1890ff' }}>忘记密码？</Link>
            <span style={{ color: '#666' }}>|</span>
            <Link to="/register" style={{ color: '#1890ff' }}>注册账号</Link>
          </Space>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;