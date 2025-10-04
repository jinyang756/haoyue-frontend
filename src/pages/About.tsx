import React from 'react';
import { Card, Typography, List, Divider, Row, Col } from 'antd';
import { 
  BulbOutlined, 
  ApiOutlined, 
  TeamOutlined, 
  MailOutlined,
  BarChartOutlined,
  RobotOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  CloudOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  const coreFeatures = [
    {
      icon: <BulbOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      title: 'AI智能分析',
      description: '基于机器学习算法，提供精准的股票分析和投资建议'
    },
    {
      icon: <ApiOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      title: '实时数据',
      description: '接入权威数据源，提供实时股票行情和技术指标'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      title: '专业团队',
      description: '由金融专家和AI工程师组成的跨学科团队'
    }
  ];
  
  const detailedFeatures = [
    {
      icon: <RobotOutlined />,
      title: 'AI智能分析',
      description: '基于机器学习算法，提供精准的股票分析和投资建议，帮助您在复杂的金融市场中做出明智决策。'
    },
    {
      icon: <LineChartOutlined />,
      title: '实时数据',
      description: '接入权威数据源，提供实时股票行情和技术指标，确保您获得最新、最准确的市场信息。'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: '安全可靠',
      description: '采用JWT认证和Auth0安全机制，保障您的账户和数据安全，让您安心使用我们的服务。'
    },
    {
      icon: <CloudOutlined />,
      title: '云端部署',
      description: '基于云原生架构，支持弹性扩展，确保服务的高可用性和稳定性，随时随地访问。'
    },
    {
      icon: <DatabaseOutlined />,
      title: '数据可视化',
      description: '通过MongoDB Charts提供丰富的数据可视化展示，直观呈现分析结果和市场趋势。'
    },
    {
      icon: <BarChartOutlined />,
      title: '专业分析报告',
      description: '提供多维度的股票分析报告，包括基本面分析、技术面分析和市场情绪分析，助您全面了解投资标的。'
    },
    {
      icon: <FileTextOutlined />,
      title: '内容管理',
      description: '提供丰富的投资教育资源和市场资讯，帮助用户提升投资知识和技能。'
    },
    {
      icon: <DollarOutlined />,
      title: '订阅计划',
      description: '灵活的订阅计划，满足不同用户需求，提供差异化的服务体验。'
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px', color: '#00f0ff' }}>
          关于皓月量化智能引擎
        </Title>
        
        <Paragraph style={{ fontSize: '16px', lineHeight: '2', color: '#ccc' }}>
          皓月量化是一个基于AI的股票分析平台，致力于为投资者提供专业、准确、及时的股票分析和投资建议。
          我们运用先进的人工智能技术和大数据分析方法，帮助用户在复杂的金融市场中做出明智的投资决策。
        </Paragraph>
        
        <Divider />
        
        <Title level={3} style={{ marginTop: '40px', marginBottom: '20px', color: '#00f0ff' }}>
          核心功能
        </Title>
        
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={coreFeatures}
          renderItem={item => (
            <List.Item>
              <Card style={{ backgroundColor: '#1a1f3a', borderColor: '#00f0ff' }}>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  {item.icon}
                </div>
                <Title level={4} style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>
                  {item.title}
                </Title>
                <Paragraph style={{ textAlign: 'center', color: '#ccc' }}>
                  {item.description}
                </Paragraph>
              </Card>
            </List.Item>
          )}
        />
        
        <Divider />
        
        <Title level={3} style={{ marginTop: '40px', marginBottom: '20px', color: '#00f0ff' }}>
          详细功能介绍
        </Title>
        
        <Row gutter={[20, 20]} style={{ marginBottom: '30px' }}>
          {detailedFeatures.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card 
                size="small" 
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  backgroundColor: '#1a1f3a',
                  borderColor: '#00f0ff'
                }}
              >
                <div style={{ fontSize: '24px', color: '#00f0ff', marginBottom: '10px' }}>
                  {feature.icon}
                </div>
                <Title level={5} style={{ color: '#fff', marginBottom: '10px' }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: '#ccc', fontSize: '12px' }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Divider />
        
        <Title level={3} style={{ marginTop: '40px', marginBottom: '20px', color: '#00f0ff' }}>
          技术架构
        </Title>
        
        <Paragraph style={{ fontSize: '16px', lineHeight: '2', color: '#ccc' }}>
          平台采用现代化的技术栈，包括React前端、Node.js后端和MongoDB数据库。
          我们使用机器学习算法进行数据分析，并通过RESTful API提供服务。
        </Paragraph>
        
        <ul style={{ color: '#ccc', fontSize: '16px' }}>
          <li><strong>前端技术：</strong>React 18, TypeScript, Ant Design, Styled Components</li>
          <li><strong>后端技术：</strong>Node.js, Express.js, MongoDB, Mongoose</li>
          <li><strong>AI技术：</strong>Python, Scikit-learn, TensorFlow.js</li>
          <li><strong>部署：</strong>Docker, Kubernetes, Vercel</li>
          <li><strong>安全：</strong>JWT, Auth0, HTTPS</li>
        </ul>
        
        <Divider />
        
        <Title level={3} style={{ marginTop: '40px', marginBottom: '20px', color: '#00f0ff' }}>
          使用指南
        </Title>
        
        <Paragraph style={{ fontSize: '16px', lineHeight: '2', color: '#ccc' }}>
          为了帮助您更好地使用我们的平台，我们提供了详细的使用指南：
        </Paragraph>
        
        <ul style={{ color: '#ccc', fontSize: '16px' }}>
          <li><strong>注册登录：</strong>创建账户并登录系统</li>
          <li><strong>AI分析：</strong>使用AI智能分析功能获取股票分析报告</li>
          <li><strong>选股功能：</strong>利用AI选股功能筛选优质股票</li>
          <li><strong>投资组合：</strong>管理您的投资组合并获取优化建议</li>
          <li><strong>内容学习：</strong>浏览我们的教育资源提升投资知识</li>
        </ul>
        
        <Divider />
        
        <Title level={3} style={{ marginTop: '40px', marginBottom: '20px', color: '#00f0ff' }}>
          联系我们
        </Title>
        
        <div style={{ textAlign: 'center' }}>
          <Paragraph style={{ color: '#ccc', fontSize: '16px' }}>
            <MailOutlined style={{ marginRight: '8px' }} />
            邮箱: contact@haoyue-quant.com
          </Paragraph>
          <Paragraph style={{ color: '#ccc', fontSize: '16px' }}>
            如果您有任何问题或建议，欢迎随时联系我们。
          </Paragraph>
        </div>
        

      </Card>
    </div>
  );
};

export default About;