import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ClientLoanApplication, ClientAppStatus } from '../../types/client';
import { CrossIcon, CheckIcon, ClockIcon, AlertCircleIcon, UserIcon, PhoneIcon } from '../Icons';
import { AnimatedButton } from '../AnimatedButton';
import { themeAlert } from '../ThemeDialog';
import { colors } from '../../theme';

interface ClientAppDetailModalProps {
  application: ClientLoanApplication | null;
  visible: boolean;
  onClose: () => void;
}

export const ClientAppDetailModal: React.FC<ClientAppDetailModalProps> = ({
  application,
  visible,
  onClose,
}) => {
  if (!application) return null;

  const getStatusColor = (status: ClientAppStatus) => {
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
          dot: colors.error,
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

  const statusTheme = getStatusColor(application.status);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerCategory}>APPLICATION STATUS</Text>
              <Text style={styles.headerTitle}>{application.id}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close details"
            >
              <CrossIcon size={14} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Amount & Status Card */}
            <View style={styles.financialCard}>
              <View style={styles.finTop}>
                <View>
                  <Text style={styles.finLabel}>SANCTIONED LOAN AMOUNT</Text>
                  <Text style={styles.finAmount}>{application.formattedAmount}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusTheme.bg, borderColor: statusTheme.border },
                  ]}
                >
                  <View style={[styles.statusDot, { backgroundColor: statusTheme.dot }]} />
                  <Text style={[styles.statusText, { color: statusTheme.text }]}>
                    {application.status}
                  </Text>
                </View>
              </View>

              <View style={styles.finGrid}>
                <View style={styles.finItem}>
                  <Text style={styles.finItemLabel}>LOAN TYPE</Text>
                  <Text style={styles.finItemValue}>{application.loanType}</Text>
                </View>
                <View style={styles.finItem}>
                  <Text style={styles.finItemLabel}>TENURE</Text>
                  <Text style={styles.finItemValue}>{application.tenureMonths} Months</Text>
                </View>
                <View style={styles.finItem}>
                  <Text style={styles.finItemLabel}>ESTIMATED EMI</Text>
                  <Text style={[styles.finItemValue, { color: colors.statusApproved }]}>
                    {application.emiAmount || 'Calculated on approval'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Rejection Notice (if rejected) */}
            {application.status === 'Rejected' && application.rejectionReason && (
              <View style={styles.rejectionCard}>
                <View style={styles.rejectionHeader}>
                  <AlertCircleIcon size={16} color={colors.error} />
                  <Text style={styles.rejectionTitle}>Underwriting Evaluation Reason</Text>
                </View>
                <Text style={styles.rejectionText}>{application.rejectionReason}</Text>
              </View>
            )}

            {/* Requested Documents (if documents requested) */}
            {application.requestedDocuments && application.requestedDocuments.length > 0 && (
              <View style={styles.docsCard}>
                <Text style={styles.docsTitle}>Requested Supplementary Documents</Text>
                {application.requestedDocuments.map((doc, idx) => (
                  <View key={idx} style={styles.docRow}>
                    <ClockIcon size={14} color={colors.statusPending} />
                    <Text style={styles.docText}>{doc}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 4-Step Milestone History */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Verification Milestones</Text>
              {application.steps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                return (
                  <View key={step.id} style={styles.stepRow}>
                    <View
                      style={[
                        styles.stepDot,
                        isCompleted && styles.stepDotCompleted,
                        isCurrent && styles.stepDotCurrent,
                      ]}
                    >
                      {isCompleted ? (
                        <CheckIcon size={10} color={colors.white} />
                      ) : (
                        <View style={styles.stepInnerDot} />
                      )}
                    </View>
                    <View style={styles.stepInfo}>
                      <Text
                        style={[
                          styles.stepName,
                          (isCompleted || isCurrent) && styles.stepNameActive,
                        ]}
                      >
                        {step.label}
                      </Text>
                      {step.date ? <Text style={styles.stepDate}>{step.date}</Text> : null}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Assigned Advisor */}
            {application.agentAssigned && (
              <View style={styles.advisorCard}>
                <View style={styles.advisorAvatar}>
                  <UserIcon size={16} color={colors.textPrimary} />
                </View>
                <View style={styles.advisorInfo}>
                  <Text style={styles.advisorName}>
                    Advisor: {application.agentAssigned.name}
                  </Text>
                  <Text style={styles.advisorBranch}>
                    {application.agentAssigned.branch} (ID: {application.agentAssigned.id})
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => themeAlert('Contacting Advisor', `Connecting to ${application.agentAssigned?.phone}`)}
                  style={styles.advisorCallBtn}
                >
                  <PhoneIcon size={14} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            )}

            <AnimatedButton
              title="Close Dossier"
              variant="black"
              onPress={onClose}
              style={{ marginTop: 12, width: '100%' }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.slate400,
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingBottom: 24,
  },
  financialCard: {
    backgroundColor: colors.slate50,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  finTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  finLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate500,
    letterSpacing: 0.5,
  },
  finAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  finGrid: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  finItem: {
    flex: 1,
  },
  finItemLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.slate400,
    letterSpacing: 0.3,
  },
  finItemValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  rejectionCard: {
    backgroundColor: colors.statusRejectedBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.statusRejectedBorder,
    marginBottom: 12,
  },
  rejectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  rejectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.statusRejected,
  },
  rejectionText: {
    fontSize: 12,
    color: colors.statusRejected,
    lineHeight: 17,
  },
  docsCard: {
    backgroundColor: colors.brandGoldSoft,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.brandGoldLight,
    marginBottom: 12,
  },
  docsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.brandGoldDark,
    marginBottom: 6,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  docText: {
    fontSize: 12,
    color: colors.brandGoldDark,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.slate100,
    borderWidth: 1.5,
    borderColor: colors.slate300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepDotCompleted: {
    backgroundColor: colors.statusApproved,
    borderColor: colors.statusApproved,
  },
  stepDotCurrent: {
    backgroundColor: colors.statusReviewBg,
    borderColor: colors.statusReview,
  },
  stepInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.slate400,
  },
  stepInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.slate500,
  },
  stepNameActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  stepDate: {
    fontSize: 11,
    color: colors.slate400,
  },
  advisorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.slate50,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  advisorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  advisorInfo: {
    flex: 1,
  },
  advisorName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  advisorBranch: {
    fontSize: 11,
    color: colors.slate500,
    marginTop: 1,
  },
  advisorCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

