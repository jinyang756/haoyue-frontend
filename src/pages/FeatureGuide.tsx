import React from 'react';
import { Card, Typography, Collapse, List, Divider, Row, Col } from 'antd';
import { 
  BarChartOutlined, 
  RobotOutlined, 
  LineChartOutlined, 
  SafetyCertificateOutlined,
  CloudOutlined,
  DatabaseOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const FeatureGuide: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      key: '1',
      icon: <RobotOutlined />,
      title: 'AI智能分析',
      description: '基于机器学习算法，提供精准的股票分析和投资建议'
    },
    {
      key: '2',
      icon: <LineChartOutlined />,
      title: '实时数据',
      description: '接入权威数据源，提供实时股票行情和技术指标'
    },
    {
      key: '3',
      icon: <SafetyCertificateOutlined />,
      title: '安全可靠',
      description: '采用JWT认证和Auth0安全机制，保障您的账户和数据安全'
    },
    {
      key: '4',
      icon: <CloudOutlined />,
      title: '云端部署',
      description: '基于云原生架构，支持弹性扩展，确保服务的高可用性'
    },
    {
      key: '5',
      icon: <DatabaseOutlined />,
      title: '数据可视化',
      description: '通过MongoDB Charts提供丰富的数据可视化展示'
    },
    {
      key: '6',
      icon: <BarChartOutlined />,
      title: '专业分析报告',
      description: '提供多维度的股票分析报告，包括基本面、技术面和市场情绪分析'
    },
    {
      key: '7',
      icon: <TeamOutlined />,
      title: '专业团队',
      description: '由金融专家和AI工程师组成的跨学科团队'
    },
    {
      key: '8',
      icon: <FileTextOutlined />,
      title: '内容管理',
      description: '提供丰富的投资教育资源和市场资讯'
    },
    {
      key: '9',
      icon: <DollarOutlined />,
      title: '订阅计划',
      description: '灵活的订阅计划，满足不同用户需求'
    }
  ];

  const usageSteps = [
    {
      title: '注册/登录账户',
      description: '访问网站并创建账户，或使用现有账户登录'
    },
    {
      title: '选择分析功能',
      description: '根据需求选择AI分析、股票筛选或投资组合分析'
    },
    {
      title: '输入分析参数',
      description: '设置分析条件，如股票代码、时间范围、分析类型等'
    },
    {
      title: '查看分析结果',
      description: '查看生成的分析报告和投资建议'
    },
    {
      title: '制定投资策略',
      description: '根据分析结果制定或调整投资策略'
    },
    {
      title: '持续跟踪',
      description: '定期查看更新的分析报告，跟踪投资表现'
    }
  ];

  return (
    <div className="feature-guide-page">
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          功能介绍与使用指南
        </Title>
        
        <Divider />
        
        <Title level={3}>核心功能</Title>
        <Row gutter={[20, 20]} style={{ marginBottom: '30px' }}>
          {features.map((feature) => (
            <Col xs={24} sm={12} md={8} key={feature.key}>
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
                <Paragraph style={{ color: '#ccc' }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Divider />
        
        <Title level={3}>使用步骤</Title>
        <List
          itemLayout="horizontal"
          dataSource={usageSteps}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: '#165DFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                }
                title={<span style={{ color: '#fff' }}>{item.title}</span>}
                description={<span style={{ color: '#ccc' }}>{item.description}</span>}
              />
            </List.Item>
          )}
          style={{ marginBottom: '30px' }}
        />
        
        <Divider />
        
        <Title level={3}>功能详解</Title>
        <Collapse accordion>
          <Panel header="AI智能分析" key="1">
            <Paragraph>
              我们的AI智能分析功能基于先进的机器学习算法，能够分析大量历史数据和实时市场信息，
              为用户提供精准的股票分析和投资建议。该功能包括：
            </Paragraph>
            <ul>
              <li>基本面分析：分析公司财务状况、行业地位等</li>
              <li>技术面分析：基于技术指标预测价格走势</li>
              <li>市场情绪分析：分析市场情绪和投资者行为</li>
              <li>风险评估：评估投资风险并提供风险控制建议</li>
            </ul>
          </Panel>
          
          <Panel header="股票筛选" key="2">
            <Paragraph>
              AI选股功能帮助用户从海量股票中筛选出具有投资价值的标的。用户可以设置筛选条件，
              如市值、行业、财务指标等，系统将根据AI算法推荐符合条件的股票。
            </Paragraph>
          </Panel>
          
          <Panel header="投资组合分析" key="3">
            <Paragraph>
              投资组合分析功能帮助用户评估和优化自己的投资组合。通过分析组合的风险收益特征，
              提供资产配置建议和再平衡策略。
            </Paragraph>
          </Panel>
          
          <Panel header="实时数据监控" key="4">
            <Paragraph>
              实时数据监控功能提供24/7的市场监控，及时捕捉市场变化和异常信号。
              用户可以设置自定义提醒，当满足特定条件时收到通知。
            </Paragraph>
          </Panel>
          
          <Panel header="内容管理" key="5">
            <Paragraph>
              内容管理模块提供丰富的投资教育资源，包括市场分析、投资策略、
              风险管理等专业内容，帮助用户提升投资知识和技能。
            </Paragraph>
          </Panel>
        </Collapse>
        
        <Divider />
        
        <Title level={3}>订阅计划</Title>
        <Paragraph>
          我们提供多种订阅计划以满足不同用户需求：
        </Paragraph>
        <ul>
          <li>免费版：基础功能，适合初学者</li>
          <li>专业版：完整功能，适合个人投资者</li>
          <li>VIP版：高级功能+专属服务，适合专业投资者</li>
        </ul>
        
        <Divider />
        
        <Title level={3}>技术支持</Title>
        <Paragraph>
          如在使用过程中遇到任何问题，请联系我们的技术支持团队：
        </Paragraph>
        <ul>
          <li>客服邮箱：support@haoyue.com</li>
          <li>客服电话：400-123-4567</li>
          <li>在线客服：网站右下角聊天窗口</li>
        </ul>
      </Card>
    </div>
  );
};

export default FeatureGuide;