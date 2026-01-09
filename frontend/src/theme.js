// Modern Color Scheme for CreatorBox
// Professional navy blues, cyan accents, and clean UI

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#06b6d4',          // Cyan 500
    light: '#22d3ee',         // Cyan 400
    dark: '#0891b2',          // Cyan 600
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
  },
  
  // Secondary Colors
  secondary: {
    purple: '#8b5cf6',        // Violet 500
    green: '#10b981',         // Emerald 500
    orange: '#f59e0b',        // Amber 500
    pink: '#ec4899',          // Pink 500
    blue: '#3b82f6'           // Blue 500
  },
  
  // Neutral Grays
  neutral: {
    50: '#f8fafc',            // Slate 50
    100: '#f1f5f9',           // Slate 100
    200: '#e2e8f0',           // Slate 200
    300: '#cbd5e1',           // Slate 300
    400: '#94a3b8',           // Slate 400
    500: '#64748b',           // Slate 500
    600: '#475569',           // Slate 600
    700: '#334155',           // Slate 700
    800: '#1e293b',           // Slate 800
    900: '#0f172a'            // Slate 900
  },
  
  // Dark Mode Backgrounds
  dark: {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    card: '#1e293b',
    hover: '#334155'
  },
  
  // Light Mode Backgrounds
  light: {
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
    card: '#ffffff',
    hover: '#f1f5f9'
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4'
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(15, 23, 42, 0.08)',
    md: '0 4px 16px rgba(15, 23, 42, 0.12)',
    lg: '0 8px 24px rgba(15, 23, 42, 0.15)',
    xl: '0 12px 32px rgba(15, 23, 42, 0.18)',
    '2xl': '0 24px 48px rgba(15, 23, 42, 0.20)',
    colored: '0 8px 24px rgba(6, 182, 212, 0.3)'
  },
  
  // Text Colors
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    light: '#94a3b8',
    white: '#ffffff',
    dark: '#0f172a'
  }
};

// Modern Icons (Professional Unicode Symbols)
export const icons = {
  business: '▦',
  portfolio: '◆',
  ecommerce: '◉',
  blog: '▣',
  landing: '▲',
  dashboard: '▧',
  ai: '✨',
  star: '★',
  check: '✓',
  cross: '✕',
  arrow: '→',
  lightning: '⚡',
  fire: '⚡',
  hexagon: '⬡',
  circle: '●',
  square: '■',
  diamond: '◆',
  heart: '♥',
  shield: '⬟'
};

// Brand Name
export const brandName = 'CreatorBox';
export const brandTagline = 'Professional Templates. Powered by AI.';

export default { colors, icons, brandName, brandTagline };
