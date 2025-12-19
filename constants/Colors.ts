// ============================================
// RIEF DESIGN SYSTEM
// Dark mode by default - minimal, breathing
// ============================================

export const colors = {
  // Backgrounds
  bg: '#050505',
  surface: '#121212',
  surfaceLight: '#1E1E1E',
  card: '#0A0A0A',

  // Brand
  primary: '#6366f1',      // Indigo
  secondary: '#a855f7',    // Purple
  accent: '#22d3ee',       // Cyan

  // Text
  text: '#ffffff',
  textMuted: '#a1a1aa',
  textDim: '#52525b',

  // Status
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',

  // Borders
  border: '#27272a',
  borderLight: '#3f3f46',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: colors.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: colors.text,
  },
  body: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.text,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
  },
  caption: {
    fontSize: 12,
    color: colors.textDim,
  },
};

// Legacy export for compatibility
export default {
  light: {
    text: colors.text,
    background: colors.bg,
    tint: colors.primary,
    tabIconDefault: colors.textDim,
    tabIconSelected: colors.primary,
  },
  dark: {
    text: colors.text,
    background: colors.bg,
    tint: colors.primary,
    tabIconDefault: colors.textDim,
    tabIconSelected: colors.primary,
  },
};
