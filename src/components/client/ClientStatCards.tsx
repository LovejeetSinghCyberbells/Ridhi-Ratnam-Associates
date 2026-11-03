import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClientStats } from '../../types/client';
import { FilesIcon, CheckIcon, ClockIcon } from '../Icons';
import { spacing, useAppTheme, colors } from '../../theme';

interface ClientStatCardsProps {
  stats: ClientStats;
}

export const ClientStatCards: React.FC<ClientStatCardsProps> = ({ stats }) => {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Card 1: Total Applications */}
      <View
        style={[
          styles.statBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View
          style={[
            styles.iconPill,
            { backgroundColor: isDark ? colors.cardSecondary : colors.slate100 },
          ]}
        >
          <FilesIcon size={14} color={colors.textPrimary} />
        </View>
        <Text style={[styles.statValue, { color: colors.textPrimary }]}>
          {stats.total}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Total Apps
        </Text>
      </View>

      {/* Card 2: Approved Applications */}
      <View
        style={[
          styles.statBox,
          {
            backgroundColor: isDark ? colors.statusApprovedBg : colors.surfaceSubtle,
            borderColor: isDark ? colors.statusApprovedBorder : colors.statusApprovedBorder,
          },
        ]}
      >
        <View
          style={[
            styles.iconPill,
            { backgroundColor: colors.statusApprovedBg },
          ]}
        >
          <CheckIcon size={14} color={colors.statusApproved} />
        </View>
        <Text
          style={[
            styles.statValue,
            { color: colors.statusApproved },
          ]}
        >
          {stats.approved}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Approved
        </Text>
      </View>

      {/* Card 3: Pending Applications */}
      <View
        style={[
          styles.statBox,
          {
            backgroundColor: colors.brandGoldSoft,
            borderColor: colors.brandGoldLight,
          },
        ]}
      >
        <View
          style={[
            styles.iconPill,
            { backgroundColor: colors.statusPendingBg },
          ]}
        >
          <ClockIcon size={14} color={colors.statusPending} />
        </View>
        <Text
          style={[
            styles.statValue,
            { color: colors.statusPending },
          ]}
        >
          {stats.pending}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Pending
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
