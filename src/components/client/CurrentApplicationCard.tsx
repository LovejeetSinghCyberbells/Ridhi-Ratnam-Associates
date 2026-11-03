import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClientLoanApplication, ApplicationStep } from '../../types/client';
import { CheckIcon, ClockIcon, FileTextIcon, ShieldIcon, BuildingIcon } from '../Icons';
import { AnimatedButton } from '../AnimatedButton';
import { spacing, useAppTheme } from '../../theme';

interface CurrentApplicationCardProps {
  application: ClientLoanApplication | null;
  onViewApplication: (application: ClientLoanApplication) => void;
  onApplyNew: () => void;
}

export const CurrentApplicationCard: React.FC<CurrentApplicationCardProps> = ({
  application,
  onViewApplication,
  onApplyNew,
}) => {
  const { colors, isDark } = useAppTheme();

  if (!application) {
    return (
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
          No Active Applications
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          You do not have any active loan requests currently in review.
        </Text>
        <AnimatedButton
          title="Submit New Application"
          variant="black"
          onPress={onApplyNew}
          style={{ width: '100%', marginTop: 12 }}
        />
      </View>
    );
  }

  const getStatusBadge = () => {
    switch (application.status) {
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

  const statusStyle = getStatusBadge();
  const docsCount = application.documents?.length || 6;

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Top Header: ID & Status Badge */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>
            ACTIVE APPLICATION
          </Text>
          <Text style={[styles.appIdText, { color: colors.textPrimary }]}>
            {`ID: ${application.id}`}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {application.status}
          </Text>
        </View>
      </View>

      {/* Facility Type & Purpose */}
      <View style={styles.facilityBlock}>
        <Text style={[styles.facilityName, { color: colors.textPrimary }]}>
          {application.loanType}
        </Text>
        <Text style={[styles.facilityPurpose, { color: colors.textSecondary }]}>
          {application.purpose || 'Working capital inventory & business operations expansion'}
        </Text>
      </View>

      {/* Financial Details Row */}
      <View
        style={[
          styles.finRow,
          {
            backgroundColor: isDark ? colors.cardSecondary : colors.cardElevated,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.finCol}>
          <Text style={[styles.finLabel, { color: colors.textSecondary }]}>
            Requested Amount
          </Text>
          <Text style={[styles.finAmount, { color: colors.textPrimary }]}>
            {application.formattedAmount}
          </Text>
        </View>

        <View style={styles.finColCenter}>
          <Text style={[styles.finLabel, { color: colors.textSecondary }]}>
            Est. Monthly EMI
          </Text>
          <Text
            style={[
              styles.finValue,
              { color: isDark ? '#34D399' : '#047857' },
            ]}
          >
            {application.emiAmount || '₹16,250 / mo'}
          </Text>
        </View>

        <View style={styles.finColRight}>
          <Text style={[styles.finLabel, { color: colors.textSecondary }]}>Tenure</Text>
          <Text style={[styles.finValue, { color: colors.textPrimary }]}>
            {application.tenureMonths || 36} Months
          </Text>
        </View>
      </View>

      {/* Real-World Attached Documents Strip */}
      <View
        style={[
          styles.docsSummaryStrip,
          {
            backgroundColor: isDark ? '#06281D' : '#F0FDF4',
            borderColor: isDark ? '#065F46' : '#BBF7D0',
          },
        ]}
      >
        <View
          style={[
            styles.docsIconBox,
            { backgroundColor: isDark ? '#0F3E2C' : '#DCFCE7' },
          ]}
        >
          <FileTextIcon size={14} color={isDark ? '#34D399' : '#047857'} />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text
            style={[
              styles.docsSummaryTitle,
              { color: isDark ? '#34D399' : '#166534' },
            ]}
          >
            {docsCount} Mandatory Documents Attached
          </Text>
          <Text
            style={[
              styles.docsSummarySub,
              { color: isDark ? '#A7F3D0' : '#15803D' },
            ]}
          >
            PAN, Aadhaar e-KYC, Bank Statement, ITR, GSTN & Utility Bills
          </Text>
        </View>
        <View
          style={[
            styles.docsVerifiedChip,
            { backgroundColor: isDark ? '#0F3E2C' : '#DCFCE7' },
          ]}
        >
          <ShieldIcon size={10} color={isDark ? '#34D399' : '#047857'} />
          <Text
            style={[
              styles.docsVerifiedText,
              { color: isDark ? '#34D399' : '#166534' },
            ]}
          >
            Audited
          </Text>
        </View>
      </View>

      {/* Assigned Underwriting Advisor */}
      {application.agentAssigned && (
        <View
          style={[
            styles.advisorStrip,
            {
              backgroundColor: isDark ? colors.cardSecondary : '#F8FAFC',
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.advisorAvatar,
              { backgroundColor: isDark ? colors.brandGold : colors.topBarBlack },
            ]}
          >
            <Text
              style={[
                styles.advisorAvatarText,
                { color: isDark ? '#012655' : '#FFFFFF' },
              ]}
            >
              RS
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.advisorLabel, { color: colors.textSecondary }]}>
              Dedicated Advisor Assigned
            </Text>
            <Text style={[styles.advisorName, { color: colors.textPrimary }]}>
              {application.agentAssigned.name} • {application.agentAssigned.branch || 'Chandigarh Branch'}
            </Text>
          </View>
        </View>
      )}

      {/* Divider */}
      <View
        style={[
          styles.divider,
          { backgroundColor: colors.cardBorder },
        ]}
      />

      {/* Real-time Status Stepper */}
      {application.steps && application.steps.length > 0 && (
        <View style={styles.trackerContainer}>
          <Text style={[styles.trackerTitle, { color: colors.textSecondary }]}>
            Application Journey
          </Text>
          <View style={styles.stepsWrapper}>
            {application.steps.map((step, index) => {
              const isLast = index === application.steps.length - 1;
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';

              return (
                <View key={step.id} style={styles.stepItem}>
                  <View style={styles.nodeColumn}>
                    <View
                      style={[
                        styles.stepNode,
                        {
                          backgroundColor: isDark ? colors.cardSecondary : '#F1F5F9',
                          borderColor: isDark ? colors.cardBorder : '#CBD5E1',
                        },
                        isCompleted && styles.stepNodeCompleted,
                        isCurrent && [
                          styles.stepNodeCurrent,
                          {
                            borderColor: colors.brandGold,
                            backgroundColor: isDark ? '#2E2208' : '#FFFBEB',
                          },
                        ],
                      ]}
                    >
                      {isCompleted ? (
                        <CheckIcon size={12} color="#FFFFFF" />
                      ) : isCurrent ? (
                        <ClockIcon size={12} color={colors.brandGold} />
                      ) : (
                        <View style={styles.stepNodePending} />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.stepLine,
                          {
                            backgroundColor: isCompleted
                              ? '#10B981'
                              : isDark
                              ? colors.cardBorder
                              : '#E2E8F0',
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepContent}>
                    <View style={styles.stepTitleRow}>
                      <Text
                        style={[
                          styles.stepTitle,
                          { color: colors.textPrimary },
                          isCurrent && { color: colors.brandGold, fontWeight: '800' },
                        ]}
                      >
                        {step.label}
                      </Text>
                      {step.date && (
                        <Text
                          style={[
                            styles.stepDate,
                            { color: colors.textTertiary },
                          ]}
                        >
                          {step.date}
                        </Text>
                      )}
                    </View>
                    {step.description ? (
                      <Text
                        style={[
                          styles.stepDescription,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {step.description}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Action Button */}
      <AnimatedButton
        title="View Application"
        variant="black"
        onPress={() => onViewApplication(application)}
        style={styles.actionBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: spacing.lg,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  facilityBlock: {
    marginBottom: 12,
  },
  facilityName: {
    fontSize: 15,
    fontWeight: '800',
  },
  facilityPurpose: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  metaLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  appIdText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  finRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  finCol: {
    flex: 1.2,
  },
  finColCenter: {
    flex: 1,
    alignItems: 'center',
  },
  finColRight: {
    flex: 0.9,
    alignItems: 'flex-end',
  },
  finLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  finAmount: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  finValue: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  docsSummaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  docsIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docsSummaryTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  docsSummarySub: {
    fontSize: 10.5,
    marginTop: 1,
  },
  docsVerifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
    gap: 3,
  },
  docsVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
  },
  advisorStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
  },
  advisorAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advisorAvatarText: {
    fontSize: 10,
    fontWeight: '800',
  },
  advisorLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  advisorName: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  trackerContainer: {
    marginBottom: 14,
  },
  trackerTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  stepsWrapper: {
    paddingLeft: 4,
  },
  stepItem: {
    flexDirection: 'row',
    minHeight: 46,
  },
  nodeColumn: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepNodeCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepNodeCurrent: {
    borderWidth: 2,
  },
  stepNodePending: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 14,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepDate: {
    fontSize: 11,
  },
  stepDescription: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  actionBtn: {
    width: '100%',
    marginTop: 4,
  },
});
