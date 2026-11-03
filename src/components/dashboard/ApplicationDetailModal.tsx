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
        return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' };
      case 'Under Review':
        return { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' };
      case 'Approved':
        return { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857' };
      case 'Rejected':
        return { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' };
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
              <CrossIcon size={14} color="#0D0E12" />
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
                  <Text style={[styles.finItemValue, { color: '#047857' }]}>
                    {application.cibilScore || 750}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact Details */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Client Contact Information</Text>
              <View style={styles.contactRow}>
                <PhoneIcon size={16} color="#64748B" />
                <Text style={styles.contactText}>{application.clientPhone}</Text>
              </View>
              <View style={styles.contactRow}>
                <MailIcon size={16} color="#64748B" />
                <Text style={styles.contactText}>{application.clientEmail}</Text>
              </View>
              <View style={styles.contactRow}>
                <CheckIcon size={16} color="#10B981" />
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
  headerLeft: {},
  headerCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 17,
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
  clientHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0D0E12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  heroInfo: {
    flex: 1,
  },
  heroClientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0D0E12',
  },
  heroLoanType: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  finLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  finAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0D0E12',
    marginVertical: 4,
    letterSpacing: -0.5,
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
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E12',
    marginTop: 2,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
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
    color: '#0D0E12',
  },
  notesText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  actionBtn: {
    width: '100%',
    marginTop: 10,
  },
});

