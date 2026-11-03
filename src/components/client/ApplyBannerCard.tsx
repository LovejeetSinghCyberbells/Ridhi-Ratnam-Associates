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
            <TrendingUpIcon size={18} color="#0D0E12" />
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8EAED',
    overflow: 'hidden',
    shadowColor: '#000',
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
    backgroundColor: '#FEF9EE',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 4,
  },
  shieldText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E12',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaButton: {
    width: '100%',
  },
});
