import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Input, Select, Space, Tag, message, Spin, Typography } from 'antd';
import { 
  SearchOutlined, 
  PlayCircleOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DeleteOutlined, 
  BarChartOutlined, 
  CalendarOutlined,
  PieChartOutlined
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
import styled from 'styled-components';
import { theme } from '../styles/theme';

// 懒加载创建分析模态框组件
const CreateAnalysisModal = React.lazy(() => import('@/components/analysis/CreateAnalysisModal'));

const { Title, Text } = Typography;
const { Option } = Select;

// 样式组件
const StyledCard = styled(Card)`
  background-color: ${theme.cardBg};
  ${theme.border};
  box-shadow: ${theme.glow};
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
  .ant-card-head {
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .ant-card-title {
    color: ${theme.neonBlue} !important;
    font-size: 20px;
  }
`;

const StyledButton = styled(Button)`
  ${theme.border};
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const StyledInput = styled(Input)`
  background-color: ${theme.inputBg};
  color: white;
  border-color: ${theme.borderColor};
  &:focus {
    border-color: ${theme.neonBlue};
    box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.2);
  }
  .ant-input-suffix {
    color: ${theme.neonBlue};
  }
`;

const StyledSelect = styled(Select)`
  background-color: ${theme.inputBg};
  color: white;
  .ant-select-selector {
    background-color: ${theme.inputBg} !important;
    color: white !important;
    border-color: ${theme.borderColor} !important;
  }
  .ant-select-arrow {
    color: ${theme.neonBlue} !important;
  }
  .ant-select-dropdown {
    background-color: ${theme.cardBg};
    border-color: ${theme.borderColor};
    color: white;
  }
  .ant-select-item {
    color: white;
    &:hover {
      background-color: rgba(255,255,255,0.1);
    }
    &.ant-select-item-selected {
      background-color: rgba(64, 169, 255, 0.2);
      color: ${theme.neonBlue};
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: ${theme.headerBg};
    color: ${theme.neonBlue};
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .ant-table-tbody > tr > td {
    background-color: ${theme.cardBg};
    color: white;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: all 0.3s ease;
  }
  .ant-table-tbody > tr:hover > td {
    background-color: rgba(255,255,255,0.05);
  }
  .ant-table-pagination {
    .ant-pagination-item {
      background-color: ${theme.inputBg};
      border-color: ${theme.borderColor};
      color: white;
      &:hover {
        border-color: ${theme.neonBlue};
        color: ${theme.neonBlue};
      }
      &.ant-pagination-item-active {
        background-color: ${theme.neonBlue};
        border-color: ${theme.neonBlue};
        color: white;
      }
    }
    .ant-pagination-prev, .ant-pagination-next {
      background-color: ${theme.inputBg};
      border-color: ${theme.borderColor};
      .ant-pagination-item-link {
        color: white;
        &:hover {
          color: ${theme.neonBlue};
          border-color: ${theme.neonBlue};
        }
      }
    }
    .ant-pagination-total-text {
      color: #ccc;
    }
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number; status: string }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${(props) => 
    props.status === 'completed' ? '#52c41a' : 
    props.status === 'failed' ? '#f5222d' : theme.neonBlue};
  transition: width 0.3s ease;
  border-radius: 4px;
`;

// 统计卡片组件
const StatCard = styled.div`
  background-color: ${theme.cardBg};
  ${theme.border};
  box-shadow: ${theme.glow};
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-3px);
  }
