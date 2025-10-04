import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAnalysisTaskByIdAsync, 
  clearCurrentTask 
} from '@/store/slices/analysisSlice';
import { RootState, AppDispatch } from '@/store';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Spin, 
  Tag, 
  Descriptions, 
  Progress, 
  Typography,
  Divider,
  Statistic,
  Badge
} from 'antd';
import { 
  ArrowLeftOutlined,
  StarOutlined,
  FundOutlined,
  BarChartOutlined,
  MessageOutlined,
  AlertOutlined,
  ThunderboltOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const { Title, Text } = Typography;

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

const RecommendationTag = styled(Tag)<{ recommendation: string }>`
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  background-color: ${props => {
    switch (props.recommendation) {
      case 'strong_buy': return '#52c41a';
      case 'buy': return '#87d068';
      case 'hold': return '#faad14';
      case 'sell': return '#ff7a45';
      case 'strong_sell': return '#f5222d';
      default: return '#1890ff';
    }
  }};
  color: white;
  border: none;
`;

const AnalysisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { currentTask, loading, error } = useSelector((state: RootState) => state.analysis);

  useEffect(() => {
    if (id) {
      dispatch(fetchAnalysisTaskByIdAsync(id));
    }

    return () => {
      dispatch(clearCurrentTask());
    };
  }, [id, dispatch]);

  const handleBack = () => {
    navigate('/ai');
  };

  if (!currentTask && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Text>未找到分析任务</Text>
        <div style={{ marginTop: 20 }}>
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
            返回分析列表
          </Button>
        </div>
      </div>
    );
  }

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy': return '强烈买入';
      case 'buy': return '买入';
      case 'hold': return '持有';
      case 'sell': return '卖出';
      case 'strong_sell': return '强烈卖出';
      default: return recommendation;
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very low': return '极低';
      case 'low': return '低';
      case 'medium': return '中等';
      case 'high': return '高';
      case 'very high': return '极高';
      default: return riskLevel;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very low': return '#52c41a';
      case 'low': return '#87d068';
      case 'medium': return '#faad14';
      case 'high': return '#ff7a45';
      case 'very high': return '#f5222d';
      default: return '#1890ff';
    }
  };

  return (
    <div>
      {/* 页面标题和返回按钮 */}
      <div style={{ marginBottom: '30px' }}>
        <Button 
          onClick={handleBack} 
          icon={<ArrowLeftOutlined />} 
          style={{ marginBottom: 16 }}
        >
          返回分析列表
        </Button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 className="neon-text">AI分析详情</h1>
          {currentTask && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Text type="secondary">{new Date(currentTask.createdAt).toLocaleString()}</Text>
              <Tag color={currentTask.status === 'completed' ? 'green' : currentTask.status === 'failed' ? 'red' : 'blue'}>
                {currentTask.status === 'completed' ? '已完成' : currentTask.status === 'failed' ? '失败' : '处理中'}
              </Tag>
            </div>
          )}
        </div>
        
        {currentTask && (
          <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
            {currentTask.stockName} ({currentTask.symbol}) - {currentTask.type}分析
          </Typography.Paragraph>
        )}
      </div>

      <LoadingWrapper loading={loading} error={error as string}>
        {currentTask && currentTask.result && (
          <>
            {/* 综合评分和推荐 */}
            <StyledCard>
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Statistic
                      title="综合评分"
                      value={currentTask.result.overallRating}
                      precision={1}
                      valueStyle={{ 
                        fontSize: 48, 
                        color: currentTask.result.recommendation === 'strong buy' || currentTask.result.recommendation === 'buy' ? '#52c41a' : 
                               currentTask.result.recommendation === 'sell' || currentTask.result.recommendation === 'strong sell' ? '#f5222d' : '#faad14'
                      }}
                      prefix={<StarOutlined />}
                    />
                  </div>
                </Col>
                
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>投资建议</Text>
                    </div>
                    <RecommendationTag recommendation={currentTask.result.recommendation}>
                      {getRecommendationText(currentTask.result.recommendation)}
                    </RecommendationTag>
                  </div>
                </Col>
                
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>置信度</Text>
                    </div>
                    <Progress 
                      type="circle" 
                      percent={currentTask.result.confidenceLevel} 
                      width={80}
                      strokeColor={
                        currentTask.result.confidenceLevel >= 80 ? '#52c41a' : 
                        currentTask.result.confidenceLevel >= 60 ? '#faad14' : '#f5222d'
                      }
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text>{currentTask.result.confidenceLevel}%</Text>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <Divider />
              
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                  <Statistic
                    title="目标价格"
                    value={currentTask.result.targetPrice}
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                
                <Col xs={12} md={6}>
                  <Statistic
                    title="上涨空间"
                    value={currentTask.result.upsidePotential}
                    precision={1}
                    suffix="%"
                    valueStyle={{ 
                      color: currentTask.result.upsidePotential > 0 ? '#52c41a' : '#f5222d'
                    }}
                  />
                </Col>
                
                <Col xs={12} md={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>风险等级</Text>
                    </div>
                    <Badge 
                      count={getRiskLevelText(currentTask.result.riskLevel)} 
                      style={{ 
                        backgroundColor: getRiskLevelColor(currentTask.result.riskLevel),
                        padding: '0 12px'
                      }}
                    />
                  </div>
                </Col>
                
                <Col xs={12} md={6}>
                  <Statistic
                    title="下行风险"
                    value={currentTask.result.downsideRisk}
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Col>
              </Row>
            </StyledCard>

            {/* 多维度评分 */}
            <StyledCard title={<span><FundOutlined /> 多维度评分</span>}>
              <Row gutter={[24, 24]}>
                <Col xs={12} md={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>基本面</Text>
                    </div>
                    <Progress 
                      type="circle" 
                      percent={currentTask.factors?.fundamentalScore} 
                      width={100}
                      strokeColor="#52c41a"
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text>{currentTask.factors?.fundamentalScore}分</Text>
                    </div>
                  </div>
                </Col>
                
                <Col xs={12} md={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>技术面</Text>
                    </div>
                    <Progress 
                      type="circle" 
                      percent={currentTask.factors?.technicalScore} 
                      width={100}
                      strokeColor="#1890ff"
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text>{currentTask.factors?.technicalScore}分</Text>
                    </div>
                  </div>
                </Col>
                
                <Col xs={12} md={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>情绪面</Text>
                    </div>
                    <Progress 
                      type="circle" 
                      percent={currentTask.factors?.sentimentScore} 
                      width={100}
                      strokeColor="#faad14"
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text>{currentTask.factors?.sentimentScore}分</Text>
                    </div>
                  </div>
                </Col>
                
                <Col xs={12} md={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>市场环境</Text>
                    </div>
                    <Progress 
                      type="circle" 
                      percent={Math.round(((currentTask.factors?.fundamentalScore || 0) + (currentTask.factors?.technicalScore || 0) + (currentTask.factors?.sentimentScore || 0)) / 3)} 
                      width={100}
                      strokeColor="#722ed1"
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text>
                        {Math.round(((currentTask.factors?.fundamentalScore || 0) + (currentTask.factors?.technicalScore || 0) + (currentTask.factors?.sentimentScore || 0)) / 3)}分
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </StyledCard>

            {/* 风险评估 */}
            <StyledCard title={<span><AlertOutlined /> 风险评估</span>}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card size="small" title="风险等级">
                    <Text>风险等级: {getRiskLevelText(currentTask.result.riskLevel)}</Text>
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Card size="small" title="风险说明">
                    <Text>根据分析结果，该股票的风险等级为{getRiskLevelText(currentTask.result.riskLevel)}。</Text>
                  </Card>
                </Col>
              </Row>
            </StyledCard>

            {/* 技术指标 */}
            <StyledCard title={<span><LineChartOutlined /> 技术指标</span>}>
              <Text>技术指标信息可在技术分析详情中查看。</Text>
            </StyledCard>

            {/* AI分析总结 */}
            <StyledCard title={<span><ThunderboltOutlined /> AI分析总结</span>}>
              <Text>{currentTask.aiExplanation?.reasoning || '暂无详细分析说明。'}</Text>
            </StyledCard>
          </>
        )}
      </LoadingWrapper>
    </div>
  );
};

export default AnalysisDetail;