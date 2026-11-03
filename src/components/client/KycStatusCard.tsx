import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { KycSubmission, KycStatus } from '../../types/kyc';
import { useAppTheme, spacing, borderRadius } from '../../theme';
import {
  ShieldIcon,
  ClockIcon,
  CheckIcon,
  AlertCircleIcon,
  FileTextIcon,
  ChevronRightIcon,
  UploadCloudIcon,
} from '../Icons';
import { AnimatedButton } from '../AnimatedButton';

interface KycStatusCardProps {
  submission?: KycSubmission | null;
  onViewSubmission?: (submission: KycSubmission) => void;
  onViewDetails?: (submission: KycSubmission) => void;
  onUploadNew?: () => void;
}

export const KycStatusCard: React.FC<KycStatusCardProps> = ({
  submission,
  onViewSubmission,
  onViewDetails,
  onUploadNew,
}) => {
  const { colors, isDark } = useAppTheme();
  const handleView = onViewSubmission || onViewDetails;

  // 1. Empty State: Not Submitted
  if (!submission) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.emptyHeaderRow}>
          <View style={[styles.emptyIconBadge, { backgroundColor: isDark ? colors.cardSecondary : '#FEF8E7' }]}>
            <ShieldIcon size={24} color={colors.brandGold} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={styles.statusPillEmpty}>
              <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.statusPillTextEmpty}>Not Submitted</Text>
            </View>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              KYC Verification Required
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Submit your government identity & address documents to complete account verification.
            </Text>
          </View>
        </View>

        <AnimatedButton
          testID="btn-empty-upload-kyc"
          title="Upload KYC Documents"
          variant="black"
          showChevronTriple={true}
          onPress={onUploadNew || (() => {})}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  // 2. Status Style Config
  const getStatusBadge = (status: KycStatus) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Approved',
          bg: isDark ? '#06281D' : '#ECFDF5',
          border: isDark ? '#065F46' : '#A7F3D0',
          text: isDark ? '#34D399' : '#047857',
          dot: '#10B981',
          icon: <CheckIcon size={14} color="#FFFFFF" />,
          iconBg: '#10B981',
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          bg: isDark ? '#2D1515' : '#FEF2F2',
          border: isDark ? '#B91C1C' : '#FECACA',
          text: isDark ? '#F87171' : '#DC2626',
          dot: '#EF4444',
          icon: <AlertCircleIcon size={14} color="#FFFFFF" />,
          iconBg: '#EF4444',
        };
      case 'PENDING':
      default:
        return {
          label: 'Pending Verification',
          bg: isDark ? '#2E2208' : '#FFFBEB',
          border: isDark ? '#B45309' : '#FDE68A',
          text: isDark ? '#FBBF24' : '#B45309',
          dot: '#F59E0B',
          icon: <ClockIcon size={14} color="#FFFFFF" />,
          iconBg: '#F59E0B',
        };
    }
  };

  const badge = getStatusBadge(submission.status);
  const docCount = submission.documents?.length || 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Top Status & Submission ID Row */}
      <View style={styles.topRow}>
        <View style={styles.idGroup}>
          <Text style={[styles.eyebrow, { color: colors.brandGold }]}>KYC SUBMISSION</Text>
          <Text style={[styles.subIdText, { color: colors.textPrimary }]}>
            {submission.id}
          </Text>
        </View>

        {/* Status Pill Badge */}
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: badge.bg,
              borderColor: badge.border,
            },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
          <Text style={[styles.statusPillText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      {/* Rejection Alert Callout if Rejected */}
      {submission.status === 'REJECTED' && submission.rejectionReason && (
        <View
          style={[
            styles.rejectionBox,
            {
              backgroundColor: isDark ? '#2D1515' : '#FEF2F2',
              borderColor: isDark ? '#B91C1C' : '#FECACA',
            },
          ]}
        >
          <AlertCircleIcon size={16} color="#DC2626" />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.rejectionTitle}>Action Needed: Document Rejection</Text>
            <Text style={[styles.rejectionBody, { color: isDark ? '#F87171' : '#991B1B' }]}>
              {submission.rejectionReason}
            </Text>
          </View>
        </View>
      )}

      {/* Approval Message Callout if Approved */}
      {submission.status === 'APPROVED' && (
        <View
          style={[
            styles.approvalBox,
            {
              backgroundColor: isDark ? '#06281D' : '#ECFDF5',
              borderColor: isDark ? '#065F46' : '#A7F3D0',
            },
          ]}
        >
          <CheckIcon size={16} color="#059669" />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.approvalTitle}>Identity Officially Verified</Text>
            <Text style={[styles.approvalBody, { color: isDark ? '#34D399' : '#047857' }]}>
              Your KYC dossier has been authenticated and approved by Ridhi Ratnam Associates.
            </Text>
          </View>
        </View>
      )}

      {/* Submission Metadata Strip */}
      <View
        style={[
          styles.metaStrip,
          {
            backgroundColor: isDark ? colors.cardSecondary : '#F8FAFC',
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.metaCol}>
          <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Submission Date</Text>
          <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
            {submission.submissionDate}
          </Text>
        </View>
        <View style={[styles.metaDivider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.metaCol}>
          <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Documents</Text>
          <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
            {docCount} Uploaded
          </Text>
        </View>
        <View style={[styles.metaDivider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.metaCol}>
          <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Verification</Text>
          <Text style={[styles.metaValue, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      {/* Primary Action Button: View Submission */}
      <View style={styles.actionRow}>
        <AnimatedButton
          testID="btn-view-submission"
          title="View Submission"
          variant="black"
          showChevronTriple={true}
          onPress={() => {
            if (handleView) handleView(submission);
          }}
          style={styles.actionBtn}
        />

        {submission.status === 'REJECTED' && (
          <TouchableOpacity
            testID="btn-correct-resubmit"
            activeOpacity={0.8}
            onPress={onUploadNew || (() => {})}
            style={[
              styles.resubmitBtn,
              {
                borderColor: colors.brandGold,
                backgroundColor: isDark ? colors.cardSecondary : '#FEF8E7',
              },
            ]}
          >
            <UploadCloudIcon size={16} color={colors.brandGold} />
            <Text style={[styles.resubmitBtnText, { color: colors.brandGold }]}>
              Replace Documents
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginHorizontal: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  idGroup: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  subIdText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  statusPillEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
    marginBottom: 6,
    gap: 6,
  },
  statusPillTextEmpty: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  emptyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emptyIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  rejectionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  rejectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 2,
  },
  rejectionBody: {
    fontSize: 12,
    lineHeight: 16,
  },
  approvalBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  approvalTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 2,
  },
  approvalBody: {
    fontSize: 12,
    lineHeight: 16,
  },
  metaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  metaCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  metaValue: {
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
  },
  metaDivider: {
    width: 1,
    height: 22,
  },
  actionRow: {
    gap: 8,
  },
  actionBtn: {
    width: '100%',
  },
  resubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: borderRadius.pill,
    borderWidth: 1.5,
    gap: 6,
  },
  resubmitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
