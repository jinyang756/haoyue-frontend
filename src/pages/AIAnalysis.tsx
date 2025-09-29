import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Input, Select, Space, Tag, message, Spin, Modal, Row, Col } from 'antd';
import { 
  SearchOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { 
  fetchAnalysisTasksAsync, 
  cancelAnalysisTaskAsync,
  fetchAnalysisTaskByIdAsync,
  createAnalysisTaskAsync
} from '@/store/slices/analysisSlice';
import { searchStocks } from '@/services/stockservice';
import { RootState } from '@/store';
import { Link } from 'react-router-dom';
import LoadingWrapper from '@/components/common/LoadingWrapper';

const { Search } = Input;
const { Option } = Select;

const AIAnalysis: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, pagination } = useSelector((state: RootState) => state.analysis);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'basic' | 'advanced' | 'premium'>('all');
  const [stockOptions, setStockOptions] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [analysisType, setAnalysisType] = useState<'basic' | 'advanced' | 'premium'>('advanced');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAnalysisTasksAsync({
      page: currentPage,
      pageSize,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }));
  }, [dispatch, currentPage, pageSize, statusFilter, typeFilter]);

  const handleSearch = async () => {
    if (searchText.trim()) {
      try {
        const results = await searchStocks(searchText.trim());
        setStockOptions(results.map(stock => ({
          value: stock.symbol,
          label: `${stock.symbol} ${stock.name}`
        })));
      } catch (err) {
        message.error('搜索股票失败');
      }
    } else {
      setStockOptions([]);
    }
  };

  const handleCreateAnalysis = async () => {
    if (!selectedStock) {
      message.error('请选择股票');
      return;
    }

    setCreateLoading(true);
    try {
      await dispatch(createAnalysisTaskAsync({
        symbol: selectedStock,
        type: analysisType
      })).unwrap();
      message.success('AI分析任务已创建');
      setCreateModalVisible(false);
      setSelectedStock('');
      setSearchText('');
      dispatch(fetchAnalysisTasksAsync({
        page: currentPage,
        pageSize,
        status: statusFilter !== 'all' ? statusFilter : undefined
      }));
    } catch (err) {
      message.error('创建分析任务失败');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCancelTask = async (id: string) => {
    try {
      await dispatch(cancelAnalysisTaskAsync(id)).unwrap();
      message.success('分析任务已取消');
      dispatch(fetchAnalysisTasksAsync({
        page: currentPage,
        pageSize,
        status: statusFilter !== 'all' ? statusFilter : undefined
      }));
    } catch (err) {
      message.error('取消分析任务失败');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ReloadOutlined style={{ color: '#faad14' }} />;
      case 'processing':
        return <Spin size="small" style={{ color: '#1890ff' }} />;
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string, record: any) => (
        <Link to={`/ai-analysis/${id}`} style={{ color: '#1890ff' }}>
          {id.substring(0, 8)}...
        </Link>
      )
    },
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
      render: (symbol: string, record: any) => (
        <Link to={`/stocks/${symbol}`} style={{ color: '#1890ff' }}>
          {symbol}
        </Link>
      )
    },
    {
      title: '股票名称',
      dataIndex: 'stockName',
      key: 'stockName',
      width: 180
    },
    {
      title: '分析类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap = {
          'basic': '基础分析',
          'advanced': '高级分析',
          'premium': '专业分析'
        };
        return typeMap[type as keyof typeof typeMap] || type;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status === 'pending' ? '待处理' : 
           status === 'processing' ? '分析中' : 
           status === 'completed' ? '已完成' : '已失败'}
        </Tag>
      )
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number, record: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ width: 40 }}>{progress}%</span>
            <div style={{ flex: 1 }}>
              <div style={{ 
                width: '100%', 
                height: 8, 
                backgroundColor: '#f0f0f0', 
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    backgroundColor: record.status === 'completed' ? '#52c41a' : 
                                  record.status === 'failed' ? '#f5222d' : '#1890ff',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            icon={<SearchOutlined />}
            onClick={() => window.location.href = `/ai-analysis/${record.id}`}
          >
            查看
          </Button>
          {(record.status === 'pending' || record.status === 'processing') && (
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleCancelTask(record.id)}
            >
              取消
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card 
        title="AI智能分析" 
        bordered={false}
        extra={
          <Button 
            type="primary" 
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            创建分析任务
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Search
                placeholder="请输入股票代码或名称搜索"
                allowClear
                enterButton="搜索"
                size="middle"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Select
                placeholder="选择状态"
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="all">全部状态</Option>
                <Option value="pending">待处理</Option>
                <Option value="processing">分析中</Option>
                <Option value="completed">已完成</Option>
                <Option value="failed">已失败</Option>
              </Select>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Select
                placeholder="选择类型"
                style={{ width: '100%' }}
                value={typeFilter}
                onChange={setTypeFilter}
              >
                <Option value="all">全部类型</Option>
                <Option value="basic">基础分析</Option>
                <Option value="advanced">高级分析</Option>
                <Option value="premium">专业分析</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <LoadingWrapper loading={loading} error={error as string}>
          <Table
            columns={columns}
            dataSource={tasks}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: pagination.total,
              onChange: handlePageChange,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            rowKey="id"
            scroll={{ x: 1300 }}
          />
        </LoadingWrapper>
      </Card>

      {/* 创建分析任务模态框 */}
      <Modal
        title="创建AI分析任务"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={handleCreateAnalysis}
        confirmLoading={createLoading}
        maskClosable={false}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            选择股票
          </label>
          <Select
            showSearch
            placeholder="请搜索股票代码或名称"
            style={{ width: '100%' }}
            value={selectedStock}
            onChange={setSelectedStock}
            filterOption={false}
            onSearch={handleSearch}
            notFoundContent="请输入关键词搜索"
          >
            {stockOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            分析类型
          </label>
          <Select
            style={{ width: '100%' }}
            value={analysisType}
            onChange={(value) => setAnalysisType(value as 'basic' | 'advanced' | 'premium')}
          >
            <Option value="basic">基础分析 (免费)</Option>
            <Option value="advanced">高级分析 (VIP)</Option>
            <Option value="premium">专业分析 (VIP Pro)</Option>
          </Select>
        </div>
        
        <div style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>分析内容说明：</strong>
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {analysisType === 'basic' && (
              <div>
                <div>• 基础财务指标分析</div>
                <div>• 简单技术面分析</div>
                <div>• 基础风险评估</div>
                <div>• 短期投资建议</div>
              </div>
            )}
            {analysisType === 'advanced' && (
              <div>
                <div>• 详细财务分析</div>
                <div>• 深度技术分析</div>
                <div>• 市场情绪分析</div>
                <div>• 多维度风险评估</div>
                <div>• 中长期投资建议</div>
              </div>
            )}
            {analysisType === 'premium' && (
              <div>
                <div>• 专业财务建模</div>
                <div>• AI智能预测</div>
                <div>• 机构资金流向分析</div>
                <div>• 高级风险控制</div>
                <div>• 个性化投资策略</div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AIAnalysis;