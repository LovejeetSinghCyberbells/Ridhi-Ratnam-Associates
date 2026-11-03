import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MonthlyPerformance } from '../../types/dashboard';
import { useAppTheme, colors } from '../../theme';
import { TrendingUpIcon } from '../Icons';

interface MonthlyPerformanceCardProps {
  performance: MonthlyPerformance;
}

export const MonthlyPerformanceCard: React.FC<MonthlyPerformanceCardProps> = ({
  performance,
}) => {
  const { colors, isDark } = useAppTheme();
  const { handled, approved, rejected, pending, approvalPercentage } = performance;

  // Segment widths in percentage of total handled (45)
  const approvedPct = Math.round((approved / handled) * 100);
  const pendingPct = Math.round((pending / handled) * 100);
  const rejectedPct = 100 - approvedPct - pendingPct;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Title & Headline */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Monthly Performance
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {performance.month || 'Current Cycle'}
          </Text>
        </View>

        <View
          style={[
            styles.rateBadge,
            {
              backgroundColor: colors.statusApprovedBg,
              borderColor: colors.statusApprovedBorder,
            },
          ]}
        >
          <TrendingUpIcon size={14} color={colors.statusApproved} />
          <Text
            style={[
              styles.rateText,
              { color: colors.statusApproved },
            ]}
          >
            {`${approvalPercentage.toFixed(1)}%`}
          </Text>
          <Text
            style={[
              styles.rateLabel,
              { color: colors.statusApproved },
            ]}
          >
            APPROVAL
          </Text>
        </View>
      </View>

      {/* Visual Multi-Segment Progress Bar */}
      <View style={styles.progressSection}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.slate100 },
          ]}
        >
          <View
            style={[
              styles.progressSegment,
              { width: `${approvedPct}%`, backgroundColor: colors.statusApproved },
            ]}
          />
          <View
            style={[
              styles.progressSegment,
              { width: `${pendingPct}%`, backgroundColor: colors.brandGold },
            ]}
          />
          <View
            style={[
              styles.progressSegment,
              { width: `${rejectedPct}%`, backgroundColor: colors.statusRejected },
            ]}
          />
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.statusApproved }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Approved ({approvedPct}%)
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.brandGold }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Pending ({pendingPct}%)
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.statusRejected }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Rejected ({rejectedPct}%)
            </Text>
          </View>
        </View>
      </View>

      {/* 4 Metric Counter Pills */}
      <View style={styles.metricsGrid}>
        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: colors.slate50,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            Handled
          </Text>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
            {handled}
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: colors.statusApprovedBg,
              borderColor: colors.statusApprovedBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: colors.statusApproved },
            ]}
          >
            Approved
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: colors.statusApproved },
            ]}
          >
            {approved}
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: colors.brandGoldSoft,
              borderColor: colors.brandGoldLight,
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: colors.brandGoldDark },
            ]}
          >
            Pending
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: colors.statusPending },
            ]}
          >
            {pending}
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: colors.statusRejectedBg,
              borderColor: colors.statusRejectedBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: colors.statusRejected },
            ]}
          >
            Rejected
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: colors.statusRejected },
            ]}
          >
            {rejected}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  rateText: {
    fontSize: 13,
    fontWeight: '800',
  },
  rateLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressSection: {
    marginBottom: 14,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressSegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
