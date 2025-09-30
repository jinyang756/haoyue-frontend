import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchStockDetailAsync, 
  fetchStockHistoryAsync, 
  fetchTechnicalIndicatorsAsync, 
  fetchAIAnalysisAsync,
  setCurrentPeriod,
  clearCurrentStock 
} from '@/store/slices/stockSlice';
import { createAnalysisTaskAsync } from '@/store/slices/analysisSlice';
import { RootState, AppDispatch } from '@/store';
import { Card, Row, Col, Button, Spin, Tabs, Tag, message } from 'antd';
import { 
  LineChartOutlined, 
  StarOutlined, 
  CalendarOutlined,
  DollarOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { StockChart } from '@/components/stock/StockChart';
import TechnicalIndicators from '@/components/stock/TechnicalIndicators';
import AIAnalysisCard from '@/components/analysis/AIAnalysisCard';
import LoadingWrapper from '@/components/common/LoadingWrapper';

const { TabPane } = Tabs;

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { 
    currentStock, 
    stockHistory, 
    technicalIndicators, 
    aiAnalysis,
    loading,
    error,
    currentPeriod
  } = useSelector((state: RootState) => state.stocks);

  const [activeTab, setActiveTab] = useState('chart');
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    if (!symbol) {
      navigate('/stocks');
      return;
    }

    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchStockDetailAsync(symbol)),
          dispatch(fetchStockHistoryAsync({ symbol, period: currentPeriod })),
          dispatch(fetchTechnicalIndicatorsAsync(symbol)),
          dispatch(fetchAIAnalysisAsync(symbol))
        ]);
      } catch (err) {
        message.error('获取股票数据失败');
      }
    };

    fetchData();

    return () => {
      dispatch(clearCurrentStock());
    };
  }, [symbol, dispatch, navigate, currentPeriod]);

  const handlePeriodChange = (period: 'day' | 'week' | 'month') => {
    dispatch(setCurrentPeriod(period));
    dispatch(fetchStockHistoryAsync({ symbol: symbol!, period }));
  };

  const handleCreateAnalysis = async () => {
    if (!symbol) return;

    setAnalysisLoading(true);
    try {
      await dispatch(createAnalysisTaskAsync({
        symbol,
        type: 'advanced'
      })).unwrap();
      message.success('AI分析任务已创建，正在分析中...');
      navigate('/ai-analysis');
    } catch (err) {
      message.error('创建分析任务失败');
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (!currentStock) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载股票数据中..." />
      </div>
    );
  }

  const { name, price, change, changePercent, marketCap, pe, pb, eps, dividend } = currentStock;

  return (
    <div>
      {/* 股票基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={12}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: 16 }}>
                <StarOutlined style={{ color: '#faad14', fontSize: 24 }} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  {symbol} {name}
                  <Tag style={{ marginLeft: 16 }} color="blue">
                    {currentStock.market}
                  </Tag>
                </div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                  最后更新时间: {new Date(currentStock.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} lg={12} style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 16 }}>
              <Button 
                type="primary" 
                size="large"
                icon={<LineChartOutlined />}
                onClick={handleCreateAnalysis}
                loading={analysisLoading}
              >
                AI深度分析
              </Button>
            </div>
          </Col>
        </Row>

        <div style={{ height: 1, backgroundColor: '#e8e8e8', margin: '16px 0' }} />

        <Row gutter={[24, 24]}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666' }}>最新价格</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', marginTop: 4 }}>{price.toFixed(2)}</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666' }}>涨跌幅</div>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                marginTop: 4,
                color: change > 0 ? '#f5222d' : change < 0 ? '#52c41a' : '#666'
              }}>
                {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666' }}>市值</div>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 4 }}>
                <DollarOutlined /> {(marketCap / 100000000).toFixed(2)}亿
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666' }}>市盈率</div>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 4 }}>{pe.toFixed(2)}</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666' }}>市净率</div>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 4 }}>{pb.toFixed(2)}</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666' }}>每股收益</div>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 4 }}>{eps.toFixed(2)}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><BarChartOutlined /> K线图</span>} 
          key="chart"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18}>
              <StockChart
                symbol={symbol!}
                data={stockHistory}
                loading={loading}
                period={currentPeriod}
                onPeriodChange={handlePeriodChange}
              />
            </Col>
            <Col xs={24} lg={6}>
              <TechnicalIndicators
                indicators={technicalIndicators}
                loading={loading}
              />
            </Col>
          </Row>
        </TabPane>

        <TabPane 
          tab={<span><PieChartOutlined /> AI分析</span>} 
          key="analysis"
        >
          <AIAnalysisCard
            analysis={aiAnalysis}
            loading={loading}
          />
        </TabPane>

        <TabPane 
          tab={<span><CalendarOutlined /> 历史数据</span>} 
          key="history"
        >
          <Card title="历史数据">
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Spin size="large" tip="加载历史数据中..." />
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StockDetail;