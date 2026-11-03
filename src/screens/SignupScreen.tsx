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
import { PillChip } from '../components/PillChip';
import { themeAlert } from '../components/ThemeDialog';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
  onBack?: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onNavigateToLogin,
  onBack,
}) => {
  const [role, setRole] = useState<UserRole>('client');

  // Common Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Agent Specific Fields
  const [agentCode, setAgentCode] = useState('');
  const [agencyName, setAgencyName] = useState('');

  // Client Specific Interests (Pill chips from theme)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Mutual Funds',
    'SIP Growth',
  ]);

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeAccent = role === 'client' ? colors.accentMint : colors.brandGold;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegister = () => {
    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (role === 'agent' && !agentCode.trim()) {
      setErrorMessage('Please enter your ARN or Agent Code');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide your mobile phone number');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service to continue');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      themeAlert(
        'Account Registered!',
        `Your ${
          role === 'client' ? 'Client' : 'Agent Partner'
        } account for ${fullName} has been created successfully. Welcome to Ridhi Ratnam Associates!`,
        [
          {
            text: 'Proceed to Login',
            onPress: onNavigateToLogin,
          },
        ]
      );
    }, 1300);
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
          title="Create Account"
          subtitle="Join Ridhi Ratnam Associates and unlock custom financial growth strategies."
          badge="NEW REGISTRATION"
          badgeColor={activeAccent}
          showBack={!!onBack}
          onBack={onBack}
        />

        {/* Logo */}
        <View style={styles.logoRow}>
          <BrandLogo size="small" showTagline={false} />
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* User Role Switcher */}
          <Text style={styles.roleHeaderLabel}>Select Your Account Type</Text>
          <RoleSelector selectedRole={role} onSelectRole={setRole} />

          {/* Simple Fields */}
          <View style={styles.fieldsContainer}>
            <CustomInput
              label="Full Name"
              placeholder="e.g. Paul Wilson"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setErrorMessage('');
              }}
              leftIcon="👤"
              accentColor={activeAccent}
            />

            {/* If Agent, require ARN/Agent Code & Agency Name */}
            {role === 'agent' && (
              <>
                <CustomInput
                  label="Agent / ARN Code *"
                  placeholder="e.g. ARN-109482"
                  value={agentCode}
                  onChangeText={(text) => {
                    setAgentCode(text);
                    setErrorMessage('');
                  }}
                  leftIcon="🏷️"
                  accentColor={colors.brandGold}
                  autoCapitalize="characters"
                />

                <CustomInput
                  label="Agency / Branch Name (Optional)"
                  placeholder="e.g. North Delhi Wealth Branch"
                  value={agencyName}
                  onChangeText={setAgencyName}
                  leftIcon="🏢"
                  accentColor={colors.brandGold}
                />
              </>
            )}

            <CustomInput
              label={role === 'client' ? 'Email Address' : 'Official Work Email'}
              placeholder="name@domain.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage('');
              }}
              leftIcon="✉️"
              accentColor={activeAccent}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Mobile Number"
              placeholder="+91 98765 43210"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrorMessage('');
              }}
              leftIcon="📱"
              accentColor={activeAccent}
              keyboardType="phone-pad"
            />

            <CustomInput
              label="Password"
              placeholder="Minimum 6 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage('');
              }}
              isPassword={true}
              leftIcon="🔒"
              accentColor={activeAccent}
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrorMessage('');
              }}
              isPassword={true}
              leftIcon="🔐"
              accentColor={activeAccent}
            />

            {/* Client Interest Pills (Inspired by Theme Screenshot Mood Pills) */}
            {role === 'client' && (
              <View style={styles.interestSection}>
                <Text style={styles.interestSectionTitle}>
                  Your Wealth Interests (Optional)
                </Text>
                <View style={styles.chipsRow}>
                  {['Mutual Funds', 'SIP Growth', 'Tax Advisory', 'Retirement', 'Equities'].map(
                    (item) => (
                      <PillChip
                        key={item}
                        label={item}
                        selected={selectedInterests.includes(item)}
                        onPress={() => toggleInterest(item)}
                        accentColor={colors.accentMint}
                      />
                    )
                  )}
                </View>
              </View>
            )}

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {errorMessage}</Text>
              </View>
            ) : null}

            {/* Terms & Conditions Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAgreeTerms(!agreeTerms)}
              style={styles.termsRow}
            >
              <View
                style={[
                  styles.checkbox,
                  agreeTerms && { backgroundColor: activeAccent, borderColor: activeAccent },
                ]}
              >
                {agreeTerms && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={[styles.termsLink, { color: activeAccent }]}>Terms of Service</Text>{' '}
                and{' '}
                <Text style={[styles.termsLink, { color: activeAccent }]}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <AnimatedButton
              title={`Register as ${role === 'client' ? 'Client' : 'Agent'}`}
              variant="white"
              showArrow={true}
              loading={loading}
              onPress={handleRegister}
              style={styles.registerButton}
            />
          </View>
        </View>

        {/* Footer Link to Login */}
        <View style={styles.footerLinkRow}>
          <Text style={styles.footerPrompt}>Already have an account? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToLogin}>
            <Text style={[styles.signInLink, { color: activeAccent }]}>
              Sign In
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
    shadowColor: '#000',
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
  interestSection: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  interestSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkMark: {
    color: '#0A0E17',
    fontSize: 11,
    fontWeight: '900',
    marginTop: -1,
  },
  termsText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '700',
  },
  registerButton: {
    marginBottom: spacing.sm,
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
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

