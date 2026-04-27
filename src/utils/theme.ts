import { StyleSheet } from 'react-native';

// ============================================================
// Color Palette
// ============================================================
export const COLORS = {
  primary: '#2563EB',       // TerraSept Blue
  primaryLight: '#DBEAFE',
  primaryDark: '#1D4ED8',

  secondary: '#F59E0B',     // Accent Amber
  secondaryLight: '#FEF3C7',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',

  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  border: '#E5E7EB',
  divider: '#F3F4F6',
};

// ============================================================
// Typography
// ============================================================
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// ============================================================
// Spacing
// ============================================================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

// ============================================================
// Border Radius
// ============================================================
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ============================================================
// Shadows
// ============================================================
export const SHADOWS = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});
