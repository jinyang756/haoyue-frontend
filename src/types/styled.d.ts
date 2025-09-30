import 'styled-components';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  neonBlue: string;
  neonPink: string;
  darkBg: string;
  cardBg: string;
  border: string;
  glow: string;
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}