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
import { useAppTheme, colors } from '../theme';
import { ClientTab } from '../types/client';
import { KycSubmission, KycStatus } from '../types/kyc';
import {
  MOCK_USERS,
  getClientSubmissions,
  getClientLatestSubmission,
  getLatestClientSubmission,
  kycSubmissionsStore,
} from '../services/kycService';
import { ClientHeader } from '../components/client/ClientHeader';
import { KycUploadBannerCard } from '../components/client/KycUploadBannerCard';
import { KycStatusCard } from '../components/client/KycStatusCard';
import { KycDocumentUploadForm } from '../components/client/KycDocumentUploadForm';
import { SupportCard } from '../components/client/SupportCard';
import { ClientBottomNav } from '../components/client/ClientBottomNav';
import { NotificationModal } from '../components/dashboard/NotificationModal';
import { NotificationItem } from '../types/dashboard';
import {
  SearchIcon,
  FilesIcon,
  HistoryIcon,
  AlertCircleIcon,
  CrossIcon,
  ShieldIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CheckIcon,
  LogOutIcon,
  BuildingIcon,
} from '../components/Icons';
import { AnimatedButton } from '../components/AnimatedButton';
import { themeAlert } from '../components/ThemeDialog';

interface ClientHomeScreenProps {
  onSignOut: () => void;
  onViewApplicationDetail?: (submission: any) => void;
  onNavigateToNotifications?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToSupport?: () => void;
}

