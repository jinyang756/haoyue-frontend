import React from 'react';
import { Card, Typography, List } from 'antd';
import { BulbOutlined, ApiOutlined, TeamOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  const features = [
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

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          关于皓月量化智能引擎
        </Title>
        
        <Paragraph style={{ fontSize: '16px', lineHeight: '2' }}>
          皓月量化是一个基于AI的股票分析平台，致力于为投资者提供专业、准确、及时的股票分析和投资建议。
          我们运用先进的人工智能技术和大数据分析方法，帮助用户在复杂的金融市场中做出明智的投资决策。
        </Paragraph>
        
        <Title level={3} style={{ marginTop: '40px', marginBottom: '20px' }}>
          核心功能
        </Title>
        
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={features}
          renderItem={item => (
            <List.Item>
              <Card>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  {item.icon}
                </div>
                <Title level={4} style={{ textAlign: 'center', marginBottom: '10px' }}>
                  {item.title}
                </Title>
                <Paragraph style={{ textAlign: 'center' }}>
                  {item.description}
                </Paragraph>
              </Card>
            </List.Item>
          )}
        />
        
        <Title level={3} style={{ marginTop: '40px', marginBottom: '20px' }}>
          技术架构
        </Title>
        
        <Paragraph style={{ fontSize: '16px', lineHeight: '2' }}>
          平台采用现代化的技术栈，包括React前端、Node.js后端和MongoDB数据库。
          我们使用机器学习算法进行数据分析，并通过RESTful API提供服务。
        </Paragraph>
        
        <Title level={3} style={{ marginTop: '40px', marginBottom: '20px' }}>
          联系我们
        </Title>
        
        <div style={{ textAlign: 'center' }}>
          <Paragraph>
            <MailOutlined style={{ marginRight: '8px' }} />
            邮箱: contact@haoyue-quant.com
          </Paragraph>
          <Paragraph>
            如果您有任何问题或建议，欢迎随时联系我们。
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default About;