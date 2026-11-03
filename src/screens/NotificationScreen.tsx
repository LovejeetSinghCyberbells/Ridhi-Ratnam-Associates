import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme';
import { NotificationItem } from '../types/dashboard';
import {
  ChevronLeftIcon,
  BellIcon,
  CheckIcon,
  ClockIcon,
  FilesIcon,
  AlertCircleIcon,
  FilterIcon,
} from '../components/Icons';
import { themeAlert } from '../components/ThemeDialog';

interface NotificationScreenProps {
  notifications?: NotificationItem[];
  userRole?: 'agent' | 'client';
  onBack: () => void;
  onSelectApplicationId?: (appId: string) => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Application Submitted',
    message: 'Amit Verma submitted a new Business Expansion Loan application for ₹5,00,000.',
    time: '12 mins ago',
    unread: true,
    type: 'submission',
  },
  {
    id: 'notif-2',
    title: 'Underwriting Verification Complete',
    message: 'GSTN and bank statement reconciliations for application RRA-2026-00124 have completed with 100% confidence score.',
    time: '45 mins ago',
    unread: true,
    type: 'review',
  },
  {
    id: 'notif-3',
    title: 'Loan Disbursed Successfully',
    message: 'Sanction disbursement of ₹8,00,000 for Karan Mehta (RRA-2026-00122) has been cleared through RTGS escrow.',
    time: '2 hours ago',
    unread: false,
    type: 'approval',
  },
  {
    id: 'notif-4',
    title: 'Quarterly Risk Review Scheduled',
    message: 'Monthly portfolio performance and audit cycle report is available for inspection in the agent portal.',
    time: '5 hours ago',
    unread: false,
    type: 'system',
  },
  {
    id: 'notif-5',
    title: 'Application Flagged for Verification',
    message: 'Application RRA-2026-00121 requires additional utility address proof verification from client Priya Singh.',
    time: '1 day ago',
    unread: false,
    type: 'review',
  },
];

type FilterType = 'All' | 'Unread' | 'approval' | 'review' | 'system' | 'submission';

