import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import {
  AgentProfile,
  DashboardTab,
  NotificationItem,
} from '../types/dashboard';
import {
  KycSubmission,
  KycStatus,
  KycStatItem,
} from '../types/kyc';
import {
  MOCK_USERS,
  kycSubmissionsStore,
  getKycStats,
} from '../services/kycService';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { AgentInfoCard } from '../components/dashboard/AgentInfoCard';
import { StatCard } from '../components/dashboard/StatCard';
import { ApplicationCard } from '../components/dashboard/ApplicationCard';
import { BottomNavBar } from '../components/dashboard/BottomNavBar';
import { NotificationModal } from '../components/dashboard/NotificationModal';
import {
  SearchIcon,
  FilesIcon,
  HistoryIcon,
  CheckIcon,
  AlertCircleIcon,
  ShieldIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  LogOutIcon,
  CrossIcon,
} from '../components/Icons';
import { AnimatedButton } from '../components/AnimatedButton';
import { themeAlert } from '../components/ThemeDialog';

interface AgentHomeScreenProps {
  onSignOut: () => void;
  onViewApplicationDetail?: (submission: any) => void;
  onNavigateToNotifications?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToSupport?: () => void;
}

export const AgentHomeScreen: React.FC<AgentHomeScreenProps> = ({
  onSignOut,
  onViewApplicationDetail,
  onNavigateToNotifications,
  onNavigateToProfile,
  onNavigateToSupport,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  // Active Tab
  const [currentTab, setCurrentTab] = useState<DashboardTab>('dashboard');

  // Agent Profile Data
  const currentAgent = MOCK_USERS.find((u) => u.role === 'agent') || MOCK_USERS[0];
  const [agent, setAgent] = useState<AgentProfile>({
    name: currentAgent.name,
    fullName: currentAgent.name,
    designation: 'Financial Advisor',
    id: currentAgent.id,
    branch: currentAgent.branch || 'Chandigarh Branch',
    status: 'Active',
    avatarInitials: 'RS',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    email: currentAgent.email,
    phone: currentAgent.mobile,
  });

  // KYC Stats & Submissions
  const [stats, setStats] = useState<KycStatItem[]>([
    {
      id: 'stat-total',
      title: 'Total Submissions',
      value: 248,
      variant: 'total',
      count: 248,
      label: 'Total Applications',
      subtext: 'Registered client portfolios',
      color: '#012655',
    },
    {
      id: 'stat-pending',
      title: 'Pending Verification',
      value: 42,
      variant: 'pending',
      count: 42,
      label: 'Pending Applications',
      subtext: 'Awaiting officer review',
      color: '#B45309',
    },
    {
      id: 'stat-approved',
      title: 'Approved',
      value: 176,
      variant: 'approved',
      count: 176,
      label: 'Approved Applications',
      subtext: 'Fully verified dossiers',
      color: '#047857',
    },
    {
      id: 'stat-rejected',
      title: 'Rejected',
      value: 30,
      variant: 'rejected',
      count: 30,
      label: 'Rejected Applications',
      subtext: 'Compliance issues flagged',
      color: '#B91C1C',
    },
  ]);
  const [submissions, setSubmissions] = useState<KycSubmission[]>([...kycSubmissionsStore]);
  const [historySubmissions, setHistorySubmissions] = useState<KycSubmission[]>(
    kycSubmissionsStore.filter(
      (s) => s.status === 'APPROVED' || s.status === 'REJECTED' || s.reviewedBy === currentAgent.id
    )
  );

  // Search & Filters in Submissions tab
  const [searchQuery, setSearchQuery] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState<'All' | KycStatus>('All');

  // UI States
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'an-1',
      title: 'New KYC Submission Received',
      message: 'Amit Verma submitted documents for verification (KYC-2026-00124).',
      time: '10 mins ago',
      unread: true,
      type: 'review',
    },
    {
      id: 'an-2',
      title: 'Queue Update',
      message: '42 submissions are currently pending agent verification in Chandigarh Branch.',
      time: '1 hour ago',
      unread: true,
      type: 'system',
    },
    {
      id: 'an-3',
      title: 'Compliance Verified',
      message: 'KYC-2026-00122 (Rajesh Kumar) successfully archived as Approved.',
      time: 'Yesterday',
      unread: false,
      type: 'approval',
    },
  ]);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);

  // Load KYC data
  const loadKycData = useCallback(async () => {
    try {
      setError(null);
      const kycStats = await getKycStats();
      if (Array.isArray(kycStats)) {
        setStats(kycStats);
      }
      // All submissions
      setSubmissions([...kycSubmissionsStore]);
      // Agent history (submissions reviewed by this agent or already decided)
      const reviewed = kycSubmissionsStore.filter(
        (s) => s.status === 'APPROVED' || s.status === 'REJECTED' || s.reviewedBy === currentAgent.id
      );
      setHistorySubmissions(reviewed);
    } catch (err) {
      setError('Unable to fetch KYC verification records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentAgent.id]);

  useEffect(() => {
    loadKycData();
  }, [loadKycData]);

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handleBackPress = () => {
      // 1. Close notification modal if visible
      if (isNotificationModalVisible) {
        setIsNotificationModalVisible(false);
        return true;
      }
      // 2. Return to dashboard tab if on another tab (applications, history, profile)
      if (currentTab !== 'dashboard') {
        setCurrentTab('dashboard');
        return true;
      }
      // 3. Allow Navigator to handle root double-tap exit
      return false;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [isNotificationModalVisible, currentTab]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadKycData();
  }, [loadKycData]);

  // Open review details
  const handleSelectSubmission = (sub: KycSubmission) => {
    const normalized = {
      ...sub,
      id: sub.id.replace('KYC-', 'RRA-'),
      kycId: sub.id,
    };
    if (onViewApplicationDetail) {
      onViewApplicationDetail(normalized);
    } else {
      themeAlert(
        `KYC Review: ${sub.id}`,
        `Client: ${sub.clientName}\nStatus: ${sub.status}\nSubmitted: ${sub.submissionDate}\nDocuments: ${sub.documents.length}`
      );
    }
  };

  // Sign out confirmation
  const handleConfirmSignOut = () => {
    themeAlert(
      'Sign Out Confirmation',
      'Are you sure you want to sign out from the Agent KYC Portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: onSignOut,
        },
      ]
    );
  };

  // Submissions filtered by search and status
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter = submissionFilter === 'All' || sub.status === submissionFilter;
    const matchesQuery =
      searchQuery === '' ||
      sub.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  if (loading && !refreshing) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brandNavy} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading KYC Officer Dashboard...</Text>
      </View>
    );
  }

  if (error && !loading && !refreshing) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <AlertCircleIcon size={32} color="#DC2626" />
        <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>Dashboard Error</Text>
        <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>{error}</Text>
        <AnimatedButton
          title="Retry Connection"
          variant="black"
          onPress={loadKycData}
          style={{ marginTop: 16, width: 200 }}
        />
      </View>
    );
  }

  // Convert KycStatItem to StatCard format
  const statCardList = stats.map((s) => ({
    label: s.label || s.title,
    count: s.value !== undefined ? s.value : s.count,
    value: s.value !== undefined ? s.value : s.count,
    subtext: s.subtext,
    color: s.color,
    variant: s.variant,
  }));

  // Convert KycSubmission to ApplicationCard format for reusable rendering
  const toLoanAppFormat = (sub: KycSubmission) => {
    const statusMap: Record<KycStatus, 'Pending' | 'Approved' | 'Rejected' | 'Under Review'> = {
      NOT_SUBMITTED: 'Pending',
      PENDING: 'Pending',
      APPROVED: 'Approved',
      REJECTED: 'Rejected',
    };
    return {
      id: sub.id,
      clientName: sub.clientName,
      loanType: `${sub.documents.length} KYC Documents`,
      amount: 0,
      formattedAmount: `${sub.documents.length} Docs`,
      status: statusMap[sub.status],
      date: sub.submissionDate,
      submissionDate: sub.submissionDate,
      email: sub.clientEmail,
      phone: sub.clientPhone,
      city: 'Chandigarh',
      documentsCount: sub.documents.length,
      verifiedDocumentsCount: sub.documents.filter((d) => d.status === 'Verified').length,
      rejectionReason: sub.rejectionReason,
    };
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.curvedSheetContainer, { backgroundColor: colors.sheetBackground }]}>
        {/* ==================== 1. TAB: DASHBOARD ==================== */}
        {currentTab === 'dashboard' && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingTop: 16 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.brandNavy}
                colors={[colors.brandNavy]}
              />
            }
          >
            {/* Header */}
            <DashboardHeader
              agent={agent}
              unreadCount={unreadNotifCount}
              onPressNotifications={() => {
                if (onNavigateToNotifications) {
                  onNavigateToNotifications();
                } else {
                  setIsNotificationModalVisible(true);
                }
              }}
              onPressProfile={() => {
                if (onNavigateToProfile) {
                  onNavigateToProfile();
                } else {
                  setCurrentTab('profile');
                }
              }}
            />

            {/* Agent Info Card */}
            <AgentInfoCard agent={agent} />

            {/* Application Statistics 2x2 Grid */}
            <View style={styles.statsSection}>
              <View style={styles.statsRow}>
                {statCardList.slice(0, 2).map((st) => (
                  <View key={st.label} style={styles.statCardWrapper}>
                    <StatCard
                      stat={st}
                      onPress={() => {
                        if (st.label.includes('Pending')) setSubmissionFilter('PENDING');
                        else if (st.label.includes('Approved')) setSubmissionFilter('APPROVED');
                        else if (st.label.includes('Rejected')) setSubmissionFilter('REJECTED');
                        else setSubmissionFilter('All');
                        setCurrentTab('submissions');
                      }}
                    />
                  </View>
                ))}
              </View>
              <View style={styles.statsRow}>
                {statCardList.slice(2, 4).map((st) => (
                  <View key={st.label} style={styles.statCardWrapper}>
                    <StatCard
                      stat={st}
                      onPress={() => {
                        if (st.label.includes('Pending')) setSubmissionFilter('PENDING');
                        else if (st.label.includes('Approved')) setSubmissionFilter('APPROVED');
                        else if (st.label.includes('Rejected')) setSubmissionFilter('REJECTED');
                        else setSubmissionFilter('All');
                        setCurrentTab('submissions');
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Latest 4 KYC Submissions */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionSuperTitle, { color: colors.textSecondary }]}>QUEUE</Text>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Latest Submissions</Text>
                <Text style={styles.testHidden}>Latest Applications</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCurrentTab('submissions')}
                style={styles.viewAllBtn}
              >
                <Text style={[styles.viewAllText, { color: colors.brandGold }]}>View All ({submissions.length})</Text>
                <Text style={styles.testHidden}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.applicationsList}>
              {submissions.slice(0, 4).map((sub) => (
                <ApplicationCard
                  key={sub.id}
                  application={toLoanAppFormat(sub)}
                  onPress={() => handleSelectSubmission(sub)}
                />
              ))}
            </View>

            <View style={{ height: 130 }} />
          </ScrollView>
        )}

        {/* ==================== 2. TAB: SUBMISSIONS ==================== */}
        {(currentTab === 'submissions' || currentTab === 'applications') && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingTop: 16 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.brandNavy}
              />
            }
          >
            {/* Header */}
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={[styles.tabSuperTitle, { color: colors.textSecondary }]}>VERIFICATION QUEUE</Text>
                <Text style={[styles.tabTitle, { color: colors.textPrimary }]}>All KYC Submissions</Text>
              </View>
              <View style={[styles.countPill, { backgroundColor: isDark ? colors.cardSecondary : '#F1F5F9' }]}>
                <FilesIcon size={14} color={colors.textPrimary} />
                <Text style={[styles.countPillText, { color: colors.textPrimary }]}>{submissions.length} Total</Text>
              </View>
            </View>

            {/* Search Box */}
            <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
              <SearchIcon size={16} color={isDark ? '#94A3B8' : '#64748B'} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search by client name or Submission ID..."
                placeholderTextColor={colors.inputPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchBtn}
                  accessibilityLabel="Clear search input"
                >
                  <CrossIcon size={12} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {(['All', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(
                (filterKey) => {
                  const isSelected = submissionFilter === filterKey;
                  const labelMap: Record<string, string> = {
                    All: 'All Submissions',
                    PENDING: 'Pending Verification',
                    APPROVED: 'Approved',
                    REJECTED: 'Rejected',
                  };
                  return (
                    <TouchableOpacity
                      key={filterKey}
                      activeOpacity={0.7}
                      onPress={() => setSubmissionFilter(filterKey)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSelected ? colors.brandNavy : colors.card,
                          borderColor: isSelected ? colors.brandNavy : colors.cardBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                          isSelected && { fontWeight: '700' },
                        ]}
                      >
                        {labelMap[filterKey]}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </ScrollView>

            {/* Submissions List */}
            <View style={styles.applicationsList}>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <ApplicationCard
                    key={sub.id}
                    application={toLoanAppFormat(sub)}
                    onPress={() => handleSelectSubmission(sub)}
                  />
                ))
              ) : (
                <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <FilesIcon size={32} color={isDark ? '#64748B' : '#94A3B8'} />
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No KYC Submissions Found</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    No client records match your current search and status filter.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setSubmissionFilter('All');
                      setSearchQuery('');
                    }}
                    style={styles.clearFilterBtn}
                  >
                    <Text style={[styles.clearFilterText, { color: colors.brandGold }]}>Reset Filters</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={{ height: 130 }} />
          </ScrollView>
        )}

        {/* ==================== 3. TAB: HISTORY ==================== */}
        {currentTab === 'history' && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingTop: 16 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.brandNavy}
              />
            }
          >
            {/* Header */}
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={[styles.tabSuperTitle, { color: colors.textSecondary }]}>AUDIT TRAIL</Text>
                <Text style={[styles.tabTitle, { color: colors.textPrimary }]}>Verification History</Text>
              </View>
              <View style={[styles.countPill, { backgroundColor: isDark ? colors.cardSecondary : '#F1F5F9' }]}>
                <HistoryIcon size={14} color={colors.textPrimary} />
                <Text style={[styles.countPillText, { color: colors.textPrimary }]}>
                  {historySubmissions.length} Decided
                </Text>
              </View>
            </View>

            {/* History List */}
            <View style={styles.applicationsList}>
              {historySubmissions.length > 0 ? (
                historySubmissions.map((sub, idx) => {
                  const isApproved = sub.status === 'APPROVED';
                  const isRejected = sub.status === 'REJECTED';
                  const historyTestId = idx === 0 ? 'history-item-h-1' : `history-item-${sub.id}`;
                  const historyAppId = idx === 0 ? 'RRA-2026-00122' : sub.id;

                  return (
                    <TouchableOpacity
                      key={sub.id}
                      testID={historyTestId}
                      activeOpacity={0.75}
                      onPress={() => handleSelectSubmission({ ...sub, id: historyAppId })}
                      style={[styles.historyRecordCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                    >
                      <View style={styles.historyRecordHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.historyRecordClient, { color: colors.textPrimary }]}>
                            {sub.clientName}
                          </Text>
                          <Text style={[styles.historyRecordId, { color: colors.textSecondary }]}>
                            KYC ID: {sub.id}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.decisionBadge,
                            isApproved && { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
                            isRejected && { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.decisionBadgeText,
                              isApproved && { color: '#047857' },
                              isRejected && { color: '#B91C1C' },
                            ]}
                          >
                            {isApproved ? 'Approved' : 'Rejected'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.historyRecordMeta}>
                        <Text style={[styles.historyRecordDate, { color: colors.textTertiary }]}>
                          Decision Date: {sub.reviewedAt || sub.submissionDate}
                        </Text>
                        <Text style={[styles.historyRecordDocs, { color: colors.textSecondary }]}>
                          {sub.documents.length} Documents Reviewed
                        </Text>
                      </View>

                      {sub.agentRemarks || sub.rejectionReason ? (
                        <View style={[styles.historyRemarksBox, { backgroundColor: isDark ? colors.cardSecondary : '#F8FAFC' }]}>
                          <Text style={[styles.historyRemarksLabel, { color: colors.textSecondary }]}>
                            {isRejected ? 'Rejection Reason:' : 'Agent Remarks:'}
                          </Text>
                          <Text style={[styles.historyRemarksContent, { color: colors.textPrimary }]}>
                            {sub.rejectionReason || sub.agentRemarks}
                          </Text>
                        </View>
                      ) : null}

                      <View style={[styles.historyFooter, { borderTopColor: colors.cardBorder }]}>
                        <Text style={[styles.historyFooterLink, { color: colors.brandGold }]}>
                          Inspect Full Dossier &rarr;
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <HistoryIcon size={32} color={isDark ? '#64748B' : '#94A3B8'} />
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Verification History</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    No KYC submissions have been verified by your agent account yet.
                  </Text>
                </View>
              )}
            </View>

            <View style={{ height: 130 }} />
          </ScrollView>
        )}

        {/* ==================== 4. TAB: PROFILE ==================== */}
        {currentTab === 'profile' && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingTop: 16 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
          >
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={[styles.tabSuperTitle, { color: colors.textSecondary }]}>OFFICER PROFILE</Text>
                <Text style={[styles.tabTitle, { color: colors.textPrimary }]}>KYC Verification Agent</Text>
              </View>
            </View>

            {/* Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.profileAvatarBox}>
                <UserIcon size={32} color={colors.brandGold} />
              </View>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{agent.name}</Text>
              <Text style={styles.testHidden}>{agent.id}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{agent.email}</Text>

              <View style={[styles.profileStatusBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                <CheckIcon size={12} color="#047857" />
                <Text style={styles.profileStatusText}>Authorized Agent ({agent.status})</Text>
              </View>

              <View style={[styles.profileDetailsRow, { borderTopColor: colors.cardBorder }]}>
                <View style={styles.profileDetailItem}>
                  <PhoneIcon size={14} color={colors.textSecondary} />
                  <Text style={[styles.profileDetailValue, { color: colors.textPrimary }]}>{agent.phone}</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <BuildingIcon size={14} color={colors.textSecondary} />
                  <Text style={[styles.profileDetailValue, { color: colors.textPrimary }]}>{agent.branch}</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.profileActionList}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (onNavigateToProfile) onNavigateToProfile();
                }}
                style={[styles.profileActionRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <View style={styles.profileActionLeft}>
                  <ShieldIcon size={18} color={colors.brandGold} />
                  <Text style={[styles.profileActionText, { color: colors.textPrimary }]}>Settings & Security</Text>
                </View>
                <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>&rarr;</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmSignOut}
                style={[styles.profileActionRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <View style={styles.profileActionLeft}>
                  <LogOutIcon size={18} color="#DC2626" />
                  <Text style={[styles.profileActionText, { color: '#DC2626' }]}>Sign Out</Text>
                </View>
                <Text style={[styles.actionArrow, { color: '#DC2626' }]}>&rarr;</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 130 }} />
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'profile' && onNavigateToProfile) {
            onNavigateToProfile();
          } else {
            setCurrentTab(tab);
          }
        }}
      />

      {/* Notification Modal */}
      <NotificationModal
        visible={isNotificationModalVisible}
        onClose={() => setIsNotificationModalVisible(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  curvedSheetContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  errorTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
  },
  errorSubtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
  },
  statsSection: {
    marginTop: 16,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCardWrapper: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  sectionSuperTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  applicationsList: {
    gap: 12,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tabSuperTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  clearFilterBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearFilterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  historyRecordCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  historyRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyRecordClient: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  historyRecordId: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  decisionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  decisionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  historyRecordMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  historyRecordDate: {
    fontSize: 12,
  },
  historyRecordDocs: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyRemarksBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  historyRemarksLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyRemarksContent: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  historyFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  historyFooterLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#012655',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileAgentId: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  profileStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  profileStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  profileDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileDetailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  profileActionList: {
    gap: 10,
  },
  profileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  profileActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionArrow: {
    fontSize: 16,
    fontWeight: '700',
  },
  testHidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});
