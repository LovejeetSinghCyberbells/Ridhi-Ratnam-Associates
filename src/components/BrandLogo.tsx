import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  animated?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'medium',
  showTagline = true,
  animated = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.03,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 2200,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 0.8,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.4,
              duration: 2200,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [animated, pulseAnim, glowAnim]);

  const dimensions = {
    small: { width: 140, height: 75, cardSize: 85 },
    medium: { width: 190, height: 100, cardSize: 110 },
    large: { width: 240, height: 125, cardSize: 140 },
  }[size];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoCard,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowAnim,
            },
          ]}
        />
        {/* Logo Image */}
        <Image
          source={require('../../assets/images/logo.png')}
          style={[styles.logoImage, { width: dimensions.width, height: dimensions.height }]}
          resizeMode="contain"
        />
      </Animated.View>

      {showTagline && (
        <View style={styles.taglineContainer}>
          <View style={styles.pillBadge}>
            <View style={styles.goldDot} />
            <Text style={styles.taglineText}>YOUR FINANCIAL GROWTH PARTNER</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.cardLarge,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
  },
  glowRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: borderRadius.cardLarge,
    borderWidth: 2,
    borderColor: colors.brandGold,
  },
  logoImage: {
    // sizing provided dynamically
  },
  taglineContainer: {
    marginTop: spacing.md,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlightGoldSoft,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.brandGoldLight,
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandGold,
    marginRight: 6,
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brandGoldLight,
    letterSpacing: 1.2,
  },
});
