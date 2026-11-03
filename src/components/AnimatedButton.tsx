import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

export type ButtonVariant = 'black' | 'white' | 'gold' | 'mint' | 'dark' | 'outline';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  showChevronTriple?: boolean;
  showArrow?: boolean;
  size?: 'small' | 'medium' | 'large';
  testID?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'black',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  showChevronTriple = false,
  showArrow = false,
  size = 'large',
  testID,
}) => {
  // Variant Styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'black':
        return {
          container: styles.blackBtn,
          text: styles.blackBtnText,
          chevronColor: '#FFFFFF',
        };
      case 'white':
        return {
          container: styles.whiteBtn,
          text: styles.whiteBtnText,
          chevronColor: colors.textDark,
        };
      case 'gold':
        return {
          container: styles.goldBtn,
          text: styles.goldBtnText,
          chevronColor: '#1A1405',
        };
      case 'mint':
        return {
          container: styles.mintBtn,
          text: styles.mintBtnText,
          chevronColor: '#0A2521',
        };
      case 'dark':
        return {
          container: styles.darkBtn,
          text: styles.darkBtnText,
          chevronColor: colors.textPrimary,
        };
      case 'outline':
        return {
          container: styles.outlineBtn,
          text: styles.outlineBtnText,
          chevronColor: colors.textDark,
        };
    }
  };

  const { container: variantContainer, text: variantText, chevronColor } = getVariantStyles();

  const sizeStyles = {
    small: { height: 42, paddingHorizontal: 18, fontSize: 13 },
    medium: { height: 50, paddingHorizontal: 22, fontSize: 14 },
    large: { height: 54, paddingHorizontal: 26, fontSize: 15 },
  }[size];

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.baseButton,
        variantContainer,
        {
          height: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'black' ? '#FFFFFF' : colors.textDark}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.baseText,
              variantText,
              { fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {showChevronTriple && (
            <Text style={[styles.tripleChevron, { color: chevronColor }]}>
              {' '}❯❯❯
            </Text>
          )}
          {showArrow && !showChevronTriple && (
            <Text style={[styles.singleArrow, { color: chevronColor }]}>
              {' '}›
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '700',
    letterSpacing: 0.2,
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  tripleChevron: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: -1,
    marginLeft: 6,
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  singleArrow: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 4,
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  // Shapes.inc signature primary black button
  blackBtn: {
    backgroundColor: colors.primaryBlack,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  blackBtnText: {
    color: '#FFFFFF',
  },

  // Clean secondary white button with subtle border
  whiteBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  whiteBtnText: {
    color: colors.textDark,
  },

  goldBtn: {
    backgroundColor: colors.brandGold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  goldBtnText: {
    color: '#130E02',
  },

  mintBtn: {
    backgroundColor: '#10B981',
  },
  mintBtnText: {
    color: '#FFFFFF',
  },

  darkBtn: {
    backgroundColor: '#1E2026',
  },
  darkBtnText: {
    color: '#FFFFFF',
  },

  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E2E5E9',
  },
  outlineBtnText: {
    color: colors.textDark,
  },
});
