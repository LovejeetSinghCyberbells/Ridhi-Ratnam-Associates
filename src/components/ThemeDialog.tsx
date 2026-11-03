import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, borderRadius, spacing, useAppTheme } from '../theme';
import {
  CheckIcon,
  AlertCircleIcon,
  LogOutIcon,
  PhoneIcon,
  HeadphonesIcon,
  ShieldIcon,
  LockIcon,
  CrossIcon,
  MailIcon,
} from './Icons';

declare const process: any;

export interface DialogButton {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface DialogConfig {
  title: string;
  message?: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'destructive' | 'phone' | 'email' | 'security';
  badge?: string;
  buttons?: DialogButton[];
  onDismiss?: () => void;
}

interface DialogContextType {
  showDialog: (config: DialogConfig) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Global handler reference to allow calling themeAlert() from anywhere
let globalDialogHandler: ((config: DialogConfig) => void) | null = null;

export const showThemeAlert = (config: DialogConfig) => {
  if (globalDialogHandler) {
    globalDialogHandler(config);
  }
};

/**
 * Drop-in themed replacement for React Native's Alert.alert.
 * Matches the institutional Ridhi Ratnam Associates design system.
 */
export const themeAlert = (
  title: string,
  message?: string,
  buttons?: DialogButton[],
  options?: { cancelable?: boolean; onDismiss?: () => void }
) => {
  // Infer dialog type from title, message and button styles
  const lowerTitle = (title || '').toLowerCase();
  const lowerMsg = (message || '').toLowerCase();

  let inferredType: DialogConfig['type'] = 'default';
  let inferredBadge = 'RIDHI RATNAM ASSOCIATES';

  if (
    lowerTitle.includes('sign out') ||
    lowerTitle.includes('decline') ||
    lowerTitle.includes('reject') ||
    buttons?.some((b) => b.style === 'destructive')
  ) {
    inferredType = 'destructive';
    inferredBadge = 'SECURITY CONFIRMATION';
  } else if (
    lowerTitle.includes('success') ||
    lowerTitle.includes('approved') ||
    lowerTitle.includes('updated') ||
    lowerTitle.includes('registered') ||
    lowerTitle.includes('verified') ||
    lowerTitle.includes('submitted') ||
    lowerTitle.includes('sanction')
  ) {
    inferredType = 'success';
    inferredBadge = 'VERIFIED RECORD';
  } else if (
    lowerTitle.includes('call') ||
    lowerTitle.includes('hotline') ||
    lowerTitle.includes('phone') ||
    lowerTitle.includes('dial')
  ) {
    inferredType = 'phone';
    inferredBadge = 'PRIORITY HELPLINE';
  } else if (lowerTitle.includes('email') || lowerTitle.includes('mail')) {
    inferredType = 'email';
    inferredBadge = 'INSTITUTIONAL EMAIL';
  } else if (
    lowerTitle.includes('security') ||
    lowerTitle.includes('password') ||
    lowerTitle.includes('biometric') ||
    lowerTitle.includes('privacy') ||
    lowerTitle.includes('compliance')
  ) {
    inferredType = 'security';
    inferredBadge = 'INSTITUTIONAL INTEGRITY';
  } else if (
    lowerTitle.includes('missing') ||
    lowerTitle.includes('error') ||
    lowerTitle.includes('invalid') ||
    lowerTitle.includes('alert')
  ) {
    inferredType = 'warning';
    inferredBadge = 'ACTION REQUIRED';
  }

  showThemeAlert({
    title,
    message,
    type: inferredType,
    badge: inferredBadge,
    buttons,
    onDismiss: options?.onDismiss,
  });
};

export const useThemeDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    return {
      showDialog: showThemeAlert,
      hideDialog: () => {},
    };
  }
  return context;
};

