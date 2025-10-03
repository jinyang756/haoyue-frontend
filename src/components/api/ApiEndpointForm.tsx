import React from 'react';
import { Form, Input, Select, Switch, Button, Modal, message } from 'antd';
import type { ApiEndpoint } from '../../models/Api';
import { useDispatch } from 'react-redux';
import { addApiEndpoint } from '../../store/slices/apiServiceSlice';
import type { AppDispatch } from '../../store';

interface ApiEndpointFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const ApiEndpointForm: React.FC<ApiEndpointFormProps> = ({ visible, onCancel, onSuccess }) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const newEndpoint: Omit<ApiEndpoint, 'id' | 'lastUpdated'> = {
        ...values,
        isPublic: values.isPublic || false,
        status: 'development' as const
      };

      await dispatch(addApiEndpoint(newEndpoint)).unwrap();
      message.success('API接口创建成功');
      form.resetFields();
      onCancel();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('创建API接口失败:', error);
      message.error('创建API接口失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="添加API接口"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ loading }}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          method: 'GET',
          isPublic: false
        }}
      >
        <Form.Item
          name="path"
          label="API路径"
          rules={[{ required: true, message: '请输入API路径' }]}
        >
          <Input placeholder="例如: /api/stocks" />
        </Form.Item>
        
        <Form.Item
          name="method"
          label="请求方法"
          rules={[{ required: true, message: '请选择请求方法' }]}
        >
          <Select>
            <Select.Option value="GET">GET</Select.Option>
            <Select.Option value="POST">POST</Select.Option>
            <Select.Option value="PUT">PUT</Select.Option>
            <Select.Option value="DELETE">DELETE</Select.Option>
            <Select.Option value="PATCH">PATCH</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="description"
          label="接口描述"
          rules={[{ required: true, message: '请输入接口描述' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入接口的详细描述" />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择接口分类' }]}
        >
          <Select placeholder="请选择分类">
            <Select.Option value="认证">认证</Select.Option>
            <Select.Option value="股票数据">股票数据</Select.Option>
            <Select.Option value="AI分析">AI分析</Select.Option>
            <Select.Option value="推荐">推荐</Select.Option>
            <Select.Option value="管理">管理</Select.Option>
            <Select.Option value="用户">用户</Select.Option>
            <Select.Option value="系统">系统</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="isPublic"
          label="是否公开"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item
          name="responseTime"
          label="预期响应时间(ms)"
          tooltip="预估的平均响应时间"
        >
          <Input type="number" placeholder="例如: 100" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApiEndpointForm;