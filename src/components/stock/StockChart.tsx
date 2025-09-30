import React from 'react';
import EChartsReact from 'echarts-for-react';
import { theme } from '../../styles/theme';
import { Card, Select, Spin } from 'antd';

const { Option } = Select;

interface StockChartProps {
  symbol?: string;
  data: any[];
  loading?: boolean;
  period?: 'day' | 'week' | 'month';
  onPeriodChange?: (period: 'day' | 'week' | 'month') => void;
}

export const StockChart: React.FC<StockChartProps> = ({
  symbol,
  data,
  loading = false,
  period = 'day',
  onPeriodChange
}) => {
  const getOption = () => ({
    backgroundColor: theme.cardBg,
    border: theme.border,
    boxShadow: theme.glow,
    borderRadius: 12,
    title: { text: symbol ? `${symbol} ${period.toUpperCase()} K线分析` : '股票K线分析', left: 'center', textStyle: { color: theme.neonBlue } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    xAxis: { type: 'category', data: data.map((item) => item.date), axisLine: { lineStyle: { color: theme.neonBlue } } },
    yAxis: [{ 
      type: 'value', 
      axisLine: { lineStyle: { color: theme.neonBlue } }
    }, {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    }],
    series: [
      {
        name: 'K线',
        type: 'candlestick',
        data: data.map((item) => [item.open, item.close, item.low, item.high]),
        itemStyle: {
          color: '#00F0FF',
          color0: '#FF2E63',
          borderColor: '#00F0FF',
          borderColor0: '#FF2E63',
        },
      },
      { name: '成交量', type: 'bar', data: data.map((item) => item.volume), yAxisIndex: 1, itemStyle: { color: '#722ED1' } },
    ],
  });

  if (onPeriodChange) {
    return (
      <Card
        title="股票K线图"
        extra={
          <Select
            value={period}
            onChange={(value) => onPeriodChange(value as 'day' | 'week' | 'month')}
            style={{ width: 120 }}
          >
            <Option value="day">日线</Option>
            <Option value="week">周线</Option>
            <Option value="month">月线</Option>
          </Select>
        }
      >
        {loading || !data.length ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" tip="加载K线数据中..." />
          </div>
        ) : (
          <EChartsReact option={getOption()} style={{ height: '400px', width: '100%' }} />
        )}
      </Card>
    );
  }

  return <EChartsReact option={getOption()} style={{ height: '400px', width: '100%' }} />;
};