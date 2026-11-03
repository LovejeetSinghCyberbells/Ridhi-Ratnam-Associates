export const lightColors = {
  // Base Screen Background (Refined Light Off-White Grey)
  background: '#EBEDF0',
  backgroundSecondary: '#F4F5F8',
  sheetBackground: '#EBEDF0',
  offWhiteGray: '#EBEDF0',
  offWhiteGraySurface: '#F7F8FA',
  offWhiteGrayBorder: '#D8DCE2',
  
  // Signature Corporate Deep Navy Header & Bars (#012655)
  topBarBlack: '#012655',
  darkGray: '#012655',
  darkGrayElevated: '#08326D',
  darkGrayBorder: '#0C3E80',
  glassBackground: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
  
  // Card & Surface Colors (Crisp White on Soft Grey)
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardSecondary: '#F4F5F8',
  cardBorder: '#E2E8F0',
  cardBorderSubtle: '#EDF0F4',
  cardShadow: 'rgba(0, 0, 0, 0.05)',

  // Theme Buttons & Bars
  primaryBlack: '#012655',
  primaryBlackHover: '#08326D',
  buttonWhite: '#F7F8FA',
  buttonWhiteBorder: '#D8DCE2',
  
  // Ridhi Ratnam Brand Identity & Warm Antique Gold Highlights (#CDA148)
  brandNavy: '#012655',
  brandNavyLight: '#08326D',
  brandGold: '#CDA148',
  highlightGold: '#CDA148',
  highlightGoldSoft: 'rgba(205, 161, 72, 0.12)',
  brandGoldLight: '#EED8A1',
  brandGoldSoft: '#FEF8E7',
  brandGoldDark: '#9C7523',

  // Accent Colors from Theme Screenshot
  accentBlue: '#2563EB',
  accentBlueSoft: '#EFF6FF',
  accentGreen: '#10B981',
  accentPink: '#EC4899',
  accentYellow: '#CDA148',
  accentPurple: '#8B5CF6',
  accentMint: '#10B981',
  
  // Hero Pastels
  heroPastelMint: '#DCF5E7',
  heroPastelPink: '#FFD6E3',
  heroPastelGold: '#FBF2D5',
  darkSheetBg: '#012655',

  // Typography
  textPrimary: '#012655',
  textSecondary: '#5E6C84',
  textTertiary: '#8993A4',
  textDark: '#012655',
  textWhite: '#FFFFFF',
  
  // Pill Buttons & Badges
  pillBlack: '#012655',
  pillWhite: '#F7F8FA',
  pillInactiveBg: '#E8EAEE',
  pillInactiveBorder: '#D8DCE2',
  pillInactiveText: '#5E6C84',
  
  // Inputs
  inputBg: '#F0F2F5',
  inputBorder: '#D8DCE2',
  inputFocusBorder: '#012655',
  inputPlaceholder: '#8993A4',
  
  // States & Underwriting Status Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#CDA148',
  info: '#3B82F6',
  
  statusApproved: '#047857',
  statusApprovedBg: '#ECFDF5',
  statusApprovedBorder: '#A7F3D0',
  
  statusReview: '#1D4ED8',
  statusReviewBg: '#EFF6FF',
  statusReviewBorder: '#BFDBFE',
  
  statusPending: '#B45309',
  statusPendingBg: '#FFFBEB',
  statusPendingBorder: '#FDE68A',
  
  statusRejected: '#DC2626',
  statusRejectedBg: '#FEF2F2',
  statusRejectedBorder: '#FECACA',

  // Role Accents
  clientAccent: '#012655',
  clientSoftBg: '#EFF6FF',
  agentAccent: '#CDA148',
  agentSoftBg: '#FEF8E7',
};

// Light theme is the sole application theme
export const darkColors = lightColors;

// Mutable exported colors object that permanently holds light colors
export const colors = { ...lightColors };

export const getThemeColors = (_mode?: 'light' | 'dark') => lightColors;

export const applyTheme = (_mode?: 'light' | 'dark') => {
  Object.assign(colors, lightColors);
};
