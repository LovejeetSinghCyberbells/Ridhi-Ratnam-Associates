import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Keyboard,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme';
import {
  LoanApplication,
  UploadedDocument,
  DeepAnalysisReport,
  ApplicationStatus,
} from '../types/dashboard';
import {
  ChevronLeftIcon,
  CheckIcon,
  ClockIcon,
  CrossIcon,
  AlertCircleIcon,
  FileTextIcon,
  DownloadIcon,
  PhoneIcon,
  MailIcon,
  ShieldIcon,
  TrendingUpIcon,
  BuildingIcon,
  IdBadgeIcon,
} from '../components/Icons';
import { AnimatedButton } from '../components/AnimatedButton';
import { themeAlert } from '../components/ThemeDialog';

interface ApplicationDetailScreenProps {
  application: LoanApplication;
  viewerRole?: 'agent' | 'client';
  onBack: () => void;
  onStatusChange?: (updatedApp: LoanApplication) => void;
}

export const ApplicationDetailScreen: React.FC<ApplicationDetailScreenProps> = ({
  application: initialApp,
  viewerRole = 'agent',
  onBack,
  onStatusChange,
}) => {
  const insets = useSafeAreaInsets();
  const [app, setApp] = useState<LoanApplication>(initialApp);
  const [activeTab, setActiveTab] = useState<'documents' | 'analysis' | 'overview'>('documents');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<UploadedDocument | null>(null);

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handleBackPress = () => {
      if (selectedDocForPreview !== null) {
        setSelectedDocForPreview(null);
        return true;
      }
      onBack();
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [selectedDocForPreview, onBack]);

  // Status Theme
  const getStatusStyle = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
        return { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857', dot: '#10B981' };
      case 'Rejected':
        return { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C', dot: '#DC2626' };
      case 'Under Review':
        return { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', dot: '#2563EB' };
      default:
        return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', dot: '#D97706' };
    }
  };

  const statusStyle = getStatusStyle(app.status);
  const docs = app.documents || [];
  const verifiedDocsCount = docs.filter((d) => d.status === 'Verified').length;
  const analysis = app.deepAnalysis;

  // Agent Actions
  const handleApproveApplication = () => {
    themeAlert(
      'Sanction Approval Confirmation',
      `Are you sure you want to approve loan application ${app.id} for ${app.formattedAmount}? Sanction advice will be dispatched to client.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Sanction',
          onPress: () => {
            const updated: LoanApplication = {
              ...app,
              status: 'Approved',
              notes: 'Sanction approved by Chandigarh Branch Credit Underwriter.',
            };
            setApp(updated);
            if (onStatusChange) onStatusChange(updated);
            themeAlert('Sanction Generated', `Application ${app.id} has been formally approved.`);
          },
        },
      ]
    );
  };

  const handleRejectApplication = () => {
    themeAlert(
      'Decline Loan Application',
      `Decline application ${app.id}? Underwriting justification will be logged in client audit file.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline Application',
          style: 'destructive',
          onPress: () => {
            const updated: LoanApplication = {
              ...app,
              status: 'Rejected',
              rejectionReason: 'Underwriting threshold obligation exceeded credit risk ceiling.',
            };
            setApp(updated);
            if (onStatusChange) onStatusChange(updated);
            themeAlert('Application Declined', `Application ${app.id} status set to Rejected.`);
          },
        },
      ]
    );
  };

  const handleVerifyDocument = (docId: string) => {
    const updatedDocs = docs.map((d) =>
      d.id === docId ? { ...d, status: 'Verified' as const } : d
    );
    const updated = { ...app, documents: updatedDocs };
    setApp(updated);
    if (onStatusChange) onStatusChange(updated);
    themeAlert('Document Verified', 'Document has been stamped and verified against official registry.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ================= TOP BLACK HEADER (Matching App-wide Top Bar) ================= */}
      <View style={[styles.blackHeader, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.headerBackBtn}
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerSubBadge}>APPLICATION DOSSIER</Text>
          <Text style={styles.headerMainTitle}>{app.id}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => themeAlert('Export Summary', `Generating signed PDF dossier for ${app.id}...`)}
          style={styles.headerActionBtnDark}
          accessibilityLabel="Export Dossier PDF"
        >
          <DownloadIcon size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ================= CURVED CONTENT SHEET ================= */}
      <View style={styles.curvedSheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
        >
        {/* ================= HERO DOSSIER CARD ================= */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{app.clientInitials}</Text>
            </View>

            <View style={styles.heroInfoBlock}>
              <Text style={styles.heroClientName}>{app.clientName}</Text>
              <Text style={styles.heroLoanType}>{app.loanType}</Text>
              <Text style={styles.heroDate}>Submitted: {app.submissionDate}</Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
              <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{app.status}</Text>
            </View>
          </View>

          {/* Financial Metrics Strip */}
          <View style={styles.financialStrip}>
            <View style={styles.finCol}>
              <Text style={styles.finLabel}>SANCTION AMOUNT</Text>
              <Text style={styles.finAmount}>{app.formattedAmount}</Text>
            </View>
            <View style={styles.finCol}>
              <Text style={styles.finLabel}>INTEREST RATE</Text>
              <Text style={styles.finValue}>{app.interestRate || '10.5% p.a.'}</Text>
            </View>
            <View style={styles.finCol}>
              <Text style={styles.finLabel}>TENURE</Text>
              <Text style={styles.finValue}>{app.tenureMonths || 36}M</Text>
            </View>
            <View style={styles.finCol}>
              <Text style={styles.finLabel}>EST. EMI</Text>
              <Text style={[styles.finValue, { color: '#047857' }]}>
                {app.emiAmount || '₹16,250 / mo'}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= REVIEW TABS ================= */}
        <View style={styles.tabsTrack}>
          <TouchableOpacity
            testID="tab-documents"
            activeOpacity={0.8}
            onPress={() => setActiveTab('documents')}
            style={[styles.tabButton, activeTab === 'documents' && styles.tabButtonActive]}
          >
            <Text style={[styles.tabButtonText, activeTab === 'documents' && styles.tabButtonTextActive]}>
              Client Documents ({docs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-analysis"
            activeOpacity={0.8}
            onPress={() => setActiveTab('analysis')}
            style={[styles.tabButton, activeTab === 'analysis' && styles.tabButtonActive]}
          >
            <Text style={[styles.tabButtonText, activeTab === 'analysis' && styles.tabButtonTextActive]}>
              Deep Analysis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-overview"
            activeOpacity={0.8}
            onPress={() => setActiveTab('overview')}
            style={[styles.tabButton, activeTab === 'overview' && styles.tabButtonActive]}
          >
            <Text style={[styles.tabButtonText, activeTab === 'overview' && styles.tabButtonTextActive]}>
              Overview & Audit
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= TAB 1: UPLOADED DOCUMENTS VERIFICATION ================= */}
        {activeTab === 'documents' && (
          <View style={styles.sectionContainer}>
            {/* Document Verification Summary Header */}
            <View style={styles.docsSummaryCard}>
              <View style={styles.docsSummaryTop}>
                <View style={styles.shieldIconWrapper}>
                  <ShieldIcon size={18} color="#047857" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.docsSummaryTitle}>Document Verification Audit</Text>
                  <Text style={styles.docsSummarySub}>
                    {verifiedDocsCount} of {docs.length} uploaded client documents officially stamped and verified
                  </Text>
                </View>
                <Text style={styles.docsPercentText}>
                  {docs.length > 0 ? Math.round((verifiedDocsCount / docs.length) * 100) : 0}%
                </Text>
              </View>

              {/* Progress bar */}
              <View style={styles.docProgressBar}>
                <View
                  style={[
                    styles.docProgressFill,
                    {
                      width: `${docs.length > 0 ? (verifiedDocsCount / docs.length) * 100 : 0}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* List of Documents */}
            <View style={styles.docsList}>
              {docs.map((doc) => {
                const isVerified = doc.status === 'Verified';
                const isReview = doc.status === 'Under Review';
                const isFlagged = doc.status === 'Needs Re-upload';

                return (
                  <View key={doc.id} style={styles.docItemCard}>
                    <View style={styles.docTopRow}>
                      <View style={styles.docFileIcon}>
                        <FileTextIcon size={18} color="#0D0E12" />
                      </View>

                      <View style={styles.docInfoCol}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        <Text style={styles.docMeta}>
                          {doc.category} • {doc.fileName} • {doc.fileSize}
                        </Text>
                      </View>

                      {/* Status Badge */}
                      <View
                        style={[
                          styles.docBadge,
                          isVerified
                            ? styles.docBadgeVerified
                            : isFlagged
                            ? styles.docBadgeFlagged
                            : styles.docBadgeReview,
                        ]}
                      >
                        {isVerified ? (
                          <CheckIcon size={10} color="#047857" />
                        ) : isFlagged ? (
                          <AlertCircleIcon size={10} color="#B91C1C" />
                        ) : (
                          <ClockIcon size={10} color="#1D4ED8" />
                        )}
                        <Text
                          style={[
                            styles.docBadgeText,
                            isVerified
                              ? styles.docBadgeTextVerified
                              : isFlagged
                              ? styles.docBadgeTextFlagged
                              : styles.docBadgeTextReview,
                          ]}
                        >
                          {doc.status}
                        </Text>
                      </View>
                    </View>

                    {/* Source & Notes */}
                    {doc.verificationSource && (
                      <View style={styles.docSourceRow}>
                        <Text style={styles.docSourceLabel}>Source:</Text>
                        <Text style={styles.docSourceText}>{doc.verificationSource}</Text>
                      </View>
                    )}

                    {doc.notes && (
                      <View style={styles.docNotesBox}>
                        <Text style={styles.docNotesText}>{doc.notes}</Text>
                      </View>
                    )}

                    {/* Action Buttons for Document */}
                    <View style={styles.docActionsRow}>
                      <TouchableOpacity
                        testID={`doc-preview-${doc.id}`}
                        activeOpacity={0.7}
                        onPress={() => setSelectedDocForPreview(doc)}
                        style={styles.docActionBtn}
                      >
                        <Text style={styles.docActionText}>Preview Document</Text>
                      </TouchableOpacity>

                      {viewerRole === 'agent' && !isVerified && (
                        <TouchableOpacity
                          testID={`doc-verify-${doc.id}`}
                          activeOpacity={0.7}
                          onPress={() => handleVerifyDocument(doc.id)}
                          style={[styles.docActionBtn, styles.docActionBtnVerify]}
                        >
                          <CheckIcon size={12} color="#047857" />
                          <Text style={[styles.docActionText, { color: '#047857' }]}>
                            Stamp & Verify
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ================= TAB 2: DEEP UNDERWRITING ANALYSIS ================= */}
        {activeTab === 'analysis' && analysis && (
          <View style={styles.sectionContainer}>
            {/* Risk Recommendation Card */}
            <View style={styles.recommendationCard}>
              <View style={styles.recHeaderRow}>
                <View style={styles.recBadge}>
                  <Text style={styles.recBadgeText}>{analysis.riskScore.toUpperCase()}</Text>
                </View>
                <Text style={styles.recScoreLabel}>CIBIL BUREAU RATING</Text>
              </View>

              <Text style={styles.recHeadline}>{analysis.recommendation}</Text>

              <View style={styles.cibilMeterRow}>
                <View style={styles.cibilScoreCircle}>
                  <Text style={styles.cibilScoreNumber}>{analysis.cibilScore}</Text>
                  <Text style={styles.cibilScoreGrade}>{analysis.cibilGrade}</Text>
                </View>
                <View style={styles.cibilAnalysisCol}>
                  <Text style={styles.cibilDetailTitle}>Credit Bureau Assessment</Text>
                  <Text style={styles.cibilDetailText}>
                    Clean delinquency record across past 36 months. 100% on-time repayment history
                    with zero write-offs or suit-filed accounts.
                  </Text>
                </View>
              </View>
            </View>

            {/* Financial Ratios Grid */}
            <View style={styles.ratiosGridCard}>
              <Text style={styles.cardSectionTitle}>Financial & Debt Capacity Ratios</Text>

              <View style={styles.ratioRow}>
                <View style={styles.ratioBox}>
                  <Text style={styles.ratioLabel}>FOIR / DEBT RATIO</Text>
                  <Text style={styles.ratioValue}>{analysis.foirRatio}</Text>
                  <Text style={styles.ratioSub}>Benchmark: &lt; 50%</Text>
                </View>
                <View style={styles.ratioBox}>
                  <Text style={styles.ratioLabel}>MONTHLY INCOME</Text>
                  <Text style={styles.ratioValue}>{analysis.monthlyIncome}</Text>
                  <Text style={styles.ratioSub}>Verified Inflow</Text>
                </View>
              </View>

              <View style={[styles.ratioRow, { marginTop: 8 }]}>
                <View style={styles.ratioBox}>
                  <Text style={styles.ratioLabel}>MONTHLY DEBT</Text>
                  <Text style={styles.ratioValue}>{analysis.monthlyDebtObligation}</Text>
                  <Text style={styles.ratioSub}>Obligations</Text>
                </View>
                <View style={styles.ratioBox}>
                  <Text style={styles.ratioLabel}>AVG BANK BALANCE</Text>
                  <Text style={styles.ratioValue}>{analysis.averageQuarterlyBalance}</Text>
                  <Text style={styles.ratioSub}>Quarterly Inflow</Text>
                </View>
              </View>
            </View>

            {/* 6-Point Compliance Audit Checklist */}
            <View style={styles.checklistCard}>
              <Text style={styles.cardSectionTitle}>6-Point Underwriting Checklist</Text>

              {analysis.auditChecks.map((check) => (
                <View key={check.id} style={styles.checkItemRow}>
                  <View
                    style={[
                      styles.checkDot,
                      check.passed ? styles.checkDotPass : styles.checkDotFail,
                    ]}
                  >
                    {check.passed ? (
                      <CheckIcon size={10} color="#FFFFFF" />
                    ) : (
                      <CrossIcon size={10} color="#FFFFFF" />
                    )}
                  </View>

                  <View style={styles.checkInfoCol}>
                    <Text style={styles.checkItemTitle}>{check.title}</Text>
                    <Text style={styles.checkItemDesc}>{check.notes}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ================= TAB 3: OVERVIEW & AUDIT ================= */}
        {activeTab === 'overview' && (
          <View style={styles.sectionContainer}>
            {/* Rejection Notice (if rejected) */}
            {app.status === 'Rejected' && app.rejectionReason && (
              <View style={styles.rejectionNoticeCard}>
                <View style={styles.rejectionHeader}>
                  <AlertCircleIcon size={16} color="#DC2626" />
                  <Text style={styles.rejectionTitle}>Underwriting Decline Rationale</Text>
                </View>
                <Text style={styles.rejectionText}>{app.rejectionReason}</Text>
              </View>
            )}

            {/* Client Contact & KYC Card */}
            <View style={styles.contactCard}>
              <Text style={styles.cardSectionTitle}>Client Identification & KYC</Text>

              <View style={styles.contactItem}>
                <PhoneIcon size={16} color="#64748B" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.contactLabel}>Mobile Number</Text>
                  <Text style={styles.contactValue}>{app.clientPhone}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <MailIcon size={16} color="#64748B" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.contactLabel}>Email Address</Text>
                  <Text style={styles.contactValue}>{app.clientEmail}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <BuildingIcon size={16} color="#64748B" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.contactLabel}>Servicing Branch</Text>
                  <Text style={styles.contactValue}>
                    {app.agentAssigned?.branch || 'Chandigarh Branch'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Assigned Advisor Card */}
            {app.agentAssigned && (
              <View style={styles.advisorCard}>
                <Text style={styles.cardSectionTitle}>Assigned Underwriting Advisor</Text>
                <View style={styles.advisorInner}>
                  <View style={styles.advisorAvatar}>
                    <Text style={styles.advisorAvatarText}>RS</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.advisorName}>{app.agentAssigned.name}</Text>
                    <Text style={styles.advisorId}>Verification Officer</Text>
                    <Text style={styles.testHidden}>{app.agentAssigned.id}</Text>
                    <Text style={styles.advisorPhone}>{app.agentAssigned.phone}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => themeAlert('Dialing Advisor', `Connecting to ${app.agentAssigned?.phone}`)}
                    style={styles.callAdvisorBtn}
                  >
                    <PhoneIcon size={16} color="#0D0E12" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Audit Notes */}
            {app.notes && (
              <View style={styles.notesCard}>
                <Text style={styles.cardSectionTitle}>Underwriter Audit Remarks</Text>
                <Text style={styles.notesBody}>{app.notes}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      </View>

      {/* ================= FIXED STICKY UNDERWRITING ACTIONS BAR ================= */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {viewerRole === 'agent' ? (
          <View style={styles.agentActionRow}>
            {app.status !== 'Approved' && (
              <AnimatedButton
                title="Sanction & Approve Loan"
                variant="black"
                onPress={handleApproveApplication}
                style={styles.primaryAction}
              />
            )}

            {app.status !== 'Rejected' && (
              <AnimatedButton
                title="Decline"
                variant="outline"
                onPress={handleRejectApplication}
                style={styles.secondaryAction}
                textStyle={{ color: '#DC2626' }}
              />
            )}
          </View>
        ) : (
          <View style={styles.clientActionRow}>
            <AnimatedButton
              title="Download Application Dossier"
              variant="black"
              onPress={() => themeAlert('Exporting Dossier', `Downloading sanction dossier for ${app.id}...`)}
              style={styles.primaryAction}
            />
          </View>
        )}
      </View>

      {/* ================= DOCUMENT PREVIEW MODAL ================= */}
      <Modal
        visible={selectedDocForPreview !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDocForPreview(null)}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewBox}>
            <View style={styles.previewHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewCategory}>DOCUMENT AUDIT PREVIEW</Text>
                <Text style={styles.previewTitle}>{selectedDocForPreview?.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedDocForPreview(null)}
                style={styles.previewClose}
              >
                <CrossIcon size={14} color="#0D0E12" />
              </TouchableOpacity>
            </View>

            {/* Simulated Verified Document Sheet */}
            <View style={styles.previewSheet}>
              <View style={styles.stampBadge}>
                <CheckIcon size={14} color="#047857" />
                <Text style={styles.stampText}>DIGITALLY VERIFIED</Text>
              </View>

              <Text style={styles.previewDocFile}>{selectedDocForPreview?.fileName}</Text>
              <Text style={styles.previewDocSource}>
                Registry: {selectedDocForPreview?.verificationSource || 'Verified by Compliance Desk'}
              </Text>
              <Text style={styles.previewDocDate}>
                Uploaded on {selectedDocForPreview?.uploadDate} • Size {selectedDocForPreview?.fileSize}
              </Text>

              {selectedDocForPreview?.notes && (
                <View style={styles.previewNotesBox}>
                  <Text style={styles.previewNotesText}>
                    Audit Remarks: {selectedDocForPreview.notes}
                  </Text>
                </View>
              )}
            </View>

            <AnimatedButton
              title="Close Preview"
              variant="black"
              onPress={() => setSelectedDocForPreview(null)}
              style={{ width: '100%', marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.topBarBlack,
  },
  blackHeader: {
    backgroundColor: colors.topBarBlack,
    paddingHorizontal: 20,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerSubBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.brandGold,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerMainTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerActionBtnDark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curvedSheetContainer: {
    flex: 1,
    backgroundColor: colors.sheetBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.pill,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E12',
  },
  topCenterTitle: {
    alignItems: 'center',
  },
  topCategory: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  topAppId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D0E12',
  },
  exportBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 12,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EAED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0D0E12',
    borderWidth: 1.5,
    borderColor: colors.brandGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroInfoBlock: {
    flex: 1,
  },
  heroClientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0D0E12',
  },
  heroLoanType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  heroDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
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
  financialStrip: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  finCol: {
    flex: 1,
  },
  finLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  finAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D0E12',
  },
  finValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0D0E12',
  },
  tabsTrack: {
    flexDirection: 'row',
    backgroundColor: '#E8EAED',
    borderRadius: 16,
    padding: 3,
    marginHorizontal: spacing.lg,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#0D0E12',
    fontWeight: '800',
  },
  sectionContainer: {
    paddingHorizontal: spacing.lg,
  },
  docsSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
  },
  docsSummaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  shieldIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docsSummaryTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0D0E12',
  },
  docsSummarySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  docsPercentText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857',
  },
  docProgressBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  docProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  docsList: {
    gap: 10,
  },
  docItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  docTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docFileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  docInfoCol: {
    flex: 1,
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E12',
  },
  docMeta: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  docBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  docBadgeVerified: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  docBadgeReview: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  docBadgeFlagged: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  docBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  docBadgeTextVerified: {
    color: '#047857',
  },
  docBadgeTextReview: {
    color: '#1D4ED8',
  },
  docBadgeTextFlagged: {
    color: '#B91C1C',
  },
  docSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F6',
    gap: 4,
  },
  docSourceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  docSourceText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  docNotesBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 10,
    marginTop: 6,
  },
  docNotesText: {
    fontSize: 11,
    color: '#475569',
  },
  docActionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  docActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 7,
    borderRadius: 12,
    gap: 4,
  },
  docActionBtnVerify: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  docActionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0D0E12',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
  },
  recHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  recBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  recScoreLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  recHeadline: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D0E12',
    marginBottom: 12,
  },
  cibilMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cibilScoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cibilScoreNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0D0E12',
  },
  cibilScoreGrade: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  cibilAnalysisCol: {
    flex: 1,
  },
  cibilDetailTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D0E12',
  },
  cibilDetailText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
  },
  ratiosGridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  ratioRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratioBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ratioLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  ratioValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D0E12',
    marginVertical: 2,
  },
  ratioSub: {
    fontSize: 10,
    color: '#64748B',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 10,
  },
  checkDotPass: {
    backgroundColor: '#10B981',
  },
  checkDotFail: {
    backgroundColor: '#DC2626',
  },
  checkInfoCol: {
    flex: 1,
  },
  checkItemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0D0E12',
  },
  checkItemDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  rejectionNoticeCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
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
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E12',
    marginTop: 1,
  },
  advisorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
  },
  advisorInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  advisorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0D0E12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  advisorAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  advisorName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0D0E12',
  },
  advisorId: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  advisorPhone: {
    fontSize: 11,
    color: '#94A3B8',
  },
  callAdvisorBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
  },
  notesBody: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
  },
  agentActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  clientActionRow: {
    width: '100%',
  },
  primaryAction: {
    flex: 2,
  },
  secondaryAction: {
    flex: 1,
    borderColor: '#DC2626',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  previewBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  previewCategory: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D0E12',
    marginTop: 2,
  },
  previewClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewSheet: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  stampBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
    marginBottom: 12,
  },
  stampText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  previewDocFile: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D0E12',
    textAlign: 'center',
  },
  previewDocSource: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  previewDocDate: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 4,
  },
  previewNotesBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
    width: '100%',
  },
  previewNotesText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  testHidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});
