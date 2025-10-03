import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

// 粒子动画关键帧
const float = keyframes`
  0% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px) rotate(360deg);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(0, 240, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 240, 255, 0);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BrandContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${theme.darkBg} 0%, #1a1f3a 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  overflow: hidden;
`;

const Particle = styled.div<{ delay: number; duration: number }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${theme.neonBlue};
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in infinite;
  animation-delay: ${props => props.delay}s;
  box-shadow: 0 0 10px ${theme.neonBlue};
`;

const LogoContainer = styled.div`
  text-align: center;
  animation: ${pulse} 3s ease-in-out infinite;
  margin-bottom: 40px;
`;

const LogoText = styled.h1`
  font-family: 'Orbitron', monospace;
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(45deg, ${theme.neonBlue}, ${theme.primary}, ${theme.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
`;

const Subtitle = styled.p`
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  color: #aaa;
  margin: 20px 0 0 0;
  animation: ${fadeIn} 2s ease-out 1s both;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #ddd;
  max-width: 600px;
  text-align: center;
  margin: 30px 0;
  animation: ${fadeIn} 2s ease-out 1.5s both;
  line-height: 1.6;
`;

const EnterButton = styled(Button)`
  animation: ${fadeIn} 2s ease-out 2s both;
  height: 50px;
  font-size: 1.2rem;
  padding: 0 40px;
  background: linear-gradient(45deg, ${theme.primary}, ${theme.secondary});
  border: none;
  font-family: 'Orbitron', monospace;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 240, 255, 0.4);
  }
`;

const SkipButton = styled.button`
  position: absolute;
  bottom: 30px;
  background: transparent;
  border: none;
  color: #aaa;
  font-family: 'Orbitron', monospace;
  cursor: pointer;
  animation: ${fadeIn} 2s ease-out 2.5s both;
  
  &:hover {
    color: ${theme.neonBlue};
    text-decoration: underline;
  }
`;

export const BrandShowcase: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // 3秒后显示内容
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 3000);
    
    // 15秒后自动进入
    const autoEnterTimer = setTimeout(() => {
      onEnter();
    }, 15000);
    
    return () => {
      clearTimeout(contentTimer);
      clearTimeout(autoEnterTimer);
    };
  }, [onEnter]);
  
  // 生成随机粒子
  const particles = Array.from({ length: 30 }, (_, i) => (
    <Particle 
      key={i} 
      delay={i * 0.2} 
      duration={3 + Math.random() * 4}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  ));
  
  return (
    <BrandContainer>
      {particles}
      {showContent && (
        <>
          <LogoContainer>
            <LogoText>皓月量化</LogoText>
          </LogoContainer>
          <Subtitle>智能引擎</Subtitle>
          <Description>
            基于人工智能的股票分析平台，为您提供专业、准确、及时的投资决策支持
          </Description>
          <EnterButton 
            type="primary" 
            size="large" 
            icon={<RightOutlined />}
            onClick={onEnter}
          >
            进入平台
          </EnterButton>
          <SkipButton onClick={onEnter}>
            跳过动画
          </SkipButton>
        </>
      )}
    </BrandContainer>
  );
};