import React from 'react';
import { Spin, Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface LoadingWrapperProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  onRetry?: () => void;
  fullScreen?: boolean;
  loadingText?: string;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  error,
  children,
  onRetry,
  fullScreen = false,
  loadingText = '加载中...'
}) => {
  const containerStyle: React.CSSProperties = {
    position: fullScreen ? 'fixed' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: fullScreen ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
    zIndex: fullScreen ? 1000 : 1,
    borderRadius: fullScreen ? 0 : 8
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <Spin size="large" tip={loadingText} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
          style={{ maxWidth: 400 }}
          action={
            onRetry && (
              <Button 
                type="primary" 
                size="small" 
                onClick={onRetry}
                icon={<ReloadOutlined />}
              >
                重试
              </Button>
            )
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingWrapper;