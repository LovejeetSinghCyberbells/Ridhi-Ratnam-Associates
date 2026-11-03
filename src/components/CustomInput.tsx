import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { borderRadius, spacing, useAppTheme, colors } from '../theme';
import { EyeIcon, EyeOffIcon, AlertCircleIcon } from './Icons';

export interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: string | React.ReactNode;
  isPassword?: boolean;
  accentColor?: string;
  containerStyle?: ViewStyle;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  accentColor,
  containerStyle,
  ...rest
}) => {
  const { colors, isDark } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  const activeAccent = accentColor || (isDark ? colors.brandGold : colors.topBarBlack);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(e);
    }
  };

  const borderColor = error
    ? colors.error
    : isFocused
    ? activeAccent
    : colors.inputBorder;

  const backgroundColor = error
    ? colors.statusRejectedBg
    : isFocused
    ? colors.white
    : colors.inputBg;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <View style={styles.labelRow}>
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary },
            isFocused && { color: error ? colors.error : activeAccent },
            error ? styles.labelError : null,
          ]}
        >
          {label}
        </Text>
      </View>

      {/* Input Field Container */}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.iconContainer}>
            {typeof leftIcon === 'string' ? (
              <Text style={styles.iconText}>{leftIcon}</Text>
            ) : (
              leftIcon
            )}
          </View>
        )}

        <TextInput
          placeholderTextColor={colors.inputPlaceholder}
          style={[styles.input, { color: colors.textPrimary }]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={activeAccent}
          autoCorrect={false}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
          >
            {showPassword ? (
              <EyeOffIcon size={20} color={colors.textPrimary} />
            ) : (
              <EyeIcon size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Inline Field Error */}
      {error ? (
        <View style={styles.errorRow}>
          <AlertCircleIcon size={12} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  labelError: {
    color: colors.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 52,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14.5,
    fontWeight: '500',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  eyeButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 2,
    gap: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 11.5,
    fontWeight: '600',
  },
});
