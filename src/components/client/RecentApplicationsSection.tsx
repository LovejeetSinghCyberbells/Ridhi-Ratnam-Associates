import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ClientLoanApplication, ClientAppStatus } from '../../types/client';
import { ChevronRightIcon } from '../Icons';
import { spacing, useAppTheme } from '../../theme';

interface RecentApplicationsSectionProps {
  applications: ClientLoanApplication[];
  onViewAll: () => void;
  onSelectApplication: (app: ClientLoanApplication) => void;
}

export const RecentApplicationsSection: React.FC<RecentApplicationsSectionProps> = ({
  applications,
  onViewAll,
  onSelectApplication,
}) => {
  const { colors, isDark } = useAppTheme();

  const getStatusTheme = (status: ClientAppStatus) => {
    switch (status) {
      case 'Under Review':
        return isDark
          ? { bg: '#112240', border: '#1D4ED8', text: '#60A5FA', dot: '#3B82F6' }
          : { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', dot: '#2563EB' };
      case 'Approved':
        return isDark
          ? { bg: '#06281D', border: '#065F46', text: '#34D399', dot: '#10B981' }
          : { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857', dot: '#10B981' };
      case 'Rejected':
        return isDark
          ? { bg: '#2D1515', border: '#B91C1C', text: '#F87171', dot: '#EF4444' }
          : { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C', dot: '#DC2626' };
      default:
        return isDark
          ? { bg: '#2E2208', border: '#B45309', text: '#FBBF24', dot: '#F59E0B' }
          : { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', dot: '#D97706' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Recent Applications
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onViewAll}
          style={styles.viewAllBtn}
          accessibilityLabel="View all applications"
        >
          <Text style={[styles.viewAllText, { color: colors.textPrimary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3 Application Cards */}
      <View style={styles.cardsList}>
        {applications.map((app) => {
          const statusTheme = getStatusTheme(app.status);

          return (
            <TouchableOpacity
              key={app.id}
              activeOpacity={0.75}
              onPress={() => onSelectApplication(app)}
              style={[
                styles.appCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Application ${app.id}, amount ${app.formattedAmount}`}
            >
              {/* Left Column: ID & Loan Type */}
              <View style={styles.leftCol}>
                <Text style={[styles.appIdText, { color: colors.textPrimary }]}>
                  {`ID: ${app.id}`}
                </Text>
                <Text style={[styles.loanTypeText, { color: colors.textSecondary }]}>
                  {app.loanType}
                </Text>
                <Text style={[styles.dateText, { color: colors.textTertiary }]}>
                  {app.submissionDate}
                </Text>
              </View>

              {/* Right Column: Amount, Status, and Arrow */}
              <View style={styles.rightCol}>
                <Text style={[styles.amountText, { color: colors.textPrimary }]}>
                  {app.formattedAmount}
                </Text>

                <View style={styles.statusAndArrowRow}>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: statusTheme.bg,
                        borderColor: statusTheme.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusTheme.dot },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusTheme.text },
                      ]}
                    >
                      {app.status}
                    </Text>
                  </View>

                  <ChevronRightIcon
                    size={14}
                    color={isDark ? '#94A3B8' : '#64748B'}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardsList: {
    gap: 10,
  },
  appCard: {
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  leftCol: {
    flex: 1.1,
  },
  appIdText: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  loanTypeText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },
  statusAndArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
