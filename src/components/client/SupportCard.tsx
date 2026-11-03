import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { spacing, useAppTheme, colors } from '../../theme';
import { PhoneIcon, MessageSquareIcon, HeadphonesIcon } from '../Icons';
import { AnimatedButton } from '../AnimatedButton';
import { themeAlert } from '../ThemeDialog';

interface SupportCardProps {
  onPressContactSupport?: () => void;
}

export const SupportCard: React.FC<SupportCardProps> = ({ onPressContactSupport }) => {
  const { colors, isDark } = useAppTheme();

  const handleCall = () => {
    themeAlert(
      'Client Concierge Desk',
      'Connecting to Ridhi Ratnam Priority Desk at 1800 123 4567.\nHours: Mon-Sat, 9:00 AM - 6:00 PM IST',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL('tel:18001234567').catch(() => {
              themeAlert('Call', 'Unable to dial on this device simulator.');
            });
          },
        },
      ]
    );
  };

  const handleEmail = () => {
    themeAlert(
      'Priority Email Desk',
      'Write to our official support team at support@ridhiratnam.com.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Mail',
          onPress: () => {
            Linking.openURL('mailto:support@ridhiratnam.com?subject=Loan Application Support Inquiry').catch(() => {
              themeAlert('Email', 'Unable to open mail client on this device simulator.');
            });
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={onPressContactSupport ? 0.7 : 1}
        onPress={onPressContactSupport}
        style={styles.headerRow}
        accessibilityRole={onPressContactSupport ? 'button' : undefined}
        accessibilityLabel="Open Full Help & Support Center"
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isDark ? colors.cardSecondary : colors.slate100 },
          ]}
        >
          <HeadphonesIcon size={18} color={isDark ? colors.brandGold : colors.textPrimary} />
        </View>
        <View style={styles.titleCol}>
          <View style={styles.titleBadgeRow}>
            <Text style={[styles.heading, { color: colors.textPrimary }]}>
              Need Assistance?
            </Text>
            {onPressContactSupport && (
              <View
                style={[
                  styles.viewDeskPill,
                  {
                    backgroundColor: isDark ? colors.cardSecondary : colors.slate50,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <Text style={styles.viewDeskPillText}>Help Center ›</Text>
              </View>
            )}
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Our team is here to help you with your application.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Contact Channels Row */}
      <View style={styles.channelsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCall}
          style={[
            styles.channelButton,
            {
              backgroundColor: isDark ? colors.cardSecondary : colors.slate50,
              borderColor: colors.cardBorder,
            },
          ]}
          accessibilityLabel="Call Customer Support"
        >
          <PhoneIcon size={14} color={isDark ? colors.brandGold : colors.textPrimary} />
          <Text style={[styles.channelText, { color: colors.textPrimary }]}>
            1800 234 5678
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleEmail}
          style={[
            styles.channelButton,
            {
              backgroundColor: isDark ? colors.cardSecondary : colors.slate50,
              borderColor: colors.cardBorder,
            },
          ]}
          accessibilityLabel="Email Customer Support"
        >
          <MessageSquareIcon size={14} color={isDark ? colors.brandGold : colors.textPrimary} />
          <Text style={[styles.channelText, { color: colors.textPrimary }]}>
            support@ridhiratnam.com
          </Text>
        </TouchableOpacity>
      </View>

      <AnimatedButton
        title="Contact Advisor Support"
        variant="outline"
        onPress={onPressContactSupport || handleCall}
        style={styles.supportBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 0,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleCol: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    includeFontPadding: false,
  },
  viewDeskPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDeskPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.brandGold,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  description: {
    fontSize: 12.5,
    marginTop: 2,
    lineHeight: 17,
    includeFontPadding: false,
  },
  channelsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  channelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderWidth: 1,
    gap: 6,
  },
  channelText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  supportBtn: {
    width: '100%',
  },
});
