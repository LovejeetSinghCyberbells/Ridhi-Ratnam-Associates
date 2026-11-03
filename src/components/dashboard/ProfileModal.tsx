import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { AgentProfile } from '../../types/dashboard';
import { CrossIcon, MailIcon, PhoneIcon, BuildingIcon, IdBadgeIcon, LogOutIcon } from '../Icons';
import { AnimatedButton } from '../AnimatedButton';
import { themeAlert } from '../ThemeDialog';
import { colors } from '../../theme';

interface ProfileModalProps {
  agent: AgentProfile;
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  agent,
  visible,
  onClose,
  onLogout,
}) => {
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
              <Text style={styles.headerCategory}>AUTHORIZED PARTNER</Text>
              <Text style={styles.headerTitle}>Agent Profile</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close profile"
            >
              <CrossIcon size={14} color={colors.topBarBlack} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Avatar & Hero */}
            <View style={styles.heroRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{agent.avatarInitials}</Text>
              </View>

              <View style={styles.heroInfo}>
                <Text style={styles.agentName}>{agent.fullName}</Text>
                <Text style={styles.agentDesignation}>{agent.designation}</Text>
                <View style={styles.idBadge}>
                  <IdBadgeIcon size={12} color={colors.brandGold} />
                  <Text style={styles.idText}>Verification Officer</Text>
                  <Text style={styles.testHidden}>{agent.id}</Text>
                </View>
              </View>
            </View>

            {/* Account Details Box */}
            <View style={styles.detailCard}>
              <Text style={styles.cardHeader}>Agency & Credentials</Text>

              <View style={styles.itemRow}>
                <BuildingIcon size={16} color={colors.slate500} />
                <View style={styles.itemCol}>
                  <Text style={styles.itemLabel}>Agency / Branch</Text>
                  <Text style={styles.itemValue}>{agent.branch}</Text>
                </View>
              </View>

              <View style={styles.itemRow}>
                <MailIcon size={16} color={colors.slate500} />
                <View style={styles.itemCol}>
                  <Text style={styles.itemLabel}>Official Email</Text>
                  <Text style={styles.itemValue}>{agent.email}</Text>
                </View>
              </View>

              <View style={styles.itemRow}>
                <PhoneIcon size={16} color={colors.slate500} />
                <View style={styles.itemCol}>
                  <Text style={styles.itemLabel}>Registered Mobile</Text>
                  <Text style={styles.itemValue}>{agent.phone}</Text>
                </View>
              </View>

              <View style={styles.itemRow}>
                <View style={styles.statusDot} />
                <View style={styles.itemCol}>
                  <Text style={styles.itemLabel}>Account Status</Text>
                  <Text style={[styles.itemValue, { color: colors.statusApproved }]}>
                    {agent.status} (Verified Partner)
                  </Text>
                </View>
              </View>
            </View>

            {/* Development Mock Credentials Reminder */}
            <View style={styles.devCard}>
              <Text style={styles.devTitle}>Demo Agent Credentials</Text>
              <Text style={styles.devText}>
                Email: {agent.email}
              </Text>
              <Text style={styles.devSub}>Password: Agent@123</Text>
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity
              testID="btn-modal-sign-out"
              activeOpacity={0.8}
              onPress={() => {
                themeAlert(
                  'Sign Out Confirmation',
                  'Are you sure you want to sign out from your Ridhi Ratnam Associates account session?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Sign Out',
                      style: 'destructive',
                      onPress: onLogout,
                    },
                  ]
                );
              }}
              style={styles.signOutButton}
            >
              <LogOutIcon size={17} color={colors.error} />
              <Text style={styles.signOutButtonText}>Sign Out of Account</Text>
            </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
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
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.topBarBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.brandGold,
    marginRight: 14,
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  heroInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  agentDesignation: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate500,
    marginTop: 2,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandGoldSoft,
    borderWidth: 1,
    borderColor: colors.brandGoldLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 4,
  },
  idText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brandGoldDark,
    letterSpacing: 0.4,
  },
  detailCard: {
    backgroundColor: colors.slate50,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  itemCol: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.slate400,
  },
  itemValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devCard: {
    backgroundColor: colors.statusPendingBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.statusPendingBorder,
    marginBottom: 16,
  },
  devTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.statusPending,
    marginBottom: 2,
  },
  devText: {
    fontSize: 11.5,
    color: colors.statusPending,
    fontWeight: '600',
  },
  devSub: {
    fontSize: 11,
    color: colors.brandGoldDark,
    fontWeight: '700',
    marginTop: 2,
  },
  logoutBtn: {
    width: '100%',
    borderColor: colors.error,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.statusRejectedBg,
    borderWidth: 1.5,
    borderColor: colors.statusRejectedBorder,
    gap: 8,
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
  },
  testHidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});

