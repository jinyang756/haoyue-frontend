import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Space, 
  Row, 
  Col, 
  Typography, 
  Collapse, 
  Table, 
  Tag, 
  Spin, 
  message,
  Form,
  InputNumber,
  Switch,
  List
} from 'antd';
import { 
  SendOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  HistoryOutlined,
  SaveOutlined,
  PlayCircleOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { 
  ApiTestRequestConfig, 
  ApiTestResponse, 
  ApiTestHistory,
  ApiEnvironment
} from '../../models/Api';
import { sampleTestRequests, sampleTestHistory, sampleEnvironments } from '../../utils/testData';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

// Mock monaco editor component since it's not available in test environment
const MockEditor: React.FC<{ 
  height?: string; 
  language?: string; 
  value?: string; 
  onChange?: (value: string) => void;
  theme?: string;
}> = ({ value, onChange }) => {
  return (
    <Input.TextArea
      rows={8}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      style={{ fontFamily: 'monospace', fontSize: 12 }}
      placeholder="请输入内容..."
    />
  );
};

const ApiTester: React.FC = () => {
  // 请求配置状态
  const [requestConfig, setRequestConfig] = useState<ApiTestRequestConfig>({
    id: '',
    url: '',
    method: 'GET',
    headers: {},
    body: '',
    queryParams: {},
    environment: 'default'
  });
  
  // 响应状态
  const [response, setResponse] = useState<ApiTestResponse | null>(null);
  
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  
  // 历史记录状态
  const [history, setHistory] = useState<ApiTestHistory[]>(sampleTestHistory);
  
  // 环境配置状态
  const [environments] = useState<ApiEnvironment[]>(sampleEnvironments);
  
  // 表单实例
  const [form] = Form.useForm();
  
  // Header和Query参数状态
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([
    { key: 'Content-Type', value: 'application/json' }
  ]);
  
  const [queryParams, setQueryParams] = useState<Array<{ key: string; value: string }>>([]);

  // 当requestConfig变化时，更新表单和相关状态
  useEffect(() => {
    form.setFieldsValue({
      url: requestConfig.url,
      method: requestConfig.method,
      environment: requestConfig.environment
    });
    
    // 更新headers状态
    const newHeaders = Object.entries(requestConfig.headers).map(([key, value]) => ({
      key,
      value
    }));
    setHeaders(newHeaders);
    
    // 更新queryParams状态
    const newQueryParams = Object.entries(requestConfig.queryParams).map(([key, value]) => ({
      key,
      value
    }));
    setQueryParams(newQueryParams);
  }, [requestConfig, form]);

  // 处理URL变化
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestConfig({
      ...requestConfig,
      url: e.target.value
    });
  };

  // 处理方法变化
  const handleMethodChange = (value: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') => {
    setRequestConfig({
      ...requestConfig,
      method: value
    });
  };

  // 处理环境变化
  const handleEnvironmentChange = (value: string) => {
    setRequestConfig({
      ...requestConfig,
      environment: value
    });
  };

  // 添加Header
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  // 删除Header
  const removeHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  // 更新Header
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  // 添加Query参数
  const addQueryParams = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };

  // 删除Query参数
  const removeQueryParams = (index: number) => {
    const newQueryParams = [...queryParams];
    newQueryParams.splice(index, 1);
    setQueryParams(newQueryParams);
  };

  // 更新Query参数
  const updateQueryParams = (index: number, field: 'key' | 'value', value: string) => {
    const newQueryParams = [...queryParams];
    newQueryParams[index][field] = value;
    setQueryParams(newQueryParams);
  };

  // 发送请求
  const sendRequest = async () => {
    // 验证URL
    if (!requestConfig.url) {
      message.error('请输入请求URL');
      return;
    }

    // 构建完整的请求配置
    const fullRequestConfig: ApiTestRequestConfig = {
      ...requestConfig,
      headers: headers.reduce((acc, header) => {
        if (header.key && header.value) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {} as Record<string, string>),
      queryParams: queryParams.reduce((acc, param) => {
        if (param.key && param.value) {
          acc[param.key] = param.value;
        }
        return acc;
      }, {} as Record<string, string>)
    };

    setLoading(true);
    setResponse(null);

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 生成模拟响应
      const mockResponse: ApiTestResponse = {
        statusCode: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': '1234',
          'Server': 'Mock Server'
        },
        body: JSON.stringify({
          message: 'This is a mock response',
          data: {
            id: 1,
            name: 'Test Data',
            timestamp: new Date().toISOString()
          }
        }, null, 2),
        responseTime: Math.floor(Math.random() * 500) + 100,
        timestamp: new Date().toISOString()
      };

      setResponse(mockResponse);
      
      // 保存到历史记录
      const historyItem: ApiTestHistory = {
        id: `hist-${Date.now()}`,
        request: fullRequestConfig,
        response: mockResponse,
        success: true
      };
      
      setHistory([historyItem, ...history.slice(0, 99)]); // 限制历史记录数量
      
      message.success('请求发送成功');
    } catch (error) {
      message.error('请求发送失败');
    } finally {
      setLoading(false);
    }
  };

  // 从历史记录加载请求
  const loadFromHistory = (historyItem: ApiTestHistory) => {
    setRequestConfig(historyItem.request);
    setResponse(historyItem.response);
  };

  // 重新执行历史记录中的请求
  const reExecuteHistory = async (historyItem: ApiTestHistory) => {
    setRequestConfig(historyItem.request);
    setResponse(null);
    
    setLoading(true);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setResponse(historyItem.response);
      message.success('请求重新执行成功');
    } catch (error) {
      message.error('请求重新执行失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除历史记录
  const deleteHistory = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  // 保存当前请求到历史记录
  const saveToHistory = () => {
    if (!requestConfig.url) {
      message.error('请输入请求URL');
      return;
    }

    const fullRequestConfig: ApiTestRequestConfig = {
      ...requestConfig,
      headers: headers.reduce((acc, header) => {
        if (header.key && header.value) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {} as Record<string, string>),
      queryParams: queryParams.reduce((acc, param) => {
        if (param.key && param.value) {
          acc[param.key] = param.value;
        }
        return acc;
      }, {} as Record<string, string>)
    };

    const historyItem: ApiTestHistory = {
      id: `hist-${Date.now()}`,
      request: fullRequestConfig,
      response: response || {
        statusCode: 0,
        statusText: '',
        headers: {},
        body: '',
        responseTime: 0,
        timestamp: new Date().toISOString()
      },
      success: true
    };

    setHistory([historyItem, ...history.slice(0, 99)]);
    message.success('请求已保存到历史记录');
  };

  // 格式化JSON
  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  return (
    <div>
      <Card title={
        <Space>
          <PlayCircleOutlined />
          <span>API测试工具</span>
        </Space>
      }>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item label="请求URL">
                    <Input
                      placeholder="请输入API端点URL，例如: https://api.example.com/users"
                      value={requestConfig.url}
                      onChange={handleUrlChange}
                      addonBefore={
                        <Select 
                          value={requestConfig.method} 
                          onChange={handleMethodChange}
                          style={{ width: 100 }}
                        >
                          <Option value="GET">GET</Option>
                          <Option value="POST">POST</Option>
                          <Option value="PUT">PUT</Option>
                          <Option value="DELETE">DELETE</Option>
                          <Option value="PATCH">PATCH</Option>
                        </Select>
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="环境">
                    <Select 
                      value={requestConfig.environment} 
                      onChange={handleEnvironmentChange}
                    >
                      {environments.map(env => (
                        <Option key={env.id} value={env.id}>{env.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="&nbsp;">
                    <Space>
                      <Button 
                        type="primary" 
                        icon={<SendOutlined />} 
                        onClick={sendRequest}
                        loading={loading}
                      >
                        发送请求
                      </Button>
                      <Button 
                        icon={<SaveOutlined />} 
                        onClick={saveToHistory}
                      >
                        保存
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>

        <Collapse defaultActiveKey={['headers', 'query', 'body']} ghost>
          <Panel header="请求头 (Headers)" key="headers">
            <Button 
              type="dashed" 
              onClick={addHeader} 
              icon={<PlusOutlined />}
              style={{ marginBottom: 16 }}
            >
              添加Header
            </Button>
            {headers.map((header, index) => (
              <Row key={index} gutter={8} style={{ marginBottom: 8 }}>
                <Col span={10}>
                  <Input
                    placeholder="Header名称"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  />
                </Col>
                <Col span={10}>
                  <Input
                    placeholder="Header值"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  />
                </Col>
                <Col span={4}>
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeHeader(index)}
                    danger
                  />
                </Col>
              </Row>
            ))}
          </Panel>

          <Panel header="查询参数 (Query Parameters)" key="query">
            <Button 
              type="dashed" 
              onClick={addQueryParams} 
              icon={<PlusOutlined />}
              style={{ marginBottom: 16 }}
            >
              添加参数
            </Button>
            {queryParams.map((param, index) => (
              <Row key={index} gutter={8} style={{ marginBottom: 8 }}>
                <Col span={10}>
                  <Input
                    placeholder="参数名称"
                    value={param.key}
                    onChange={(e) => updateQueryParams(index, 'key', e.target.value)}
                  />
                </Col>
                <Col span={10}>
                  <Input
                    placeholder="参数值"
                    value={param.value}
                    onChange={(e) => updateQueryParams(index, 'value', e.target.value)}
                  />
                </Col>
                <Col span={4}>
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeQueryParams(index)}
                    danger
                  />
                </Col>
              </Row>
            ))}
          </Panel>

          <Panel header="请求体 (Body)" key="body">
            <MockEditor
              height="200px"
              language="json"
              value={requestConfig.body}
              onChange={(value) => setRequestConfig({ ...requestConfig, body: value })}
            />
          </Panel>
        </Collapse>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="响应" extra={response && `${response.responseTime}ms`}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin tip="正在发送请求..." />
              </div>
            ) : response ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Tag color={response.statusCode >= 200 && response.statusCode < 300 ? 'green' : 'red'}>
                    {response.statusCode} {response.statusText}
                  </Tag>
                  <Text type="secondary" style={{ marginLeft: 16 }}>
                    响应时间: {response.responseTime}ms
                  </Text>
                </div>
                
                <Collapse ghost>
                  <Panel header="响应头" key="response-headers">
                    <Table
                      size="small"
                      pagination={false}
                      dataSource={Object.entries(response.headers).map(([key, value]) => ({
                        key,
                        value
                      }))}
                      columns={[
                        { title: 'Header', dataIndex: 'key', key: 'key' },
                        { title: 'Value', dataIndex: 'value', key: 'value' }
                      ]}
                    />
                  </Panel>
                  
                  <Panel header="响应体" key="response-body">
                    <MockEditor
                      height="300px"
                      language="json"
                      value={formatJson(response.body)}
                      onChange={() => {}} // 只读
                    />
                  </Panel>
                </Collapse>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <HistoryOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>发送请求后，响应将显示在这里</p>
              </div>
            )}
          </Card>
        </Col>
        
        <Col span={12}>
          <Card 
            title={
              <Space>
                <HistoryOutlined />
                <span>历史记录</span>
              </Space>
            }
            extra={<Text type="secondary">{history.length} 条记录</Text>}
          >
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <HistoryOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>暂无历史记录</p>
              </div>
            ) : (
              <List
                dataSource={history}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        size="small" 
                        icon={<PlayCircleOutlined />}
                        onClick={() => reExecuteHistory(item)}
                      >
                        重新执行
                      </Button>,
                      <Button 
                        type="link" 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => loadFromHistory(item)}
                      >
                        加载
                      </Button>,
                      <Button 
                        type="link" 
                        size="small" 
                        icon={<DeleteOutlined />}
                        onClick={() => deleteHistory(item.id)}
                        danger
                      >
                        删除
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag color={item.request.method === 'GET' ? 'blue' : item.request.method === 'POST' ? 'green' : item.request.method === 'PUT' ? 'orange' : 'red'}>
                            {item.request.method}
                          </Tag>
                          <Text ellipsis style={{ maxWidth: 200 }}>{item.request.url}</Text>
                        </Space>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(item.response.timestamp).toLocaleString()}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ApiTester;