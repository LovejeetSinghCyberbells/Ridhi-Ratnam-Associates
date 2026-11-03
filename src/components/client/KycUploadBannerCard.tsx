import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme, borderRadius, spacing } from '../../theme';
import { ShieldIcon, UploadCloudIcon } from '../Icons';
import { AnimatedButton } from '../AnimatedButton';

interface KycUploadBannerCardProps {
  onPressUpload: () => void;
}

export const KycUploadBannerCard: React.FC<KycUploadBannerCardProps> = ({
  onPressUpload,
}) => {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Decorative Gold Top Accent Line */}
      <View style={[styles.topGoldBar, { backgroundColor: colors.brandGold }]} />

      <View style={styles.innerContent}>
        {/* Top Tag & Security Icon */}
        <View style={styles.headerRow}>
          <View style={[styles.shieldBadge, { backgroundColor: isDark ? colors.cardSecondary : '#FEF8E7', borderColor: colors.brandGold }]}>
            <ShieldIcon size={13} color={colors.brandGold} />
            <Text style={[styles.shieldText, { color: colors.brandGold }]}>
              DOCUMENT VERIFICATION
            </Text>
          </View>

          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.cardElevated,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <UploadCloudIcon size={18} color={colors.brandGold} />
          </View>
        </View>

        {/* Heading & Subtitle as specified */}
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          Welcome to Ridhi Ratnam Associates
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Complete your KYC verification by submitting your required documents.
        </Text>

        {/* Primary CTA Button */}
        <AnimatedButton
          testID="btn-upload-kyc-banner"
          title="Upload KYC Documents"
          showChevronTriple={true}
          variant="black"
          onPress={onPressUpload}
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
};

// Backwards-compatible alias for existing imports
export const ApplyBannerCard: React.FC<{ onPressApply?: () => void }> = ({ onPressApply }) => {
  return <KycUploadBannerCard onPressUpload={onPressApply || (() => {})} />;
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  topGoldBar: {
    height: 3,
    width: '100%',
  },
  innerContent: {
    padding: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    gap: 6,
  },
  shieldText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
    includeFontPadding: false,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    includeFontPadding: false,
  },
  ctaButton: {
    width: '100%',
  },
});

