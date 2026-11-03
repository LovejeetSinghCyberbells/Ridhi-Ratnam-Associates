import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, useAppTheme } from '../theme';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShieldIcon,
  LockIcon,
  FileTextIcon,
  CheckIcon,
  BuildingIcon,
  IdBadgeIcon,
  AlertCircleIcon,
  PhoneIcon,
  MailIcon,
  HeadphonesIcon,
  DownloadIcon,
} from '../components/Icons';
import { AnimatedButton } from '../components/AnimatedButton';
import { themeAlert } from '../components/ThemeDialog';

interface PrivacyPolicyScreenProps {
  userRole?: 'agent' | 'client';
  onBack: () => void;
  onAccept?: () => void;
}

type PolicyCategory =
  | 'all'
  | 'collection'
  | 'rbi'
  | 'security'
  | 'sharing'
  | 'rights'
  | 'grievance';

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({
  userRole = 'client',
  onBack,
  onAccept,
}) => {
  const insets = useSafeAreaInsets();
  const { colors: themeColors, isDark } = useAppTheme();
  const [accepted, setAccepted] = useState(false);

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handleBackPress = () => {
      onBack();
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [onBack]);
  const [activeCategory, setActiveCategory] = useState<PolicyCategory>('all');
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
  });

  const toggleSection = (id: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Ridhi Ratnam Associates - Privacy Policy',
        message:
          'Ridhi Ratnam Associates Client Privacy & Data Protection Policy (RBI NBFC & DPDP Act Compliant):\nhttps://ridhiratnam.demo/privacy-policy',
      });
    } catch {
      themeAlert('Share Policy', 'Unable to initiate sharing dialog on this simulator.');
    }
  };

  const handleDownloadPdf = () => {
    themeAlert(
      'Download Initiated',
      'RRA_Data_Privacy_Policy_v2.4.pdf is being prepared. Bank-grade encrypted copy will be saved to your local device storage.'
    );
  };

  const handleAcknowledge = () => {
    setAccepted(true);
    if (onAccept) {
      onAccept();
    }
    themeAlert(
      'Policy Acknowledged',
      'You have reviewed and accepted the Ridhi Ratnam Associates Data Governance & Privacy Terms.'
    );
  };

  const categoryChips: { id: PolicyCategory; label: string }[] = [
    { id: 'all', label: 'All Sections (10)' },
    { id: 'collection', label: 'Data Collection' },
    { id: 'rbi', label: 'RBI & No Device Access' },
    { id: 'security', label: 'Security & 256-Bit AES' },
    { id: 'sharing', label: 'Sharing & Zero Sale' },
    { id: 'rights', label: 'Borrower Rights' },
    { id: 'grievance', label: 'Grievance Officer' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ================= 1. CORPORATE NAVY TOP HEADER (#012655) ================= */}
      <View style={[styles.blackHeader, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.headerBackBtn}
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerSubBadge}>LEGAL & REGULATORY GOVERNANCE</Text>
          <Text style={styles.headerMainTitle}>Privacy Policy</Text>
        </View>

        <TouchableOpacity
          testID="btn-share-policy"
          activeOpacity={0.7}
          onPress={handleShare}
          style={styles.headerActionBtn}
          accessibilityLabel="Share privacy policy"
        >
          <FileTextIcon size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ================= 2. CURVED CONTENT SHEET ================= */}
      <View
        style={[
          styles.curvedSheetContainer,
          { backgroundColor: themeColors.sheetBackground },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          ]}
        >
          {/* Regulatory Trust Badge Card */}
          <View
            style={[
              styles.trustBannerCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <View style={styles.trustIconCircle}>
              <ShieldIcon size={22} color={colors.brandGold} />
            </View>
            <View style={styles.trustTextCol}>
              <View style={styles.badgeRow}>
                <View style={styles.verifiedDot} />
                <Text style={styles.badgeLabel}>
                  RBI DIGITAL LENDING & DPDP ACT 2023 COMPLIANT
                </Text>
              </View>
              <Text style={[styles.trustTitle, { color: themeColors.textPrimary }]}>
                Client Data Confidentiality Guarantee
              </Text>
              <Text style={[styles.trustSub, { color: themeColors.textSecondary }]}>
                Version 2.4 • Effective November 2026 • 256-Bit AES Bank-Grade Architecture
              </Text>
            </View>
          </View>

          {/* Quick Highlights Grid */}
          <View
            style={[
              styles.quickHighlightsGrid,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <View style={styles.highlightCol}>
              <Text style={styles.highlightTag}>DATA SALE</Text>
              <Text style={[styles.highlightValue, { color: '#047857' }]}>Zero Sale</Text>
              <Text style={[styles.highlightSub, { color: themeColors.textSecondary }]}>
                Never monetized
              </Text>
            </View>
            <View style={[styles.highlightDivider, { backgroundColor: themeColors.cardBorder }]} />
            <View style={styles.highlightCol}>
              <Text style={styles.highlightTag}>ENCRYPTION</Text>
              <Text style={[styles.highlightValue, { color: '#0284C7' }]}>256-Bit AES</Text>
              <Text style={[styles.highlightSub, { color: themeColors.textSecondary }]}>
                Rest & Transit
              </Text>
            </View>
            <View style={[styles.highlightDivider, { backgroundColor: themeColors.cardBorder }]} />
            <View style={styles.highlightCol}>
              <Text style={styles.highlightTag}>CIBIL QUERY</Text>
              <Text style={[styles.highlightValue, { color: colors.brandGold }]}>Explicit</Text>
              <Text style={[styles.highlightSub, { color: themeColors.textSecondary }]}>
                Consent-only
              </Text>
            </View>
          </View>

          {/* Action Row: Download PDF & Expand/Collapse All */}
          <View style={styles.toolbarRow}>
            <TouchableOpacity
              testID="btn-download-pdf-privacy"
              activeOpacity={0.7}
              onPress={handleDownloadPdf}
              style={[
                styles.pdfBtn,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <FileTextIcon size={14} color={isDark ? colors.brandGold : colors.topBarBlack} />
              <Text style={[styles.pdfBtnText, { color: themeColors.textPrimary }]}>
                Download PDF Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                const allOpen = Object.values(expandedSections).every((v) => v);
                const nextState: { [key: number]: boolean } = {};
                for (let i = 1; i <= 10; i++) nextState[i] = !allOpen;
                setExpandedSections(nextState);
              }}
              style={[
                styles.expandToggleBtn,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.expandToggleText, { color: themeColors.textSecondary }]}>
                {Object.values(expandedSections).every((v) => v)
                  ? 'Collapse All'
                  : 'Expand All'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Chips Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categoryChips.map((chip) => {
              const isActive = activeCategory === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  activeOpacity={0.7}
                  onPress={() => setActiveCategory(chip.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isActive
                        ? isDark
                          ? colors.brandGold
                          : colors.topBarBlack
                        : themeColors.card,
                      borderColor: isActive
                        ? 'transparent'
                        : themeColors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      {
                        color: isActive
                          ? isDark
                            ? colors.topBarBlack
                            : '#FFFFFF'
                          : themeColors.textSecondary,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ================= SECTION 1: PREAMBLE & STATUTORY SCOPE ================= */}
          {(activeCategory === 'all' || activeCategory === 'collection') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(1)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: '#0284C7' }]}>
                  <Text style={styles.sectionNumText}>1</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Preamble & Statutory Scope
                </Text>
                {expandedSections[1] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[1] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    Ridhi Ratnam Associates ("Company", "we", "us", or "our") operates as a premier financial advisory and loan syndication intermediation firm originating credit facilities in collaboration with Reserve Bank of India ("RBI") regulated Scheduled Commercial Banks and Non-Banking Financial Companies ("NBFCs").
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 8 }]}>
                    This Policy governs the collection, processing, transmission, and statutory retention of personal and financial information in strict conformance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000, and the RBI Master Directions on Digital Lending.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 2: CATEGORIES OF DATA COLLECTED ================= */}
          {(activeCategory === 'all' || activeCategory === 'collection') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(2)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: '#047857' }]}>
                  <Text style={styles.sectionNumText}>2</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Categories of Personal & Financial Data
                </Text>
                {expandedSections[2] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[2] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    To assess borrowing eligibility and fulfill underwriting mandates, we collect only necessary data with your explicit, revocable consent:
                  </Text>

                  <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                      <View style={[styles.bulletDot, { backgroundColor: colors.brandGold }]} />
                      <Text style={[styles.bulletText, { color: themeColors.textPrimary }]}>
                        <Text style={styles.boldText}>Identity & KYC Proofs:</Text> Permanent Account Number (PAN), masked Aadhaar XML (OTP-authenticated e-KYC without biometric capture), Passport, or Voter ID.
                      </Text>
                    </View>

                    <View style={styles.bulletItem}>
                      <View style={[styles.bulletDot, { backgroundColor: colors.brandGold }]} />
                      <Text style={[styles.bulletText, { color: themeColors.textPrimary }]}>
                        <Text style={styles.boldText}>Financial Disclosures:</Text> Bank statements via RBI-certified Account Aggregator or verified parsers, Income Tax Returns (ITR-4/V), Audited Financials, and monthly GSTR-3B filings.
                      </Text>
                    </View>

                    <View style={styles.bulletItem}>
                      <View style={[styles.bulletDot, { backgroundColor: colors.brandGold }]} />
                      <Text style={[styles.bulletText, { color: themeColors.textPrimary }]}>
                        <Text style={styles.boldText}>Employment & Business Records:</Text> Salary slips, Form 16, GSTIN certificate, Udyam MSME Registration, Partnership Deeds, and MOA/AOA charters.
                      </Text>
                    </View>

                    <View style={styles.bulletItem}>
                      <View style={[styles.bulletDot, { backgroundColor: colors.brandGold }]} />
                      <Text style={[styles.bulletText, { color: themeColors.textPrimary }]}>
                        <Text style={styles.boldText}>Credit History Data:</Text> Comprehensive credit score and repayment track records retrieved from authorized Credit Information Companies (CIBIL, Experian, Equifax, CRIF).
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 3: LAWFUL PURPOSE OF PROCESSING ================= */}
          {(activeCategory === 'all' || activeCategory === 'collection') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(3)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.brandGold }]}>
                  <Text style={styles.sectionNumText}>3</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Lawful Purpose & Underwriting Basis
                </Text>
                {expandedSections[3] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[3] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    All collected information is processed solely for lawful lending intermediation operations:
                  </Text>

                  <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                      <CheckIcon size={14} color="#047857" />
                      <Text style={[styles.bulletText, { color: themeColors.textPrimary, marginLeft: 8 }]}>
                        Underwriting assessment: Calculating Debt-to-Income (FOIR), Loan-to-Value (LTV), and creditworthiness ratios.
                      </Text>
                    </View>

                    <View style={styles.bulletItem}>
                      <CheckIcon size={14} color="#047857" />
                      <Text style={[styles.bulletText, { color: themeColors.textPrimary, marginLeft: 8 }]}>
                        Statutory KYC & Anti-Money Laundering (AML) checks against domestic and international sanction gazettes.
                      </Text>
                    </View>

                    <View style={styles.bulletItem}>
                      <CheckIcon size={14} color="#047857" />
                      <Text style={[styles.bulletText, { color: themeColors.textPrimary, marginLeft: 8 }]}>
                        NACH / e-Mandate automated repayment setup for electronic monthly installment settlement.
                      </Text>
                    </View>

                    <View style={styles.bulletItem}>
                      <CheckIcon size={14} color="#047857" />
                      <Text style={[styles.bulletText, { color: themeColors.textPrimary, marginLeft: 8 }]}>
                        Real-time delivery of transactional loan status updates, RTGS disbursement receipts, and repayment reminders.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 4: STRICT PROHIBITION ON DEVICE ACCESS ================= */}
          {(activeCategory === 'all' || activeCategory === 'rbi') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(4)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: '#DC2626' }]}>
                  <Text style={styles.sectionNumText}>4</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Prohibition on Device & Biometric Access
                </Text>
                {expandedSections[4] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[4] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    Under the Reserve Bank of India (RBI) Digital Lending Directions, Ridhi Ratnam Associates enforces zero-access restrictions across all mobile and client interfaces:
                  </Text>

                  <View style={styles.securityGrid}>
                    <View
                      style={[
                        styles.securityCard,
                        {
                          backgroundColor: isDark ? themeColors.cardSecondary : '#FEF2F2',
                          borderColor: isDark ? '#B91C1C' : '#FECACA',
                        },
                      ]}
                    >
                      <AlertCircleIcon size={16} color="#DC2626" />
                      <Text style={[styles.securityTitle, { color: isDark ? '#F87171' : '#991B1B' }]}>
                        No Contacts or Photos
                      </Text>
                      <Text style={[styles.securitySub, { color: themeColors.textSecondary }]}>
                        We never request access to your contact list, call records, SMS inbox, or device photo galleries.
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.securityCard,
                        {
                          backgroundColor: isDark ? themeColors.cardSecondary : '#FEF2F2',
                          borderColor: isDark ? '#B91C1C' : '#FECACA',
                        },
                      ]}
                    >
                      <AlertCircleIcon size={16} color="#DC2626" />
                      <Text style={[styles.securityTitle, { color: isDark ? '#F87171' : '#991B1B' }]}>
                        No Biometric Storage
                      </Text>
                      <Text style={[styles.securitySub, { color: themeColors.textSecondary }]}>
                        Fingerprint or facial scans are never captured, processed, or retained on our systems.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 5: BANK-GRADE SECURITY & ENCRYPTION ================= */}
          {(activeCategory === 'all' || activeCategory === 'security') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(5)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: '#6366F1' }]}>
                  <Text style={styles.sectionNumText}>5</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Bank-Grade Security Architecture
                </Text>
                {expandedSections[5] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[5] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    We implement defense-in-depth technical and organizational controls to protect customer credit dossiers:
                  </Text>

                  <View style={styles.securityGrid}>
                    <View
                      style={[
                        styles.securityCard,
                        {
                          backgroundColor: isDark ? themeColors.cardSecondary : '#F8FAFC',
                          borderColor: themeColors.cardBorder,
                        },
                      ]}
                    >
                      <LockIcon size={16} color="#0284C7" />
                      <Text style={[styles.securityTitle, { color: themeColors.textPrimary }]}>
                        256-Bit AES & TLS 1.3
                      </Text>
                      <Text style={[styles.securitySub, { color: themeColors.textSecondary }]}>
                        All records encrypted at rest and in transit across ISO 27001 data centers strictly in India.
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.securityCard,
                        {
                          backgroundColor: isDark ? themeColors.cardSecondary : '#F8FAFC',
                          borderColor: themeColors.cardBorder,
                        },
                      ]}
                    >
                      <ShieldIcon size={16} color="#047857" />
                      <Text style={[styles.securityTitle, { color: themeColors.textPrimary }]}>
                        Role-Based Access
                      </Text>
                      <Text style={[styles.securitySub, { color: themeColors.textSecondary }]}>
                        Strictly compartmentalized underwriting access governed by multi-factor authentication (MFA).
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 6: ZERO SALE & AUTHORIZED SHARING ================= */}
          {(activeCategory === 'all' || activeCategory === 'sharing') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(6)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: '#B45309' }]}>
                  <Text style={styles.sectionNumText}>6</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Zero Sale & Authorized Disclosures
                </Text>
                {expandedSections[6] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[6] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    We share applicant credit dossiers strictly on a need-to-know basis with authorized entities:
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 6 }]}>
                    • <Text style={styles.boldText}>Regulated Lending Partners:</Text> Scheduled Commercial Banks and NBFCs directly underwriting and funding the sanctioned facility.
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 6 }]}>
                    • <Text style={styles.boldText}>Verification Gateways:</Text> UIDAI (Aadhaar e-KYC), NSDL (PAN validation), GSTN, and certified Credit Bureaus (CIBIL, Experian).
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 6 }]}>
                    • <Text style={styles.boldText}>Strict Non-Monetization:</Text> Ridhi Ratnam Associates guarantees that your data is never sold, traded, or shared with unsolicited third-party marketing networks.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 7: ACCOUNT AGGREGATOR FRAMEWORK ================= */}
          {(activeCategory === 'all' || activeCategory === 'sharing') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(7)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: '#0D9488' }]}>
                  <Text style={styles.sectionNumText}>7</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Account Aggregator (AA) Integration
                </Text>
                {expandedSections[7] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[7] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    Financial statement verification operates through RBI-regulated Account Aggregator (AA) networks:
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 8 }]}>
                    • <Text style={styles.boldText}>End-to-End Encryption:</Text> Statement data travels encrypted directly between your bank (FIP) and our underwriting engine (FIU).
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 6 }]}>
                    • <Text style={styles.boldText}>Revocable Consent Handles:</Text> You retain the right to inspect, pause, or revoke consent handles at any time through your preferred Account Aggregator app.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 8: RETENTION & CRYPTOGRAPHIC ERASURE ================= */}
          {(activeCategory === 'all' || activeCategory === 'rights') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(8)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.sectionNumText}>8</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Statutory Retention & Cryptographic Erasure
                </Text>
                {expandedSections[8] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[8] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    Under the Prevention of Money Laundering Act (PMLA) and RBI Master Directions:
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 8 }]}>
                    • <Text style={styles.boldText}>8-Year Statutory Mandate:</Text> Loan transaction ledgers, sanction letters, and KYC dossiers are retained for eight (8) years following loan closure.
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 6 }]}>
                    • <Text style={styles.boldText}>Unfunded Applications:</Text> Incomplete drafts or rejected prospect dossiers are cryptographically shredded after 180 days upon borrower request.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 9: BORROWER RIGHTS UNDER DPDP ACT 2023 ================= */}
          {(activeCategory === 'all' || activeCategory === 'rights') && (
            <View
              style={[
                styles.policySectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(9)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: '#2563EB' }]}>
                  <Text style={styles.sectionNumText}>9</Text>
                </View>
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary }]}>
                  Data Principal Rights (DPDP Act 2023)
                </Text>
                {expandedSections[9] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[9] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary }]}>
                    As a Data Principal under Indian data protection law, you possess enforceable rights:
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 8 }]}>
                    • <Text style={styles.boldText}>Right to Summary:</Text> Request a summary of personal data held and identities of all lending institutions with whom data was shared.
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 6 }]}>
                    • <Text style={styles.boldText}>Right to Correction:</Text> Rectify inaccurate, incomplete, or outdated personal or financial information.
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 6 }]}>
                    • <Text style={styles.boldText}>Right to Nominate:</Text> Designate an authorized nominee in the event of death or legal incapacity.
                  </Text>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 6 }]}>
                    • <Text style={styles.boldText}>Right to Withdraw Consent:</Text> Revoke processing consent (subject to active loan repayment contractual obligations).
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* ================= SECTION 10: GRIEVANCE REDRESSAL & OMBUDSMAN ================= */}
          {(activeCategory === 'all' || activeCategory === 'grievance') && (
            <View
              style={[
                styles.grievanceCard,
                {
                  backgroundColor: isDark ? themeColors.cardSecondary : '#FEFBF3',
                  borderColor: colors.brandGold,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSection(10)}
                style={styles.sectionHeaderRow}
              >
                <HeadphonesIcon size={18} color={colors.brandGold} />
                <Text style={[styles.sectionTitleText, { color: themeColors.textPrimary, marginLeft: 8 }]}>
                  Grievance Redressal & Ombudsman
                </Text>
                {expandedSections[10] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedSections[10] && (
                <View style={styles.clauseBody}>
                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 4 }]}>
                    For privacy inquiries, bureau record disputes, or data protection escalations, please contact our designated statutory authority:
                  </Text>

                  <View style={styles.officerBox}>
                    <Text style={[styles.officerName, { color: themeColors.textPrimary }]}>
                      Mr. Vikramaditya Rathore
                    </Text>
                    <Text style={[styles.officerRole, { color: themeColors.textSecondary }]}>
                      Chief Grievance Redressal Officer (CGRO)
                    </Text>
                    <Text style={[styles.officerContact, { color: themeColors.textSecondary }]}>
                      ✉️ privacy.grievance@ridhiratnam.demo • 📞 1800 234 5678 (Ext. 4)
                    </Text>
                    <Text style={[styles.officerContact, { color: themeColors.textSecondary, marginTop: 2 }]}>
                      📍 Ridhi Ratnam Tower, Sector 17-C, Chandigarh, 160017
                    </Text>
                  </View>

                  <Text style={[styles.bodyParagraph, { color: themeColors.textSecondary, marginTop: 10, fontSize: 12 }]}>
                    If grievances remain unresolved within thirty (30) business days, borrowers may escalate to the Reserve Bank of India Complaint Management System (RBI CMS) at <Text style={styles.boldText}>https://cms.rbi.org.in</Text>.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Bottom Acknowledgment Action */}
          <AnimatedButton
            testID="btn-acknowledge-privacy-policy"
            title={accepted ? 'Policy Acknowledged ✓' : 'I Acknowledge & Accept Policy'}
            variant="black"
            onPress={handleAcknowledge}
            style={styles.actionBtn}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.topBarBlack,
  },

  // Corporate Navy Top Header (#012655)
  blackHeader: {
    backgroundColor: colors.topBarBlack,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.brandGold,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Curved Content Sheet
  curvedSheetContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    marginTop: -16,
  },
  scrollContent: {
    padding: 20,
  },

  // Trust Banner Card
  trustBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  trustIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(205, 161, 72, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  trustTextCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.brandGold,
    letterSpacing: 0.5,
  },
  trustTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  trustSub: {
    fontSize: 11,
    marginTop: 2,
  },

  // Quick Highlights Grid
  quickHighlightsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  highlightCol: {
    flex: 1,
    alignItems: 'center',
  },
  highlightTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  highlightValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  highlightSub: {
    fontSize: 10,
    marginTop: 1,
  },
  highlightDivider: {
    width: 1,
    height: 26,
  },

  // Toolbar Row: Download PDF & Expand/Collapse All
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  pdfBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    gap: 6,
  },
  pdfBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  expandToggleBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Category Filter Chips
  categoryScroll: {
    paddingBottom: 14,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
  },

  // Policy Section Cards
  policySectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionNumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitleText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  clauseBody: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  bodyParagraph: {
    fontSize: 13,
    lineHeight: 19,
  },
  boldText: {
    fontWeight: '700',
  },
  bulletList: {
    marginTop: 8,
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },

  // Security Architecture Cards Grid
  securityGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  securityCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },
  securitySub: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },

  // Grievance Card
  grievanceCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
  },
  officerBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(205, 161, 72, 0.08)',
  },
  officerName: {
    fontSize: 14,
    fontWeight: '800',
  },
  officerRole: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  officerContact: {
    fontSize: 11.5,
    marginTop: 4,
    lineHeight: 16,
  },

  // Action Button
  actionBtn: {
    marginTop: 4,
    marginBottom: 20,
  },
});
