declare module 'particles.js' {
  interface ParticlesJS {
    destroy: () => void;
    // 可以根据需要添加更多方法
  }

  interface ParticlesOptions {
    particles: {
      number: {
        value: number;
        density: {
          enable: boolean;
          value_area: number;
        };
      };
      color: {
        value: string | string[];
      };
      shape: {
        type: string;
      };
      opacity: {
        value: number;
        random: boolean;
        anim: {
          enable: boolean;
          speed: number;
          opacity_min: number;
        };
      };
      size: {
        value: number;
        random: boolean;
        anim: {
          enable: boolean;
          speed: number;
          size_min: number;
        };
      };
      line_linked: {
        enable: boolean;
        distance: number;
        color: string;
        opacity: number;
        width: number;
      };
      move: {
        enable: boolean;
        speed: number;
        direction: string;
        random: boolean;
        straight: boolean;
      };
    };
    interactivity: {
      detect_on: string;
      events: {
        onhover: {
          enable: boolean;
          mode: string;
        };
        onclick: {
          enable: boolean;
          mode: string;
        };
      };
      modes: {
        grab: {
          distance: number;
          line_linked: {
            opacity: number;
          };
        };
        push: {
          particles_nb: number;
        };
      };
    };
    retina_detect: boolean;
  }

  class Particles {
    constructor(elementId: string, options: ParticlesOptions);
    destroy: () => void;
  }

  export default Particles;
}