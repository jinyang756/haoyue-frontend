import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './index.css';
import './i18n/config'; // 国际化配置
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

// 创建根节点
const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(container);

// 渲染应用
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </I18nextProvider>
  </React.StrictMode>
);