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
        return { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', dot: '#2563EB' };
      case 'Approved':
        return { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857', dot: '#10B981' };
      case 'Rejected':
        return { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C', dot: '#DC2626' };
      default:
        return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', dot: '#D97706' };
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
              <CrossIcon size={14} color="#0D0E12" />
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
                  <Text style={[styles.finItemValue, { color: '#047857' }]}>
                    {application.emiAmount || 'Calculated on approval'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Rejection Notice (if rejected) */}
            {application.status === 'Rejected' && application.rejectionReason && (
              <View style={styles.rejectionCard}>
                <View style={styles.rejectionHeader}>
                  <AlertCircleIcon size={16} color="#DC2626" />
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
                    <ClockIcon size={14} color="#D97706" />
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
                        <CheckIcon size={10} color="#FFFFFF" />
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
                  <UserIcon size={16} color="#0D0E12" />
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
                  <PhoneIcon size={14} color="#0D0E12" />
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#F1F3F6',
  },
  headerCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E12',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingBottom: 24,
  },
  financialCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#64748B',
    letterSpacing: 0.5,
  },
  finAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0D0E12',
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
    borderTopColor: '#E2E8F0',
  },
  finItem: {
    flex: 1,
  },
  finItemLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  finItemValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0D0E12',
    marginTop: 2,
  },
  rejectionCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
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
    color: '#B91C1C',
  },
  rejectionText: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 17,
  },
  docsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  docsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
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
    color: '#78350F',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
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
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepDotCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepDotCurrent: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  stepInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
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
    color: '#64748B',
  },
  stepNameActive: {
    color: '#0D0E12',
    fontWeight: '700',
  },
  stepDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  advisorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  advisorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#0D0E12',
  },
  advisorBranch: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  advisorCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

