import React from 'react';
import { Button, Card, Col, Row, Typography, Space } from 'antd';
import { 
  BarChartOutlined, 
  RobotOutlined, 
  LineChartOutlined, 
  SafetyCertificateOutlined,
  CloudOutlined,
  DatabaseOutlined,
  RocketOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ApiDataApplication } from '../components/ApiDataApplication';
import TechStackShowcase from '../components/TechStackShowcase';

const { Title, Paragraph } = Typography;

const HomePageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, ${theme.darkBg} 0%, #1a1f3a 100%);
  border-radius: 12px;
  ${theme.border};
  box-shadow: ${theme.glow};
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 30px 15px;
    margin-bottom: 20px;
  }
`;

const FeatureCard = styled(Card)`
  background-color: ${theme.cardBg};
  ${theme.border};
  box-shadow: ${theme.glow};
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 240, 255, 0.3);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const StyledIcon = styled.div`
  font-size: 48px;
  color: ${theme.neonBlue};
  margin-bottom: 20px;
  text-shadow: 0 0 10px ${theme.neonBlue};
  
  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 15px;
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: 60px 20px;
  margin: 40px 0;
  background: linear-gradient(135deg, #1a1f3a 0%, ${theme.darkBg} 100%);
  border-radius: 12px;
  ${theme.border};
  box-shadow: ${theme.glow};
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 40px 15px;
    margin: 20px 0;
  }
`;

const StatsSection = styled.div`
  padding: 40px 20px;
  margin: 40px 0;
  text-align: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 30px 15px;
    margin: 20px 0;
  }
`;

const StatItem = styled.div`
  display: inline-block;
  margin: 0 20px;
  
  .stat-number {
    font-size: 36px;
    font-weight: bold;
    color: ${theme.neonBlue};
    text-shadow: 0 0 5px ${theme.neonBlue};
  }
  
  .stat-label {
    font-size: 16px;
    color: #aaa;
    margin-top: 8px;
  }
  
  @media (max-width: 768px) {
    margin: 0 10px;
    
    .stat-number {
      font-size: 24px;
    }
    
    .stat-label {
      font-size: 12px;
    }
  }
  
  @media (max-width: 480px) {
    display: block;
    margin: 10px 0;
  }
`;

// 移动端平台数据展示
const MobileStatsGrid = styled.div`
  display: none;
  
  @media (max-width: 480px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    text-align: center;
    margin-top: 20px;
  }
`;

const MobileStatItem = styled.div`
  .stat-number {
    font-size: 20px;
    font-weight: bold;
    color: ${theme.neonBlue};
    text-shadow: 0 0 5px ${theme.neonBlue};
  }
  
  .stat-label {
    font-size: 12px;
    color: #aaa;
    margin-top: 4px;
  }
`;

