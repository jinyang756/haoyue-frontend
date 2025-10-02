import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Typography, Tag, message, Spin, Modal } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import request from '@/services/request';

const { Title, Paragraph } = Typography;

// 订阅计划配置
const PLAN_CONFIG: Record<string, any> = {
  free: {
    name: '免费版',
    price: 0,
    period: '永久',
    features: [
      { name: '基础股票分析', included: true },
      { name: '股票搜索', included: true },
      { name: '技术指标', included: true },
      { name: 'AI推荐功能', included: false },
      { name: '高级图表', included: false },
      { name: '优先技术支持', included: false }
    ],
    description: '基础功能免费使用'
  },
  basic: {
    name: '基础版',
    price: 99,
    period: '年',
    features: [
      { name: '基础股票分析', included: true },
      { name: '股票搜索', included: true },
      { name: '技术指标', included: true },
      { name: 'AI推荐功能', included: true },
      { name: '高级图表', included: false },
      { name: '优先技术支持', included: false }
    ],
    description: '包含AI推荐功能'
  },
  premium: {
    name: '高级版',
    price: 299,
    period: '年',
    features: [
      { name: '基础股票分析', included: true },
      { name: '股票搜索', included: true },
      { name: '技术指标', included: true },
      { name: 'AI推荐功能', included: true },
      { name: '高级图表', included: true },
      { name: '优先技术支持', included: true }
    ],
    description: '完整功能，优先支持'
  },
  enterprise: {
    name: '企业版',
    price: 999,
    period: '年',
    features: [
      { name: '基础股票分析', included: true },
      { name: '股票搜索', included: true },
      { name: '技术指标', included: true },
      { name: 'AI推荐功能', included: true },
      { name: '高级图表', included: true },
      { name: '优先技术支持', included: true }
    ],
    description: '企业级功能，专属服务'
  }
};

export const Subscription: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plans] = useState<any>(PLAN_CONFIG);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  // 获取用户当前订阅信息
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const response = await request.get('/api/subscriptions/me');
        setCurrentSubscription(response);
      } catch (error) {
        console.error('获取订阅信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  // 处理订阅
  const handleSubscribe = async (planType: string) => {
    try {
      setLoading(true);
      
      // 这里应该集成实际的支付系统
      // 为了演示，我们直接创建订阅
      const response = await request.post('/api/subscriptions', {
        plan: planType,
        paymentMethod: 'alipay', // 模拟支付方式
        transactionId: `txn_${Date.now()}` // 模拟交易ID
      });
      
      message.success('订阅成功！');
      setCurrentSubscription(response);
      refreshUser(); // 刷新用户信息
    } catch (error: any) {
      message.error(error.message || '订阅失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消订阅
  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      if (currentSubscription) {
        await request.put(`/api/subscriptions/${currentSubscription._id}/cancel`);
        message.success('订阅已取消');
        setCurrentSubscription(null);
        refreshUser(); // 刷新用户信息
      }
      setCancelModalVisible(false);
    } catch (error: any) {
      message.error(error.message || '取消订阅失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 检查用户是否可以升级
  const canUpgrade = (planType: string) => {
    if (!currentSubscription) return true;
    
    const planOrder: Record<string, number> = { free: 0, basic: 1, premium: 2, enterprise: 3 };
    return planOrder[planType] > planOrder[currentSubscription.plan as string];
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        订阅计划
      </Title>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}
      
      {!loading && (
        <>
          {/* 当前订阅信息 */}
          {currentSubscription && (
            <Card style={{ marginBottom: '30px' }}>
              <Title level={4}>当前订阅</Title>
              <Paragraph>
                <strong>计划:</strong> {PLAN_CONFIG[currentSubscription.plan as string]?.name}
              </Paragraph>
              <Paragraph>
                <strong>状态:</strong> 
                <Tag color={currentSubscription.status === 'active' ? 'green' : 'red'}>
                  {currentSubscription.status === 'active' ? '激活' : '未激活'}
                </Tag>
              </Paragraph>
              <Paragraph>
                <strong>到期时间:</strong> 
                {currentSubscription.endDate ? new Date(currentSubscription.endDate).toLocaleDateString() : '永久'}
              </Paragraph>
              <Button 
                type="primary" 
                danger 
                onClick={() => setCancelModalVisible(true)}
              >
                取消订阅
              </Button>
            </Card>
          )}
          
          {/* 订阅计划 */}
          <Row gutter={[24, 24]}>
            {Object.entries(plans).map(([planType, plan]: [string, any]) => (
              <Col xs={24} sm={12} md={8} lg={6} key={planType}>
                <Card
                  title={
                    <div style={{ textAlign: 'center' }}>
                      <Title level={4} style={{ marginBottom: '10px' }}>{plan.name}</Title>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                          ¥{plan.price}
                        </span>
                        {plan.price > 0 && <span>/年</span>}
                      </div>
                      <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                        {plan.description}
                      </Paragraph>
                    </div>
                  }
                  bordered
                  style={{ 
                    height: '100%',
                    borderColor: user?.role === 'vip' && planType !== 'free' ? '#1890ff' : undefined,
                    boxShadow: user?.role === 'vip' && planType !== 'free' ? '0 0 10px rgba(24, 144, 255, 0.3)' : undefined
                  }}
                >
                  <div style={{ minHeight: '200px' }}>
                    {plan.features.map((feature: any, index: number) => (
                      <div key={index} style={{ marginBottom: '10px' }}>
                        {feature.included ? (
                          <CheckOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        ) : (
                          <CloseOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                        )}
                        <span style={{ 
                          textDecoration: feature.included ? 'none' : 'line-through',
                          color: feature.included ? 'inherit' : '#999'
                        }}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {user?.role === 'vip' && planType !== 'free' ? (
                    <Button 
                      type="primary" 
                      block 
                      disabled
                      style={{ marginTop: '20px' }}
                    >
                      当前计划
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      block
                      loading={loading}
                      onClick={() => handleSubscribe(planType)}
                      disabled={!canUpgrade(planType)}
                      style={{ marginTop: '20px' }}
                    >
                      {canUpgrade(planType) ? '立即订阅' : '无法降级'}
                    </Button>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
      
      {/* 取消订阅确认模态框 */}
      <Modal
        title="确认取消订阅"
        visible={cancelModalVisible}
        onOk={handleCancelSubscription}
        onCancel={() => setCancelModalVisible(false)}
        okText="确认取消"
        cancelText="继续订阅"
        okButtonProps={{ danger: true }}
      >
        <Paragraph>
          您确定要取消当前订阅吗？取消后您将失去相关高级功能的访问权限。
        </Paragraph>
        <Paragraph>
          注意：取消订阅后，您仍可以使用免费版的功能。
        </Paragraph>
      </Modal>
    </div>
  );
};

export default Subscription;