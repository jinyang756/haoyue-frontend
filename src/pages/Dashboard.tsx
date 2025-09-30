import React from 'react';
import { Row, Col, Card, Statistic, Tag, Progress } from 'antd';
import { StockChart } from '../components/stock/StockChart';
import { theme } from '../styles/theme';
import styled from 'styled-components';

const { Meta } = Card;

const StyledCard = styled(Card)`
  background-color: ${theme.cardBg};
  ${theme.border};
  box-shadow: ${theme.glow};
  margin-bottom: 20px;
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title {
    color: ${theme.neonBlue};
  }
  .ant-statistic-content-value {
    color: white;
  }
`;

const mockStockData = Array.from({ length: 30 }).map((_, i) => ({
  date: `2025-0${i < 9 ? '0' + (i + 1) : i + 1}`,
  open: 100 + Math.random() * 20,
  close: 100 + Math.random() * 20,
  high: 100 + Math.random() * 30,
  low: 100 + Math.random() * 10,
  volume: 10000 + Math.random() * 5000,
}));

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="neon-text" style={{ textAlign: 'center', marginBottom: '20px' }}>
        量化分析仪表盘
      </h1>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StyledCard>
            <StyledStatistic title="总资产" value={1234567} prefix="¥" />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StyledCard>
            <StyledStatistic title="收益率" value={12.5} suffix="%" />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StyledCard>
            <StyledStatistic title="风险等级" value={50} suffix="/100" />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StyledCard>
            <StyledStatistic title="AI分析任务" value={15} suffix="个" />
          </StyledCard>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <StyledCard>
            <Meta title="股票K线图" />
            <StockChart data={mockStockData} />
          </StyledCard>
        </Col>
        <Col xs={24} lg={8}>
          <StyledCard>
            <Meta title="股票表现" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['AAPL', 'MSFT', 'TSLA', 'AMZN'].map((stock) => (
                <div key={stock} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{stock}</span>
                  <Tag color={Math.random() > 0.5 ? 'green' : 'red'}>
                    {Math.random() > 0.5 ? '+' : '-'}
                    {Math.abs(Math.random() * 5).toFixed(2)}%
                  </Tag>
                </div>
              ))}
            </div>
          </StyledCard>
          <StyledCard>
            <Meta title="AI分析进度" />
            <Progress percent={75} status="active" strokeColor={theme.neonBlue} />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;