// 移动端CTA按钮容器
const MobileCTAContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }
`;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <RobotOutlined />,
      title: t('ai_intelligent_analysis'),
      description: '基于机器学习算法，提供精准的股票分析和投资建议，帮助您在复杂的金融市场中做出明智决策。'
    },
    {
      icon: <LineChartOutlined />,
      title: t('real_time_data'),
      description: '接入权威数据源，提供实时股票行情和技术指标，确保您获得最新、最准确的市场信息。'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: t('secure_reliable'),
      description: '采用JWT认证和Auth0安全机制，保障您的账户和数据安全，让您安心使用我们的服务。'
    },
    {
      icon: <CloudOutlined />,
      title: t('cloud_deployment'),
      description: '基于云原生架构，支持弹性扩展，确保服务的高可用性和稳定性，随时随地访问。'
    },
    {
      icon: <DatabaseOutlined />,
      title: t('data_visualization'),
      description: '通过MongoDB Charts提供丰富的数据可视化展示，直观呈现分析结果和市场趋势。'
    },
    {
      icon: <TeamOutlined />,
      title: t('professional_team'),
      description: '由金融专家和AI工程师组成的跨学科团队，持续优化算法和功能，为您提供专业服务。'
    }
  ];
  
  const handleGetStarted = () => {
    navigate('/login');
  };
  
  return (
    <HomePageContainer>
      <Helmet>
        <title>{t('home_title')} - 基于AI的股票分析平台</title>
        <meta name="description" content="皓月量化智能引擎是一个基于AI的股票分析平台，提供实时股票数据、技术指标分析、AI智能推荐等服务，帮助投资者做出更明智的投资决策。" />
        <meta name="keywords" content="股票分析, AI量化, 技术指标, 股票推荐, 投资分析, 金融数据, 量化交易, 股市分析" />
      </Helmet>
      
      <HeroSection>
        <Title level={1} style={{ color: theme.neonBlue, marginBottom: '20px', fontSize: '48px' }}>
          {t('home_title')}
        </Title>
        <Paragraph style={{ fontSize: '20px', color: '#ddd', maxWidth: '800px', margin: '0 auto 30px' }}>
          基于人工智能的股票分析平台，为您提供专业、准确、及时的投资决策支持
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleGetStarted}
          style={{ 
            height: '50px', 
            fontSize: '18px', 
            padding: '0 40px',
            background: 'linear-gradient(45deg, #165DFF, #722ED1)',
            border: 'none'
          }}
        >
          {t('get_started')}
        </Button>
        

      </HeroSection>
      
      <StatsSection>
        <div style={{ marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#fff', marginBottom: '30px' }}>
            平台数据
          </Title>
          <div className="platform-stats">
            <StatItem>
              <div className="stat-number">10,000+</div>
              <div className="stat-label">股票覆盖</div>
            </StatItem>
            <StatItem>
              <div className="stat-number">1M+</div>
              <div className="stat-label">用户信赖</div>
            </StatItem>
            <StatItem>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">服务可用性</div>
            </StatItem>
            <StatItem>
              <div className="stat-number">24/7</div>
              <div className="stat-label">实时监控</div>
            </StatItem>
          </div>
          
          {/* 移动端平台数据展示 */}
          <MobileStatsGrid>
            <MobileStatItem>
              <div className="stat-number">10,000+</div>
              <div className="stat-label">股票覆盖</div>
            </MobileStatItem>
            <MobileStatItem>
              <div className="stat-number">1M+</div>
              <div className="stat-label">用户信赖</div>
            </MobileStatItem>
            <MobileStatItem>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">服务可用性</div>
            </MobileStatItem>
            <MobileStatItem>
              <div className="stat-number">24/7</div>
              <div className="stat-label">实时监控</div>
            </MobileStatItem>
          </MobileStatsGrid>
        </div>
        

      </StatsSection>
      
      <div style={{ marginBottom: '40px', position: 'relative', zIndex: 2 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#fff' }}>
          核心功能
        </Title>
        <Row gutter={[30, 30]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <FeatureCard>
                <StyledIcon>{feature.icon}</StyledIcon>
                <Title level={4} style={{ color: '#fff', marginBottom: '15px' }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: '#ccc', fontSize: '16px' }}>
                  {feature.description}
                </Paragraph>
              </FeatureCard>
            </Col>
          ))}
        </Row>
      </div>
      
      <CTASection>
        <Title level={2} style={{ color: theme.neonBlue, marginBottom: '20px' }}>
          开始您的智能投资之旅
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#ddd', maxWidth: '700px', margin: '0 auto 30px' }}>
          加入皓月量化智能引擎，让AI为您分析市场趋势，提供专业的投资建议，助您在股市中稳健获利。
        </Paragraph>
        <Space size="large">
          <Button 
            type="primary" 
            size="large" 
            icon={<RocketOutlined />}
            onClick={handleGetStarted}
            style={{ 
              height: '45px', 
              fontSize: '16px', 
              padding: '0 30px',
              background: 'linear-gradient(45deg, #165DFF, #722ED1)'
            }}
          >
            {t('experience_now')}
          </Button>
          <Button 
            size="large" 
            href="/about"
            style={{ 
              height: '45px', 
              fontSize: '16px', 
              padding: '0 30px',
              color: '#fff',
              borderColor: theme.neonBlue
            }}
          >
            {t('learn_more')}
          </Button>
        </Space>
        

      </CTASection>
      
      <TechStackShowcase />
      <ApiDataApplication />
    </HomePageContainer>
  );
};

export default Home;