import React from 'react';
import particlesJS from 'particles.js';

export const ParticlesBackground: React.FC = () => {
  React.useEffect(() => {
    new particlesJS('particles-js', {
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: ['#165DFF', '#722ED1', '#00F0FF'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
        size: { value: 2, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
        line_linked: { enable: true, distance: 150, color: '#00F0FF', opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1, direction: 'none', random: true, straight: false },
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
        modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } },
      },
      retina_detect: true,
    });
    return () => {
      // 简化清理函数
      const canvas = document.getElementById('particles-js');
      if (canvas) {
        canvas.innerHTML = '';
      }
    };
  }, []);

  return <div id="particles-js" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};