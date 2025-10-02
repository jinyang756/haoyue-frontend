import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Space, 
  Tag,
  Card,
  Row,
  Col,
  Typography,
  Divider
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ContentService } from '../services/contentService';
import type { ContentItem } from '../models/Content';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PageContainer = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ContentCard = styled(Card)`
  margin-bottom: 24px;
  .ant-card-body {
    padding: 24px;
  }
`;

const ActionButton = styled(Button)`
  margin-right: 8px;
`;

const ContentManagement: React.FC = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await ContentService.getAllContents();
      setContents(data);
    } catch (error) {
      message.error('获取内容列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingContent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ContentItem) => {
    setEditingContent(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await ContentService.deleteContent(id);
      message.success('删除成功');
      fetchContents();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handlePreview = (record: ContentItem) => {
    // 这里可以打开预览窗口或者跳转到预览页面
    message.info(`预览内容: ${record.title}`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingContent) {
        // 更新内容
        await ContentService.updateContent(editingContent._id, values);
        message.success('更新成功');
      } else {
        // 创建内容
        await ContentService.createContent(values);
        message.success('创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchContents();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'orange';
      case 'archived': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={category === 'news' ? 'blue' : category === 'guide' ? 'green' : 'purple'}>
          {category === 'news' ? '新闻' : category === 'guide' ? '指南' : '其他'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === 'published' ? '已发布' : status === 'draft' ? '草稿' : '已归档'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ContentItem) => (
        <Space size="middle">
          <ActionButton 
            icon={<EyeOutlined />} 
            onClick={() => handlePreview(record)}
            size="small"
          >
            预览
          </ActionButton>
          <ActionButton 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </ActionButton>
          <ActionButton 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record._id)}
            danger
            size="small"
          >
            删除
          </ActionButton>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <HeaderSection>
        <Title level={3}>内容管理</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
        >
          新建内容
        </Button>
      </HeaderSection>

      <ContentCard>
        <Table
          dataSource={contents}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </ContentCard>

      <Modal
        title={editingContent ? "编辑内容" : "新建内容"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input placeholder="请输入内容标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select placeholder="请选择内容分类">
                  <Option value="news">新闻</Option>
                  <Option value="guide">指南</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择内容状态">
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea 
              rows={8} 
              placeholder="请输入内容详情" 
              style={{ resize: 'none' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ContentManagement;