import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const NoPermission: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有访问该页面的权限"
        extra={
          <Link to="/">
            <Button type="primary">
              返回首页
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NoPermission;