export const ThemeDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors: themeColors, isDark } = useAppTheme();
  const [activeConfig, setActiveConfig] = useState<DialogConfig | null>(null);
  const [visible, setVisible] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;

  const hideDialog = useCallback(() => {
    if (process.env.NODE_ENV === 'test') {
      setVisible(false);
      const dismissCallback = activeConfig?.onDismiss;
      setActiveConfig(null);
      if (dismissCallback) dismissCallback();
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      const dismissCallback = activeConfig?.onDismiss;
      setActiveConfig(null);
      if (dismissCallback) dismissCallback();
    });
  }, [fadeAnim, scaleAnim, activeConfig]);

  const showDialog = useCallback(
    (config: DialogConfig) => {
      setActiveConfig(config);
      setVisible(true);

      if (process.env.NODE_ENV === 'test') {
        return;
      }

      fadeAnim.setValue(0);
      scaleAnim.setValue(0.98);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [fadeAnim, scaleAnim]
  );

  useEffect(() => {
    globalDialogHandler = showDialog;
    return () => {
      globalDialogHandler = null;
    };
  }, [showDialog]);

  // Determine top icon based on type
  const renderTopIcon = () => {
    const type = activeConfig?.type || 'default';
    switch (type) {
      case 'destructive':
        return (
          <View style={[styles.iconCircle, styles.iconCircleDestructive]}>
            <LogOutIcon size={22} color={colors.error} />
          </View>
        );
      case 'success':
        return (
          <View style={[styles.iconCircle, styles.iconCircleSuccess]}>
            <CheckIcon size={22} color={colors.success} />
          </View>
        );
      case 'warning':
      case 'error':
        return (
          <View style={[styles.iconCircle, styles.iconCircleWarning]}>
            <AlertCircleIcon size={22} color={colors.statusPending} />
          </View>
        );
      case 'phone':
        return (
          <View style={[styles.iconCircle, styles.iconCircleNeutral]}>
            <PhoneIcon size={20} color={colors.topBarBlack} />
          </View>
        );
      case 'email':
        return (
          <View style={[styles.iconCircle, styles.iconCircleNeutral]}>
            <MailIcon size={20} color={colors.topBarBlack} />
          </View>
        );
      case 'security':
        return (
          <View style={[styles.iconCircle, styles.iconCircleSecurity]}>
            <ShieldIcon size={22} color={colors.brandGold} />
          </View>
        );
      default:
        return (
          <View style={[styles.iconCircle, styles.iconCircleNeutral]}>
            <HeadphonesIcon size={20} color={colors.topBarBlack} />
          </View>
        );
    }
  };

  const buttons = activeConfig?.buttons && activeConfig.buttons.length > 0
    ? activeConfig.buttons
    : [{ text: 'OK', style: 'default' as const }];

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={hideDialog}
      >
        <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={hideDialog}
          />

          <Animated.View
            style={[
              styles.dialogCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Close Cross button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={hideDialog}
              style={[
                styles.closeCrossBtn,
                { backgroundColor: colors.slate100 },
              ]}
              accessibilityLabel="Close dialog"
            >
              <CrossIcon size={12} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Top Themed Icon */}
            <View style={styles.iconContainer}>{renderTopIcon()}</View>

            {/* Pill Header Badge */}
            {activeConfig?.badge ? (
              <View
                style={[
                  styles.badgeWrapper,
                  {
                    backgroundColor: colors.slate50,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <Text style={styles.badgeText}>{activeConfig.badge}</Text>
              </View>
            ) : null}

            {/* Dialog Title */}
            <Text style={[styles.dialogTitle, { color: themeColors.textPrimary }]}>
              {activeConfig?.title}
            </Text>

            {/* Dialog Message */}
            {activeConfig?.message ? (
              <Text style={[styles.dialogMessage, { color: themeColors.textSecondary }]}>
                {activeConfig.message}
              </Text>
            ) : null}

            {/* Action Buttons */}
            <View
              style={[
                styles.buttonsContainer,
                buttons.length === 2 && styles.buttonsRow,
              ]}
            >
              {buttons.map((btn, index) => {
                const isDestructive = btn.style === 'destructive';
                const isCancel = btn.style === 'cancel';
                const isPrimary = !isCancel && !isDestructive;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    testID={`dialog-btn-${index}`}
                    onPress={() => {
                      hideDialog();
                      if (btn.onPress) {
                        btn.onPress();
                      }
                    }}
                    style={[
                      styles.actionButton,
                      buttons.length === 2 && styles.actionButtonSplit,
                      isCancel && [
                        styles.cancelButton,
                        {
                          backgroundColor: colors.slate100,
                          borderColor: themeColors.cardBorder,
                        },
                      ],
                      isDestructive && styles.destructiveButton,
                      isPrimary && [
                        styles.primaryButton,
                        {
                          backgroundColor: colors.topBarBlack,
                        },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        isCancel && [styles.cancelButtonText, { color: colors.slate600 }],
                        isDestructive && styles.destructiveButtonText,
                        isPrimary && [styles.primaryButtonText, { color: colors.white }],
                      ]}
                    >
                      {btn.text || 'Confirm'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </DialogContext.Provider>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialogCard: {
    width: Math.min(width - 40, 360),
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingTop: 24,
    paddingBottom: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  closeCrossBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  iconCircleDestructive: {
    backgroundColor: colors.statusRejectedBg,
    borderColor: colors.statusRejectedBorder,
  },
  iconCircleSuccess: {
    backgroundColor: colors.statusApprovedBg,
    borderColor: colors.statusApprovedBorder,
  },
  iconCircleWarning: {
    backgroundColor: colors.statusPendingBg,
    borderColor: colors.statusPendingBorder,
  },
  iconCircleSecurity: {
    backgroundColor: colors.statusPendingBg,
    borderColor: colors.statusPendingBorder,
  },
  iconCircleNeutral: {
    backgroundColor: colors.slate100,
    borderColor: colors.border,
  },
  badgeWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.brandGold,
    letterSpacing: 0.8,
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.topBarBlack,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 6,
    lineHeight: 22,
  },
  dialogMessage: {
    fontSize: 13,
    color: colors.slate600,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  buttonsContainer: {
    width: '100%',
    gap: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  actionButton: {
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  actionButtonSplit: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.topBarBlack,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.slate600,
    fontSize: 13.5,
    fontWeight: '700',
  },
  destructiveButton: {
    backgroundColor: colors.statusRejectedBg,
    borderWidth: 1.5,
    borderColor: colors.statusRejectedBorder,
  },
  destructiveButtonText: {
    color: colors.error,
    fontSize: 13.5,
    fontWeight: '800',
  },
});
