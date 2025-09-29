import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, message } from 'antd';
import { 
  TrendingUpOutlined, 
  TrendingDownOutlined,
  DollarOutlined,
  BarChartOutlined,
  UserOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocksAsync } from '@/store/slices/stockSlice';
import { fetchAnalysisStatsAsync } from '@/store/slices/analysisSlice';
import { RootState } from '@/store';
import { Link } from 'react-router-dom';
import LoadingWrapper from '@/components/common/LoadingWrapper';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { stocks, loading: stockLoading, error: stockError } = useSelector((state: RootState) => state.stocks);
  const { stats, loading: analysisLoading } = useSelector((state: RootState) => state.analysis);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchStocksAsync({ page: 1, pageSize: 10 }));
    
    if (isAuthenticated) {
      dispatch(fetchAnalysisStatsAsync());
    }
  }, [dispatch, isAuthenticated]);

  const topGainers = stocks
    .filter(stock => stock.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = stocks
    .filter(stock => stock.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  const marketStats = {
    totalStocks: stocks.length,
    avgChange: stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length,
    topGainer: topGainers[0],
    topLoser: topLosers[0]
  };

  const columns = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string) => (
        <Link to={`/stocks/${symbol}`} style={{ color: '#1890ff' }}>
          {symbol}
        </Link>
      )
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '最新价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toFixed(2)
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      render: (changePercent: number) => (
        <span style={{ 
          color: changePercent > 0 ? '#f5222d' : changePercent < 0 ? '#52c41a' : '#666' 
        }}>
          {changePercent > 0 && <TrendingUpOutlined size={12} />}
          {changePercent < 0 && <TrendingDownOutlined size={12} />}
          {Math.abs(changePercent).toFixed(2)}%
        </span>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 16 }}>皓月量化智能引擎</h1>
        <p style={{ color: '#666', fontSize: 16 }}>
          专业的AI股票分析平台，为您提供精准的投资建议和智能分析服务
        </p>
      </div>

      <Row gutter={[24, 24]}>
        {/* 市场概览 */}
        <Col xs={24} lg={16}>
          <Card title="市场概览" bordered={false}>
            <LoadingWrapper loading={stockLoading} error={stockError as string}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="总股票数"
                    value={marketStats.totalStocks}
                    precision={0}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="平均涨跌幅"
                    value={`${marketStats.avgChange.toFixed(2)}%`}
                    valueStyle={{ 
                      color: marketStats.avgChange > 0 ? '#f5222d' : marketStats.avgChange < 0 ? '#52c41a' : '#666' 
                    }}
                    prefix={marketStats.avgChange > 0 ? <TrendingUpOutlined /> : marketStats.avgChange < 0 ? <TrendingDownOutlined /> : null}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="最大涨幅"
                    value={marketStats.topGainer ? `${marketStats.topGainer.changePercent.toFixed(2)}%` : '0.00%'}
                    valueStyle={{ color: '#f5222d' }}
                    prefix={<TrendingUpOutlined />}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="最大跌幅"
                    value={marketStats.topLoser ? `${marketStats.topLoser.changePercent.toFixed(2)}%` : '0.00%'}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<TrendingDownOutlined />}
                  />
                </Col>
              </Row>
            </LoadingWrapper>
          </Card>
        </Col>

        {/* 用户信息 */}
        <Col xs={24} lg={8}>
          <Card title="用户信息" bordered={false}>
            {isAuthenticated ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 16 }}>
                  <UserOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>{user?.username}</div>
                <div style={{ color: '#666', marginBottom: 16 }}>{user?.email}</div>
                <Tag color={user?.role === 'admin' ? 'red' : user?.role === 'vip' ? 'gold' : 'blue'}>
                  {user?.role === 'admin' ? '管理员' : user?.role === 'vip' ? 'VIP用户' : '普通用户'}
                </Tag>
                <div style={{ marginTop: 16 }}>
                  <Button 
                    type="primary" 
                    block
                    icon={<StarOutlined />}
                    onClick={() => window.location.href = '/profile'}
                  >
                    个人中心
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <p style={{ marginBottom: 16 }}>请登录以使用完整功能</p>
                <Button 
                  type="primary" 
                  block
                  onClick={() => window.location.href = '/login'}
                >
                  立即登录
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 热门股票 */}
        <Col xs={24} lg={12}>
          <Card title="热门股票" bordered={false}>
            <LoadingWrapper loading={stockLoading} error={stockError as string}>
              <Table
                columns={columns}
                dataSource={stocks.slice(0, 10)}
                pagination={false}
                rowKey="symbol"
              />
            </LoadingWrapper>
          </Card>
        </Col>

        {/* AI分析统计 */}
        <Col xs={24} lg={12}>
          <Card title="AI分析统计" bordered={false}>
            {isAuthenticated ? (
              <LoadingWrapper loading={analysisLoading}>
                {stats ? (
                  <Row gutter={[16, 16]}>
                    <Col xs={12}>
                      <Statistic
                        title="总分析次数"
                        value={stats.totalTasks}
                        valueStyle={{ color: '#1890ff' }}
                        prefix={<BarChartOutlined />}
                      />
                    </Col>
                    <Col xs={12}>
                      <Statistic
                        title="完成分析"
                        value={stats.completedTasks}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                    <Col xs={12}>
                      <Statistic
                        title="平均评分"
                        value={stats.averageScore.toFixed(2)}
                        valueStyle={{ color: '#faad14' }}
                        prefix={<StarOutlined />}
                      />
                    </Col>
                    <Col xs={12}>
                      <Statistic
                        title="成功率"
                        value={`${stats.successRate.toFixed(1)}%`}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                    <Col xs={24} style={{ textAlign: 'center', marginTop: 16 }}>
                      <Button 
                        type="primary" 
                        size="large"
                        icon={<BarChartOutlined />}
                        onClick={() => window.location.href = '/ai-analysis'}
                      >
                        查看AI分析
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <p>暂无分析数据</p>
                  </div>
                )}
              </LoadingWrapper>
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <p style={{ marginBottom: 16 }}>登录后可查看AI分析统计</p>
                <Button 
                  type="primary" 
                  onClick={() => window.location.href = '/login'}
                >
                  立即登录
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 今日涨幅榜 */}
        <Col xs={24} lg={12}>
          <Card title="今日涨幅榜" bordered={false}>
            <LoadingWrapper loading={stockLoading} error={stockError as string}>
              <Table
                columns={columns}
                dataSource={topGainers}
                pagination={false}
                rowKey="symbol"
              />
            </LoadingWrapper>
          </Card>
        </Col>

        {/* 今日跌幅榜 */}
        <Col xs={24} lg={12}>
          <Card title="今日跌幅榜" bordered={false}>
            <LoadingWrapper loading={stockLoading} error={stockError as string}>
              <Table
                columns={columns}
                dataSource={topLosers}
                pagination={false}
                rowKey="symbol"
              />
            </LoadingWrapper>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;