`;

// 模拟数据 - 用于显示统计信息
const mockStats = {
  totalTasks: 156,
  completedTasks: 124,
  processingTasks: 18,
  successRate: 92,
};

// 任务类型分布模拟数据
const taskTypeDistribution = [
  { name: '基础分析', value: 65, color: '#1890ff' },
  { name: '高级分析', value: 25, color: '#52c41a' },
  { name: '专业分析', value: 10, color: '#faad14' },
];

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

  // 获取格式化的日期
  const getCurrentDate = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(now);
  };

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string, record: any) => (
        <Link to={`/ai-analysis/${id}`} style={{ color: theme.neonBlue }}>
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
        <Link to={`/stocks/${symbol}`} style={{ color: theme.neonBlue }}>
          {symbol}
        </Link>
      )
    },
    {
      title: '股票名称',
      dataIndex: 'stockName',
      key: 'stockName',
      width: 180,
      render: (name: string) => <Text style={{ color: '#ccc' }}>{name}</Text>
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
        const typeText = typeMap[type as keyof typeof typeMap] || type;
        const typeColor = type === 'premium' ? 'gold' : type === 'advanced' ? 'blue' : 'default';
        return <Tag color={typeColor}>{typeText}</Tag>;
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
      width: 180,
      render: (progress: number, record: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ width: 40, color: '#ccc' }}>{progress}%</span>
            <div style={{ flex: 1 }}>
              <ProgressBarContainer>
                <ProgressBarFill progress={progress} status={record.status} />
              </ProgressBarContainer>
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
      render: (time: string) => {
        const date = new Date(time);
        const formattedDate = date.toLocaleString();
        return <Text style={{ color: '#999' }}>{formattedDate}</Text>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <StyledButton 
            type="primary" 
            size="small"
            icon={<SearchOutlined />}
            onClick={() => window.location.href = `/ai-analysis/${record.id}`}
          >
            查看
          </StyledButton>
          {(record.status === 'pending' || record.status === 'processing') && (
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleCancelTask(record.id)}
              style={{ transition: 'all 0.3s ease' }}
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
      {/* 页面标题和日期 */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 className="neon-text">AI智能分析</h1>
          <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
            <CalendarOutlined style={{ marginRight: '8px', color: theme.neonBlue }} />
            <Text>{getCurrentDate()}</Text>
          </div>
        </div>
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          AI驱动的股票分析平台，助您洞察市场趋势
        </Typography.Paragraph>
      </div>

      {/* 统计信息卡片 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <StatCard>
              <BarChartOutlined style={{ fontSize: '24px', color: theme.neonBlue, marginBottom: '8px' }} />
              <Text style={{ color: '#ccc', display: 'block', marginBottom: '4px' }}>总分析任务</Text>
              <Title level={4} style={{ margin: 0, color: 'white' }}>{mockStats.totalTasks}</Title>
            </StatCard>
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <StatCard>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
              <Text style={{ color: '#ccc', display: 'block', marginBottom: '4px' }}>已完成任务</Text>
              <Title level={4} style={{ margin: 0, color: 'white' }}>{mockStats.completedTasks}</Title>
            </StatCard>
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <StatCard>
              <ReloadOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
              <Text style={{ color: '#ccc', display: 'block', marginBottom: '4px' }}>处理中任务</Text>
              <Title level={4} style={{ margin: 0, color: 'white' }}>{mockStats.processingTasks}</Title>
            </StatCard>
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <StatCard>
              <PieChartOutlined style={{ fontSize: '24px', color: '#faad14', marginBottom: '8px' }} />
              <Text style={{ color: '#ccc', display: 'block', marginBottom: '4px' }}>成功率</Text>
              <Title level={4} style={{ margin: 0, color: 'white' }}>{mockStats.successRate}%</Title>
            </StatCard>
          </div>
        </div>
      </div>

      {/* 任务类型分布 */}
      <StyledCard>
        <Title level={4} style={{ marginBottom: '16px', color: theme.neonBlue }}>任务类型分布</Title>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%' }}>
            {taskTypeDistribution.map((item) => (
              <div key={item.name} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text style={{ color: '#ccc' }}>{item.name}</Text>
                  <Text style={{ color: 'white' }}>{item.value}%</Text>
                </div>
                <ProgressBarContainer>
                  <ProgressBarFill progress={item.value} status="completed" style={{ backgroundColor: item.color }} />
                </ProgressBarContainer>
              </div>
            ))}
          </div>
        </div>
      </StyledCard>

      {/* 分析任务表格 */}
      <StyledCard 
        extra={
          <StyledButton 
            type="primary" 
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            创建分析任务
          </StyledButton>
        }
      >
        {/* 搜索和筛选 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <StyledInput
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
              <StyledSelect
                placeholder="选择状态"
                style={{ width: 120 }}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as any)}
              >
                <Option value="all">全部状态</Option>
                <Option value="pending">待处理</Option>
                <Option value="processing">分析中</Option>
                <Option value="completed">已完成</Option>
                <Option value="failed">已失败</Option>
              </StyledSelect>
            </div>
            <div>
              <StyledSelect
                placeholder="选择类型"
                style={{ width: 120 }}
                value={typeFilter}
                onChange={(value) => setTypeFilter(value as any)}
              >
                <Option value="all">全部类型</Option>
                <Option value="basic">基础分析</Option>
                <Option value="advanced">高级分析</Option>
                <Option value="premium">专业分析</Option>
              </StyledSelect>
            </div>
          </div>
        </div>

        {/* 任务列表表格 */}
        <LoadingWrapper loading={loading} error={error as string}>
          <StyledTable
            columns={columns}
            dataSource={tasks}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: pagination.total,
              onChange: handlePageChange,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total) => <Text style={{ color: '#ccc' }}>共 {total} 条记录</Text>
            }}
            rowKey="id"
            scroll={{ x: 1300 }}
            style={{ transition: 'all 0.3s ease' }}
          />
        </LoadingWrapper>
      </StyledCard>

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