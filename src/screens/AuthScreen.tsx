import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  BackHandler,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomInput } from '../components/CustomInput';
import { AnimatedButton } from '../components/AnimatedButton';
import { themeAlert } from '../components/ThemeDialog';
import {
  MailIcon,
  PhoneIcon,
  LockIcon,
  UserIcon,
  AlertCircleIcon,
  ShieldIcon,
} from '../components/Icons';
import { authenticateUser, registerClientAccount } from '../services/kycService';

export type AuthMode = 'login' | 'signup';

interface AuthScreenProps {
  initialMode?: AuthMode;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess?: (role: 'client' | 'agent') => void;
}

// Regex validations
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_PHONE_REGEX = /^(?:\+91[\-\s]?)?[6789]\d{9}$/;

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onNavigateToForgotPassword,
  onLoginSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form Fields - Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form Fields - Signup (Client Only)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Inline Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Status
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Reset fields on initialMode change (e.g. after signout)
  useEffect(() => {
    setMode(initialMode);
    setLoginPassword('');
    setSignupPassword('');
    setConfirmPassword('');
    setErrors({});
    setGeneralError('');
  }, [initialMode]);

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handleBackPress = () => {
      if (mode === 'signup') {
        handleShiftMode('login');
        return true;
      }
      return false;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [mode, loading]);

  const handleShiftMode = (targetMode: AuthMode) => {
    if (targetMode === mode || loading) return;
    setErrors({});
    setGeneralError('');
    setMode(targetMode);
  };

  // Login Validation
  const validateLogin = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!loginIdentifier.trim()) {
      newErrors.loginIdentifier = 'Please enter your registered Email, Mobile or User ID';
    }

    if (!loginPassword) {
      newErrors.loginPassword = 'Password is required';
    } else if (loginPassword.length < 6) {
      newErrors.loginPassword = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sign In Submission
  const handleLoginSubmit = async () => {
    if (loading) return;

    if (!validateLogin()) {
      setGeneralError('Please correct the highlighted errors before submitting.');
      return;
    }

    setGeneralError('');
    setLoading(true);

    try {
      const authResult = await authenticateUser(loginIdentifier, loginPassword);

      setTimeout(() => {
        setLoading(false);

        if (!authResult.success || !authResult.user) {
          setGeneralError(authResult.error || 'Invalid credentials. Please verify your details.');
          return;
        }

        const user = authResult.user;
        const roleLabel = user.role === 'agent' ? 'Verification Agent' : 'Client';

        themeAlert(
          'Authentication Successful',
          `Welcome to Ridhi Ratnam Associates KYC Portal.\n\nLogged in as ${user.name} (${roleLabel}).`,
          [
            {
              text: 'Continue to Portal',
              onPress: () => {
                if (onLoginSuccess) {
                  onLoginSuccess(user.role);
                }
              },
            },
          ]
        );
      }, 900);
    } catch {
      setLoading(false);
      setGeneralError('Network communication error. Please try again.');
    }
  };

  // Signup Validation (Client Only)
  const validateSignup = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Enter a valid email address (e.g. name@domain.com)';
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Mobile number is required';
    } else if (!INDIAN_PHONE_REGEX.test(cleanPhone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!signupPassword) {
      newErrors.signupPassword = 'Password is required';
    } else if (signupPassword.length < 6) {
      newErrors.signupPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (signupPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Signup Submission (Client Only)
  const handleSignupSubmit = async () => {
    if (loading) return;

    if (!validateSignup()) {
      setGeneralError('Please resolve all validation errors below.');
      return;
    }

    setGeneralError('');
    setLoading(true);

    try {
      await registerClientAccount({
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: phone.trim(),
        password: signupPassword,
      });

      setTimeout(() => {
        setLoading(false);
        themeAlert(
          'Account Created',
          'Your Client account has been successfully registered. Please sign in to upload and submit your KYC documents.',
          [
            {
              text: 'Sign In Now',
              onPress: () => {
                setLoginIdentifier(email.trim());
                handleShiftMode('login');
              },
            },
          ]
        );
      }, 1000);
    } catch {
      setLoading(false);
      setGeneralError('Registration error. Please try again.');
    }
  };

  const isLoginFormValid = Boolean(loginIdentifier.trim() && loginPassword.length >= 6);
  const isSignupFormValid = Boolean(
    fullName.trim() &&
      email.trim() &&
      phone.trim() &&
      signupPassword.length >= 6 &&
      confirmPassword === signupPassword
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Graphic Logo */}
        <View
          style={[
            styles.topGraphicWrapper,
            { paddingTop: Math.max(insets.top, 24) + 16 },
          ]}
        >
          <View style={styles.singleRoundAppIcon}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.singleLogoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appTitle}>Ridhi Ratnam Associates</Text>
          <Text style={styles.appSubtitle}>KYC DOCUMENT VERIFICATION PORTAL</Text>
        </View>

        {/* Main Card Container */}
        <View style={styles.cardContainer}>
          {/* Shift Segmented Pills: [ Sign In ] | [ Sign Up ] */}
          <View style={styles.shiftTrack}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleShiftMode('login')}
              style={[
                styles.shiftTab,
                mode === 'login' && styles.shiftTabActive,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'login' }}
            >
              <Text
                style={[
                  styles.shiftTabText,
                  mode === 'login' && styles.shiftTabTextActive,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleShiftMode('signup')}
              style={[
                styles.shiftTab,
                mode === 'signup' && styles.shiftTabActive,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'signup' }}
            >
              <Text
                style={[
                  styles.shiftTabText,
                  mode === 'signup' && styles.shiftTabTextActive,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* General Error Banner */}
          {generalError ? (
            <View style={styles.errorBanner}>
              <AlertCircleIcon size={14} color={colors.error} />
              <Text style={styles.errorText}>{generalError}</Text>
            </View>
          ) : null}

          {/* Form Content */}
          <View>
            {/* ===================== SIGN IN FORM ===================== */}
            {mode === 'login' && (
              <View style={styles.formFields}>
                <CustomInput
                  label="Email, Phone or User ID"
                  placeholder="e.g. amit.client@ridhiratnam.demo, RRA-AG-1024"
                  value={loginIdentifier}
                  onChangeText={(val) => {
                    setLoginIdentifier(val);
                    if (errors.loginIdentifier) {
                      setErrors((prev) => ({ ...prev, loginIdentifier: '' }));
                    }
                    setGeneralError('');
                  }}
                  leftIcon={<MailIcon size={16} color={colors.slate500} />}
                  error={errors.loginIdentifier}
                  accentColor={colors.primaryBlack}
                  autoCapitalize="none"
                  returnKeyType="next"
                />

                <CustomInput
                  label="Password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChangeText={(val) => {
                    setLoginPassword(val);
                    if (errors.loginPassword) {
                      setErrors((prev) => ({ ...prev, loginPassword: '' }));
                    }
                    setGeneralError('');
                  }}
                  isPassword={true}
                  leftIcon={<LockIcon size={16} color={colors.slate500} />}
                  error={errors.loginPassword}
                  accentColor={colors.primaryBlack}
                  returnKeyType="done"
                  onSubmitEditing={handleLoginSubmit}
                />

                {/* Forgot Password Link */}
                <View style={styles.forgotPassRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onNavigateToForgotPassword}
                    accessibilityRole="button"
                  >
                    <Text style={styles.forgotPassText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Primary Action Button */}
                <AnimatedButton
                  title={loading ? 'Authenticating...' : 'Continue with Email'}
                  showChevronTriple={!loading}
                  variant="black"
                  loading={loading}
                  disabled={loading || !isLoginFormValid}
                  onPress={handleLoginSubmit}
                  style={styles.primaryActionButton}
                />

                {/* Security Footnote */}
                <View style={styles.securityNoteRow}>
                  <ShieldIcon size={13} color={colors.brandGold} />
                  <Text style={styles.securityNoteText}>
                    Authorized access only • Role validated on authentication
                  </Text>
                </View>
              </View>
            )}

            {/* ===================== SIGN UP FORM (CLIENT REGISTRATION ONLY) ===================== */}
            {mode === 'signup' && (
              <View style={styles.formFields}>
                <View style={styles.clientOnlyNotice}>
                  <Text style={styles.clientOnlyNoticeText}>
                    Client Registration • Submit your KYC documents for quick agency verification.
                  </Text>
                </View>

                {/* Full Name */}
                <CustomInput
                  label="Full Name"
                  placeholder="e.g. Amit Verma"
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    setGeneralError('');
                  }}
                  leftIcon={<UserIcon size={16} color={colors.slate500} />}
                  error={errors.fullName}
                  accentColor={colors.primaryBlack}
                  returnKeyType="next"
                />

                {/* Email Address */}
                <CustomInput
                  label="Email Address"
                  placeholder="e.g. amit.client@ridhiratnam.demo"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    setGeneralError('');
                  }}
                  leftIcon={<MailIcon size={16} color={colors.slate500} />}
                  error={errors.email}
                  accentColor={colors.primaryBlack}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />

                {/* Mobile Number */}
                <CustomInput
                  label="Mobile Number"
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    setGeneralError('');
                  }}
                  leftIcon={<PhoneIcon size={16} color={colors.slate500} />}
                  error={errors.phone}
                  accentColor={colors.primaryBlack}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />

                {/* Password */}
                <CustomInput
                  label="Password"
                  placeholder="Minimum 6 characters"
                  value={signupPassword}
                  onChangeText={(val) => {
                    setSignupPassword(val);
                    if (errors.signupPassword) setErrors((prev) => ({ ...prev, signupPassword: '' }));
                    setGeneralError('');
                  }}
                  isPassword={true}
                  leftIcon={<LockIcon size={16} color={colors.slate500} />}
                  error={errors.signupPassword}
                  accentColor={colors.primaryBlack}
                  returnKeyType="next"
                />

                {/* Confirm Password */}
                <CustomInput
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }
                    setGeneralError('');
                  }}
                  isPassword={true}
                  leftIcon={<LockIcon size={16} color={colors.slate500} />}
                  error={errors.confirmPassword}
                  accentColor={colors.primaryBlack}
                  returnKeyType="done"
                  onSubmitEditing={handleSignupSubmit}
                />

                {/* Submit Registration Button */}
                <AnimatedButton
                  title={loading ? 'Registering Account...' : 'Create Client Account'}
                  showChevronTriple={!loading}
                  variant="black"
                  loading={loading}
                  disabled={loading || !isSignupFormValid}
                  onPress={handleSignupSubmit}
                  style={styles.primaryActionButton}
                />
              </View>
            )}
          </View>
        </View>

        {/* Bottom Switch Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerPrompt}>
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleShiftMode(mode === 'login' ? 'signup' : 'login')}
          >
            <Text style={styles.footerLink}>
              {mode === 'login' ? 'Register as Client' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  topGraphicWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  singleRoundAppIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  singleLogoImage: {
    width: 48,
    height: 48,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryBlack,
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.brandGold,
    letterSpacing: 1.2,
    marginTop: 3,
  },
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 22,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  shiftTrack: {
    flexDirection: 'row',
    backgroundColor: colors.slate100,
    borderRadius: borderRadius.pill,
    padding: 4,
    marginBottom: 18,
  },
  shiftTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftTabActive: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  shiftTabText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.slate500,
  },
  shiftTabTextActive: {
    fontWeight: '800',
    color: colors.primaryBlack,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusRejectedBg,
    borderColor: colors.statusRejectedBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  formFields: {
    gap: 12,
  },
  forgotPassRow: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 6,
  },
  forgotPassText: {
    color: colors.primaryBlack,
    fontSize: 12.5,
    fontWeight: '700',
  },
  primaryActionButton: {
    marginTop: 8,
    width: '100%',
  },
  securityNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  securityNoteText: {
    fontSize: 11,
    color: colors.slate500,
    fontWeight: '500',
  },
  clientOnlyNotice: {
    backgroundColor: colors.slate50,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  clientOnlyNoticeText: {
    fontSize: 11.5,
    color: colors.slate500,
    lineHeight: 16,
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerPrompt: {
    fontSize: 13,
    color: colors.slate500,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryBlack,
  },
});
