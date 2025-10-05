import React, { useState, useEffect } from 'react';
import { Card, Tabs, Row, Col, Button, Input, Select, DatePicker, Statistic, Badge, Tooltip, Typography, Table, Radio, Spin, Modal, Form, Tag, Switch, Space, message, InputNumber } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { 
  ApiOutlined, 
  MonitorOutlined, 
  IeOutlined, 
  DatabaseOutlined, 
  FileTextOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  DownloadOutlined,
  UploadOutlined,
  BarChartOutlined,
  ReloadOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ApiEndpointForm from '../components/api/ApiEndpointForm';
import ApiEndpointDetail from '../components/api/ApiEndpointDetail';
import ApiTester from '../components/api/ApiTester';
import type { TabsProps } from 'antd';
import ECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { RootState, AppDispatch } from '../store';
import { Pagination } from 'antd';
import { 
  fetchApiEndpoints,
  fetchApiStats,
  setFilters,
  selectApiEndpoints,
  selectApiStats,
  selectApiFilters
} from '../store/slices/apiServiceSlice';
import type { ApiEndpoint, ApiStats, ApiQueryParams } from '../models/Api';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 默认的模拟数据，确保页面始终有内容显示
const defaultApiEndpoints: ApiEndpoint[] = [
  {
    id: '1',
    path: '/api/auth/login',
    method: 'POST',
    description: '用户登录接口',
    category: '认证',
    isPublic: true,
    status: 'active',
    lastUpdated: '2024-01-15T10:30:00Z',
    responseTime: 120
  },
  {
    id: '2',
    path: '/api/stocks',
    method: 'GET',
    description: '获取股票列表',
    category: '股票数据',
    isPublic: false,
    status: 'active',
    lastUpdated: '2024-01-10T14:20:00Z',
    responseTime: 85
  },
  {
    id: '3',
    path: '/api/analysis',
    method: 'POST',
    description: '创建AI分析任务',
    category: 'AI分析',
    isPublic: false,
    status: 'active',
    lastUpdated: '2024-01-20T09:45:00Z',
    responseTime: 250
  },
  {
    id: '4',
    path: '/api/admin/users',
    method: 'GET',
    description: '获取用户列表（管理员）',
    category: '管理',
    isPublic: false,
    status: 'active',
    lastUpdated: '2024-01-05T16:10:00Z',
    responseTime: 180
  },
  {
    id: '5',
    path: '/api/recommendations',
    method: 'GET',
    description: '获取股票推荐',
    category: '推荐',
    isPublic: false,
    status: 'development',
    lastUpdated: '2024-01-25T11:30:00Z'
  }
];

const defaultApiStats: ApiStats = {
  totalRequests: 15428,
  successfulRequests: 14892,
  failedRequests: 536,
  averageResponseTime: 128,
  endpoints: {
    '/api/stocks': {
      requests: 5432,
      successRate: 98.2,
      avgResponseTime: 85,
      errors: 98
    },
    '/api/analysis': {
      requests: 2156,
      successRate: 94.7,
      avgResponseTime: 245,
      errors: 114
    },
    '/api/auth/login': {
      requests: 3245,
      successRate: 99.1,
      avgResponseTime: 112,
      errors: 29
    },
    '/api/admin/users': {
      requests: 876,
      successRate: 97.8,
      avgResponseTime: 178,
      errors: 19
    },
    '/api/recommendations': {
      requests: 456,
      successRate: 89.2,
      avgResponseTime: 320,
      errors: 50
    }
  },
  timeRange: {
    start: '2024-01-01T00:00:00Z',
    end: '2024-01-31T23:59:59Z'
  }
};

// API文档标签页组件
const ApiDocumentationTab: React.FC = () => {
  const [swaggerUrl, setSwaggerUrl] = useState<string>('https://petstore.swagger.io/v2/swagger.json');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [docType, setDocType] = useState<'swagger' | 'markdown'>('swagger');
  const [swaggerFiles, setSwaggerFiles] = useState<string[]>(['默认API文档 (petstore.swagger.io)']);
  const [selectedSwaggerFile, setSelectedSwaggerFile] = useState<string>('默认API文档 (petstore.swagger.io)');
  // 版本管理状态
  const [versions, setVersions] = useState<Array<{id: string, name: string, date: string, description: string}>>([
    {id: 'v1.0.0', name: 'v1.0.0', date: '2023-06-15', description: '初始版本'},
    {id: 'v1.1.0', name: 'v1.1.0', date: '2023-07-20', description: '新增用户模块API'},
    {id: 'v2.0.0', name: 'v2.0.0', date: '2023-10-05', description: '重构API结构，优化响应格式'},
  ]);
  const [currentVersion, setCurrentVersion] = useState<string>('v2.0.0');
  const [showVersionModal, setShowVersionModal] = useState<boolean>(false);
  const [newVersion, setNewVersion] = useState<{name: string, description: string}>({name: '', description: ''});

  const handleLoadSwagger = () => {
    setIsLoading(true);
    // 模拟加载过程
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleUploadSwagger = () => {
    message.info('请选择本地Swagger文件');
    // 这里可以实现实际的文件上传逻辑
  };

  return (
    <div>
      <Card title="API文档管理">
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{ margin: 0 }}>API文档集成</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>文档类型:</span>
                <Radio.Group value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <Radio.Button value="swagger">Swagger</Radio.Button>
                  <Radio.Button value="markdown">Markdown</Radio.Button>
                </Radio.Group>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {docType === 'swagger' && (
                <>
                  <Input
                    placeholder="输入Swagger JSON URL"
                    value={swaggerUrl}
                    onChange={(e) => setSwaggerUrl(e.target.value)}
                    style={{ width: 300 }}
                  />
                  <Button onClick={handleLoadSwagger} type="primary">加载</Button>
                </>
              )}
              <Button style={{ marginRight: 8 }}>生成文档</Button>
              <Button style={{ marginRight: 8 }} icon={<FileTextOutlined />}>下载文档</Button>
              <Button type="dashed" onClick={handleUploadSwagger}>上传文档</Button>
            </div>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ marginRight: 8 }}>已加载文档:</span>
              <Select
                value={selectedSwaggerFile}
                onChange={setSelectedSwaggerFile}
                style={{ width: 300 }}
                options={swaggerFiles.map(file => ({ label: file, value: file }))}
              />
            </div>
          </Col>
        </Row>
        
        {isLoading ? (
          <div style={{ height: 600, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" tip="加载Swagger文档中..." />
          </div>
        ) : (
          <div style={{ height: 600, position: 'relative', border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
            {docType === 'swagger' ? (
              <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2>Swagger API文档示例</h2>
                  <p style={{ color: '#8c8c8c' }}>Pet Store API - 这是一个示例文档</p>
                </div>
                  
                <div style={{ marginBottom: 24 }}>
                  <h3>基本信息</h3>
                  <div style={{ backgroundColor: '#fafafa', padding: 16, borderRadius: 4, marginBottom: 16 }}>
                    <p><strong>版本:</strong> 1.0.0</p>
                    <p><strong>主机:</strong> petstore.swagger.io</p>
                    <p><strong>基础路径:</strong> /v2</p>
                    <p><strong>协议:</strong> HTTP, HTTPS</p>
                  </div>
                </div>
                  
                <div>
                  <h3>API端点</h3>
                  {['/pet', '/store', '/user'].map((path, index) => (
                    <Card key={index} title={path} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
                          <Tag key={method} color={method === 'GET' ? 'blue' : method === 'POST' ? 'green' : method === 'PUT' ? 'orange' : 'red'}>
                            {method}
                          </Tag>
                        ))}
                      </div>
                      <p style={{ marginTop: 8, color: '#8c8c8c' }}>该端点提供宠物相关操作</p>
                      <div style={{ marginTop: 8 }}>
                        <Button size="small" type="link" icon={<LinkOutlined />}>查看详情</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, height: '100%', overflow: 'auto', fontFamily: 'monospace' }}>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
{`# API文档

## 简介
这是一个Markdown格式的API文档示例。

## API端点列表

### GET /api/endpoint
获取资源的API端点

#### 参数
- \`id\`: 资源ID (必填)

#### 响应
- 200: 成功返回资源详情
- 404: 资源不存在

### POST /api/endpoint
创建新资源的API端点

#### 请求体
\`\`\`json
{
  "name": "资源名称",
  "description": "资源描述"
}
\`\`\`

## 认证方式
API使用Bearer Token认证
`}</pre>
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* 版本管理卡片 */}
      <Card title="API版本管理" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ marginRight: 16 }}>当前版本: <strong>{currentVersion}</strong></span>
            <Button type="primary" onClick={() => setShowVersionModal(true)}>
              新建版本
            </Button>
          </div>
        </div>
        
        <Table
          columns={[
            {
              title: '版本号',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '发布日期',
              dataIndex: 'date',
              key: 'date',
            },
            {
              title: '版本描述',
              dataIndex: 'description',
              key: 'description',
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <div>
                  {record.id !== currentVersion ? (
                    <Button size="small" onClick={() => setCurrentVersion(record.id)}>
                      切换到此版本
                    </Button>
                  ) : (
                    <Badge status="success" text="当前版本" />
                  )}
                </div>
              ),
            },
          ]}
          dataSource={versions}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
      
      {/* 新建版本模态框 */}
      <Modal
        title="新建API文档版本"
        open={showVersionModal}
        onCancel={() => setShowVersionModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowVersionModal(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            setVersions([...versions, {id: newVersion.name, name: newVersion.name, date: today, description: newVersion.description}]);
            setCurrentVersion(newVersion.name);
            setShowVersionModal(false);
            setNewVersion({name: '', description: ''});
          }}>
            确认
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>版本号</label>
            <Input
              placeholder="输入版本号，如v2.1.0"
              value={newVersion.name}
              onChange={(e) => setNewVersion({...newVersion, name: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>版本描述</label>
            <Input.TextArea
              placeholder="输入版本变更描述"
              value={newVersion.description}
              onChange={(e) => setNewVersion({...newVersion, description: e.target.value})}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ApiService: React.FC<{}> = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>('endpoints');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [showAddApiForm, setShowAddApiForm] = useState<boolean>(false);
  const [showApiDetail, setShowApiDetail] = useState<boolean>(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  
  // 使用Redux选择器获取状态
  const { data: reduxApiEndpoints, loading: endpointsLoading, pagination } = useSelector((state: RootState) => selectApiEndpoints(state));
  const { data: reduxApiStats, loading: statsLoading } = useSelector((state: RootState) => selectApiStats(state));
  const filters = useSelector((state: RootState) => selectApiFilters(state));
  
  // 如果Redux中没有数据，使用默认的模拟数据
  const apiEndpoints = reduxApiEndpoints && reduxApiEndpoints.length > 0 ? reduxApiEndpoints : defaultApiEndpoints;
  const displayApiStats = reduxApiStats || defaultApiStats;
  const displayApiEndpoints = apiEndpoints;
  
  // 从filters中解构搜索条件
  const { search: searchTerm = '', category: categoryFilter = '', status: statusFilter = '' } = filters;

  // 在组件挂载时获取数据
  useEffect(() => {
    // 获取API端点列表
    dispatch(fetchApiEndpoints());
    
    // 获取API统计数据
    dispatch(fetchApiStats({ timeRange }));
  }, [dispatch]);

  // 当过滤器变化时重新获取数据
  useEffect(() => {
    dispatch(fetchApiEndpoints(filters));
  }, [dispatch, filters]);

  // 添加API后刷新列表
  const handleAddApiSuccess = () => {
    dispatch(fetchApiEndpoints(filters));
  };

  // 查看API详情
  const handleViewDetail = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setShowApiDetail(true);
  };

  // 删除API后刷新列表
  const handleDeleteSuccess = () => {
    dispatch(fetchApiEndpoints(filters));
  };

  // 当时间范围变化时重新获取统计数据
  useEffect(() => {
    dispatch(fetchApiStats({ timeRange: timeRange as "day" | "week" | "month" | "year" }));
  }, [dispatch, timeRange]);

  // 更新搜索条件并重新获取数据
  const handleSearchChange = (value: string) => {
    dispatch(setFilters({ search: value, page: 1 }));
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setFilters({ category: value, page: 1 }));
  };

  const handleStatusChange = (value: 'active' | 'deprecated' | 'development' | '') => {
    dispatch(setFilters({ status: value === '' ? undefined : value, page: 1 }));
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm, category: categoryFilter, status: statusFilter === '' ? undefined : statusFilter, page: 1 }));
    dispatch(fetchApiEndpoints(filters));
  };

  const handleRefreshStats = () => {
    dispatch(fetchApiStats({ timeRange }));
  };

  // 渲染API端点标签页
  const renderApiEndpointsTab = () => (
    <div>
      <Card title="API端点管理">
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" onClick={() => setShowAddApiForm(true)}>
                <PlusOutlined /> 添加API
              </Button>
            </div>
          </Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Input
                placeholder="搜索API路径或描述"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                placeholder="选择分类"
                allowClear
                value={categoryFilter}
                onChange={handleCategoryChange}
                style={{ width: 150 }}
                options={[
                  { label: '认证', value: '认证' },
                  { label: '股票数据', value: '股票数据' },
                  { label: 'AI分析', value: 'AI分析' },
                  { label: '管理', value: '管理' },
                  { label: '推荐', value: '推荐' },
                ]}
              />
              <Select
                placeholder="选择状态"
                allowClear
                value={statusFilter}
                onChange={handleStatusChange}
                style={{ width: 150 }}
                options={[
                  { label: '活跃', value: 'active' },
                  { label: '已废弃', value: 'deprecated' },
                  { label: '开发中', value: 'development' },
                ]}
              />
              <Button onClick={handleSearch}>搜索</Button>
            </div>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span style={{ marginRight: 16 }}>显示方式:</span>
                <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                  <Radio.Button value="card">卡片</Radio.Button>
                  <Radio.Button value="table">表格</Radio.Button>
                </Radio.Group>
              </div>
              {displayApiEndpoints.length > 0 && (
                <div>
                  <span style={{ marginRight: 8 }}>共 {displayApiEndpoints.length} 个API端点</span>
                </div>
              )}
            </div>
          </Col>
        </Row>
        
        {endpointsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Spin size="large" tip="加载API端点列表中..." />
          </div>
        ) : displayApiEndpoints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>暂无API端点数据</p>
          </div>
        ) : viewMode === 'card' ? (
          <Row gutter={[16, 16]}>
            {displayApiEndpoints.map((endpoint) => (
              <Col xs={24} sm={12} md={8} lg={6} key={endpoint.id}>
                <Card
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Tag color={endpoint.method === 'GET' ? 'blue' : endpoint.method === 'POST' ? 'green' : endpoint.method === 'PUT' ? 'orange' : 'red'}>
                          {endpoint.method}
                        </Tag>
                      </div>
                      <div>
                        <Tag color={endpoint.status === 'active' ? 'green' : endpoint.status === 'deprecated' ? 'red' : 'orange'}>
                          {endpoint.status === 'active' ? '活跃' : endpoint.status === 'deprecated' ? '已废弃' : '开发中'}
                        </Tag>
                      </div>
                    </div>
                  }
                  extra={<Button type="link" onClick={() => handleViewDetail(endpoint)}>详情</Button>}
                >
                  <p style={{ marginBottom: 8, wordBreak: 'break-all' }}>{endpoint.path}</p>
                  <p style={{ color: '#666', marginBottom: 8 }}>{endpoint.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tag>{endpoint.category}</Tag>
                    {endpoint.isPublic && <Badge status="success" text="公开" />}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Table
            columns={[
              {
                title: '路径',
                dataIndex: 'path',
                key: 'path',
                render: (text) => <span style={{ wordBreak: 'break-all' }}>{text}</span>,
              },
              {
                title: '方法',
                dataIndex: 'method',
                key: 'method',
                render: (text) => (
                  <Tag color={text === 'GET' ? 'blue' : text === 'POST' ? 'green' : text === 'PUT' ? 'orange' : 'red'}>
                    {text}
                  </Tag>
                ),
              },
              {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
              },
              {
                title: '分类',
                dataIndex: 'category',
                key: 'category',
                render: (text) => <Tag>{text}</Tag>,
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text) => (
                  <Tag color={text === 'active' ? 'green' : text === 'deprecated' ? 'red' : 'orange'}>
                    {text === 'active' ? '活跃' : text === 'deprecated' ? '已废弃' : '开发中'}
                  </Tag>
                ),
              },
              {
                title: '是否公开',
                dataIndex: 'isPublic',
                key: 'isPublic',
                render: (text) => (text ? <Badge status="success" text="是" /> : <Badge status="default" text="否" />),
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Button type="link" onClick={() => handleViewDetail(record)}>详情</Button>
                ),
              },
            ]}
            dataSource={displayApiEndpoints}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>
    </div>
  );

  // 渲染API监控标签页
  const renderApiMonitoringTab = () => (
    <div>
      <Card title="API监控">
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{ margin: 0 }}>统计时间范围</h3>
              <Radio.Group value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                <Radio.Button value="day">今日</Radio.Button>
                <Radio.Button value="week">本周</Radio.Button>
                <Radio.Button value="month">本月</Radio.Button>
                <Radio.Button value="year">本年</Radio.Button>
              </Radio.Group>
            </div>
          </Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleRefreshStats} icon={<ReloadOutlined />}>刷新数据</Button>
            </div>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card>
              <Statistic title="总请求数" value={displayApiStats.totalRequests} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card>
              <Statistic title="成功请求" value={displayApiStats.successfulRequests} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card>
              <Statistic title="失败请求" value={displayApiStats.failedRequests} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card>
              <Statistic title="平均响应时间" value={displayApiStats.averageResponseTime} suffix="ms" />
            </Card>
          </Col>
        </Row>
        
        {statsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Spin size="large" tip="加载统计数据中..." />
          </div>
        ) : (
          <div>
            <Card title="API端点性能分析">
              <Table
                columns={[
                  {
                    title: 'API端点',
                    dataIndex: 'path',
                    key: 'path',
                  },
                  {
                    title: '请求数',
                    dataIndex: 'requests',
                    key: 'requests',
                  },
                  {
                    title: '成功率',
                    dataIndex: 'successRate',
                    key: 'successRate',
                    render: (text) => `${text}%`,
                  },
                  {
                    title: '平均响应时间',
                    dataIndex: 'avgResponseTime',
                    key: 'avgResponseTime',
                    render: (text) => `${text}ms`,
                  },
                  {
                    title: '错误数',
                    dataIndex: 'errors',
                    key: 'errors',
                  },
                ]}
                dataSource={Object.entries(displayApiStats.endpoints).map(([path, stats]) => ({
                  key: path,
                  path,
                  ...stats,
                }))}
                pagination={false}
              />
            </Card>
          </div>
        )}
      </Card>
    </div>
  );

  // 渲染API权限标签页
  const renderApiPermissionsTab = () => (
    <div>
      <Card title="API权限管理" extra={<Button type="primary" size="small">保存设置</Button>}>
        <div style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8, textAlign: 'center' }}>
          <IeOutlined style={{ fontSize: 48, color: '#999', marginBottom: 16 }} />
          <Title level={4}>API权限设置</Title>
          <Paragraph>在此管理各API端点的访问权限和角色控制</Paragraph>
        </div>
      </Card>
    </div>
  );

  // 渲染数据管理标签页
  const renderApiDataManagementTab = () => (
    <div>
      <Card title="API数据管理">
        <div style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8, textAlign: 'center' }}>
          <DatabaseOutlined style={{ fontSize: 48, color: '#999', marginBottom: 16 }} />
          <Title level={4}>API数据管理</Title>
          <Paragraph>管理API的测试数据、模拟数据和数据导出导入</Paragraph>
        </div>
      </Card>
    </div>
  );

  // 渲染API测试工具标签页
  const renderApiTesterTab = () => (
    <div>
      <ApiTester />
    </div>
  );

  // Tabs配置
  const items: TabsProps['items'] = [
    {
      key: 'endpoints',
      label: 'API接口管理',
      icon: <ApiOutlined />,
      children: renderApiEndpointsTab(),
    },
    {
      key: 'monitoring',
      label: 'API监控',
      icon: <MonitorOutlined />,
      children: renderApiMonitoringTab(),
    },
    {
      key: 'documentation',
      label: 'API文档',
      icon: <FileTextOutlined />,
      children: <ApiDocumentationTab />,
    },
    {
      key: 'tester',
      label: 'API测试工具',
      icon: <ToolOutlined />,
      children: renderApiTesterTab(),
    },
    {
      key: 'permissions',
      label: 'API权限',
      icon: <IeOutlined />,
      children: renderApiPermissionsTab(),
    },
    {
      key: 'data',
      label: '数据管理',
      icon: <DatabaseOutlined />,
      children: renderApiDataManagementTab(),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>API服务管理</Title>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items} 
        type="card"
        size="large"
      />
      <ApiEndpointForm
        visible={showAddApiForm}
        onCancel={() => setShowAddApiForm(false)}
        onSuccess={handleAddApiSuccess}
      />
      <ApiEndpointDetail
        visible={showApiDetail}
        endpoint={selectedEndpoint}
        onCancel={() => setShowApiDetail(false)}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
};


export default ApiService;