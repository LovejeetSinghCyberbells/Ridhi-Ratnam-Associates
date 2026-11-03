import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';
import { UserRole } from '../types';

export type { UserRole };

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  style?: object;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(selectedRole === 'client' ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: selectedRole === 'client' ? 0 : 1,
      duration: 140,
      useNativeDriver: false,
    }).start();
  }, [selectedRole, slideAnim]);

  const handleSelect = (role: UserRole) => {
    onSelectRole(role);
  };

  // Interpolated background indicator position
  const indicatorLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '50%'],
  });

  const indicatorBg = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.accentMint, colors.brandGold],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Role Pill Switcher */}
      <View style={styles.selectorTrack}>
        <Animated.View
          style={[
            styles.animatedIndicator,
            {
              left: indicatorLeft,
              backgroundColor: indicatorBg,
            },
          ]}
        />

        {/* Client Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.tabButton}
          onPress={() => handleSelect('client')}
        >
          <View style={styles.tabContent}>
            <Text style={styles.tabIcon}>👤</Text>
            <Text
              style={[
                styles.tabLabel,
                selectedRole === 'client' ? styles.activeTabLabel : styles.inactiveTabLabel,
              ]}
            >
              Client
            </Text>
          </View>
        </TouchableOpacity>

        {/* Agent Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.tabButton}
          onPress={() => handleSelect('agent')}
        >
          <View style={styles.tabContent}>
            <Text style={styles.tabIcon}>💼</Text>
            <Text
              style={[
                styles.tabLabel,
                selectedRole === 'agent' ? styles.activeTabLabel : styles.inactiveTabLabel,
              ]}
            >
              Agent
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Role Description Badge */}
      <View
        style={[
          styles.badgeRow,
          {
            backgroundColor:
              selectedRole === 'client'
                ? colors.statusApprovedBg
                : colors.highlightGoldSoft,
            borderColor:
              selectedRole === 'client'
                ? colors.statusApprovedBorder
                : colors.brandGoldLight,
          },
        ]}
      >
        <View
          style={[
            styles.badgeDot,
            {
              backgroundColor:
                selectedRole === 'client' ? colors.accentMint : colors.brandGold,
            },
          ]}
        />
        <Text style={styles.badgeText}>
          {selectedRole === 'client'
            ? 'Access Investments, Portfolios & Services'
            : 'Access Partner Portal, Client CRM & ARN Tools'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  selectorTrack: {
    flexDirection: 'row',
    backgroundColor: colors.primaryBlack,
    borderRadius: borderRadius.pill,
    padding: 4,
    position: 'relative',
    height: 52,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  animatedIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '48%',
    borderRadius: borderRadius.pill,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  activeTabLabel: {
    color: colors.textDark,
  },
  inactiveTabLabel: {
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    alignSelf: 'center',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

