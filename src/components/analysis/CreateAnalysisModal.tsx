import React, { useState } from 'react';
import { Modal, Select, message } from 'antd';
import { searchStocks } from '@/services/stockservice';

const { Option } = Select;

interface CreateAnalysisModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (symbol: string, type: 'basic' | 'advanced' | 'premium') => void;
  loading: boolean;
}

const CreateAnalysisModal: React.FC<CreateAnalysisModalProps> = ({
  visible,
  onCancel,
  onOk,
  loading
}) => {
  const [searchText, setSearchText] = useState('');
  const [stockOptions, setStockOptions] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [analysisType, setAnalysisType] = useState<'basic' | 'advanced' | 'premium'>('advanced');

  const handleSearch = async () => {
    if (searchText.trim()) {
      try {
        const results = await searchStocks(searchText.trim());
        setStockOptions(results.map(stock => ({
          value: stock.symbol,
          label: `${stock.symbol} ${stock.name}`
        })));
      } catch (err) {
        message.error('搜索股票失败');
      }
    } else {
      setStockOptions([]);
    }
  };

  const handleOk = () => {
    if (!selectedStock) {
      message.error('请选择股票');
      return;
    }
    onOk(selectedStock, analysisType);
  };

  return (
    <Modal
      title="创建AI分析任务"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      maskClosable={false}
    >
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          选择股票
        </label>
        <Select
          showSearch
          placeholder="请搜索股票代码或名称"
          style={{ width: '100%' }}
          value={selectedStock}
          onChange={setSelectedStock}
          filterOption={false}
          onSearch={handleSearch}
          notFoundContent="请输入关键词搜索"
        >
          {stockOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          分析类型
        </label>
        <Select
          style={{ width: '100%' }}
          value={analysisType}
          onChange={(value) => setAnalysisType(value as 'basic' | 'advanced' | 'premium')}
        >
          <Option value="basic">基础分析 (免费)</Option>
          <Option value="advanced">高级分析 (VIP)</Option>
          <Option value="premium">专业分析 (VIP Pro)</Option>
        </Select>
      </div>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
        <div style={{ marginBottom: 8 }}>
          <strong>分析内容说明：</strong>
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>
          {analysisType === 'basic' && (
            <div>
              <div>• 基础财务指标分析</div>
              <div>• 简单技术面分析</div>
              <div>• 基础风险评估</div>
              <div>• 短期投资建议</div>
            </div>
          )}
          {analysisType === 'advanced' && (
            <div>
              <div>• 详细财务分析</div>
              <div>• 深度技术分析</div>
              <div>• 市场情绪分析</div>
              <div>• 多维度风险评估</div>
              <div>• 中长期投资建议</div>
            </div>
          )}
          {analysisType === 'premium' && (
            <div>
              <div>• 专业财务建模</div>
              <div>• AI智能预测</div>
              <div>• 机构资金流向分析</div>
              <div>• 高级风险控制</div>
              <div>• 个性化投资策略</div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateAnalysisModal;