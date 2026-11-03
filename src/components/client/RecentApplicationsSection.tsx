import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ClientLoanApplication, ClientAppStatus } from '../../types/client';
import { ChevronRightIcon } from '../Icons';
import { spacing, useAppTheme, colors } from '../../theme';

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
        return {
          bg: colors.statusReviewBg,
          border: colors.statusReviewBorder,
          text: colors.statusReview,
          dot: colors.statusReview,
        };
      case 'Approved':
        return {
          bg: colors.statusApprovedBg,
          border: colors.statusApprovedBorder,
          text: colors.statusApproved,
          dot: colors.statusApproved,
        };
      case 'Rejected':
        return {
          bg: colors.statusRejectedBg,
          border: colors.statusRejectedBorder,
          text: colors.statusRejected,
          dot: colors.statusRejected,
        };
      default:
        return {
          bg: colors.statusPendingBg,
          border: colors.statusPendingBorder,
          text: colors.statusPending,
          dot: colors.statusPending,
        };
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
                    color={isDark ? colors.slate400 : colors.slate500}
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
    shadowColor: colors.shadow,
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
