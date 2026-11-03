import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Crisp, elegant fade-in entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 2. Loading indicator
    Animated.timing(barProgress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // 3. Automated transition after splash duration
    const timer = setTimeout(() => {
      onFinish();
    }, 1200);

    return () => clearTimeout(timer);
  }, [fadeAnim, barProgress, onFinish]);

  const progressWidth = barProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Centered Brand Presentation */}
      <Animated.View
        style={[
          styles.centerBrandWrapper,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Company Logo in clean circular container */}
        <View style={styles.logoBadgeContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Company Title */}
        <Text style={styles.brandTitle}>Ridhi Ratnam Associates</Text>

        {/* Tagline Badge */}
        <View style={styles.taglineBadge}>
          <View style={styles.goldDot} />
          <Text style={styles.taglineText}>YOUR FINANCIAL GROWTH PARTNER</Text>
        </View>
      </Animated.View>

      {/* Bottom Loading Progress Bar */}
      <View style={styles.bottomProgressWrapper}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
        <Text style={styles.copyrightText}>LOAN & FINANCIAL ADVISORY SERVICES</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xxxl + 10,
    paddingHorizontal: spacing.xl,
  },
  centerBrandWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeContainer: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: 110,
    height: 74,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: borderRadius.pill,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  goldDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.brandGold,
    marginRight: 8,
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate600,
    letterSpacing: 1,
  },
  bottomProgressWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    width: 120,
    height: 3,
    backgroundColor: colors.slate200,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.topBarBlack,
    borderRadius: 1.5,
  },
  copyrightText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate400,
    letterSpacing: 1.2,
  },
});