export const NotificationScreen: React.FC<NotificationScreenProps> = ({
  notifications: initialNotifications = DEFAULT_NOTIFICATIONS,
  userRole = 'agent',
  onBack,
  onSelectApplicationId,
}) => {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handleBackPress = () => {
      onBack();
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [onBack]);

  const unreadCount = items.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleToggleItemRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleNotificationPress = (notif: NotificationItem) => {
    // Mark as read
    if (notif.unread) {
      handleToggleItemRead(notif.id);
    }

    // Extract potential App ID
    const match = notif.message.match(/RRA-\d{4}-\d{5}/);
    if (match && onSelectApplicationId) {
      themeAlert(
        'Inspect Application',
        `Would you like to open application ${match[0]} mentioned in this dispatch?`,
        [
          { text: 'Dismiss', style: 'cancel' },
          {
            text: 'Open Dossier',
            onPress: () => onSelectApplicationId(match[0]),
          },
        ]
      );
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return item.unread;
    return item.type === activeFilter;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'approval':
        return {
          icon: <CheckIcon size={14} color="#047857" />,
          bg: '#ECFDF5',
          border: '#A7F3D0',
          badgeText: 'APPROVAL',
          badgeColor: '#047857',
        };
      case 'review':
        return {
          icon: <ClockIcon size={14} color="#1D4ED8" />,
          bg: '#EFF6FF',
          border: '#BFDBFE',
          badgeText: 'REVIEW',
          badgeColor: '#1D4ED8',
        };
      case 'submission':
        return {
          icon: <FilesIcon size={14} color="#B45309" />,
          bg: '#FFFBEB',
          border: '#FDE68A',
          badgeText: 'NEW SUBMISSION',
          badgeColor: '#B45309',
        };
      default:
        return {
          icon: <BellIcon size={14} color="#0D0E12" />,
          bg: '#F1F5F9',
          border: '#CBD5E1',
          badgeText: 'SYSTEM',
          badgeColor: '#475569',
        };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Black Header (Consistent with Profile top bar design) */}
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
          <Text style={styles.headerSubBadge}>DISPATCH & AUDIT FEED</Text>
          <Text style={styles.headerMainTitle}>Notifications</Text>
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity
            testID="btn-mark-all-read"
            activeOpacity={0.7}
            onPress={handleMarkAllRead}
            style={styles.markAllBtnDark}
          >
            <Text style={styles.markAllTextDark}>Mark Read</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {/* Curved Content Sheet Container */}
      <View style={styles.curvedSheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
        >
        {/* Unread Status Strip */}
        <View style={styles.statusStrip}>
          <View style={styles.statusStripLeft}>
            <View style={styles.bellIconCircle}>
              <BellIcon size={16} color="#0D0E12" />
            </View>
            <View>
              <Text style={styles.statusStripTitle}>
                {unreadCount > 0
                  ? `${unreadCount} Unread ${unreadCount === 1 ? 'Dispatch' : 'Dispatches'}`
                  : 'All Dispatches Read'}
              </Text>
              <Text style={styles.statusStripSub}>
                {userRole === 'agent'
                  ? 'Real-time loan audit notifications and underwriting alerts'
                  : 'Updates on your loan applications and advisor communications'}
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {(
            [
              { key: 'All', label: 'All' },
              { key: 'Unread', label: `Unread (${unreadCount})` },
              { key: 'submission', label: 'Submissions' },
              { key: 'review', label: 'Underwriting' },
              { key: 'approval', label: 'Sanctions' },
              { key: 'system', label: 'System' },
            ] as const
          ).map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                testID={`filter-${filter.key}`}
                activeOpacity={0.75}
                onPress={() => setActiveFilter(filter.key)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Notification Cards List */}
        <View style={styles.listContainer}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const meta = getIconForType(item.type);
              return (
                <TouchableOpacity
                  key={item.id}
                  testID={`notif-item-${item.id}`}
                  activeOpacity={0.8}
                  onPress={() => handleNotificationPress(item)}
                  style={[
                    styles.notifCard,
                    item.unread && styles.notifCardUnread,
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.badgeLeft}>
                      <View
                        style={[
                          styles.typeIconBox,
                          { backgroundColor: meta.bg, borderColor: meta.border },
                        ]}
                      >
                        {meta.icon}
                      </View>
                      <Text style={[styles.typeBadgeText, { color: meta.badgeColor }]}>
                        {meta.badgeText}
                      </Text>
                    </View>

                    <View style={styles.timeRow}>
                      <Text style={styles.timeText}>{item.time}</Text>
                      {item.unread && <View style={styles.unreadDot} />}
                    </View>
                  </View>

                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifMessage}>{item.message}</Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.tapActionText}>
                      {item.unread ? 'Tap to mark as read' : 'Read'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <BellIcon size={28} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySub}>
                There are currently no alerts in this category. You will receive updates as loan applications are processed.
              </Text>
              {activeFilter !== 'All' && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setActiveFilter('All')}
                  style={styles.resetFilterBtn}
                >
                  <Text style={styles.resetFilterText}>View All Notifications</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
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
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  markAllBtnDark: {
    backgroundColor: colors.glassBackground,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  markAllTextDark: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 10,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D0E12',
    marginLeft: 4,
  },
  topCenter: {
    alignItems: 'center',
  },
  topCategory: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D0E12',
    letterSpacing: -0.2,
  },
  markAllBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  markAllText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0D0E12',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statusStrip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  statusStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusStripTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D0E12',
  },
  statusStripSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  filterRow: {
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0D0E12',
    borderColor: '#0D0E12',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    gap: 12,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  notifCardUnread: {
    borderColor: '#CBD5E1',
    borderLeftWidth: 4,
    borderLeftColor: '#0D0E12',
    backgroundColor: '#FAFAFB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#CDA148',
    marginLeft: 6,
  },
  notifTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0D0E12',
    marginBottom: 5,
    lineHeight: 20,
  },
  notifMessage: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tapActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D0E12',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetFilterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D0E12',
  },
});

