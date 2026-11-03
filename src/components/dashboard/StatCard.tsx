import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ApplicationStat } from '../../types/dashboard';
import { useAppTheme, colors } from '../../theme';
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
          icon: <ClockIcon size={16} color={colors.brandGold} />,
          iconBg: colors.brandGoldSoft,
          border: colors.brandGoldLight,
          valueColor: colors.statusPending,
          badgeBg: colors.brandGoldSoft,
          badgeText: colors.brandGoldDark,
        };
      case 'approved':
        return {
          icon: <CheckIcon size={16} color={colors.statusApproved} />,
          iconBg: colors.statusApprovedBg,
          border: colors.statusApprovedBorder,
          valueColor: colors.statusApproved,
          badgeBg: colors.statusApprovedBg,
          badgeText: colors.statusApproved,
        };
      case 'rejected':
        return {
          icon: <CrossIcon size={16} color={colors.statusRejected} />,
          iconBg: colors.statusRejectedBg,
          border: colors.statusRejectedBorder,
          valueColor: colors.statusRejected,
          badgeBg: colors.statusRejectedBg,
          badgeText: colors.statusRejected,
        };
      case 'total':
      default:
        return {
          icon: <FilesIcon size={16} color={colors.textPrimary} />,
          iconBg: colors.slate100,
          border: colors.cardBorder,
          valueColor: colors.textPrimary,
          badgeBg: colors.slate50,
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
    shadowColor: colors.shadow,
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
