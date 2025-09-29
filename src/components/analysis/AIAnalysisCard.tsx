import React from 'react';
import { Card, Statistic, Row, Col, Progress, Tag, Badge, Divider } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  StarOutlined
} from '@ant-design/icons';
import { AIAnalysis } from '@/services/stockservice';

interface AIAnalysisCardProps {
  analysis: AIAnalysis | null;
  loading: boolean;
}

const getRecommendationColor = (recommendation: string) => {
  switch (recommendation) {
    case 'strong_buy':
    case 'buy':
      return '#52c41a';
    case 'hold':
      return '#faad14';
    case 'sell':
    case 'strong_sell':
      return '#f5222d';
    default:
      return '#1890ff';
  }
};

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low':
      return '#52c41a';
    case 'medium':
      return '#faad14';
    case 'high':
      return '#f5222d';
    default:
      return '#1890ff';
  }
};

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ analysis, loading }) => {
  if (loading || !analysis) {
    return (
      <Card title="AI智能分析" loading={loading}>
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          加载中...
        </div>
      </Card>
    );
  }

  const {
    overallScore,
    fundamentalScore,
    technicalScore,
    sentimentScore,
    riskLevel,
    targetPrice,
    upsidePotential,
    recommendation
  } = analysis;

  return (
    <Card title="AI智能分析" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div style={{ textAlign: 'center', padding: 20, border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <Statistic
                  title="综合评分"
                  value={overallScore}
                  precision={1}
                  valueStyle={{ fontSize: 36, color: getRecommendationColor(recommendation) }}
                  prefix={<StarOutlined style={{ color: getRecommendationColor(recommendation) }} />}
                />
            <div style={{ marginTop: 16 }}>
              <Badge 
                count={recommendation.toUpperCase().replace('_', ' ')} 
                style={{ backgroundColor: getRecommendationColor(recommendation), fontSize: 16 }}
              />
            </div>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div style={{ padding: 20, border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Statistic
                  title="目标价格"
                  value={targetPrice}
                  precision={2}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="上涨空间"
                  value={`${upsidePotential.toFixed(1)}%`}
                  precision={1}
                  valueStyle={{ color: upsidePotential > 0 ? '#52c41a' : '#f5222d' }}
                  prefix={upsidePotential > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Divider>多维度评分</Divider>

      <Row gutter={[16, 16]}>
        <Col xs={8}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8 }}>基本面</div>
            <Progress 
              percent={fundamentalScore * 10} 
              type="circle" 
              size={80} 
              strokeColor="#52c41a"
            />
            <div style={{ marginTop: 8 }}>{fundamentalScore.toFixed(1)}</div>
          </div>
        </Col>

        <Col xs={8}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8 }}>技术面</div>
            <Progress 
              percent={technicalScore * 10} 
              type="circle" 
              size={80} 
              strokeColor="#1890ff"
            />
            <div style={{ marginTop: 8 }}>{technicalScore.toFixed(1)}</div>
          </div>
        </Col>

        <Col xs={8}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8 }}>情绪面</div>
            <Progress 
              percent={sentimentScore * 10} 
              type="circle" 
              size={80} 
              strokeColor="#faad14"
            />
            <div style={{ marginTop: 8 }}>{sentimentScore.toFixed(1)}</div>
          </div>
        </Col>
      </Row>

      <Divider>风险评估</Divider>

      <div style={{ textAlign: 'center', padding: 16 }}>
        <Badge 
          count={`${riskLevel.toUpperCase()} RISK`} 
          style={{ backgroundColor: getRiskColor(riskLevel), fontSize: 16, padding: '0 16px' }}
        />
      </div>
    </Card>
  );
};

export default AIAnalysisCard;