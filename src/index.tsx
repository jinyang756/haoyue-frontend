import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import store from './store';
import routes from './routes';
import 'antd/dist/reset.css';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <AppRoutes />
        </Router>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);