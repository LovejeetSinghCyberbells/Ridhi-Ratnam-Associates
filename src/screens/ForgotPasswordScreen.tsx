import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
  StatusBar,
  BackHandler,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomInput } from '../components/CustomInput';
import { AnimatedButton } from '../components/AnimatedButton';
import { PillChip } from '../components/PillChip';
import { themeAlert } from '../components/ThemeDialog';
import {
  ChevronLeftIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  CheckIcon,
  AlertCircleIcon,
} from '../components/Icons';

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
  onBack: () => void;
}

type RecoveryMethod = 'email' | 'phone';
type FlowStep = 'method' | 'otp' | 'new_password' | 'success';

// Indian mobile number regex
const INDIAN_PHONE_REGEX = /^(?:\+91[\-\s]?)?[6789]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigateToLogin,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<FlowStep>('method');
  const [method, setMethod] = useState<RecoveryMethod>('email');
  const [contactInput, setContactInput] = useState('');

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const otpInputRefs = useRef<(any | null)[]>([]);

  // New Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handleBackPress = () => {
      if (step === 'otp') {
        setStep('method');
        return true;
      }
      if (step === 'new_password') {
        setStep('otp');
        return true;
      }
      if (step === 'success') {
        onNavigateToLogin();
        return true;
      }
      onBack();
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [step, onBack, onNavigateToLogin]);

  // Step 1 & 2: Send OTP
  const handleSendCode = () => {
    if (loading) return;

    if (!contactInput.trim()) {
      setErrorMessage(
        method === 'email'
          ? 'Please enter your registered email address'
          : 'Please enter your registered mobile number'
      );
      return;
    }

    if (method === 'email' && !EMAIL_REGEX.test(contactInput.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    if (method === 'phone') {
      const sanitizedPhone = contactInput.replace(/\s+/g, '');
      if (!INDIAN_PHONE_REGEX.test(sanitizedPhone)) {
        setErrorMessage('Please enter a valid 10-digit Indian mobile number');
        return;
      }
    }

    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimer(45);
    }, 800);
  };

  // Step 4: OTP Input Handler
  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanText.slice(-1);
    setOtp(newOtp);
    setErrorMessage('');

    // Auto-focus next input
    if (cleanText && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If last digit filled, auto submit
    if (index === 5 && cleanText) {
      const fullCode = newOtp.join('');
      if (fullCode.length === 6) {
        setTimeout(() => {
          verifyOtpCode(newOtp);
        }, 200);
      }
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 4: Verify OTP
  const verifyOtpCode = (currentOtp = otp) => {
    if (loading) return;

    const code = currentOtp.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP verification code');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('new_password');
    }, 850);
  };

  // Step 5: Resend OTP
  const handleResendCode = () => {
    if (timer > 0 || loading) return;
    setTimer(45);
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');
    themeAlert(
      'Security Code Dispatched',
      `A new 6-digit verification code has been dispatched to ${contactInput}.`
    );
  };

  // Step 6 & 7: Set New Password
  const handleResetPasswordSubmit = () => {
    if (loading) return;

    if (!newPassword) {
      setErrorMessage('Please enter your new password');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters in length');
      return;
    }

    if (!confirmNewPassword) {
      setErrorMessage('Please confirm your new password');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Password confirmation does not match');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Black Header (Standardized App-wide Design) */}
      <View style={[styles.blackHeader, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={step === 'method' ? onBack : () => setStep('method')}
          style={styles.headerBackBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerCategory}>Account Recovery</Text>
          <Text style={styles.headerMainTitle}>Reset Password</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Curved Content Sheet Container */}
      <View style={styles.curvedSheetContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 40 }]}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator={false}
          >
            {/* Headline Section */}
            <View style={styles.headlineWrapper}>
              <Text style={styles.mainTitle}>
                {step === 'method' && 'Reset Password'}
                {step === 'otp' && 'Security Code'}
                {step === 'new_password' && 'Create New Password'}
                {step === 'success' && 'Password Updated'}
              </Text>
              <Text style={styles.subTitle}>
                {step === 'method' &&
                  'Select your recovery channel to receive a 6-digit authentication code.'}
                {step === 'otp' &&
                  `Enter the 6-digit security code sent to ${contactInput || 'your registered contact'}.`}
                {step === 'new_password' &&
                  'Choose a secure new password with a minimum of 8 characters.'}
                {step === 'success' &&
                  'Your password has been securely updated. You can now log into your account.'}
              </Text>
            </View>

        {/* Global Error Banner */}
        {errorMessage ? (
          <View style={styles.errorBox}>
            <AlertCircleIcon size={14} color="#DC2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Main Card Container */}
        <View style={styles.cardContainer}>
          {/* STEP 1 & 2: SELECT METHOD & ENTER CONTACT */}
          {step === 'method' && (
            <View>
              <Text style={styles.sectionLabel}>Select Recovery Channel</Text>
              <View style={styles.chipsRow}>
                <PillChip
                  label="Registered Email"
                  icon={<MailIcon size={14} color={method === 'email' ? '#FFFFFF' : '#64748B'} />}
                  selected={method === 'email'}
                  onPress={() => {
                    setMethod('email');
                    setContactInput('');
                    setErrorMessage('');
                  }}
                  accentColor={colors.primaryBlack}
                  style={styles.channelChip}
                />
                <PillChip
                  label="SMS to Mobile"
                  icon={<PhoneIcon size={14} color={method === 'phone' ? '#FFFFFF' : '#64748B'} />}
                  selected={method === 'phone'}
                  onPress={() => {
                    setMethod('phone');
                    setContactInput('');
                    setErrorMessage('');
                  }}
                  accentColor={colors.primaryBlack}
                  style={styles.channelChip}
                />
              </View>

              <CustomInput
                label={method === 'email' ? 'Registered Email Address' : 'Registered Mobile Number'}
                placeholder={
                  method === 'email' ? 'e.g. name@domain.com' : 'e.g. +91 98765 43210'
                }
                value={contactInput}
                onChangeText={(val) => {
                  setContactInput(val);
                  setErrorMessage('');
                }}
                leftIcon={
                  method === 'email' ? (
                    <MailIcon size={16} color="#64748B" />
                  ) : (
                    <PhoneIcon size={16} color="#64748B" />
                  )
                }
                accentColor={colors.primaryBlack}
                keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
              />

              <AnimatedButton
                title={loading ? 'Sending Security Code...' : 'Send Verification Code'}
                showChevronTriple={!loading}
                variant="black"
                loading={loading}
                disabled={loading || !contactInput.trim()}
                onPress={handleSendCode}
                style={styles.actionButton}
              />
            </View>
          )}

          {/* STEP 3, 4, 5: ENTER OTP & COUNTDOWN */}
          {step === 'otp' && (
            <View>
              <Text style={styles.sectionLabel}>Enter 6-Digit Security Code</Text>

              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <View key={index} style={styles.otpBox}>
                    <TextInput
                      ref={(ref) => {
                        otpInputRefs.current[index] = ref;
                      }}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(val) => handleOtpChange(val, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      selectionColor={colors.primaryBlack}
                      selectTextOnFocus
                    />
                  </View>
                ))}
              </View>

              <View style={styles.timerRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={timer > 0 || loading}
                  onPress={handleResendCode}
                >
                  <Text
                    style={[
                      styles.resendText,
                      { color: timer > 0 ? '#94A3B8' : '#0D0E12' },
                    ]}
                  >
                    {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code Now'}
                  </Text>
                </TouchableOpacity>
              </View>

              <AnimatedButton
                title={loading ? 'Verifying Code...' : 'Verify Security Code'}
                showChevronTriple={!loading}
                variant="black"
                loading={loading}
                disabled={loading || otp.join('').length < 6}
                onPress={() => verifyOtpCode()}
                style={styles.actionButton}
              />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setStep('method');
                  setErrorMessage('');
                }}
                style={styles.changeContactBtn}
              >
                <Text style={styles.changeContactText}>‹ Change contact info</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 6 & 7: CREATE NEW PASSWORD */}
          {step === 'new_password' && (
            <View>
              <Text style={styles.sectionLabel}>Security Credentials</Text>

              <CustomInput
                label="New Password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChangeText={(val) => {
                  setNewPassword(val);
                  setErrorMessage('');
                }}
                isPassword={true}
                leftIcon={<LockIcon size={16} color="#64748B" />}
                accentColor={colors.primaryBlack}
              />

              <CustomInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmNewPassword}
                onChangeText={(val) => {
                  setConfirmNewPassword(val);
                  setErrorMessage('');
                }}
                isPassword={true}
                leftIcon={<LockIcon size={16} color="#64748B" />}
                accentColor={colors.primaryBlack}
              />

              <AnimatedButton
                title={loading ? 'Updating Password...' : 'Reset Password'}
                showChevronTriple={!loading}
                variant="black"
                loading={loading}
                disabled={
                  loading ||
                  !newPassword ||
                  newPassword.length < 8 ||
                  newPassword !== confirmNewPassword
                }
                onPress={handleResetPasswordSubmit}
                style={styles.actionButton}
              />
            </View>
          )}

          {/* STEP 8 & 9: SUCCESS */}
          {step === 'success' && (
            <View style={styles.successContainer}>
              <View style={styles.successBadge}>
                <CheckIcon size={24} color="#10B981" />
              </View>

              <Text style={styles.successTitle}>Password Reset Complete</Text>
              <Text style={styles.successDesc}>
                Your account password has been updated successfully. Please return to the sign-in
                screen to access your portal.
              </Text>

              <AnimatedButton
                title="Return to Sign In"
                showChevronTriple={true}
                variant="black"
                onPress={onNavigateToLogin}
                style={styles.actionButton}
              />
            </View>
          )}
        </View>

        {/* Footer Link */}
        {step !== 'success' && (
          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>Remembered your credentials? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToLogin}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    alignItems: 'center',
  },
  headerMainTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
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
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.sheetBackground,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 64,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  backButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: '#E2E5E9',
  },
  backButtonText: {
    color: '#0D0E12',
    fontSize: 13,
    fontWeight: '700',
  },
  headerCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.brandGold,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  headlineWrapper: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.md,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0D0E12',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    paddingHorizontal: spacing.sm,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    borderRadius: 32,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E8EAED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.md,
  },
  channelChip: {
    flex: 1,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E5E9',
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#0D0E12',
  },
  timerRow: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  resendText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  actionButton: {
    width: '100%',
    marginTop: spacing.sm,
  },
  changeContactBtn: {
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingVertical: 6,
  },
  changeContactText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  successBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D0E12',
    letterSpacing: -0.4,
    marginBottom: 8,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerPrompt: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D0E12',
  },
});
