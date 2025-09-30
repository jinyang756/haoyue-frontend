import React from 'react';
import { Suspense } from 'react';
import { Spin } from 'antd';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/globalStyles';
import { ParticlesBackground } from './components/ParticlesBackground';

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ParticlesBackground />
      <Suspense fallback={<Spin size="large" style={{ display: 'block', margin: '50px auto' }} />}>
        {children}
      </Suspense>
    </ThemeProvider>
  );
};

export default App;