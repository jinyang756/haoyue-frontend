import React from 'react';
import { Card, Statistic, Row, Col, Progress, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { TechnicalIndicators } from '@/services/stockservice';

interface TechnicalIndicatorProps {
  indicators: TechnicalIndicators | null;
  loading: boolean;
}

const TechnicalIndicator: React.FC<TechnicalIndicatorProps> = ({ indicators, loading }) => {
  if (loading || !indicators) {
    return (
      <Card title="技术指标分析" loading={loading}>
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          加载中...
        </div>
      </Card>
    );
  }

  const { rsi, macd, bollinger, kdj, ma } = indicators;

  const getRSIColor = (value: number) => {
    if (value > 70) return '#f5222d';
    if (value < 30) return '#52c41a';
    return '#1890ff';
  };

  const getRSIText = (value: number) => {
    if (value > 70) return '超买';
    if (value < 30) return '超卖';
    return '正常';
  };

  const getMACDColor = (value: number) => {
    return value > 0 ? '#52c41a' : '#f5222d';
  };

  return (
    <Card title="技术指标分析">
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} md={6}>
          <Tooltip title="相对强弱指数，70以上超买，30以下超卖">
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 16 }}>
              <Statistic
                title="RSI (14)"
                value={rsi.toFixed(2)}
                precision={2}
                valueStyle={{ color: getRSIColor(rsi) }}
              />
              <div style={{ marginTop: 8 }}>
                <Progress 
                  percent={Math.min(100, Math.max(0, (rsi - 30) / 0.4))} 
                  status={rsi > 70 ? 'exception' : rsi < 30 ? 'success' : 'active'}
                  size="small"
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 4, color: getRSIColor(rsi) }}>
                {getRSIText(rsi)}
              </div>
            </div>
          </Tooltip>
        </Col>

        <Col xs={12} sm={8} md={6}>
          <Tooltip title="移动平均收敛散度，正值看涨，负值看跌">
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 16 }}>
              <Statistic
                title="MACD"
                value={macd.toFixed(4)}
                precision={4}
                valueStyle={{ color: getMACDColor(macd) }}
                prefix={macd > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              />
            </div>
          </Tooltip>
        </Col>

        <Col xs={12} sm={8} md={6}>
          <Tooltip title="布林带位置，当前价格相对于上下轨的位置">
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 16 }}>
              <Statistic
                title="布林带位置"
                value={`${((bollinger.current - bollinger.lower) / (bollinger.upper - bollinger.lower) * 100).toFixed(1)}%`}
                precision={1}
              />
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div>上轨: {bollinger.upper.toFixed(2)}</div>
                <div>中轨: {bollinger.middle.toFixed(2)}</div>
                <div>下轨: {bollinger.lower.toFixed(2)}</div>
              </div>
            </div>
          </Tooltip>
        </Col>

        <Col xs={12} sm={8} md={6}>
          <Tooltip title="随机指标，K线和D线的交叉情况">
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 16 }}>
              <Statistic title="KDJ" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#888' }}>K</div>
                  <div style={{ fontSize: 16 }}>{kdj.k.toFixed(1)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#888' }}>D</div>
                  <div style={{ fontSize: 16 }}>{kdj.d.toFixed(1)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#888' }}>J</div>
                  <div style={{ fontSize: 16 }}>{kdj.j.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </Tooltip>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Tooltip title="移动平均线，反映价格趋势">
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 16 }}>
              <Statistic title="移动平均线" />
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span>MA5: {ma.ma5.toFixed(2)}</span>
                  <span>MA10: {ma.ma10.toFixed(2)}</span>
                  <span>MA20: {ma.ma20.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Tooltip>
        </Col>
      </Row>
    </Card>
  );
};

export default TechnicalIndicator;