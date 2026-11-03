import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ApplicationStat } from '../../types/dashboard';
import { useAppTheme } from '../../theme';
import {
  FilesIcon,
  ClockIcon,
  CheckIcon,
  CrossIcon,
} from '../Icons';

interface StatCardProps {
  stat: any;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, onPress }) => {
  const { colors, isDark } = useAppTheme();

  const getTheme = () => {
    const rawVariant = stat.variant || (
      stat.label?.toLowerCase().includes('pending')
        ? 'pending'
        : stat.label?.toLowerCase().includes('approved')
        ? 'approved'
        : stat.label?.toLowerCase().includes('rejected')
        ? 'rejected'
        : 'total'
    );

    switch (rawVariant) {
      case 'pending':
        return {
          icon: <ClockIcon size={16} color={isDark ? '#FBBF24' : '#D97706'} />,
          iconBg: isDark ? '#45330D' : '#FEF3C7',
          border: isDark ? '#B45309' : '#FDE68A',
          valueColor: isDark ? '#FBBF24' : '#B45309',
          badgeBg: isDark ? '#2E2208' : '#FFFBEB',
          badgeText: isDark ? '#FDE68A' : '#92400E',
        };
      case 'approved':
        return {
          icon: <CheckIcon size={16} color={isDark ? '#34D399' : '#059669'} />,
          iconBg: isDark ? '#0F3E2C' : '#D1FAE5',
          border: isDark ? '#065F46' : '#A7F3D0',
          valueColor: isDark ? '#34D399' : '#047857',
          badgeBg: isDark ? '#06281D' : '#ECFDF5',
          badgeText: isDark ? '#A7F3D0' : '#065F46',
        };
      case 'rejected':
        return {
          icon: <CrossIcon size={16} color={isDark ? '#F87171' : '#DC2626'} />,
          iconBg: isDark ? '#451A1A' : '#FEE2E2',
          border: isDark ? '#B91C1C' : '#FECACA',
          valueColor: isDark ? '#F87171' : '#B91C1C',
          badgeBg: isDark ? '#2D1515' : '#FEF2F2',
          badgeText: isDark ? '#FECACA' : '#991B1B',
        };
      case 'total':
      default:
        return {
          icon: <FilesIcon size={16} color={colors.textPrimary} />,
          iconBg: isDark ? colors.cardSecondary : '#F1F5F9',
          border: colors.cardBorder,
          valueColor: colors.textPrimary,
          badgeBg: isDark ? colors.cardSecondary : '#F8FAFC',
          badgeText: colors.textSecondary,
        };
    }
  };

  const theme = getTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Top Header Row with Icon and Subtitle tag */}
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
          {theme.icon}
        </View>
        {stat.changeRate ? (
          <View style={[styles.tagBadge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.tagText, { color: theme.badgeText }]} numberOfLines={1}>
              {stat.periodLabel || 'Status'}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Large Numerical Value */}
      <Text style={[styles.statValue, { color: theme.valueColor }]}>
        {(stat.value !== undefined ? stat.value : stat.count !== undefined ? stat.count : 0).toLocaleString()}
      </Text>

      {/* Title */}
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>
        {stat.title || stat.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    maxWidth: '65%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginVertical: 4,
    includeFontPadding: false,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
    includeFontPadding: false,
  },
});
