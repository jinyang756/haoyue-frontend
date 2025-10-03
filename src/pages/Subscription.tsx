import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  message, 
  Spin, 
  Modal, 
  Radio, 
  Divider,
  Statistic,
  Descriptions,
  Input,
  Form,
  Select,
  Switch,
  Tooltip,
  Badge
} from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  CrownOutlined, 
  CalendarOutlined,
  DollarOutlined,
  SyncOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import request from '@/services/request';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

// 样式组件
const PlanCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  &.current-plan {
    border-color: #1890ff;
    box-shadow: 0 0 15px rgba(24, 144, 255, 0.3);
  }
  
  &.recommended {
    position: relative;
    border-color: #faad14;
    
    &::before {
      content: '推荐';
      position: absolute;
      top: -10px;
      right: 20px;
      background: #faad14;
      color: white;
      padding: 2px 10px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: bold;
    }
  }
`;

const FeatureItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const BillingCycleSelector = styled.div`
  text-align: center;
  margin: 15px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const DiscountBadge = styled(Tag)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 12px;
`;

// 订阅计划配置
const PLAN_CONFIG: Record<string, any> = {
  free: {
    name: '免费版',
    price: 0,
    originalPrice: 0,
    period: '终身',
    billingCycles: {
      lifetime: { price: 0, discount: 0 }
    },
    features: [
      { name: '基础股票分析', included: true },
      { name: '每日AI分析 1次', included: true },
      { name: '3个技术指标', included: true },
      { name: '基础数据可视化', included: true },
      { name: '数据导出', included: false },
      { name: '优先技术支持', included: false },
      { name: '自定义指标', included: false },
      { name: '专属分析师', included: false }
    ],
    description: '基础功能免费使用',
    limitations: ['无数据导出', '无优先支持']
  },
  basic: {
    name: '基础版',
    price: 99,
    originalPrice: 99,
    period: '月',
    billingCycles: {
      monthly: { price: 99, discount: 0 },
      quarterly: { price: 267, discount: 10 }, // 99 * 3 * 0.9 = 267
      yearly: { price: 950, discount: 20 } // 99 * 12 * 0.8 = 950
    },
    features: [
      { name: '股票查询', included: true },
      { name: '每日AI分析 5次', included: true },
      { name: '8个技术指标', included: true },
      { name: '数据导出', included: true },
      { name: '基础支持', included: true },
      { name: '优先技术支持', included: false },
      { name: '自定义指标', included: false },
      { name: '专属分析师', included: false }
    ],
    description: '包含AI推荐功能',
    limitations: ['无优先支持']
  },
  premium: {
    name: '高级版',
    price: 299,
    originalPrice: 299,
    period: '月',
    billingCycles: {
      monthly: { price: 299, discount: 0 },
      quarterly: { price: 807, discount: 10 }, // 299 * 3 * 0.9 = 807
      yearly: { price: 2870, discount: 20 } // 299 * 12 * 0.8 = 2870
    },
    features: [
      { name: '股票查询', included: true },
      { name: '每日AI分析 20次', included: true },
      { name: '15个技术指标', included: true },
      { name: '数据导出', included: true },
      { name: '优先支持', included: true },
      { name: '自定义指标', included: true },
      { name: '专属分析师', included: false },
      { name: '投资组合管理', included: false }
    ],
    description: '完整功能，优先支持',
    limitations: []
  },
  vip: {
    name: 'VIP版',
    price: 599,
    originalPrice: 599,
    period: '月',
    billingCycles: {
      monthly: { price: 599, discount: 0 },
      quarterly: { price: 1617, discount: 10 }, // 599 * 3 * 0.9 = 1617
      yearly: { price: 5750, discount: 20 } // 599 * 12 * 0.8 = 5750
    },
    features: [
      { name: '股票查询', included: true },
      { name: '每日AI分析 50次', included: true },
      { name: '20个技术指标', included: true },
      { name: '数据导出', included: true },
      { name: '优先支持', included: true },
      { name: '自定义指标', included: true },
      { name: '专属分析师', included: true },
      { name: '投资组合管理', included: true },
      { name: '风险评估', included: false }
    ],
    description: 'VIP专属服务',
    limitations: []
  },
  platinum: {
    name: '白金版',
    price: 1999,
    originalPrice: 1999,
    period: '月',
    billingCycles: {
      monthly: { price: 1999, discount: 0 },
      quarterly: { price: 5397, discount: 10 }, // 1999 * 3 * 0.9 = 5397
      yearly: { price: 19190, discount: 20 } // 1999 * 12 * 0.8 = 19190
    },
    features: [
      { name: '股票查询', included: true },
      { name: '每日AI分析 无限次', included: true },
      { name: '技术指标 无限个', included: true },
      { name: '数据导出', included: true },
      { name: '优先支持', included: true },
      { name: '自定义指标', included: true },
      { name: '专属分析师', included: true },
      { name: '投资组合管理', included: true },
      { name: '风险评估', included: true },
      { name: 'API访问', included: true },
      { name: '团队协作', included: true }
    ],
    description: '企业级功能，专属服务',
    limitations: []
  }
};

export const Subscription: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plans] = useState<any>(PLAN_CONFIG);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [discountCode, setDiscountCode] = useState('');
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const [addMemberEmail, setAddMemberEmail] = useState('');
  const [invoiceInfo, setInvoiceInfo] = useState({
    companyName: '',
    taxId: '',
    address: '',
    phone: ''
  });
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  // 获取订阅计划
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        // 获取后端定义的计划
        const response: any = await request.get('/api/subscriptions/plans');
        setAvailablePlans(response.data?.plans || Object.keys(PLAN_CONFIG));
      } catch (error) {
        console.error('获取订阅计划失败:', error);
        // 使用默认计划
        setAvailablePlans(Object.keys(PLAN_CONFIG));
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // 获取用户当前订阅信息
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const response: any = await request.get('/api/subscriptions/current');
        setCurrentSubscription(response.data?.subscription);
        
        // 如果有活跃订阅，获取团队成员
        if (response.data?.subscription) {
          try {
            const teamResponse: any = await request.get('/api/subscriptions/team');
            setTeamMembers(teamResponse.data?.teamMembers || []);
          } catch (teamError) {
            console.error('获取团队成员失败:', teamError);
          }
        }
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
      
      // 创建订阅
      const response: any = await request.post('/api/subscriptions', {
        plan: planType,
        billingCycle,
        discountCode: discountCode || undefined,
        invoiceInfo: showInvoiceForm ? invoiceInfo : undefined
      });
      
      // 显示支付模态框
      setSelectedPlan(response.data?.subscription);
      setPaymentModalVisible(true);
    } catch (error: any) {
      message.error(error.message || '创建订阅失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理支付
  const handlePayment = async (paymentMethod: string) => {
    try {
      setLoading(true);
      
      if (!selectedPlan) return;
      
      // 处理支付
      const response: any = await request.post('/api/subscriptions/payment', {
        subscriptionId: selectedPlan._id,
        paymentMethod,
        paymentData: {
          // 这里可以添加实际的支付数据
          amount: selectedPlan.amount,
          currency: 'CNY'
        }
      });
      
      message.success('支付成功，订阅已激活！');
      setCurrentSubscription(response.data?.subscription);
      refreshUser(); // 刷新用户信息
      setPaymentModalVisible(false);
      setSelectedPlan(null);
    } catch (error: any) {
      message.error(error.message || '支付失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消订阅
  const handleCancelSubscription = async (reason?: string) => {
    try {
      setLoading(true);
      if (currentSubscription) {
        await request.post(`/api/subscriptions/${currentSubscription._id}/cancel`, {
          reason
        });
        message.success('订阅已取消');
        setCurrentSubscription(null);
        setTeamMembers([]);
        refreshUser(); // 刷新用户信息
      }
      setCancelModalVisible(false);
    } catch (error: any) {
      message.error(error.message || '取消订阅失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 计算折扣价格
  const calculatePrice = (plan: any, cycle: string) => {
    if (!plan.billingCycles[cycle]) return plan.price;
    return plan.billingCycles[cycle].price;
  };

  // 计算折扣百分比
  const calculateDiscount = (plan: any, cycle: string) => {
    if (!plan.billingCycles[cycle]) return 0;
    return plan.billingCycles[cycle].discount;
  };

  // 检查用户是否可以升级
  const canUpgrade = (planType: string) => {
    if (!currentSubscription) return true;
    
    const planOrder: Record<string, number> = { 
      free: 0, 
      basic: 1, 
      premium: 2, 
      vip: 3,
      platinum: 4 
    };
    return planOrder[planType] >= planOrder[currentSubscription.plan as string];
  };

  // 获取团队成员
  const fetchTeamMembers = async () => {
    try {
      const response: any = await request.get('/api/subscriptions/team');
      setTeamMembers(response.data?.teamMembers || []);
    } catch (error) {
      console.error('获取团队成员失败:', error);
    }
  };

  // 添加团队成员
  const handleAddTeamMember = async () => {
    try {
      setLoading(true);
      await request.post('/api/subscriptions/team', {
        email: addMemberEmail
      });
      message.success('成功添加团队成员');
      setAddMemberEmail('');
      fetchTeamMembers();
    } catch (error: any) {
      message.error(error.message || '添加团队成员失败');
    } finally {
      setLoading(false);
    }
  };

  // 移除团队成员
  const handleRemoveTeamMember = async (memberId: string) => {
    try {
      setLoading(true);
      await request.delete(`/api/subscriptions/team/${memberId}`);
      message.success('成功移除团队成员');
      fetchTeamMembers();
    } catch (error: any) {
      message.error(error.message || '移除团队成员失败');
    } finally {
      setLoading(false);
    }
  };

  // 升级订阅
  const handleUpgradeSubscription = async (planType: string) => {
    try {
      setLoading(true);
      if (currentSubscription) {
        const response: any = await request.put(`/api/subscriptions/${currentSubscription._id}`, {
          plan: planType,
          billingCycle
        });
        message.success('订阅升级成功');
        setCurrentSubscription(response.data?.subscription);
        refreshUser();
      }
    } catch (error: any) {
      message.error(error.message || '升级订阅失败');
    } finally {
      setLoading(false);
    }
  };

  // 续订订阅
  const handleRenewSubscription = async () => {
    try {
      setLoading(true);
      if (currentSubscription) {
        const response: any = await request.put(`/api/subscriptions/${currentSubscription._id}`, {
          plan: currentSubscription.plan,
          billingCycle
        });
        message.success('订阅续订成功');
        setCurrentSubscription(response.data?.subscription);
        refreshUser();
      }
    } catch (error: any) {
      message.error(error.message || '续订订阅失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取计划最大团队成员数
  const getMaxTeamMembers = (planType: string) => {
    const plan = plans[planType];
    if (!plan) return 1;
    
    // 根据计划类型返回最大团队成员数
    switch (planType) {
      case 'free': return 1;
      case 'basic': return 1;
      case 'premium': return 3;
      case 'vip': return 5;
      case 'platinum': return 10;
      default: return 1;
    }
  };

  // 检查是否可以添加团队成员
  const canAddTeamMember = () => {
    if (!currentSubscription) return false;
    return teamMembers.length < getMaxTeamMembers(currentSubscription.plan);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        订阅计划
      </Title>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="加载中..." />
        </div>
      )}
      
      {!loading && (
        <>
          {/* 当前订阅信息 */}
          {currentSubscription && (
            <Card style={{ marginBottom: '30px' }}>
              <Title level={4}>当前订阅</Title>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="计划">
                      <Text strong>{PLAN_CONFIG[currentSubscription.plan as string]?.name}</Text>
                      {currentSubscription.plan !== 'free' && (
                        <Tag color="gold" style={{ marginLeft: 8 }}>
                          <TeamOutlined /> {teamMembers.length}/{getMaxTeamMembers(currentSubscription.plan)} 成员
                        </Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="状态">
                      <Tag color={currentSubscription.status === 'active' ? 'green' : 'red'}>
                        {currentSubscription.status === 'active' ? '激活' : '未激活'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="计费周期">
                      {currentSubscription.billingCycle === 'monthly' ? '月付' : 
                       currentSubscription.billingCycle === 'quarterly' ? '季付' : 
                       currentSubscription.billingCycle === 'yearly' ? '年付' : '终身'}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col xs={24} md={12}>
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="开始时间">
                      <CalendarOutlined /> {new Date(currentSubscription.startDate).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="到期时间">
                      <CalendarOutlined /> {new Date(currentSubscription.endDate).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="自动续订">
                      {currentSubscription.autoRenew ? '是' : '否'}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              
              {/* 团队管理 */}
              {currentSubscription.plan !== 'free' && (
                <div style={{ marginTop: '20px' }}>
                  <Title level={5}>团队管理</Title>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <Text strong>团队成员 ({teamMembers.length}/{getMaxTeamMembers(currentSubscription.plan)})</Text>
                    </div>
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => setTeamModalVisible(true)}
                      disabled={!canAddTeamMember()}
                    >
                      添加成员
                    </Button>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {teamMembers.map((member: any) => (
                      <Tag 
                        key={member.id} 
                        closable 
                        onClose={() => handleRemoveTeamMember(member.id)}
                        style={{ padding: '5px 10px' }}
                      >
                        {member.username} ({member.email})
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  onClick={handleRenewSubscription}
                  icon={<SyncOutlined />}
                  style={{ marginRight: '10px' }}
                >
                  续订
                </Button>
                <Button 
                  type="primary" 
                  danger 
                  onClick={() => setCancelModalVisible(true)}
                  icon={<CloseOutlined />}
                >
                  取消订阅
                </Button>
              </div>
            </Card>
          )}
          
          {/* 计费周期选择 */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Title level={4}>选择计费周期</Title>
            <Radio.Group 
              value={billingCycle} 
              onChange={(e) => setBillingCycle(e.target.value)}
              size="large"
            >
              <Radio.Button value="monthly">月付</Radio.Button>
              <Radio.Button value="quarterly">季付 <Tag color="green">9折</Tag></Radio.Button>
              <Radio.Button value="yearly">年付 <Tag color="blue">8折</Tag></Radio.Button>
            </Radio.Group>
          </div>
          
          {/* 订阅计划 */}
          <Row gutter={[24, 24]}>
            {availablePlans.map((planType) => {
              const plan = plans[planType];
              if (!plan) return null;
              
              const currentPlan = currentSubscription?.plan === planType;
              const isRecommended = planType === 'premium';
              const price = calculatePrice(plan, billingCycle);
              const discount = calculateDiscount(plan, billingCycle);
              const originalPrice = plan.originalPrice * 
                (billingCycle === 'quarterly' ? 3 : billingCycle === 'yearly' ? 12 : 1);
              
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={planType}>
                  <PlanCard
                    className={`${currentPlan ? 'current-plan' : ''} ${isRecommended ? 'recommended' : ''}`}
                  >
                    {discount > 0 && (
                      <DiscountBadge color="red">节省{discount}%</DiscountBadge>
                    )}
                    
                    <div style={{ textAlign: 'center', position: 'relative' }}>
                      <Title level={4} style={{ marginBottom: '10px' }}>
                        {plan.name} {planType === 'platinum' && <CrownOutlined />}
                      </Title>
                      
                      <div>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                          ¥{price}
                        </span>
                        {price > 0 && (
                          <span style={{ color: '#999', marginLeft: '5px' }}>
                            /{billingCycle === 'monthly' ? '月' : billingCycle === 'quarterly' ? '季' : '年'}
                          </span>
                        )}
                      </div>
                      
                      {discount > 0 && originalPrice > price && (
                        <div>
                          <Text delete style={{ color: '#999', fontSize: '14px' }}>
                            ¥{originalPrice}
                          </Text>
                          <Tag color="red" style={{ marginLeft: '5px' }}>节省¥{originalPrice - price}</Tag>
                        </div>
                      )}
                      
                      <Paragraph style={{ fontSize: '12px', color: '#666', minHeight: '40px' }}>
                        {plan.description}
                      </Paragraph>
                    </div>
                    
                    <Divider style={{ margin: '15px 0' }} />
                    
                    <div style={{ minHeight: '250px' }}>
                      {plan.features.map((feature: any, index: number) => (
                        <FeatureItem key={index}>
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
                        </FeatureItem>
                      ))}
                      
                      {plan.limitations.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <Text strong type="danger">限制:</Text>
                          {plan.limitations.map((limit: string, index: number) => (
                            <div key={index} style={{ fontSize: '12px', color: '#ff4d4f' }}>
                              • {limit}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ marginTop: '20px' }}>
                      {currentPlan ? (
                        <Button 
                          type="primary" 
                          block 
                          disabled
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
                        >
                          {canUpgrade(planType) ? '立即订阅' : '无法降级'}
                        </Button>
                      )}
                    </div>
                  </PlanCard>
                </Col>
              );
            })}
          </Row>
          
          {/* 折扣码输入 */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <InputWithButton
              placeholder="输入折扣码"
              value={discountCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}
              buttonText="应用"
              onButtonClick={() => message.info('折扣码已应用')}
              style={{ maxWidth: '300px' }}
            />
          </div>
        </>
      )}
      
      {/* 取消订阅确认模态框 */}
      <Modal
        title="确认取消订阅"
        visible={cancelModalVisible}
        onOk={() => handleCancelSubscription()}
        onCancel={() => setCancelModalVisible(false)}
        okText="确认取消"
        cancelText="继续订阅"
        okButtonProps={{ danger: true, loading }}
      >
        <Paragraph>
          <Text strong>您确定要取消当前订阅吗？</Text>
        </Paragraph>
        <Paragraph>
          取消后您将失去相关高级功能的访问权限，但仍可以使用免费版的功能。
        </Paragraph>
        <Paragraph type="warning">
          注意：已支付的费用不会退还。
        </Paragraph>
        <Form.Item label="取消原因（可选）">
          <Input.TextArea 
            placeholder="请告诉我们您取消订阅的原因，帮助我们改进服务"
            rows={3}
          />
        </Form.Item>
      </Modal>
      
      {/* 支付模态框 */}
      <Modal
        title="选择支付方式"
        visible={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={400}
      >
        {selectedPlan && (
          <div>
            <Card size="small" style={{ marginBottom: '20px' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="订阅计划">
                  {PLAN_CONFIG[selectedPlan.plan]?.name}
                </Descriptions.Item>
                <Descriptions.Item label="计费周期">
                  {selectedPlan.billingCycle === 'monthly' ? '月付' : 
                   selectedPlan.billingCycle === 'quarterly' ? '季付' : 
                   selectedPlan.billingCycle === 'yearly' ? '年付' : '终身'}
                </Descriptions.Item>
                <Descriptions.Item label="金额">
                  <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    ¥{selectedPlan.amount}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            
            <Title level={5}>选择支付方式</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button 
                size="large" 
                icon={<DollarOutlined />} 
                onClick={() => handlePayment('alipay')}
                loading={loading}
              >
                支付宝支付
              </Button>
              <Button 
                size="large" 
                icon={<DollarOutlined />} 
                onClick={() => handlePayment('wechat')}
                loading={loading}
              >
                微信支付
              </Button>
              <Button 
                size="large" 
                icon={<DollarOutlined />} 
                onClick={() => handlePayment('credit_card')}
                loading={loading}
              >
                信用卡支付
              </Button>
            </div>
            
            {/* 发票信息开关 */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Switch 
                checked={showInvoiceForm}
                onChange={setShowInvoiceForm}
                checkedChildren="需要发票"
                unCheckedChildren="不需要发票"
              />
            </div>
            
            {/* 发票信息表单 */}
            {showInvoiceForm && (
              <div style={{ marginTop: '20px' }}>
                <Title level={5}>发票信息</Title>
                <Form layout="vertical">
                  <Form.Item label="公司名称">
                    <Input 
                      placeholder="请输入公司名称"
                      value={invoiceInfo.companyName}
                      onChange={(e) => setInvoiceInfo({...invoiceInfo, companyName: e.target.value})}
                    />
                  </Form.Item>
                  <Form.Item label="税号">
                    <Input 
                      placeholder="请输入税号"
                      value={invoiceInfo.taxId}
                      onChange={(e) => setInvoiceInfo({...invoiceInfo, taxId: e.target.value})}
                    />
                  </Form.Item>
                  <Form.Item label="地址">
                    <Input 
                      placeholder="请输入地址"
                      value={invoiceInfo.address}
                      onChange={(e) => setInvoiceInfo({...invoiceInfo, address: e.target.value})}
                    />
                  </Form.Item>
                  <Form.Item label="电话">
                    <Input 
                      placeholder="请输入电话"
                      value={invoiceInfo.phone}
                      onChange={(e) => setInvoiceInfo({...invoiceInfo, phone: e.target.value})}
                    />
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        )}
      </Modal>
      
      {/* 团队管理模态框 */}
      <Modal
        title="添加团队成员"
        visible={teamModalVisible}
        onCancel={() => setTeamModalVisible(false)}
        onOk={handleAddTeamMember}
        okText="添加"
        cancelText="取消"
        okButtonProps={{ loading }}
      >
        <Form layout="vertical">
          <Form.Item 
            label="成员邮箱" 
            required
            help="请输入要添加的团队成员的注册邮箱"
          >
            <Input 
              placeholder="请输入邮箱地址"
              value={addMemberEmail}
              onChange={(e) => setAddMemberEmail(e.target.value)}
              type="email"
            />
          </Form.Item>
        </Form>
        <Paragraph type="secondary">
          <InfoCircleOutlined /> 添加的成员将共享您的订阅权限，但不能管理订阅设置。
        </Paragraph>
      </Modal>
    </div>
  );
};

// 输入框和按钮组合组件
const InputWithButton: React.FC<any> = ({ 
  placeholder, 
  value, 
  onChange, 
  buttonText, 
  onButtonClick,
  style 
}) => {
  return (
    <div style={{ display: 'flex', ...style }}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          flex: 1,
          borderRadius: '4px 0 0 4px'
        }}
      />
      <Button 
        type="primary" 
        onClick={onButtonClick}
        style={{ borderRadius: '0 4px 4px 0' }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default Subscription;