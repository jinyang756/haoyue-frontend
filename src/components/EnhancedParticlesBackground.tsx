import React from 'react';
// 导入particles.js，但使用全局对象的方式
import 'particles.js';

// 为window对象添加particlesJS属性的类型声明
declare global {
  interface Window {
    particlesJS?: any;
  }
}

export const EnhancedParticlesBackground: React.FC = () => {
  React.useEffect(() => {
    // 使用全局对象window.particlesJS调用
    if (window.particlesJS) {
      window.particlesJS('enhanced-particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ['#165DFF', '#722ED1', '#00F0FF', '#FF2E63'] },
          shape: { 
            type: ['circle', 'triangle', 'polygon'],
            polygon: { nb_sides: 5 }
          },
          opacity: { 
            value: 0.6, 
            random: true, 
            anim: { 
              enable: true, 
              speed: 1, 
              opacity_min: 0.1,
              sync: false
            } 
          },
          size: { 
            value: 3, 
            random: true, 
            anim: { 
              enable: true, 
              speed: 2, 
              size_min: 0.1,
              sync: false
            } 
          },
          line_linked: { 
            enable: true, 
            distance: 150, 
            color: '#00F0FF', 
            opacity: 0.3, 
            width: 1,
            triangles: {
              enable: true,
              color: '#722ED1',
              opacity: 0.1
            }
          },
          move: { 
            enable: true, 
            speed: 1.5, 
            direction: 'none', 
            random: true, 
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: { 
            onhover: { 
              enable: true, 
              mode: ['grab', 'bubble'],
              parallax: {
                enable: true,
                force: 60,
                smooth: 10
              }
            }, 
            onclick: { 
              enable: true, 
              mode: ['push', 'repulse'] 
            },
            resize: true
          },
          modes: { 
            grab: { 
              distance: 140, 
              line_linked: { 
                opacity: 0.8 
              } 
            },
            bubble: {
              distance: 200,
              size: 10,
              duration: 2,
              opacity: 0.8,
              speed: 3
            },
            push: { 
              particles_nb: 4 
            },
            repulse: {
              distance: 100,
              duration: 0.4
            }
          },
        },
        retina_detect: true,
      });
      
      // 返回清理函数
      return () => {
        const canvas = document.getElementById('enhanced-particles-js');
        if (canvas) {
          canvas.innerHTML = '';
        }
      };
    }
    
    return () => {
      // 空的清理函数，当window.particlesJS不存在时执行
    };
  }, []);

  return <div id="enhanced-particles-js" style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    zIndex: -1,
    background: 'linear-gradient(135deg, #0A0F25 0%, #1a1f3a 100%)'
  }} />;
};