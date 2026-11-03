import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';
import { BrandLogo } from '../components/BrandLogo';
import { RoleSelector, UserRole } from '../components/RoleSelector';
import { CustomInput } from '../components/CustomInput';
import { AnimatedButton } from '../components/AnimatedButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { themeAlert } from '../components/ThemeDialog';

interface LoginScreenProps {
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
  onBack?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToSignup,
  onNavigateToForgotPassword,
  onBack,
}) => {
  const [role, setRole] = useState<UserRole>('client');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeAccent = role === 'client' ? colors.accentMint : colors.brandGold;

  const handleLogin = () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered Email, Phone or Account ID');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    // Simulate backend login: automatically detects whether user is Client or Agent
    setTimeout(() => {
      setLoading(false);
      const isAgent =
        identifier.toLowerCase().startsWith('arn') ||
        identifier.toLowerCase().includes('agent') ||
        identifier.toLowerCase().includes('partner');
      const detectedRole = isAgent ? 'Authorized Agent' : 'Client / Investor';

      themeAlert(
        'Authentication Successful',
        `Welcome back to Ridhi Ratnam Associates! Authenticated as ${detectedRole}.`,
        [{ text: 'Continue' }]
      );
    }, 1200);
  };

  const handleBiometricAuth = () => {
    themeAlert(
      'Biometric Sign In',
      `Authenticate with Face ID / Fingerprint as ${
        role === 'client' ? 'Client' : 'Agent'
      }`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Authenticate',
          onPress: () => {
            themeAlert('Success', 'Biometric login successful!');
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader
          title="Welcome Back"
          subtitle="Sign in to your Ridhi Ratnam account to manage your financial portfolio."
          badge="SECURE LOGIN"
          badgeColor={activeAccent}
          showBack={!!onBack}
          onBack={onBack}
        />

        {/* Small Brand Logo */}
        <View style={styles.logoRow}>
          <BrandLogo size="small" showTagline={false} />
        </View>

        {/* Card Form Container */}
        <View style={styles.formCard}>
          {/* Form Fields (Automatic Backend Detection) */}
          <View style={styles.fieldsContainer}>
            <CustomInput
              label="Email, Phone or Account ID"
              placeholder="e.g. name@domain.com, +91... or ARN-84920"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                setErrorMessage('');
              }}
              leftIcon="✉️"
              accentColor={activeAccent}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <CustomInput
              label="Password"
              placeholder="Enter your secret password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage('');
              }}
              isPassword={true}
              leftIcon="🔒"
              accentColor={activeAccent}
            />

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {errorMessage}</Text>
              </View>
            ) : null}

            {/* Remember Me & Forgot Password Row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberMeContainer}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && { backgroundColor: activeAccent, borderColor: activeAccent },
                  ]}
                >
                  {rememberMe && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onNavigateToForgotPassword}
                style={styles.forgotPassButton}
              >
                <Text style={[styles.forgotText, { color: activeAccent }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Primary Sign In Button */}
            <AnimatedButton
              title={`Sign In as ${role === 'client' ? 'Client' : 'Agent'}`}
              variant="white"
              showArrow={true}
              loading={loading}
              onPress={handleLogin}
              style={styles.signInButton}
            />

            {/* Quick Biometric Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBiometricAuth}
              style={styles.biometricPill}
            >
              <Text style={styles.biometricIcon}>✨</Text>
              <Text style={styles.biometricText}>Quick Sign in with Face ID / Biometrics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Link to Signup */}
        <View style={styles.footerLinkRow}>
          <Text style={styles.footerPrompt}>New to Ridhi Ratnam Associates? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToSignup}>
            <Text style={[styles.signUpLink, { color: activeAccent }]}>
              Create an Account
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
    paddingBottom: spacing.xxxl,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  formCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.cardLarge,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  roleHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
  fieldsContainer: {
    marginTop: spacing.md,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginBottom: spacing.md,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: 2,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkMark: {
    color: colors.brandNavy,
    fontSize: 11,
    fontWeight: '900',
    marginTop: -1,
  },
  rememberText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  forgotPassButton: {
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
  },
  signInButton: {
    marginBottom: spacing.md,
  },
  biometricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.slate100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  biometricIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  biometricText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  footerPrompt: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