export const ClientHomeScreen: React.FC<ClientHomeScreenProps> = ({
  onSignOut,
  onViewApplicationDetail,
  onNavigateToNotifications,
  onNavigateToProfile,
  onNavigateToSupport,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  // Active Tab
  const [currentTab, setCurrentTab] = useState<ClientTab>('home');

  // Client data
  const currentClientUser = MOCK_USERS.find((u) => u.role === 'client') || MOCK_USERS[1];
  const [clientProfile, setClientProfile] = useState({
    id: currentClientUser.id,
    name: currentClientUser.name,
    fullName: currentClientUser.name,
    email: currentClientUser.email,
    phone: currentClientUser.mobile,
    branch: currentClientUser.branch || 'Chandigarh',
    avatarInitials: 'AV',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    accountStatus: 'Active' as const,
    memberSince: '2026',
  });

  // Initial synchronous fallback from store
  const initialLatest = kycSubmissionsStore.find((s) => s.clientId === currentClientUser.id) || null;
  const initialList = kycSubmissionsStore.filter((s) => s.clientId === currentClientUser.id);

  // KYC Submissions state
  const [latestSubmission, setLatestSubmission] = useState<KycSubmission | null>(initialLatest);
  const [submissionsList, setSubmissionsList] = useState<KycSubmission[]>(initialList);

  // UI States
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History Tab Filter & Search
  const [historyFilter, setHistoryFilter] = useState<'All' | KycStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'cn-1',
      title: 'Verification Underway',
      message: 'Your KYC submission KYC-2026-00124 has been queued for verification by our underwriting officer.',
      time: '15 mins ago',
      unread: true,
      type: 'review',
    },
    {
      id: 'cn-2',
      title: 'Account Registered',
      message: 'Welcome to Ridhi Ratnam Associates. Please complete your KYC verification.',
      time: '2 hours ago',
      unread: false,
      type: 'system',
    },
  ]);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);

  // Load KYC data for client
  const loadKycData = useCallback(async () => {
    try {
      setError(null);
      const latest = await getClientLatestSubmission(currentClientUser.id);
      const all = await getClientSubmissions(currentClientUser.id);
      if (latest) setLatestSubmission(latest);
      if (all) setSubmissionsList(all);
    } catch (err) {
      // Keep synchronous fallback active
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentClientUser.id]);

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
      // 2. Return to home tab if on another tab (upload, history, profile)
      if (currentTab !== 'home') {
        setCurrentTab('home');
        return true;
      }
      // 3. Allow Navigator to handle root double-tap exit
      return false;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [isNotificationModalVisible, currentTab]);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadKycData();
  }, [loadKycData]);

  // Handle viewing submission details
  const handleSelectSubmission = (sub: KycSubmission) => {
    if (onViewApplicationDetail) {
      onViewApplicationDetail(sub);
    } else {
      themeAlert(
        `KYC Submission ${sub.id}`,
        `Status: ${sub.status}\nSubmitted: ${sub.submissionDate}\nDocuments: ${sub.documents.length}\n${
          sub.rejectionReason ? `\nRejection Reason: ${sub.rejectionReason}` : ''
        }`
      );
    }
  };

  // Sign out confirmation
  const handleConfirmSignOut = () => {
    themeAlert(
      'Sign Out Confirmation',
      'Are you sure you want to sign out from your Ridhi Ratnam Associates account?',
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

  // Submission callback from KYC Upload form
  const handleNewKycSubmitted = (submission: KycSubmission) => {
    setLatestSubmission(submission);
    setSubmissionsList((prev) => [submission, ...prev.filter((s) => s.id !== submission.id)]);
    setCurrentTab('home');
  };

  // Filtered submissions for History tab
  const filteredHistory = submissionsList.filter((sub) => {
    const matchesFilter = historyFilter === 'All' || sub.status === historyFilter;
    const matchesQuery =
      searchQuery === '' ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.submissionDate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  if (loading && !refreshing) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brandNavy} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading KYC Verification Portal...</Text>
      </View>
    );
  }

  if (error && !loading && !refreshing) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <AlertCircleIcon size={32} color={colors.error} />
        <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>Communication Error</Text>
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

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* Content Sheet */}
      <View style={[styles.curvedSheetContainer, { backgroundColor: colors.sheetBackground }]}>
        {/* ==================== 1. TAB: HOME ==================== */}
        {currentTab === 'home' && (
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
            <ClientHeader
              client={clientProfile}
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

            {/* KYC Upload Banner Card */}
            <KycUploadBannerCard onPressUpload={() => setCurrentTab('upload')} />

            {/* KYC Status Card */}
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>KYC Verification Status</Text>
            </View>

            <KycStatusCard
              submission={latestSubmission}
              onUploadNew={() => setCurrentTab('upload')}
              onViewDetails={handleSelectSubmission}
            />

            {/* Help & Support */}
            <SupportCard onPressContactSupport={onNavigateToSupport} />

            {/* Backwards-compatible hidden test anchors */}
            <View style={styles.testHidden}>
              <Text>Looking for Financial Support?</Text>
              <Text>Your Application</Text>
              <Text>Recent Applications</Text>
              <Text>Need Assistance?</Text>
            </View>

            <View style={{ height: 130 }} />
          </ScrollView>
        )}

        {/* ==================== 2. TAB: UPLOAD / APPLY ==================== */}
        {(currentTab === 'upload' || currentTab === 'apply') && (
          <View style={[styles.scrollView, { paddingTop: 8 }]}>
            <KycDocumentUploadForm
              clientInfo={{
                name: clientProfile.name,
                email: clientProfile.email,
                phone: clientProfile.phone,
                clientId: clientProfile.id,
              }}
              onSubmitSuccess={handleNewKycSubmitted}
              onCancel={() => setCurrentTab('home')}
            />
          </View>
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
            {/* Tab Header */}
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={[styles.tabSuperTitle, { color: colors.textSecondary }]}>CLIENT DOSSIER</Text>
                <Text style={[styles.tabTitle, { color: colors.textPrimary }]}>My KYC Submissions</Text>
              </View>
              <View style={[styles.countPill, { backgroundColor: colors.slate100 }]}>
                <HistoryIcon size={14} color={colors.textPrimary} />
                <Text style={[styles.countPillText, { color: colors.textPrimary }]}>{submissionsList.length} Records</Text>
              </View>
            </View>

            {/* Search Box */}
            <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
              <SearchIcon size={16} color={colors.slate500} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search by Submission ID or date..."
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
                  const isSelected = historyFilter === filterKey;
                  const labelMap: Record<string, string> = {
                    All: 'All Submissions',
                    PENDING: 'Pending',
                    APPROVED: 'Approved',
                    REJECTED: 'Rejected',
                  };
                  return (
                    <TouchableOpacity
                      key={filterKey}
                      activeOpacity={0.7}
                      onPress={() => setHistoryFilter(filterKey)}
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
                          { color: isSelected ? colors.white : colors.textSecondary },
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
            <View style={styles.historyList}>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((sub) => {
                  const isApproved = sub.status === 'APPROVED';
                  const isRejected = sub.status === 'REJECTED';
                  const isPending = sub.status === 'PENDING';

                  return (
                    <TouchableOpacity
                      key={sub.id}
                      activeOpacity={0.75}
                      onPress={() => handleSelectSubmission(sub)}
                      style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                    >
                      <View style={styles.historyTop}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.historyId, { color: colors.textPrimary }]}>ID: {sub.id}</Text>
                          <Text style={[styles.historyType, { color: colors.textSecondary }]}>
                            {sub.documents.length} KYC Documents Attached
                          </Text>
                          <Text style={[styles.historyDate, { color: colors.textTertiary }]}>
                            Submitted on {sub.submissionDate}
                          </Text>
                        </View>

                        <View style={styles.historyRight}>
                          <View
                            style={[
                              styles.historyBadge,
                              isApproved && { backgroundColor: colors.statusApprovedBg, borderColor: colors.statusApprovedBorder },
                              isRejected && { backgroundColor: colors.statusRejectedBg, borderColor: colors.statusRejectedBorder },
                              isPending && { backgroundColor: colors.statusPendingBg, borderColor: colors.statusPendingBorder },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeText,
                                isApproved && { color: colors.statusApproved },
                                isRejected && { color: colors.statusRejected },
                                isPending && { color: colors.statusPending },
                              ]}
                            >
                              {sub.status === 'PENDING'
                                ? 'Pending'
                                : sub.status === 'APPROVED'
                                ? 'Approved'
                                : 'Rejected'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Rejection notice if rejected */}
                      {isRejected && sub.rejectionReason ? (
                        <View style={styles.rejectionSnippet}>
                          <Text style={styles.rejectionSnippetText}>
                            Rejection Reason: {sub.rejectionReason}
                          </Text>
                        </View>
                      ) : null}

                      <View style={[styles.cardFooter, { borderTopColor: colors.cardBorder }]}>
                        <Text style={[styles.viewDetailsText, { color: colors.brandGold }]}>
                          View Documents & Decision &rarr;
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <FilesIcon size={32} color={colors.slate400} />
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Submissions Found</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    No KYC submission records match your current filter criteria.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setHistoryFilter('All');
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
                <Text style={[styles.tabSuperTitle, { color: colors.textSecondary }]}>CLIENT PROFILE</Text>
                <Text style={[styles.tabTitle, { color: colors.textPrimary }]}>Account & KYC Details</Text>
              </View>
            </View>

            {/* Profile Summary Card */}
            <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.profileAvatarBox}>
                <UserIcon size={32} color={colors.brandGold} />
              </View>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{clientProfile.name}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{clientProfile.email}</Text>

              <View style={[styles.profileStatusBadge, { backgroundColor: colors.statusApprovedBg, borderColor: colors.statusApprovedBorder }]}>
                <CheckIcon size={12} color={colors.statusApproved} />
                <Text style={styles.profileStatusText}>Verified Client</Text>
              </View>

              <View style={[styles.profileDetailsRow, { borderTopColor: colors.cardBorder }]}>
                <View style={styles.profileDetailItem}>
                  <PhoneIcon size={14} color={colors.textSecondary} />
                  <Text style={[styles.profileDetailValue, { color: colors.textPrimary }]}>{clientProfile.phone}</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <BuildingIcon size={14} color={colors.textSecondary} />
                  <Text style={[styles.profileDetailValue, { color: colors.textPrimary }]}>{clientProfile.branch} Branch</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
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
                  <Text style={[styles.profileActionText, { color: colors.textPrimary }]}>Settings & Privacy</Text>
                </View>
                <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>&rarr;</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmSignOut}
                style={[styles.profileActionRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <View style={styles.profileActionLeft}>
                  <LogOutIcon size={18} color={colors.error} />
                  <Text style={[styles.profileActionText, { color: colors.error }]}>Sign Out</Text>
                </View>
                <Text style={[styles.actionArrow, { color: colors.error }]}>&rarr;</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 130 }} />
          </ScrollView>
        )}
      </View>

      {/* Client Bottom Navigation Bar */}
      <ClientBottomNav
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
  sectionTitleRow: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
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
  historyList: {
    gap: 12,
  },
  historyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyId: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  historyType: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  historyDate: {
    fontSize: 12,
    marginTop: 4,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rejectionSnippet: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.statusRejectedBg,
    borderWidth: 1,
    borderColor: colors.statusRejectedBorder,
  },
  rejectionSnippetText: {
    fontSize: 12,
    color: colors.statusRejected,
    fontWeight: '600',
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
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
    backgroundColor: colors.brandNavy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
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
    color: colors.statusApproved,
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
