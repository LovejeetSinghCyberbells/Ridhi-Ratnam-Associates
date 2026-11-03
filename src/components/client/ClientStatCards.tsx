import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClientStats } from '../../types/client';
import { FilesIcon, CheckIcon, ClockIcon } from '../Icons';
import { spacing, useAppTheme } from '../../theme';

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
            { backgroundColor: isDark ? colors.cardSecondary : '#F1F5F9' },
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
            backgroundColor: isDark ? '#06281D' : '#FBFFFD',
            borderColor: isDark ? '#065F46' : '#A7F3D0',
          },
        ]}
      >
        <View
          style={[
            styles.iconPill,
            { backgroundColor: isDark ? '#0F3E2C' : '#ECFDF5' },
          ]}
        >
          <CheckIcon size={14} color={isDark ? '#34D399' : '#059669'} />
        </View>
        <Text
          style={[
            styles.statValue,
            { color: isDark ? '#34D399' : '#047857' },
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
            backgroundColor: isDark ? '#2E2208' : '#FFFEFB',
            borderColor: isDark ? '#B45309' : '#FDE68A',
          },
        ]}
      >
        <View
          style={[
            styles.iconPill,
            { backgroundColor: isDark ? '#45330D' : '#FFFBEB' },
          ]}
        >
          <ClockIcon size={14} color={isDark ? '#FBBF24' : '#D97706'} />
        </View>
        <Text
          style={[
            styles.statValue,
            { color: isDark ? '#FBBF24' : '#B45309' },
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
    shadowColor: '#000',
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
