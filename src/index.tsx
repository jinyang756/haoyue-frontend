import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

// 创建根节点
const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(container);

// 渲染应用
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
      <Analytics />
    </ConfigProvider>
  </React.StrictMode>
);