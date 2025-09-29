import React from 'react';
import { Suspense } from 'react';
import { Spin } from 'antd';

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<Spin size="large" style={{ display: 'block', margin: '50px auto' }} />}>
      {children}
    </Suspense>
  );
};

export default App;