import React from 'react';
import { Row, Col, Card, Statistic, Tag, Progress, Typography, Badge, Avatar, List } from 'antd';
import { StockChart } from '../components/stock/StockChart';
import { theme } from '../styles/theme';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ExclamationTriangleOutlined,
  BarChartOutlined,
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

// 样式组件
const StyledCard = styled(Card)`
  background-color: ${theme.cardBg};
  ${theme.border};
  box-shadow: ${theme.glow};
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-3px);
  }
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title {
    color: ${theme.neonBlue};
  }
  .ant-statistic-content-value {
    color: white;
  }
`;

const StatCard = styled(StyledCard)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StockPerformanceCard = styled(StyledCard)`
  height: 100%;
`;

// 模拟数据
const mockStockData = Array.from({ length: 30 }).map((_, i) => ({
  date: `2025-0${i < 9 ? '0' + (i + 1) : i + 1}`,
  open: 100 + Math.random() * 20,
  close: 100 + Math.random() * 20,
  high: 100 + Math.random() * 30,
  low: 100 + Math.random() * 10,
  volume: 10000 + Math.random() * 5000,
}));

const mockPortfolioData = [
  { name: '股票', value: 65 },
  { name: '基金', value: 20 },
  { name: '债券', value: 10 },
  { name: '现金', value: 5 },
];

const mockRecentActivities = [
  { id: 1, user: '张三', action: '创建了AI分析任务', target: 'AAPL', time: '10分钟前' },
  { id: 2, user: '李四', action: '分享了股票详情', target: 'TSLA', time: '1小时前' },
  { id: 3, user: '王五', action: '收藏了分析报告', target: 'MSFT', time: '3小时前' },
  { id: 4, user: '系统', action: '完成了市场分析', target: '科技板块', time: '昨天' },
];

const mockStockPerformance = [
  { symbol: 'AAPL', name: '苹果公司', change: 2.35, changePercent: 1.3, price: 182.45 },
  { symbol: 'TSLA', name: '特斯拉', change: -1.23, changePercent: -0.68, price: 179.86 },
  { symbol: 'MSFT', name: '微软', change: 5.78, changePercent: 1.35, price: 435.67 },
  { symbol: 'NVDA', name: '英伟达', change: 12.45, changePercent: 1.46, price: 867.32 },
  { symbol: 'AMZN', name: '亚马逊', change: -2.34, changePercent: -0.85, price: 179.45 },
  { symbol: 'GOOGL', name: '谷歌', change: 3.45, changePercent: 0.98, price: 146.78 },
];

const mockAIAnalysisTasks = [
  { id: '1', symbol: 'AAPL', status: 'completed', progress: 100, confidence: 92 },
  { id: '2', symbol: 'TSLA', status: 'processing', progress: 75, confidence: null },
  { id: '3', symbol: 'MSFT', status: 'pending', progress: 0, confidence: null },
  { id: '4', symbol: 'NVDA', status: 'completed', progress: 100, confidence: 88 },
];

// 格式化金额
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const Dashboard: React.FC = () => {
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

  return (
    <div>
      <Helmet>
        <title>量化分析仪表盘 - 皓月量化智能引擎</title>
        <meta name="description" content="皓月量化智能引擎仪表盘，提供实时资产概览、收益率分析、风险评估和AI分析任务进度等核心数据展示。" />
        <meta name="keywords" content="量化分析, 仪表盘, 资产管理, 收益率, 风险评估, AI分析" />
        <link rel="canonical" href="https://haoyuequant.com/dashboard" />
      </Helmet>
      
      {/* 页面标题和日期 */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 className="neon-text">量化分析仪表盘</h1>
          <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
            <CalendarOutlined style={{ marginRight: '8px', color: theme.neonBlue }} />
            <Text>{getCurrentDate()}</Text>
          </div>
        </div>
        <Paragraph type="secondary" style={{ margin: 0 }}>
          欢迎回来，这是您的投资组合概览和AI分析结果
        </Paragraph>
      </div>
      {/* 主要统计数据卡片 */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <DollarOutlined style={{ fontSize: '24px', color: theme.neonBlue, marginRight: '12px' }} />
              <Text style={{ color: '#ccc' }}>总资产</Text>
            </div>
            <StyledStatistic value={1234567} precision={0} prefix="¥" />
            <div style={{ marginTop: '8px' }}>
              <Badge status="success" text={<Text style={{ color: '#52c41a' }}>+5.2% 较上月</Text>} />
            </div>
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <ArrowUpOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '12px' }} />
              <Text style={{ color: '#ccc' }}>总收益率</Text>
            </div>
            <StyledStatistic value={12.5} precision={1} suffix="%" valueStyle={{ color: '#52c41a' }} />
            <div style={{ marginTop: '8px' }}>
              <Badge status="success" text={<Text style={{ color: '#52c41a' }}>+2.3% 较上周</Text>} />
            </div>
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <ExclamationTriangleOutlined style={{ fontSize: '24px', color: '#faad14', marginRight: '12px' }} />
              <Text style={{ color: '#ccc' }}>风险等级</Text>
            </div>
            <StyledStatistic value={50} precision={0} suffix="/100" valueStyle={{ color: '#faad14' }} />
            <div style={{ marginTop: '8px' }}>
              <Progress percent={50} size="small" strokeColor={theme.neonBlue} />
            </div>
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <BarChartOutlined style={{ fontSize: '24px', color: theme.neonPink, marginRight: '12px' }} />
              <Text style={{ color: '#ccc' }}>AI分析任务</Text>
            </div>
            <StyledStatistic value={15} precision={0} suffix="个" />
            <div style={{ marginTop: '8px' }}>
              <Badge status="processing" text={<Text style={{ color: '#1890ff' }}>4个进行中</Text>} />
            </div>
          </StatCard>
        </Col>
      </Row>
      {/* 主要图表和分析结果 */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <StyledCard>
            <Title level={4} style={{ marginBottom: '24px', color: theme.neonBlue }}>
              市场概览
            </Title>
            <StockChart data={mockStockData} />
          </StyledCard>
        </Col>
        
        <Col xs={24} lg={8}>
          {/* 股票表现 */}
          <StockPerformanceCard>
            <Title level={4} style={{ marginBottom: '24px', color: theme.neonBlue }}>
              关注股票表现
            </Title>
            <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '16px' }}>
              {mockStockPerformance.map((stock) => (
                <div 
                  key={stock.symbol} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }} 
                >
                  <div>
                    <Text strong style={{ color: theme.neonBlue }}>{stock.symbol}</Text>
                    <Text style={{ color: '#ccc', marginLeft: '8px' }}>{stock.name}</Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text style={{ color: 'white', display: 'block' }}>¥{stock.price}</Text>
                    <Text style={{ color: stock.changePercent >= 0 ? '#52c41a' : '#f5222d' }}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </StockPerformanceCard>
          
          {/* AI分析进度 */}
          <StyledCard>
            <Title level={4} style={{ marginBottom: '24px', color: theme.neonBlue }}>
              AI分析任务进度
            </Title>
            <div style={{ marginBottom: '16px' }}>
              <Progress percent={75} status="active" strokeColor={theme.neonBlue} />
              <Text type="secondary" style={{ float: 'right', marginTop: '4px' }}>4/15 任务进行中</Text>
            </div>
          </StyledCard>
        </Col>
      </Row>

      {/* 投资组合分析和AI分析任务 */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <StyledCard>
            <Title level={4} style={{ marginBottom: '24px', color: theme.neonBlue }}>
              投资组合分布
            </Title>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* 这里应该是图表组件，暂时用进度条替代 */}
              <div style={{ width: '100%' }}>
                {mockPortfolioData.map((item) => (
                  <div key={item.name} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Text style={{ color: '#ccc' }}>{item.name}</Text>
                      <Text style={{ color: theme.neonBlue }}>{item.value}%</Text>
                    </div>
                    <Progress 
                      percent={item.value} 
                      strokeColor={theme.neonBlue} 
                      showInfo={false} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </StyledCard>
        </Col>
        
        <Col xs={24} lg={12}>
          <StyledCard>
            <Title level={4} style={{ marginBottom: '24px', color: theme.neonBlue }}>
              最近AI分析任务
            </Title>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {mockAIAnalysisTasks.map((task) => (
                <div 
                  key={task.id} 
                  style={{ 
                    padding: '12px', 
                    marginBottom: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} 
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong style={{ color: theme.neonBlue }}>{task.symbol}</Text>
                    <Tag 
                      color={task.status === 'completed' ? 'green' : task.status === 'processing' ? 'blue' : 'orange'} 
                    >
                      {task.status === 'completed' ? '已完成' : task.status === 'processing' ? '分析中' : '待处理'}
                    </Tag>
                  </div>
                  {task.status !== 'completed' && (
                    <Progress 
                      percent={task.progress} 
                      strokeColor={theme.neonBlue} 
                      showInfo={false} 
                      size="small" 
                      style={{ marginBottom: '8px' }}
                    />
                  )}
                  {task.status === 'completed' && task.confidence && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <TrophyOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                      <Text style={{ color: '#ccc' }}>置信度: <Text strong style={{ color: '#faad14' }}>{task.confidence}%</Text></Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </StyledCard>
        </Col>
      </Row>

      {/* 最近活动 */}
      <StyledCard>
        <Title level={4} style={{ marginBottom: '24px', color: theme.neonBlue }}>
          最近活动
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={mockRecentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar><UserOutlined /></Avatar>}
                title={
                  <span style={{ color: '#ccc' }}>
                    {item.user} <Text strong style={{ color: 'white' }}>{item.action}</Text> 
                    <Text style={{ color: theme.neonBlue }}>{item.target}</Text>
                  </span>
                }
                description={<Text style={{ color: '#999' }}>{item.time}</Text>}
              />
            </List.Item>
          )}
        />
      </StyledCard>
    </div>
  );
};

export default Dashboard;