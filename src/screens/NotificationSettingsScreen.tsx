import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, useAppTheme } from '../theme';
import {
  ChevronLeftIcon,
  BellIcon,
  MailIcon,
  PhoneIcon,
  CheckIcon,
  ShieldIcon,
  ClockIcon,
  MessageSquareIcon,
  FileTextIcon,
  AlertCircleIcon,
  SlidersIcon,
} from '../components/Icons';
import { AnimatedButton } from '../components/AnimatedButton';
import { themeAlert } from '../components/ThemeDialog';

export interface NotificationPreferences {
  applicationStatusUpdates: boolean;
  disbursementNotices: boolean;
  documentVerificationAlerts: boolean;
  underwriterQueries: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  emailDigest: boolean;
  whatsappUpdates: boolean;
  emiReminders: boolean;
  mandateLowBalanceWarning: boolean;
  rateRevisions: boolean;
  frequency: 'instant' | 'daily' | 'priority';
  quietHours: boolean;
}

interface NotificationSettingsScreenProps {
  userRole?: 'agent' | 'client';
  initialPreferences?: Partial<NotificationPreferences>;
  onBack: () => void;
  onSavePreferences?: (preferences: NotificationPreferences) => void;
}

export const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({
  userRole = 'client',
  initialPreferences,
  onBack,
  onSavePreferences,
}) => {
  const insets = useSafeAreaInsets();
  const { colors: themeColors, isDark } = useAppTheme();
  const isAgent = userRole === 'agent';

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handleBackPress = () => {
      onBack();
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [onBack]);

  // Section 1: Loan & Underwriting Alerts
  const [applicationStatusUpdates, setApplicationStatusUpdates] = useState(
    initialPreferences?.applicationStatusUpdates ?? true
  );
  const [disbursementNotices, setDisbursementNotices] = useState(
    initialPreferences?.disbursementNotices ?? true
  );
  const [documentVerificationAlerts, setDocumentVerificationAlerts] = useState(
    initialPreferences?.documentVerificationAlerts ?? true
  );
  const [underwriterQueries, setUnderwriterQueries] = useState(
    initialPreferences?.underwriterQueries ?? true
  );

  // Section 2: Delivery Channels
  const [pushNotifications, setPushNotifications] = useState(
    initialPreferences?.pushNotifications ?? true
  );
  const [smsAlerts, setSmsAlerts] = useState(
    initialPreferences?.smsAlerts ?? true
  );
  const [emailDigest, setEmailDigest] = useState(
    initialPreferences?.emailDigest ?? true
  );
  const [whatsappUpdates, setWhatsappUpdates] = useState(
    initialPreferences?.whatsappUpdates ?? false
  );

  // Section 3: Repayment & Policy Alerts
  const [emiReminders, setEmiReminders] = useState(
    initialPreferences?.emiReminders ?? true
  );
  const [mandateLowBalanceWarning, setMandateLowBalanceWarning] = useState(
    initialPreferences?.mandateLowBalanceWarning ?? true
  );
  const [rateRevisions, setRateRevisions] = useState(
    initialPreferences?.rateRevisions ?? false
  );

  // Section 4: Frequency & Quiet Hours
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'priority'>(
    initialPreferences?.frequency ?? 'instant'
  );
  const [quietHours, setQuietHours] = useState(
    initialPreferences?.quietHours ?? true
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    const updatedPreferences: NotificationPreferences = {
      applicationStatusUpdates,
      disbursementNotices,
      documentVerificationAlerts,
      underwriterQueries,
      pushNotifications,
      smsAlerts,
      emailDigest,
      whatsappUpdates,
      emiReminders,
      mandateLowBalanceWarning,
      rateRevisions,
      frequency,
      quietHours,
    };

    setTimeout(() => {
      setIsSaving(false);
      if (onSavePreferences) {
        onSavePreferences(updatedPreferences);
      }
      themeAlert(
        'Preferences Updated',
        'Your notification & alert settings have been synchronized with Ridhi Ratnam Associates dispatch servers.'
      );
    }, 400);
  };

  const handleResetToDefault = () => {
    themeAlert(
      'Reset Preferences',
      'Are you sure you want to restore recommended regulatory alert settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Default',
          onPress: () => {
            setApplicationStatusUpdates(true);
            setDisbursementNotices(true);
            setDocumentVerificationAlerts(true);
            setUnderwriterQueries(true);
            setPushNotifications(true);
            setSmsAlerts(true);
            setEmailDigest(true);
            setWhatsappUpdates(false);
            setEmiReminders(true);
            setMandateLowBalanceWarning(true);
            setRateRevisions(false);
            setFrequency('instant');
            setQuietHours(true);
            themeAlert('Restored', 'Recommended communication settings restored.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ================= 1. BLACK TOP HEADER (Standard Design) ================= */}
      <View style={[styles.blackHeader, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.headerBackBtn}
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerSubBadge}>COMMUNICATION PREFERENCES</Text>
          <Text style={styles.headerMainTitle}>Notification Settings</Text>
        </View>

        <TouchableOpacity
          testID="btn-reset-notifications"
          activeOpacity={0.7}
          onPress={handleResetToDefault}
          style={styles.headerResetBtn}
          accessibilityLabel="Reset to default settings"
        >
          <SlidersIcon size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ================= 2. CURVED CONTENT SHEET ================= */}
      <View
        style={[
          styles.curvedSheetContainer,
          { backgroundColor: themeColors.sheetBackground },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          ]}
        >
          {/* Summary Banner Card */}
          <View
            style={[
              styles.summaryBannerCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <View style={styles.summaryIconBox}>
              <BellIcon size={20} color={colors.brandGold} />
            </View>
            <View style={styles.summaryTextCol}>
              <Text style={[styles.summaryTitle, { color: themeColors.textPrimary }]}>
                {isAgent ? 'Institutional Underwriting Alerts' : 'Real-Time Facility Updates'}
              </Text>
              <Text style={[styles.summaryDesc, { color: themeColors.textSecondary }]}>
                Configure automated dispatch alerts for credit appraisals, disbursement RTGS, and NACH repayment schedules.
              </Text>
            </View>
          </View>

          {/* ================= SECTION 1: LOAN & UNDERWRITING ALERTS ================= */}
          <Text style={[styles.sectionHeaderTitle, { color: themeColors.textSecondary }]}>
            LOAN & UNDERWRITING ALERTS
          </Text>
          <View
            style={[
              styles.groupedSectionCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            {/* 1.1 Status Milestones */}
            <View style={styles.settingItemRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#0284C7' }]}>
                <ClockIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  Application Status Milestones
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Immediate alerts when credit dossier undergoes stage changes
                </Text>
              </View>
              <Switch
                testID="switch-app-status-alerts"
                value={applicationStatusUpdates}
                onValueChange={setApplicationStatusUpdates}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* 1.2 Disbursement Notices */}
            <View style={styles.settingItemRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#047857' }]}>
                <CheckIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  Disbursement & Sanction Notices
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  High-priority RTGS escrow transfers and sanction letter generation
                </Text>
              </View>
              <Switch
                testID="switch-disbursement-notices"
                value={disbursementNotices}
                onValueChange={setDisbursementNotices}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* 1.3 Document Verification */}
            <View style={styles.settingItemRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#CDA148' }]}>
                <FileTextIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  Document Verification Alerts
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Automated OCR checks for PAN, Aadhaar e-KYC, and GSTN
                </Text>
              </View>
              <Switch
                testID="switch-doc-verification-alerts"
                value={documentVerificationAlerts}
                onValueChange={setDocumentVerificationAlerts}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* 1.4 Advisor Queries */}
            <View style={[styles.settingItemRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.iconBadge, { backgroundColor: '#8B5CF6' }]}>
                <MessageSquareIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  {isAgent ? 'Applicant Communications' : 'Advisor Queries & Notes'}
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Direct communications regarding financial dossier clarifications
                </Text>
              </View>
              <Switch
                testID="switch-advisor-queries"
                value={underwriterQueries}
                onValueChange={setUnderwriterQueries}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* ================= SECTION 2: DELIVERY CHANNELS ================= */}
          <Text style={[styles.sectionHeaderTitle, { color: themeColors.textSecondary }]}>
            DISPATCH CHANNELS
          </Text>
          <View
            style={[
              styles.groupedSectionCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            {/* 2.1 Push Notifications */}
            <View style={styles.settingItemRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#0D0E12' }]}>
                <BellIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  Mobile Push Notifications
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Instant pop-up alerts on your device lock screen
                </Text>
              </View>
              <Switch
                testID="switch-push-channel"
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* 2.2 SMS Alerts */}
            <View style={styles.settingItemRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#B45309' }]}>
                <PhoneIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  SMS Transactional Alerts
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Mandatory OTPs and facility sanction confirmations
                </Text>
              </View>
              <Switch
                testID="switch-sms-channel"
                value={smsAlerts}
                onValueChange={setSmsAlerts}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* 2.3 Email Digest */}
            <View style={styles.settingItemRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#0D9488' }]}>
                <MailIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  Email Underwriting Digest
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Comprehensive weekly activity log and tax invoice statements
                </Text>
              </View>
              <Switch
                testID="switch-email-channel"
                value={emailDigest}
                onValueChange={setEmailDigest}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* 2.4 WhatsApp Corporate Updates */}
            <View style={[styles.settingItemRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.iconBadge, { backgroundColor: '#10B981' }]}>
                <MessageSquareIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  WhatsApp Concierge Dispatch
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Direct updates via verified Ridhi Ratnam green badge account
                </Text>
              </View>
              <Switch
                testID="switch-whatsapp-channel"
                value={whatsappUpdates}
                onValueChange={setWhatsappUpdates}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* ================= SECTION 3: REPAYMENT & COMPLIANCE ================= */}
          <Text style={[styles.sectionHeaderTitle, { color: themeColors.textSecondary }]}>
            REPAYMENT & COMPLIANCE REMINDERS
          </Text>
          <View
            style={[
              styles.groupedSectionCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            {/* 3.1 EMI Reminders */}
            <View style={styles.settingItemRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#D97706' }]}>
                <ClockIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  EMI Due Date Reminders
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Alerts 3 days and 1 day prior to monthly NACH debit date
                </Text>
              </View>
              <Switch
                testID="switch-emi-reminders"
                value={emiReminders}
                onValueChange={setEmiReminders}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* 3.2 Low Balance Alert */}
            <View style={styles.settingItemRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#DC2626' }]}>
                <AlertCircleIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  Mandate Balance Warnings
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Proactive warning to prevent bank return bounce penalties
                </Text>
              </View>
              <Switch
                testID="switch-low-balance-warnings"
                value={mandateLowBalanceWarning}
                onValueChange={setMandateLowBalanceWarning}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* 3.3 Interest Rate Updates */}
            <View style={[styles.settingItemRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.iconBadge, { backgroundColor: '#6366F1' }]}>
                <ShieldIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  Rate Concessions & Policy Shifts
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  RBI repo rate adjustments and prime borrower discount notices
                </Text>
              </View>
              <Switch
                testID="switch-rate-revisions"
                value={rateRevisions}
                onValueChange={setRateRevisions}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* ================= SECTION 4: FREQUENCY & QUIET HOURS ================= */}
          <Text style={[styles.sectionHeaderTitle, { color: themeColors.textSecondary }]}>
            DISPATCH CADENCE & QUIET HOURS
          </Text>
          <View
            style={[
              styles.groupedSectionCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            {/* Frequency Selector */}
            <View style={styles.frequencyContainer}>
              <Text style={[styles.settingTitle, { color: themeColors.textPrimary, marginBottom: 8 }]}>
                Alert Delivery Frequency
              </Text>
              <View style={styles.frequencyRow}>
                {(
                  [
                    { key: 'instant', label: 'Instant' },
                    { key: 'daily', label: 'Daily Digest' },
                    { key: 'priority', label: 'Priority Only' },
                  ] as const
                ).map((opt) => {
                  const isSelected = frequency === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      testID={`frequency-btn-${opt.key}`}
                      activeOpacity={0.75}
                      onPress={() => setFrequency(opt.key)}
                      style={[
                        styles.frequencyChip,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? colors.brandGold
                              : colors.topBarBlack
                            : isDark
                            ? themeColors.cardSecondary
                            : '#F1F5F9',
                          borderColor: isSelected
                            ? colors.brandGold
                            : themeColors.cardBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyChipText,
                          {
                            color: isSelected
                              ? isDark
                                ? '#012655'
                                : '#FFFFFF'
                              : themeColors.textSecondary,
                            fontWeight: isSelected ? '800' : '600',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[styles.itemDivider, { backgroundColor: themeColors.cardBorder }]} />

            {/* Quiet Hours */}
            <View style={[styles.settingItemRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.iconBadge, { backgroundColor: '#64748B' }]}>
                <ClockIcon size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>
                  Quiet Hours (10 PM – 8 AM)
                </Text>
                <Text style={[styles.settingSub, { color: themeColors.textSecondary }]}>
                  Hold non-urgent reminders during off-market hours
                </Text>
              </View>
              <Switch
                testID="switch-quiet-hours"
                value={quietHours}
                onValueChange={setQuietHours}
                trackColor={{ false: isDark ? '#323846' : '#CBD5E1', true: colors.brandGold }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Action Button: Save Preferences */}
          <AnimatedButton
            testID="btn-save-notification-settings"
            title={isSaving ? 'Synchronizing...' : 'Save Preferences'}
            variant="black"
            loading={isSaving}
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.topBarBlack,
  },

  // Header
  blackHeader: {
    backgroundColor: colors.topBarBlack,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.brandGold,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerResetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Curved Sheet
  curvedSheetContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Summary Banner
  summaryBannerCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  summaryIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FEF8E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryTextCol: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  summaryDesc: {
    fontSize: 12,
    lineHeight: 16,
  },

  // Section Headers & Grouped Cards
  sectionHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  groupedSectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 15,
  },
  itemDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
  },

  // Frequency
  frequencyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyChipText: {
    fontSize: 12,
  },

  saveBtn: {
    width: '100%',
    marginTop: 24,
  },
});

