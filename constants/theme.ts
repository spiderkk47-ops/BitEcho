// BitEcho Design System
export const Colors = {
  // Backgrounds
  background: '#0A0B0F',
  surface: '#12141A',
  card: '#1A1C25',
  cardElevated: '#1F2230',
  overlay: 'rgba(0,0,0,0.7)',

  // Brand
  primary: '#00D4FF',
  primaryDim: 'rgba(0,212,255,0.15)',
  primaryGlow: 'rgba(0,212,255,0.3)',
  secondary: '#7B2FFF',
  secondaryDim: 'rgba(123,47,255,0.15)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B4CC',
  textSubtle: '#5A6080',
  textInverse: '#0A0B0F',

  // Semantic
  success: '#00E676',
  successDim: 'rgba(0,230,118,0.15)',
  warning: '#FFB800',
  warningDim: 'rgba(255,184,0,0.15)',
  error: '#FF4D6A',
  errorDim: 'rgba(255,77,106,0.15)',

  // Borders
  border: '#1E2235',
  borderLight: '#252840',

  // Tab bar
  tabBarBg: '#0D0F16',
  tabBarBorder: '#1A1C28',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};
