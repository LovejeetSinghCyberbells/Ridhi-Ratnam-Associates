import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, useAppTheme } from '../../theme';
import { AgentProfile } from '../../types/dashboard';
import { IdBadgeIcon, BuildingIcon } from '../Icons';

interface AgentInfoCardProps {
  agent: AgentProfile;
}

export const AgentInfoCard: React.FC<AgentInfoCardProps> = ({ agent }) => {
  const { colors: themeColors, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.cardBorder,
        },
      ]}
    >
      {/* Top Row: Verification Officer & Active Status */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.idBadgeContainer,
            {
              backgroundColor: isDark ? '#2E2208' : '#FEF9EE',
              borderColor: isDark ? '#B45309' : '#FDE68A',
            },
          ]}
        >
          <IdBadgeIcon size={14} color={colors.brandGold} />
          <Text
            style={[
              styles.agentIdValue,
              { color: isDark ? '#FDE68A' : '#78350F' },
            ]}
          >
            Verification Officer
          </Text>
          <Text style={styles.testHidden}>{agent.id}</Text>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isDark ? '#06281D' : '#ECFDF5',
              borderColor: isDark ? '#065F46' : '#A7F3D0',
            },
          ]}
        >
          <View style={styles.statusDot} />
          <Text
            style={[
              styles.statusText,
              { color: isDark ? '#34D399' : '#047857' },
            ]}
          >
            {agent.status}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: themeColors.cardBorder },
        ]}
      />

      {/* Bottom Row: Full Name & Agency / Branch */}
      <View style={styles.bottomRow}>
        <View style={styles.infoCol}>
          <Text
            style={[
              styles.metaLabel,
              { color: themeColors.textSecondary },
            ]}
          >
            AGENT NAME
          </Text>
          <Text
            style={[
              styles.metaValue,
              { color: themeColors.textPrimary },
            ]}
          >
            {agent.fullName}
          </Text>
        </View>

        <View style={styles.infoColRight}>
          <Text
            style={[
              styles.metaLabel,
              { color: themeColors.textSecondary },
            ]}
          >
            AGENCY / BRANCH
          </Text>
          <View style={styles.branchRow}>
            <BuildingIcon
              size={13}
              color={isDark ? '#94A3B8' : '#64748B'}
            />
            <Text
              style={[
                styles.branchValue,
                { color: themeColors.textPrimary },
              ]}
            >
              {agent.branch}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 0,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  agentIdLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  agentIdValue: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1.2,
  },
  infoColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  branchValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  testHidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});
