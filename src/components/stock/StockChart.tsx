import React from 'react';
import EChartsReact from 'echarts-for-react';
import { theme } from '../../styles/theme';
import { Card, Select, Spin, Button } from 'antd';

const { Option } = Select;

interface StockChartProps {
  symbol?: string;
  data: any[];
  loading?: boolean;
  period?: 'day' | 'week' | 'month';
  onPeriodChange?: (period: 'day' | 'week' | 'month') => void;
  chartType?: 'kline' | 'macd' | 'rsi' | 'volume';
  onChartTypeChange?: (chartType: 'kline' | 'macd' | 'rsi' | 'volume') => void;
}

export const StockChart: React.FC<StockChartProps> = ({
  symbol,
  data,
  loading = false,
  period = 'day',
  onPeriodChange,
  chartType = 'kline',
  onChartTypeChange
}) => {
  // 创建ref来访问图表实例
  const chartRef = React.useRef<any>(null);
  
  // 图表初始化完成后的回调
  const onEvents = {
    'click': (params: any) => {
      console.log('图表点击事件:', params);
    },
    'datazoom': (params: any) => {
      console.log('数据缩放事件:', params);
    }
  };
  // 计算MACD指标
  const calculateMACD = (data: any[]) => {
    // 简化的MACD计算（实际应用中应使用更精确的算法）
    const ema12: number[] = [];
    const ema26: number[] = [];
    const macd: number[] = [];
    const signal: number[] = [];
    const histogram: number[] = [];
    
    // 简化计算，实际应用中应使用EMA算法
    data.forEach((item, index) => {
      const price = (item.open + item.close) / 2;
      macd.push(Math.sin(index / 10) * 10); // 模拟数据
      signal.push(Math.cos(index / 10) * 5); // 模拟数据
      histogram.push(macd[macd.length - 1] - signal[signal.length - 1]);
    });
    
    return { macd, signal, histogram };
  };
  
  // 计算RSI指标
  const calculateRSI = (data: any[]) => {
    // 简化的RSI计算（实际应用中应使用更精确的算法）
    const rsi: number[] = [];
    
    data.forEach((item, index) => {
      // 模拟RSI值
      rsi.push(50 + Math.sin(index / 5) * 20);
    });
    
    return rsi;
  };
  
  const getOption = () => {
    // 根据图表类型返回不同的配置
    switch (chartType) {
      case 'macd':
        const macdData = calculateMACD(data);
        return {
          backgroundColor: theme.cardBg,
          border: theme.border,
          boxShadow: theme.glow,
          borderRadius: 12,
          title: { text: symbol ? `${symbol} MACD指标` : 'MACD指标', left: 'center', textStyle: { color: theme.neonBlue } },
          tooltip: { trigger: 'axis' },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              type: 'slider',
              start: 0,
              end: 100,
              bottom: 10
            }
          ],
          xAxis: { type: 'category', data: data.map((item) => item.date), axisLine: { lineStyle: { color: theme.neonBlue } } },
          yAxis: { type: 'value', axisLine: { lineStyle: { color: theme.neonBlue } } },
          series: [
            {
              name: 'MACD',
              type: 'line',
              data: macdData.macd,
              smooth: true,
              lineStyle: { color: '#00F0FF' }
            },
            {
              name: 'Signal',
              type: 'line',
              data: macdData.signal,
              smooth: true,
              lineStyle: { color: '#FF2E63' }
            },
            {
              name: 'Histogram',
              type: 'bar',
              data: macdData.histogram,
              itemStyle: {
                color: (params: any) => params.value >= 0 ? '#00F0FF' : '#FF2E63'
              }
            }
          ]
        };
      
      case 'rsi':
        const rsiData = calculateRSI(data);
        return {
          backgroundColor: theme.cardBg,
          border: theme.border,
          boxShadow: theme.glow,
          borderRadius: 12,
          title: { text: symbol ? `${symbol} RSI指标` : 'RSI指标', left: 'center', textStyle: { color: theme.neonBlue } },
          tooltip: { trigger: 'axis' },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              type: 'slider',
              start: 0,
              end: 100,
              bottom: 10
            }
          ],
          xAxis: { type: 'category', data: data.map((item) => item.date), axisLine: { lineStyle: { color: theme.neonBlue } } },
          yAxis: { 
            type: 'value', 
            min: 0, 
            max: 100,
            axisLine: { lineStyle: { color: theme.neonBlue } },
            splitLine: { show: true }
          },
          series: [
            {
              name: 'RSI',
              type: 'line',
              data: rsiData,
              smooth: true,
              lineStyle: { color: '#00F0FF' },
              markLine: {
                silent: true,
                data: [
                  { yAxis: 70, lineStyle: { color: '#FF2E63' } },
                  { yAxis: 30, lineStyle: { color: '#52c41a' } }
                ]
              }
            }
          ]
        };
      
      case 'volume':
        return {
          backgroundColor: theme.cardBg,
          border: theme.border,
          boxShadow: theme.glow,
          borderRadius: 12,
          title: { text: symbol ? `${symbol} 成交量分析` : '成交量分析', left: 'center', textStyle: { color: theme.neonBlue } },
          tooltip: { trigger: 'axis' },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              type: 'slider',
              start: 0,
              end: 100,
              bottom: 10
            }
          ],
          xAxis: { type: 'category', data: data.map((item) => item.date), axisLine: { lineStyle: { color: theme.neonBlue } } },
          yAxis: { type: 'value', axisLine: { lineStyle: { color: theme.neonBlue } } },
          series: [
            {
              name: '成交量',
              type: 'bar',
              data: data.map((item) => item.volume),
              itemStyle: { color: '#722ED1' }
            }
          ]
        };
      
      case 'kline':
      default:
        return {
          backgroundColor: theme.cardBg,
          border: theme.border,
          boxShadow: theme.glow,
          borderRadius: 12,
          title: { text: symbol ? `${symbol} ${period.toUpperCase()} K线分析` : '股票K线分析', left: 'center', textStyle: { color: theme.neonBlue } },
          tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              type: 'slider',
              start: 0,
              end: 100,
              bottom: 10
            }
          ],
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
        };
    }
  };

  if (onPeriodChange || onChartTypeChange) {
    // 重置图表缩放
    const resetZoom = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().dispatchAction({
          type: 'dataZoom',
          start: 0,
          end: 100
        });
      }
    };
    
    // 切换图表类型
    const handleChartTypeChange = (value: 'kline' | 'macd' | 'rsi' | 'volume') => {
      if (onChartTypeChange) {
        onChartTypeChange(value);
        // 重置缩放到默认状态
        setTimeout(resetZoom, 100);
      }
    };
    
    return (
      <Card
        title="股票图表分析"
        extra={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {onChartTypeChange && (
              <Select
                value={chartType}
                onChange={handleChartTypeChange}
                style={{ width: 120 }}
              >
                <Option value="kline">K线图</Option>
                <Option value="macd">MACD</Option>
                <Option value="rsi">RSI</Option>
                <Option value="volume">成交量</Option>
              </Select>
            )}
            {onPeriodChange && chartType === 'kline' && (
              <Select
                value={period}
                onChange={(value) => onPeriodChange(value as 'day' | 'week' | 'month')}
                style={{ width: 120 }}
              >
                <Option value="day">日线</Option>
                <Option value="week">周线</Option>
                <Option value="month">月线</Option>
              </Select>
            )}
            <Button 
              size="small" 
              onClick={resetZoom}
              style={{ marginLeft: '10px' }}
            >
              重置视图
            </Button>
          </div>
        }
      >
        {loading || !data.length ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" tip="加载数据中..." />
          </div>
        ) : (
          <EChartsReact 
            ref={chartRef}
            option={getOption()} 
            style={{ height: '400px', width: '100%' }} 
            onEvents={onEvents}
          />
        )}
        
        {/* 图表说明 */}
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          <div>操作提示: 鼠标滚轮缩放 | 鼠标拖拽平移 | 点击图例切换系列显示</div>
        </div>
      </Card>
    );
  }

  return <EChartsReact option={getOption()} style={{ height: '400px', width: '100%' }} />;
};