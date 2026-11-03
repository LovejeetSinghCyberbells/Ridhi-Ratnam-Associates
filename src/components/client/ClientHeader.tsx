import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, useAppTheme } from '../../theme';
import { BellIcon } from '../Icons';
import { ClientProfile } from '../../types/client';

interface ClientHeaderProps {
  client: ClientProfile;
  unreadCount?: number;
  onPressNotifications: () => void;
  onPressProfile: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  client,
  unreadCount = 1,
  onPressNotifications,
  onPressProfile,
}) => {
  return (
    <View style={styles.container}>
      {/* Left: Greeting & Client Name */}
      <View style={styles.leftColumn}>
        <Text style={styles.greetingText}>Good Morning,</Text>
        <Text style={styles.clientName}>{client.fullName}</Text>
        <Text style={styles.subtitleText}>Welcome to Ridhi Ratnam Associates</Text>
      </View>

      {/* Right: Notification Bell & Profile Avatar */}
      <View style={styles.rightColumn}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressNotifications}
          style={styles.iconButton}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <BellIcon
            size={19}
            color={colors.textPrimary}
            hasNotification={unreadCount > 0}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressProfile}
          style={styles.avatarButton}
          accessibilityLabel="Client Profile"
          accessibilityRole="button"
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>{client.avatarInitials}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  leftColumn: {
    flex: 1,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.slate500,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  clientName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate500,
    marginTop: 3,
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.topBarBlack,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
    backgroundColor: colors.topBarBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.brandGold,
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

