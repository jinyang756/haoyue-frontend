import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Avatar, Typography, Space, message, Upload, Spin, Tag } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword } from '@/services/authservice';
import { fetchUserAsync } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { setUserInfo } from '@/utils/auth';

const { Title, Text } = Typography;
const { Meta } = Card;

interface ProfileFormValues {
  username: string;
  email: string;
  avatar?: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        username: user.username,
        email: user.email
      });
      setAvatarUrl(user.avatar || '');
    }
  }, [user, profileForm]);

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    setProfileLoading(true);
    try {
      const updatedUser = await updateProfile(values);
      message.success('个人信息更新成功');
      dispatch(fetchUserAsync());
      setUserInfo(updatedUser);
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: PasswordFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('新密码和确认密码不一致');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(values);
      message.success('密码修改成功，请重新登录');
      passwordForm.resetFields();
      // 这里可以添加登出逻辑
    } catch (error) {
      message.error('密码修改失败，请检查原密码是否正确');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response.url);
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  if (loading || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>个人中心</Title>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {/* 个人信息 */}
        <div style={{ flex: '0 0 300px', maxWidth: '300px' }}>
          <Card>
            <Meta
              avatar={
                <Avatar size={64} icon={<UserOutlined />} src={avatarUrl}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={user.username}
              description={user.email}
            />
            
            <div style={{ marginTop: 24 }}>
              <Upload
                name="avatar"
                action="/api/upload/avatar"
                listType="picture-circle"
                showUploadList={false}
                onChange={handleAvatarChange}
              >
                <Button icon={<UploadOutlined />} size="small">
                  更换头像
                </Button>
              </Upload>
            </div>
            
            <div style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>用户角色：</Text>
                <Tag color={user.role === 'admin' ? 'red' : user.role === 'vip' ? 'gold' : 'blue'}>
                  {user.role === 'admin' ? '管理员' : user.role === 'vip' ? 'VIP用户' : '普通用户'}
                </Tag>
              </div>
              
              <div style={{ marginBottom: 8 }}>
                <Text strong>注册时间：</Text>
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              
              <div>
                <Text strong>最后登录：</Text>
                {new Date(user.updatedAt).toLocaleString()}
              </div>
            </div>
          </Card>
        </div>
        
        {/* 个人信息编辑 */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <Card title="编辑个人信息">
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileSubmit}
              initialValues={{
                username: user.username,
                email: user.email
              }}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, max: 20, message: '用户名长度在3-20之间' }
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={profileLoading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Card>
          
          {/* 修改密码 */}
          <Card title="修改密码" style={{ marginTop: 24 }}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordSubmit}
            >
              <Form.Item
                name="currentPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度不能少于6位' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    }
                  })
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={passwordLoading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;