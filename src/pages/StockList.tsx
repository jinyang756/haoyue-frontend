import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, Card, Row, Col, Pagination, message } from 'antd';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocksAsync, searchStocksAsync, clearSearchResults } from '@/store/slices/stockSlice';
import { RootState, AppDispatch } from '@/store';
import { Link } from 'react-router-dom';
import LoadingWrapper from '@/components/common/LoadingWrapper';

const { Search } = Input;

const StockList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stocks, loading, error, pagination, searchResults } = useSelector((state: RootState) => state.stocks);
  
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchStocksAsync({
      page: currentPage,
      pageSize,
      sortBy: sortField || undefined,
      order: sortOrder
    }));

    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch, currentPage, pageSize, sortField, sortOrder]);

  const handleSearch = async () => {
    if (searchText.trim()) {
      try {
        await dispatch(searchStocksAsync(searchText.trim())).unwrap();
      } catch (err) {
        message.error('搜索失败，请重试');
      }
    } else {
      dispatch(clearSearchResults());
      dispatch(fetchStocksAsync({
        page: 1,
        pageSize,
        sortBy: sortField || undefined,
        order: sortOrder
      }));
      setCurrentPage(1);
    }
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSortField(sorter.field);
    setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const columns = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
      sorter: true,
      render: (symbol: string, record: any) => (
        <Link to={`/stocks/${symbol}`} style={{ color: '#1890ff' }}>
          {symbol}
        </Link>
      )
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      sorter: true
    },
    {
      title: '最新价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      sorter: true,
      render: (price: number) => price.toFixed(2)
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 120,
      sorter: true,
      render: (changePercent: number) => (
        <span style={{ 
          color: changePercent > 0 ? '#f5222d' : changePercent < 0 ? '#52c41a' : '#666' 
        }}>
          {changePercent > 0 && <ArrowUpOutlined size={12} />}
          {changePercent < 0 && <ArrowDownOutlined size={12} />}
          {Math.abs(changePercent).toFixed(2)}%
        </span>
      )
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 150,
      sorter: true,
      render: (volume: number) => (volume / 10000).toFixed(2) + '万'
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      width: 150,
      sorter: true,
      render: (marketCap: number) => (marketCap / 100000000).toFixed(2) + '亿'
    },
    {
      title: '市盈率',
      dataIndex: 'pe',
      key: 'pe',
      width: 120,
      sorter: true,
      render: (pe: number) => pe.toFixed(2)
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            icon={<SearchOutlined />}
            onClick={() => window.location.href = `/stocks/${record.symbol}`}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];

  const tableData = searchResults.length > 0 ? searchResults : stocks;

  return (
    <div>
      <Card title="股票列表" bordered={false}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12}>
            <Search
              placeholder="请输入股票代码或名称搜索"
              allowClear
              enterButton="搜索"
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              size="large"
              onClick={() => window.location.href = '/ai-analysis'}
            >
              AI智能分析
            </Button>
          </Col>
        </Row>

        <LoadingWrapper loading={loading} error={error as string}>
          <Table
            columns={columns}
            dataSource={tableData.map((stock: any, index: number) => ({
              key: index,
              ...stock
            }))}
            pagination={false}
            onChange={handleTableChange}
            rowKey="symbol"
            scroll={{ x: 1200 }}
          />
        </LoadingWrapper>

        {!searchResults.length && (
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total) => `共 ${total} 条记录`}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default StockList;