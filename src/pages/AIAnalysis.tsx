import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Input, Select, Space, Tag, message, Spin } from 'antd';
import { 
  SearchOutlined, 
  PlayCircleOutlined, 
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
import { RootState } from '@/store';
import { Link } from 'react-router-dom';
import LoadingWrapper from '@/components/common/LoadingWrapper';

// 懒加载创建分析模态框组件
const CreateAnalysisModal = React.lazy(() => import('@/components/analysis/CreateAnalysisModal'));

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
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAnalysisTasksAsync({
      page: currentPage,
      pageSize,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }));
  }, [dispatch, currentPage, pageSize, statusFilter, typeFilter]);

  const handleCreateAnalysis = async (symbol: string, type: 'basic' | 'advanced' | 'premium') => {
    setCreateLoading(true);
    try {
      await dispatch(createAnalysisTaskAsync({
        symbol,
        type
      })).unwrap();
      message.success('AI分析任务已创建');
      setCreateModalVisible(false);
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
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input
                placeholder="请输入股票代码或名称搜索"
                allowClear
                size="middle"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={() => {}}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <Select
                placeholder="选择状态"
                style={{ width: 120 }}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="all">全部状态</Option>
                <Option value="pending">待处理</Option>
                <Option value="processing">分析中</Option>
                <Option value="completed">已完成</Option>
                <Option value="failed">已失败</Option>
              </Select>
            </div>
            <div>
              <Select
                placeholder="选择类型"
                style={{ width: 120 }}
                value={typeFilter}
                onChange={setTypeFilter}
              >
                <Option value="all">全部类型</Option>
                <Option value="basic">基础分析</Option>
                <Option value="advanced">高级分析</Option>
                <Option value="premium">专业分析</Option>
              </Select>
            </div>
          </div>
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
      <React.Suspense fallback={null}>
        <CreateAnalysisModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onOk={handleCreateAnalysis}
          loading={createLoading}
        />
      </React.Suspense>
    </div>
  );
};

export default AIAnalysis;