import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, borderRadius } from '../theme';

interface PillChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  accentColor?: string;
  icon?: string | React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PillChip: React.FC<PillChipProps> = ({
  label,
  selected = false,
  onPress,
  accentColor = colors.primaryBlack,
  icon,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? [styles.selectedChip, { backgroundColor: accentColor }]
          : styles.unselectedChip,
        pressed && styles.chipPressed,
        style,
      ]}
    >
      {icon && (
        <View style={styles.iconContainer}>
          {typeof icon === 'string' ? (
            <Text style={styles.iconText}>{icon}</Text>
          ) : (
            icon
          )}
        </View>
      )}
      <Text
        style={[
          styles.label,
          selected ? styles.selectedLabel : styles.unselectedLabel,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.pill,
  },
  chipPressed: {
    opacity: 0.82,
  },
  unselectedChip: {
    backgroundColor: colors.pillInactiveBg,
    borderWidth: 1,
    borderColor: colors.pillInactiveBorder,
  },
  selectedChip: {
    backgroundColor: colors.primaryBlack,
    borderWidth: 1,
    borderColor: colors.primaryBlack,
  },
  iconContainer: {
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  unselectedLabel: {
    color: colors.textSecondary,
  },
  selectedLabel: {
    color: colors.white,
    fontWeight: '700',
  },
});
