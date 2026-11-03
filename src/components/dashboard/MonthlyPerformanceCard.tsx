import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MonthlyPerformance } from '../../types/dashboard';
import { useAppTheme } from '../../theme';
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
              backgroundColor: isDark ? '#06281D' : '#ECFDF5',
              borderColor: isDark ? '#065F46' : '#A7F3D0',
            },
          ]}
        >
          <TrendingUpIcon size={14} color={isDark ? '#34D399' : '#047857'} />
          <Text
            style={[
              styles.rateText,
              { color: isDark ? '#34D399' : '#047857' },
            ]}
          >
            {`${approvalPercentage.toFixed(1)}%`}
          </Text>
          <Text
            style={[
              styles.rateLabel,
              { color: isDark ? '#A7F3D0' : '#065F46' },
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
            { backgroundColor: isDark ? colors.cardSecondary : '#F1F5F9' },
          ]}
        >
          <View
            style={[
              styles.progressSegment,
              { width: `${approvedPct}%`, backgroundColor: '#10B981' },
            ]}
          />
          <View
            style={[
              styles.progressSegment,
              { width: `${pendingPct}%`, backgroundColor: '#F59E0B' },
            ]}
          />
          <View
            style={[
              styles.progressSegment,
              { width: `${rejectedPct}%`, backgroundColor: '#EF4444' },
            ]}
          />
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Approved ({approvedPct}%)
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Pending ({pendingPct}%)
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
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
              backgroundColor: isDark ? colors.cardSecondary : '#F8FAFC',
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
              backgroundColor: isDark ? '#06281D' : '#ECFDF5',
              borderColor: isDark ? '#065F46' : '#A7F3D0',
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: isDark ? '#A7F3D0' : '#065F46' },
            ]}
          >
            Approved
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: isDark ? '#34D399' : '#047857' },
            ]}
          >
            {approved}
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: isDark ? '#2E2208' : '#FFFBEB',
              borderColor: isDark ? '#B45309' : '#FDE68A',
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: isDark ? '#FDE68A' : '#92400E' },
            ]}
          >
            Pending
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: isDark ? '#FBBF24' : '#B45309' },
            ]}
          >
            {pending}
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: isDark ? '#2D1515' : '#FEF2F2',
              borderColor: isDark ? '#B91C1C' : '#FECACA',
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: isDark ? '#FECACA' : '#991B1B' },
            ]}
          >
            Rejected
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: isDark ? '#F87171' : '#B91C1C' },
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
    shadowColor: '#000',
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
