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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

const PreviewModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }
`;

const ContentManagement: React.FC = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [form] = Form.useForm();
  const [contentValue, setContentValue] = useState<string>('');

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
    setContentValue('');
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ContentItem) => {
    setEditingContent(record);
    setContentValue(record.content);
    form.setFieldsValue({
      ...record,
      tags: record.tags || []
    });
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
    setPreviewContent(record);
    setPreviewVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 添加内容值
      const contentData = {
        ...values,
        content: contentValue,
        tags: values.tags || []
      };
      
      if (editingContent) {
        // 更新内容
        await ContentService.updateContent(editingContent._id, contentData);
        message.success('更新成功');
      } else {
        // 创建内容
        await ContentService.createContent(contentData);
        message.success('创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
      setContentValue('');
      fetchContents();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setContentValue('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'orange';
      case 'archived': return 'red';
      default: return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'news': '新闻',
      'guide': '指南',
      'analysis': '分析',
      'tutorial': '教程',
      'other': '其他'
    };
    return categoryMap[category] || category;
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
        <Tag color={category === 'news' ? 'blue' : category === 'guide' ? 'green' : category === 'analysis' ? 'purple' : category === 'tutorial' ? 'cyan' : 'default'}>
          {getCategoryLabel(category)}
        </Tag>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags && tags.map((tag, index) => (
            <Tag key={index} color="blue">{tag}</Tag>
          ))}
        </>
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
        width={1000}
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
                  <Option value="analysis">分析</Option>
                  <Option value="tutorial">教程</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select 
              mode="tags" 
              placeholder="请输入标签，按回车确认"
              tokenSeparators={[',']}
            />
          </Form.Item>
          
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
            <ReactQuill 
              value={contentValue}
              onChange={setContentValue}
              style={{ height: '300px' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
            />
          </Form.Item>
          <div style={{ height: '50px' }}></div> {/* 为富文本编辑器留出空间 */}
        </Form>
      </Modal>
      
      <PreviewModal
        title={previewContent ? previewContent.title : "内容预览"}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {previewContent && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Tag color={getStatusColor(previewContent.status)}>
                {previewContent.status === 'published' ? '已发布' : previewContent.status === 'draft' ? '草稿' : '已归档'}
              </Tag>
              <Tag color={previewContent.category === 'news' ? 'blue' : previewContent.category === 'guide' ? 'green' : previewContent.category === 'analysis' ? 'purple' : previewContent.category === 'tutorial' ? 'cyan' : 'default'}>
                {getCategoryLabel(previewContent.category)}
              </Tag>
              {previewContent.tags && previewContent.tags.map((tag, index) => (
                <Tag key={index} color="blue">{tag}</Tag>
              ))}
            </div>
            <div dangerouslySetInnerHTML={{ __html: previewContent.content }} />
          </div>
        )}
      </PreviewModal>
    </PageContainer>
  );
};

export default ContentManagement;