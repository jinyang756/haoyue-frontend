import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, Select, Spin } from 'antd';
import { StockHistory } from '@/services/stockservice';

const { Option } = Select;

interface StockChartProps {
  symbol: string;
  data: StockHistory[];
  loading: boolean;
  period: 'day' | 'week' | 'month';
  onPeriodChange: (period: 'day' | 'week' | 'month') => void;
}

const StockChart: React.FC<StockChartProps> = ({
  symbol,
  data,
  loading,
  period,
  onPeriodChange
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      return () => {
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!chartInstance.current || loading || !data.length) return;

    const chartData = data.map(item => [
      item.date,
      item.open,
      item.close,
      item.low,
      item.high,
      item.volume
    ]);

    const option = {
      title: {
        text: `${symbol} ${period.toUpperCase()} K线图`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['K线', 'MA5', 'MA10', 'MA20'],
        bottom: 0
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.date),
        axisLabel: {
          interval: Math.ceil(data.length / 10)
        }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: chartData.map(item => [item[1], item[2], item[3], item[4]]),
          itemStyle: {
            color: '#52c41a',
            color0: '#f5222d',
            borderColor: '#52c41a',
            borderColor0: '#f5222d'
          }
        },
        {
          name: 'MA5',
          type: 'line',
          data: calculateMA(data, 5),
          smooth: true,
          lineStyle: {
            width: 1,
            color: '#ff9900'
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: calculateMA(data, 10),
          smooth: true,
          lineStyle: {
            width: 1,
            color: '#1890ff'
          }
        },
        {
          name: 'MA20',
          type: 'line',
          data: calculateMA(data, 20),
          smooth: true,
          lineStyle: {
            width: 1,
            color: '#722ed1'
          }
        }
      ]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, period, loading, calculateMA]);

  const calculateMA = (data: StockHistory[], dayCount: number) => {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < dayCount - 1) {
        result.push(0);
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j].close;
      }
      result.push(sum / dayCount);
    }
    return result;
  };

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
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="加载K线数据中..." />
        </div>
      ) : (
        <div
          ref={chartRef}
          style={{ width: '100%', height: '500px' }}
        />
      )}
    </Card>
  );
};

export default StockChart;