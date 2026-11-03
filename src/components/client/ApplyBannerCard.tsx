import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { AnimatedButton } from '../AnimatedButton';
import { ShieldIcon, TrendingUpIcon } from '../Icons';

interface ApplyBannerCardProps {
  onPressApply: () => void;
}

export const ApplyBannerCard: React.FC<ApplyBannerCardProps> = ({ onPressApply }) => {
  return (
    <View style={styles.cardContainer}>
      {/* Decorative Gold Top Border Line */}
      <View style={styles.topGoldBar} />

      <View style={styles.innerContent}>
        {/* Top Row with Header and Financial Line Badge */}
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <View style={styles.shieldBadge}>
              <ShieldIcon size={14} color={colors.brandGold} />
              <Text style={styles.shieldText}>FINANCIAL ADVANCEMENT</Text>
            </View>
          </View>

          <View style={styles.iconCircle}>
            <TrendingUpIcon size={18} color={colors.textPrimary} />
          </View>
        </View>

        <Text style={styles.heading}>Looking for Financial Support?</Text>
        <Text style={styles.description}>
          Explore loan options and submit your application with Ridhi Ratnam Associates.
        </Text>

        {/* Primary CTA Button */}
        <AnimatedButton
          title="Apply for Loan"
          showChevronTriple={true}
          variant="black"
          onPress={onPressApply}
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  topGoldBar: {
    height: 3.5,
    backgroundColor: colors.brandGold,
    width: '100%',
  },
  innerContent: {
    padding: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandGoldSoft,
    borderWidth: 1,
    borderColor: colors.brandGoldLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 4,
  },
  shieldText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.brandGoldDark,
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: colors.slate500,
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaButton: {
    width: '100%',
  },
});
