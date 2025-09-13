//import DefaultTheme from 'styled-components';

export const theme = {
  colors: {
   coral: '#FF6B6B',
    peach: '#FFB347',
    sage: '#87A96B',
    cream: '#FFF8E7',
    terracotta: '#E07A5F',
    mint: '#4ECDC4',
    deepBlue: '#2C3E50',
    lightGray: '#F4F6F8',
  },
  gradients: {
    warm: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)',
    nature: 'linear-gradient(135deg, #87A96B 0%, #A8DADC 100%)',
    adventure: 'linear-gradient(135deg, #4ECDC4 0%, #87A96B 100%)',
  },
};

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof theme.colors;
    gradients: typeof theme.gradients;
  }
}

export default theme;