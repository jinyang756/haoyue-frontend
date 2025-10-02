import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Orbitron', 'Roboto', 'sans-serif';
  }

  body {
    background-color: ${({ theme }) => theme.darkBg};
    color: white;
    overflow-x: hidden;
  }

  .neon-border {
    border: ${({ theme }) => theme.border};
    box-shadow: ${({ theme }) => theme.glow};
    border-radius: 12px;
  }

  .neon-text {
    color: ${({ theme }) => theme.neonBlue};
    text-shadow: 0 0 5px ${({ theme }) => theme.neonBlue};
  }
  
  .gradient-text {
    background: linear-gradient(45deg, #00F0FF, #165DFF, #722ED1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 240, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 240, 255, 0);
    }
  }
  
  .floating {
    animation: floating 3s ease-in-out infinite;
  }
  
  @keyframes floating {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;