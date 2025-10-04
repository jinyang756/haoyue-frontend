import React, { useState, useEffect } from 'react';
import { Card, Typography, Table, Spin, Alert, Button, Space, Row, Col } from 'antd';
import { ReloadOutlined, BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
import * as stockService from '@/services/stockservice';
import * as analysisService from '@/services/analysisservice';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const ApiSection = styled.div`
  padding: 20px;
  margin: 20px 0;
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1120 100%);
  border-radius: 12px;
  border: 1px solid #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
`;

const DataCard = styled(Card)`
  background-color: #1a1f3a;
  border: 1px solid #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  height: 100%;
  
  .ant-card-head {
    border-bottom: 1px solid #00f0ff;
  }
  
  .ant-card-head-title {
    color: #00f0ff;
  }
`;

interface StockData {
  _id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

interface AnalysisData {
  _id: string;
  stockSymbol: string;
  stockName: string;
  analysisType: string;
  score: number;
  recommendation: string;
  createdAt: string;
}

export const ApiDataApplication: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  


  // 获取股票数据
  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取股票列表
      const stocks = await stockService.getStocks({
        page: 1,
        pageSize: 10,
        sortBy: 'price',
        order: 'desc'
      });
      
      // 格式化数据
      const formattedStocks = stocks.data.map((stock: any) => ({
        _id: stock._id,
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.currentPrice || 0,
        changePercent: stock.changePercent || 0,
        volume: stock.volume || 0,
        marketCap: stock.marketCap || 0
      }));
      
      setStockData(formattedStocks);
    } catch (err) {
      setError('获取股票数据失败');
      console.error('获取股票数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取分析数据
  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取分析报告列表
      const analyses = await analysisService.getAnalysisTasks({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        order: 'desc'
      });
      
      // 格式化数据
      const formattedAnalyses = analyses.data.map((analysis: any) => ({
        _id: analysis._id,
        stockSymbol: analysis.stockSymbol,
        stockName: analysis.stockName,
        analysisType: analysis.analysisType,
        score: analysis.score || 0,
        recommendation: analysis.recommendation,
        createdAt: analysis.createdAt
      }));
      
      setAnalysisData(formattedAnalyses);
    } catch (err) {
      setError('获取分析数据失败');
      console.error('获取分析数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据获取
  useEffect(() => {
    fetchStockData();
    fetchAnalysisData();
  }, []);

  // 股票数据表格列定义
  const stockColumns = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: StockData, b: StockData) => a.symbol.localeCompare(b.symbol),
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      sorter: (a: StockData, b: StockData) => a.currentPrice - b.currentPrice,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      sorter: (a: StockData, b: StockData) => a.changePercent - b.changePercent,
      render: (percent: number) => (
        <span style={{ color: percent >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      sorter: (a: StockData, b: StockData) => a.volume - b.volume,
      render: (volume: number) => volume.toLocaleString(),
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      sorter: (a: StockData, b: StockData) => a.marketCap - b.marketCap,
      render: (marketCap: number) => `¥${(marketCap / 100000000).toFixed(2)}亿`,
    },
  ];

  // 分析数据表格列定义
  const analysisColumns = [
    {
      title: '股票代码',
      dataIndex: 'stockSymbol',
      key: 'stockSymbol',
    },
    {
      title: '股票名称',
      dataIndex: 'stockName',
      key: 'stockName',
    },
    {
      title: '分析类型',
      dataIndex: 'analysisType',
      key: 'analysisType',
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: AnalysisData, b: AnalysisData) => a.score - b.score,
      render: (score: number) => (
        <span style={{ color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f' }}>
          {score}
        </span>
      ),
    },
    {
      title: '建议',
      dataIndex: 'recommendation',
      key: 'recommendation',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <ApiSection>
      <Title level={3} style={{ color: '#00f0ff', marginBottom: '20px' }}>
        <BarChartOutlined /> API数据应用示例
      </Title>
      
      <Paragraph style={{ color: '#ccc', marginBottom: '20px' }}>
        以下展示了如何在前端应用中使用后端API提供的数据功能，包括股票数据和AI分析报告。
      </Paragraph>
      
      {error && (
        <Alert 
          message="数据获取失败" 
          description={error} 
          type="error" 
          showIcon 
          style={{ marginBottom: '20px' }}
        />
      )}
      
      <Space style={{ marginBottom: '20px' }}>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchStockData}
          loading={loading}
        >
          刷新股票数据
        </Button>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchAnalysisData}
          loading={loading}
        >
          刷新分析数据
        </Button>
      </Space>
      
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <DataCard 
            title={
              <span>
                <LineChartOutlined /> 股票数据展示
              </span>
            }
            extra={<span style={{ color: '#00f0ff' }}>实时数据</span>}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: '10px', color: '#ccc' }}>
                  正在加载股票数据...
                </Paragraph>
              </div>
            ) : (
              <Table 
                dataSource={stockData} 
                columns={stockColumns} 
                pagination={false}
                scroll={{ y: 400 }}
                size="small"
                rowKey="_id"
              />
            )}
          </DataCard>
        </Col>
        
        <Col xs={24} lg={12}>
          <DataCard 
            title={
              <span>
                <BarChartOutlined /> AI分析数据展示
              </span>
            }
            extra={<span style={{ color: '#00f0ff' }}>智能分析</span>}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: '10px', color: '#ccc' }}>
                  正在加载分析数据...
                </Paragraph>
              </div>
            ) : (
              <Table 
                dataSource={analysisData} 
                columns={analysisColumns} 
                pagination={false}
                scroll={{ y: 400 }}
                size="small"
                rowKey="_id"
              />
            )}
          </DataCard>
        </Col>
      </Row>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#0f1120', borderRadius: '8px' }}>
        <Title level={4} style={{ color: '#00f0ff' }}>API数据应用说明</Title>
        <Paragraph style={{ color: '#ccc' }}>
          1. <strong>数据获取：</strong>通过调用后端API接口获取实时股票数据和AI分析报告
        </Paragraph>
        <Paragraph style={{ color: '#ccc' }}>
          2. <strong>数据处理：</strong>对获取的数据进行格式化处理，便于前端展示
        </Paragraph>
        <Paragraph style={{ color: '#ccc' }}>
          3. <strong>数据展示：</strong>使用Ant Design组件展示数据，提供良好的用户体验
        </Paragraph>
        <Paragraph style={{ color: '#ccc' }}>
          4. <strong>交互功能：</strong>支持数据刷新、排序等交互操作
        </Paragraph>
      </div>
    </ApiSection>
  );
};

export default ApiDataApplication;