import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { 
  CodeOutlined, 
  DatabaseOutlined, 
  CloudOutlined, 
  ApiOutlined,
  BarChartOutlined,
  RobotOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const { Title, Paragraph } = Typography;

const TechCard = styled(Card)`
  background-color: ${theme.cardBg};
  ${theme.border};
  box-shadow: ${theme.glow};
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 240, 255, 0.3);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const TechIcon = styled.div`
  font-size: 48px;
  color: ${theme.neonBlue};
  margin-bottom: 20px;
  text-shadow: 0 0 10px ${theme.neonBlue};
`;

const TechStackShowcase: React.FC = () => {
  const techStack = [
    {
      icon: <CodeOutlined />,
      title: '前端技术',
      description: 'React 18, TypeScript, Ant Design, Styled Components'
    },
    {
      icon: <ApiOutlined />,
      title: '后端技术',
      description: 'Node.js, Express.js, MongoDB, Mongoose'
    },
    {
      icon: <RobotOutlined />,
      title: 'AI技术',
      description: '机器学习算法, TensorFlow.js, 数据分析'
    },
    {
      icon: <DatabaseOutlined />,
      title: '数据库',
      description: 'MongoDB, Redis, 数据可视化'
    },
    {
      icon: <CloudOutlined />,
      title: '部署运维',
      description: 'Docker, Kubernetes, Vercel, 云原生'
    },
    {
      icon: <BarChartOutlined />,
      title: '实时数据',
      description: 'WebSocket, 实时行情, 技术指标计算'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', margin: '40px 0' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: theme.neonBlue }}>
        技术栈架构
      </Title>
      
      <Row gutter={[30, 30]}>
        {techStack.map((tech, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <TechCard>
              <TechIcon>{tech.icon}</TechIcon>
              <Title level={4} style={{ color: '#fff', marginBottom: '15px' }}>
                {tech.title}
              </Title>
              <Paragraph style={{ color: '#ccc', fontSize: '16px' }}>
                {tech.description}
              </Paragraph>
            </TechCard>
          </Col>
        ))}
      </Row>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: 'rgba(26, 31, 58, 0.5)',
        borderRadius: '12px',
        border: theme.border
      }}>
        <Paragraph style={{ color: '#ccc', fontSize: '16px', margin: 0 }}>
          采用现代化全栈技术架构，确保系统高性能、高可用性和可扩展性
        </Paragraph>
      </div>
    </div>
  );
};

export default TechStackShowcase;