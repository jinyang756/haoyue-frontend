import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

// 创建旋转动画
const rotate = keyframes`
  0% {
    transform: rotate(0deg) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
`;

// 创建脉冲动画
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

// 创建浮动动画
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// 创建粒子动画
const particleAnimation = keyframes`
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(1);
    opacity: 0;
  }
`;

// 创建等离子光点游走效果
const plasma = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const BrandContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${theme.darkBg} 0%, #0a0c1a 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
  
  // 添加等离子光点游走视觉效果
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, ${theme.neonBlue} 0%, transparent 70%);
    opacity: 0.1;
    animation: ${plasma} 15s ease infinite;
    background-size: 400% 400%;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  animation: ${pulse} 2s infinite, ${float} 3s ease-in-out infinite;
  z-index: 2;
`;

const LogoText = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  color: ${theme.neonBlue};
  text-shadow: 0 0 20px ${theme.neonBlue}, 0 0 40px ${theme.neonBlue};
  margin: 0;
  animation: ${rotate} 3s ease-out forwards;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #fff;
  margin-top: 20px;
  text-align: center;
  opacity: 0;
  animation: fadeIn 1s 1.5s forwards;
  z-index: 2;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const Particle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${theme.neonBlue};
  border-radius: 50%;
  animation: ${particleAnimation} 1.5s ease-out forwards;
  box-shadow: 0 0 10px ${theme.neonBlue};
  z-index: 1;
`;

const TechStack = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
  opacity: 0;
  animation: fadeIn 1s 2s forwards;
  z-index: 2;
  position: relative;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
`;

const TechItem = styled.div`
  background: rgba(26, 31, 58, 0.8);
  border: 1px solid ${theme.neonBlue};
  border-radius: 8px;
  padding: 10px 20px;
  color: #fff;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 0.8rem;
  }
`;

interface BrandAnimationProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const BrandAnimation: React.FC<BrandAnimationProps> = ({ onComplete, onSkip }) => {
  const [particles, setParticles] = useState<Array<{id: number, tx: number, ty: number}>>([]);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  useEffect(() => {
    // 创建粒子动画
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        newParticles.push({ id: i, tx, ty });
      }
      setParticles(newParticles);
    };

    createParticles();

    // 15秒后完成动画
    const timer = setTimeout(() => {
      if (!isLooping) {
        onComplete();
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [onComplete, isLooping]);

  return (
    <BrandContainer>
      <LogoContainer>
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            style={{
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
              left: '50%',
              top: '50%',
              marginLeft: '-4px',
              marginTop: '-4px',
            } as React.CSSProperties}
          />
        ))}
        <LogoText>皓月量化</LogoText>
      </LogoContainer>
      <Subtitle>基于AI的智能股票分析引擎</Subtitle>
      
      <TechStack>
        <TechItem>React</TechItem>
        <TechItem>Node.js</TechItem>
        <TechItem>MongoDB</TechItem>
        <TechItem>AI算法</TechItem>
        <TechItem>实时数据</TechItem>
      </TechStack>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '30px', 
        display: 'flex', 
        gap: '20px', 
        zIndex: 3 
      }}>
        <button 
          onClick={() => setIsLooping(!isLooping)}
          style={{
            background: 'rgba(26, 31, 58, 0.8)',
            border: `1px solid ${theme.neonBlue}`,
            borderRadius: '8px',
            padding: '10px 20px',
            color: '#fff',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          {isLooping ? '停止循环' : '循环播放'}
        </button>
        <button 
          onClick={onSkip}
          style={{
            background: 'rgba(26, 31, 58, 0.8)',
            border: `1px solid ${theme.neonBlue}`,
            borderRadius: '8px',
            padding: '10px 20px',
            color: '#fff',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          跳过动画
        </button>
      </div>
    </BrandContainer>
  );
};

export default BrandAnimation;