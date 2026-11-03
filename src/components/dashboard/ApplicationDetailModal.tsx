import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LoanApplication, ApplicationStatus } from '../../types/dashboard';
import { CrossIcon, PhoneIcon, MailIcon, CheckIcon } from '../Icons';
import { AnimatedButton } from '../AnimatedButton';
import { colors } from '../../theme';

interface ApplicationDetailModalProps {
  application: LoanApplication | null;
  visible: boolean;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  visible,
  onClose,
}) => {
  if (!application) return null;

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return { bg: colors.statusPendingBg, border: colors.statusPendingBorder, text: colors.statusPending };
      case 'Under Review':
        return { bg: colors.statusReviewBg, border: colors.statusReviewBorder, text: colors.statusReview };
      case 'Approved':
        return { bg: colors.statusApprovedBg, border: colors.statusApprovedBorder, text: colors.statusApproved };
      case 'Rejected':
        return { bg: colors.statusRejectedBg, border: colors.statusRejectedBorder, text: colors.statusRejected };
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
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerCategory}>APPLICATION DOSSIER</Text>
              <Text style={styles.headerTitle}>{application.id}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close application details"
            >
              <CrossIcon size={14} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Client Profile Header */}
            <View style={styles.clientHero}>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroAvatarText}>{application.clientInitials}</Text>
              </View>
              <View style={styles.heroInfo}>
                <Text style={styles.heroClientName}>{application.clientName}</Text>
                <Text style={styles.heroLoanType}>{application.loanType}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusTheme.bg, borderColor: statusTheme.border },
                ]}
              >
                <Text style={[styles.statusText, { color: statusTheme.text }]}>
                  {application.status}
                </Text>
              </View>
            </View>

            {/* Financial Overview Card */}
            <View style={styles.financialCard}>
              <Text style={styles.finLabel}>SANCTIONED / REQUESTED AMOUNT</Text>
              <Text style={styles.finAmount}>{application.formattedAmount}</Text>

              <View style={styles.finGrid}>
                <View style={styles.finItem}>
                  <Text style={styles.finItemLabel}>TENURE</Text>
                  <Text style={styles.finItemValue}>{application.tenureMonths || 36} Months</Text>
                </View>
                <View style={styles.finItem}>
                  <Text style={styles.finItemLabel}>INTEREST RATE</Text>
                  <Text style={styles.finItemValue}>{application.interestRate || '10.5% p.a.'}</Text>
                </View>
                <View style={styles.finItem}>
                  <Text style={styles.finItemLabel}>CIBIL SCORE</Text>
                  <Text style={[styles.finItemValue, { color: colors.statusApproved }]}>
                    {application.cibilScore || 750}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact Details */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Client Contact Information</Text>
              <View style={styles.contactRow}>
                <PhoneIcon size={16} color={colors.slate500} />
                <Text style={styles.contactText}>{application.clientPhone}</Text>
              </View>
              <View style={styles.contactRow}>
                <MailIcon size={16} color={colors.slate500} />
                <Text style={styles.contactText}>{application.clientEmail}</Text>
              </View>
              <View style={styles.contactRow}>
                <CheckIcon size={16} color={colors.success} />
                <Text style={styles.contactText}>KYC & Aadhar Verified</Text>
              </View>
            </View>

            {/* Underwriting Notes */}
            {application.notes ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Underwriting & Verification Notes</Text>
                <Text style={styles.notesText}>{application.notes}</Text>
              </View>
            ) : null}

            {/* Close Button */}
            <AnimatedButton
              title="Close Dossier"
              variant="black"
              onPress={onClose}
              style={styles.actionBtn}
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
  headerLeft: {},
  headerCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.slate400,
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 17,
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
  clientHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.topBarBlack,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroAvatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  heroInfo: {
    flex: 1,
  },
  heroClientName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  heroLoanType: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.slate500,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  financialCard: {
    backgroundColor: colors.slate50,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  finLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate500,
    letterSpacing: 0.5,
  },
  finAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    marginVertical: 4,
    letterSpacing: -0.5,
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
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
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
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate600,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  notesText: {
    fontSize: 12.5,
    color: colors.slate600,
    lineHeight: 18,
  },
  actionBtn: {
    width: '100%',
    marginTop: 10,
  },
});

