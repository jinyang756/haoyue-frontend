import React, { useEffect, useState } from 'react';
import { Modal, Card, Tag, Divider, Descriptions, Button, message, Space, Input, Select, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, CodeOutlined, HistoryOutlined, SendOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ApiEndpoint } from '../../models/Api';
import { testApiEndpoint } from '../../services/apiService';
import { useDispatch } from 'react-redux';
import { removeApiEndpoint } from '../../store/slices/apiServiceSlice';
import type { AppDispatch } from '../../store';

interface ApiEndpointDetailProps {
  visible: boolean;
  endpoint: ApiEndpoint | null;
  onCancel: () => void;
  onEdit?: () => void;
  onDeleteSuccess?: () => void;
}

export const ApiEndpointDetail: React.FC<ApiEndpointDetailProps> = ({
  visible,
  endpoint,
  onCancel,
  onEdit,
  onDeleteSuccess
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // API测试相关状态
  const [testParams, setTestParams] = useState<Record<string, string>>({});
  const [testBody, setTestBody] = useState<string>('');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    // 确保组件卸载时清除状态
    return () => {
      // 清理函数
    };
  }, []);

  const handleDelete = () => {
    Modal.confirm({
      title: '确定要删除这个API接口吗？',
      content: '删除后将无法恢复，请谨慎操作。',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        try {
          if (endpoint) {
            setIsLoading(true);
            await dispatch(removeApiEndpoint(endpoint.id)).unwrap();
            message.success('API接口删除成功');
            onCancel();
            if (onDeleteSuccess) {
              onDeleteSuccess();
            }
          }
        } catch (error) {
          console.error('删除API接口失败:', error);
          message.error('删除API接口失败');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // API测试功能
  const handleTestApi = async () => {
    if (!endpoint) return;

    setIsTesting(true);
    try {
      // 将testParams和testBody合并为一个参数传入
      const result = await testApiEndpoint(endpoint.path, endpoint.method, {
        params: testParams,
        body: testBody
      });
      setTestResponse(result);
      message.success('API测试成功');
    } catch (error) {
      setTestResponse({ error: error instanceof Error ? error.message : '测试失败' });
      message.error('API测试失败');
      console.error('API测试失败:', error);
    } finally {
      setIsTesting(false);
    }
  };

  // 重置测试参数
  const handleResetTest = () => {
    setTestParams({});
    setTestBody('');
    setTestResponse(null);
  };

  // 当endpoint变化时重置测试状态
  useEffect(() => {
    if (visible && endpoint) {
      handleResetTest();
    }
  }, [visible, endpoint]);

  // 如果没有endpoint数据，不渲染内容
  if (!endpoint) {
    return null;
  }

  return (
    <Modal
      title="API接口详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <div style={{ marginBottom: 20 }}>
        <Space style={{ float: 'right' }}>
          <Button type="link" icon={<EditOutlined />} onClick={onEdit}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={handleDelete}>
            删除
          </Button>
        </Space>
        <h2 style={{ marginBottom: 10 }}>{endpoint.path}</h2>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <Tag color={
            endpoint.method === 'GET' ? 'green' :
            endpoint.method === 'POST' ? 'blue' :
            endpoint.method === 'PUT' ? 'orange' :
            endpoint.method === 'DELETE' ? 'red' : 'gray'
          }>
            {endpoint.method}
          </Tag>
          <Tag color="default">
            {endpoint.category}
          </Tag>
          <Tag color={
            endpoint.status === 'active' ? 'green' :
            endpoint.status === 'deprecated' ? 'orange' : 'default'
          }>
            {endpoint.status === 'active' ? '活跃' :
             endpoint.status === 'deprecated' ? '已废弃' : '开发中'}
          </Tag>
          <Tag color={endpoint.isPublic ? 'blue' : 'purple'}>
            {endpoint.isPublic ? '公开接口' : '需要认证'}
          </Tag>
        </div>
      </div>

      <Divider />

      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="接口描述">
          {endpoint.description}
        </Descriptions.Item>
        <Descriptions.Item label="最后更新时间">
          {new Date(endpoint.lastUpdated).toLocaleString('zh-CN')}
        </Descriptions.Item>
        {endpoint.responseTime && (
          <Descriptions.Item label="平均响应时间">
            {endpoint.responseTime} ms
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider />

      <div style={{ marginTop: 16 }}>
        <Card title="变更历史" size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>查看API接口的变更记录</p>
            <Button type="default" icon={<HistoryOutlined />}>查看历史</Button>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card title="API测试工具" size="small">
          {isTesting ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" tip="正在发送请求..." />
            </div>
          ) : (
            <div>
              <h4 style={{ marginBottom: 12 }}>请求参数</h4>
              <div style={{ marginBottom: 16 }}>
                {Object.entries(testParams).map(([key, value], index) => (
                  <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                    <Input
                      placeholder="参数名"
                      value={key}
                      onChange={(e) => {
                        const newParams = { ...testParams };
                        if (e.target.value) {
                          newParams[e.target.value] = value;
                          if (key !== e.target.value) delete newParams[key];
                        } else {
                          delete newParams[key];
                        }
                        setTestParams(newParams);
                      }}
                      style={{ width: 150, marginRight: 8 }}
                    />
                    <Input
                      placeholder="参数值"
                      value={value}
                      onChange={(e) => setTestParams({ ...testParams, [key]: e.target.value })}
                      style={{ flex: 1 }}
                    />
                  </div>
                ))}
                <Button type="dashed" onClick={() => setTestParams({ ...testParams, ['new_param']: '' })}>
                  添加参数
                </Button>
              </div>
              
              {['POST', 'PUT', 'PATCH'].includes(endpoint?.method || '') && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ marginBottom: 12 }}>请求体</h4>
                  <Input.TextArea
                    placeholder="JSON格式的请求体"
                    value={testBody}
                    onChange={(e) => setTestBody(e.target.value)}
                    rows={4}
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <Button type="primary" onClick={handleTestApi} icon={<SendOutlined />}>
                  发送请求
                </Button>
                <Button onClick={handleResetTest} icon={<ReloadOutlined />}>
                  重置
                </Button>
              </div>
              
              {testResponse !== null && (
                <div>
                  <h4 style={{ marginBottom: 12 }}>响应结果</h4>
                  <pre style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4, overflow: 'auto' }}>
                    {typeof testResponse === 'string' 
                      ? testResponse 
                      : JSON.stringify(testResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
};

export default ApiEndpointDetail;