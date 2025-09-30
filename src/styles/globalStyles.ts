import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Orbitron', 'sans-serif';
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
`;