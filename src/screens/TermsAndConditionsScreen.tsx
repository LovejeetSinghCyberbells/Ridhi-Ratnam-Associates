import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from '../components/Icons';
import { AnimatedButton } from '../components/AnimatedButton';
import { themeAlert } from '../components/ThemeDialog';

interface TermsAndConditionsScreenProps {
  userRole?: 'agent' | 'client';
  onBack: () => void;
  onAccept?: () => void;
}

type ClauseCategory = 'all' | 'kyc' | 'sanction' | 'repayment' | 'rights' | 'legal';

export const TermsAndConditionsScreen: React.FC<TermsAndConditionsScreenProps> = ({
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
  const [activeCategory, setActiveCategory] = useState<ClauseCategory>('all');
  const [expandedClauses, setExpandedClauses] = useState<{ [key: number]: boolean }>({
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

  const toggleClause = (id: number) => {
    setExpandedClauses(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Ridhi Ratnam Associates - Terms & Conditions',
        message:
          'Ridhi Ratnam Associates Loan Syndication & Advisory Terms & Conditions:\nhttps://ridhiratnam.demo/terms-conditions',
      });
    } catch {
      themeAlert('Share Terms', 'Unable to initiate sharing dialog on this simulator.');
    }
  };

  const handleDownloadPdf = () => {
    themeAlert(
      'Download Agreement Summary',
      'The standardized Ridhi Ratnam Associates Loan Origination & Syndication Terms (PDF v3.4) has been generated and saved to your device cache.'
    );
  };

  const handleAcknowledge = () => {
    setAccepted(true);
    if (onAccept) {
      onAccept();
    }
    themeAlert(
      'Terms Accepted',
      'You have reviewed and accepted the Ridhi Ratnam Associates Loan Syndication & Financial Advisory Terms.'
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ================= 1. BLACK TOP HEADER (Standard Design) ================= */}
      <View style={[styles.blackHeader, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <TouchableOpacity
          testID="btn-terms-back"
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.headerBackBtn}
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon size={20} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerSubBadge}>LEGAL & REGULATORY GOVERNANCE</Text>
          <Text style={styles.headerMainTitle}>Terms & Conditions</Text>
        </View>

        <TouchableOpacity
          testID="btn-share-terms"
          activeOpacity={0.7}
          onPress={handleShare}
          style={styles.headerActionBtn}
          accessibilityLabel="Share terms and conditions"
        >
          <FileTextIcon size={16} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* ================= 2. CURVED CONTENT SHEET ================= */}
      <View
        style={[
          styles.curvedSheet,
          {
            backgroundColor: themeColors.background,
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          ]}
        >
          {/* Trust Banner */}
          <View
            style={[
              styles.trustBanner,
              {
                backgroundColor: colors.slate100,
                borderColor: colors.borderDark,
              },
            ]}
          >
            <View style={styles.trustBadgeRow}>
              <View style={styles.greenPulseDot} />
              <Text style={[styles.trustBadgeText, { color: colors.statusReview }]}>
                RBI FAIR PRACTICES CODE & DIGITAL LENDING GOVERNANCE
              </Text>
            </View>
            <Text style={[styles.trustDescription, { color: themeColors.textSecondary }]}>
              These Terms & Conditions constitute a legally binding agreement between you
              (the "Applicant / Borrower / Channel Partner") and Ridhi Ratnam Associates Private
              Limited, governing all loan origination, syndication, credit evaluation, and advisory
              facilities.
            </Text>
            <View style={styles.trustMetaRow}>
              <Text style={[styles.trustMetaText, { color: themeColors.textSecondary }]}>
                Effective Date: October 2026 • Version: 3.4 • RBI Circular Compliance Verified
              </Text>
            </View>
          </View>

          {/* Quick Highlights Grid */}
          <View style={styles.summaryGrid}>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <BuildingIcon size={20} color={colors.brandGold} />
              <Text style={[styles.summaryCardTitle, { color: themeColors.textPrimary }]}>
                Authorized Partner
              </Text>
              <Text style={[styles.summaryCardDesc, { color: themeColors.textSecondary }]}>
                Partnered with scheduled commercial banks & RBI-registered NBFCs
              </Text>
            </View>

            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <LockIcon size={20} color={colors.accentMint} />
              <Text style={[styles.summaryCardTitle, { color: themeColors.textPrimary }]}>
                Zero Upfront Fees
              </Text>
              <Text style={[styles.summaryCardDesc, { color: themeColors.textSecondary }]}>
                No unauthorized advance fees; all charges clearly stated in sanction letters
              </Text>
            </View>

            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <ShieldIcon size={20} color={colors.info} />
              <Text style={[styles.summaryCardTitle, { color: themeColors.textPrimary }]}>
                NACH e-Mandate
              </Text>
              <Text style={[styles.summaryCardDesc, { color: themeColors.textSecondary }]}>
                Automated electronic repayment via NPCI-certified NACH protocols
              </Text>
            </View>
          </View>

          {/* Action Row: Download PDF & Expand All */}
          <View style={styles.toolbarRow}>
            <TouchableOpacity
              testID="btn-download-pdf-terms"
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
              <FileTextIcon size={14} color={colors.topBarBlack} />
              <Text style={[styles.pdfBtnText, { color: themeColors.textPrimary }]}>
                Download PDF Summary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                const allOpen = Object.values(expandedClauses).every(v => v);
                const nextState: { [key: number]: boolean } = {};
                for (let i = 1; i <= 10; i++) nextState[i] = !allOpen;
                setExpandedClauses(nextState);
              }}
              style={[
                styles.expandAllBtn,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.expandAllText, { color: themeColors.textSecondary }]}>
                {Object.values(expandedClauses).every(v => v) ? 'Collapse All' : 'Expand All'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsScroll}
          >
            {[
              { id: 'all', label: 'All Clauses' },
              { id: 'kyc', label: 'Eligibility & KYC' },
              { id: 'sanction', label: 'Sanction & KFS' },
              { id: 'repayment', label: 'NACH & Repayment' },
              { id: 'rights', label: 'Borrower Rights' },
              { id: 'legal', label: 'Legal & Jurisdiction' },
            ].map(chip => {
              const isActive = activeCategory === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  activeOpacity={0.7}
                  onPress={() => setActiveCategory(chip.id as ClauseCategory)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isActive
                        ? colors.topBarBlack
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
                          ? colors.white
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

          {/* Section 1: Scope of Intermediation & Advisory Facilities */}
          {(activeCategory === 'all' || activeCategory === 'kyc') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(1)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.brandGold }]}>
                  <Text style={styles.sectionNumText}>1</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Scope of Intermediation & Advisory Facilities
                </Text>
                {expandedClauses[1] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[1] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    Ridhi Ratnam Associates operates as an authorized corporate loan syndication and
                    origination partner ("Lending Service Provider / LSP") representing scheduled
                    commercial banks and Reserve Bank of India (RBI) registered Non-Banking Financial
                    Companies (NBFCs).
                  </Text>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary, marginTop: 8 }]}>
                    We do not directly disburse funds from our corporate balance sheet; all credit appraisal,
                    risk underwriting, final sanction, interest rate determination, and fund disbursements
                    are executed directly by regulated lending institutions in full adherence to the RBI
                    Master Directions on Digital Lending.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Section 2: Eligibility, KYC & Document Verification */}
          {(activeCategory === 'all' || activeCategory === 'kyc') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(2)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.info }]}>
                  <Text style={styles.sectionNumText}>2</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Applicant Eligibility & KYC Verification
                </Text>
                {expandedClauses[2] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[2] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    By submitting an application through this portal, the Applicant represents and warrants
                    that:
                  </Text>
                  <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        The applicant is a resident citizen of India aged between 21 and 65 years, or a
                        registered entity (Sole Proprietorship, Partnership, LLP, or Private Limited Company).
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        All submitted documentation—including Permanent Account Number (PAN), Aadhaar,
                        Goods & Services Tax (GST) returns, bank statements, and audited financials—are genuine,
                        valid, and legally authentic.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        The applicant explicitly authorizes Ridhi Ratnam Associates and its lending partners
                        to pull credit reports from registered Credit Information Companies (CIBIL, Experian,
                        Equifax, CRIF High Mark) to determine creditworthiness.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Section 3: Loan Sanction, Pricing & Key Fact Statement */}
          {(activeCategory === 'all' || activeCategory === 'sanction') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(3)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.accentMint }]}>
                  <Text style={styles.sectionNumText}>3</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Sanction Terms & Key Fact Statement (KFS)
                </Text>
                {expandedClauses[3] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[3] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    Upon preliminary underwriting approval, a standardized Key Fact Statement (KFS)
                    conforming to RBI circular RBI/2023-24/139 will be issued prior to loan agreement
                    execution.
                  </Text>
                  <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        <Text style={{ fontWeight: '700', color: themeColors.textPrimary }}>
                          Annual Percentage Rate (APR):
                        </Text>{' '}
                        All interest rates, processing fees, documentation costs, and statutory taxes
                        are explicitly aggregated into the APR with zero hidden markups.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        <Text style={{ fontWeight: '700', color: themeColors.textPrimary }}>
                          Sanction Validity:
                        </Text>{' '}
                        Formal sanction letters remain valid for 30 calendar days from the date of issue.
                        Disbursements are contingent upon satisfactory physical or digital pre-disbursement
                        verification.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        <Text style={{ fontWeight: '700', color: themeColors.textPrimary }}>
                          Cooling-Off Period:
                        </Text>{' '}
                        Borrowers are entitled to a statutory cooling-off look-up period of at least 3 days
                        to exit the facility by paying proportionate principal and APR without prepayment penalty.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Section 4: Repayment, NACH Mandates & Default */}
          {(activeCategory === 'all' || activeCategory === 'repayment') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(4)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.accentPurple }]}>
                  <Text style={styles.sectionNumText}>4</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Repayments, NACH Mandates & Penalties
                </Text>
                {expandedClauses[4] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[4] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    Borrowers must set up an automated electronic clearing mandate (NACH / e-NACH / UPI
                    AutoPay) with their designated primary operative bank account for periodic installment
                    debits.
                  </Text>
                  <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        <Text style={{ fontWeight: '700', color: themeColors.textPrimary }}>
                          Sufficient Balance:
                        </Text>{' '}
                        The borrower agrees to maintain clear balance in the linked bank account at least 24
                        hours prior to the scheduled EMI debit date.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        <Text style={{ fontWeight: '700', color: themeColors.textPrimary }}>
                          Dishonor & Bounce Charges:
                        </Text>{' '}
                        In the event of mandate dishonor, standardized cheque/mandate return charges (₹450 to
                        ₹750 + GST) and penal interest as specified in the lender loan agreement will apply.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        <Text style={{ fontWeight: '700', color: themeColors.textPrimary }}>
                          Credit Bureau Reporting:
                        </Text>{' '}
                        Delays exceeding 30 days past due (DPD) are reported to all 4 credit bureaus per
                        statutory mandates, directly impacting the borrower's credit score.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Section 5: Pre-payment, Foreclosure & Charges */}
          {(activeCategory === 'all' || activeCategory === 'rights') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(5)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.warning }]}>
                  <Text style={styles.sectionNumText}>5</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Foreclosure & Pre-Payment Regulations
                </Text>
                {expandedClauses[5] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[5] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    In accordance with Reserve Bank of India circulars regarding foreclosure charges:
                  </Text>
                  <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        No foreclosure charges or prepayment penalties are levied on floating-rate term loans
                        sanctioned to individual borrowers for non-business purposes.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        Commercial facilities, fixed-rate loans, or non-individual business borrowings are
                        subject to transparent prepayment schedules disclosed in the definitive sanction agreement.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Section 6: Prohibition of Fund Diversion & Speculative End-Use */}
          {(activeCategory === 'all' || activeCategory === 'repayment') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(6)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.error }]}>
                  <Text style={styles.sectionNumText}>6</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Prohibition of Speculative End-Use & Anti-Money Laundering
                </Text>
                {expandedClauses[6] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[6] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    The applicant covenants that funds disbursed shall be utilized strictly for the lawful
                    business or personal purpose declared in the application. Any diversion of funds into
                    speculative equity trading, cryptocurrencies, real estate speculation, or activities
                    prohibited under the Prevention of Money Laundering Act (PMLA 2002) is strictly barred
                    and will trigger immediate loan acceleration and legal recovery.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Section 7: Fair Practice Code & Recovery Standards */}
          {(activeCategory === 'all' || activeCategory === 'rights') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(7)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.statusApproved }]}>
                  <Text style={styles.sectionNumText}>7</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Fair Practice Code & Dignified Recovery Guidelines
                </Text>
                {expandedClauses[7] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[7] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    Ridhi Ratnam Associates strictly upholds the RBI Fair Practices Code for Lenders:
                  </Text>
                  <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        Borrower communications regarding outstanding dues shall strictly take place
                        between 08:00 AM and 07:00 PM IST.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={[styles.bulletText, { color: themeColors.textSecondary }]}>
                        Zero tolerance for verbal intimidation, harassment, unannounced visits, or
                        contacting personal references outside verified statutory guarantors.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Section 8: Electronic Records & IT Act 2000 */}
          {(activeCategory === 'all' || activeCategory === 'legal') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(8)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.accentBlue }]}>
                  <Text style={styles.sectionNumText}>8</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Electronic Records & Digital Signature Consent
                </Text>
                {expandedClauses[8] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[8] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    Under Section 10A of the Information Technology Act 2000, agreements, intimations,
                    and consents executed via OTP authentication, Aadhaar electronic signature (e-Sign),
                    or digital clicks within this application are recognized as valid, enforceable legal
                    contracts in all courts of law.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Section 9: Governing Law & Legal Jurisdiction */}
          {(activeCategory === 'all' || activeCategory === 'legal') && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleClause(9)}
                style={styles.sectionHeaderRow}
              >
                <View style={[styles.sectionNumBadge, { backgroundColor: colors.textSecondary }]}>
                  <Text style={styles.sectionNumText}>9</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                  Governing Law & Legal Jurisdiction
                </Text>
                {expandedClauses[9] ? (
                  <ChevronUpIcon size={16} color={themeColors.textSecondary} />
                ) : (
                  <ChevronDownIcon size={16} color={themeColors.textSecondary} />
                )}
              </TouchableOpacity>

              {expandedClauses[9] && (
                <View style={styles.clauseContent}>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary }]}>
                    These Terms & Conditions are governed by the Laws of the Republic of India. Any legal
                    proceeding, controversy, or claim arising out of or relating to these facilities shall
                    be subject to the exclusive jurisdiction of the competent civil courts situated in
                    Chandigarh (U.T.), India.
                  </Text>
                  <Text style={[styles.paragraphText, { color: themeColors.textSecondary, marginTop: 8 }]}>
                    Parties agree that unresolved grievances may be referred to binding arbitration conducted
                    under the Indian Arbitration and Conciliation Act, 1996, with a sole arbitrator appointed
                    by mutual consent.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Section 10: Legal Affairs & Compliance Desk */}
          <View
            style={[
              styles.officerCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <View style={styles.officerHeaderRow}>
              <View style={[styles.officerIconCircle, { backgroundColor: colors.brandGold }]}>
                <HeadphonesIcon size={20} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.officerLabel, { color: themeColors.textSecondary }]}>
                  LEGAL COMPLIANCE & ESCALATIONS
                </Text>
                <Text style={[styles.officerName, { color: themeColors.textPrimary }]}>
                  Legal Affairs & Compliance Desk
                </Text>
              </View>
            </View>

            <View style={[styles.officerDivider, { backgroundColor: themeColors.cardBorder }]} />

            <View style={styles.officerDetailRow}>
              <BuildingIcon size={16} color={themeColors.textSecondary} />
              <Text style={[styles.officerDetailText, { color: themeColors.textPrimary }]}>
                Ridhi Ratnam Associates, Sector 17-C, Chandigarh 160017
              </Text>
            </View>

            <View style={styles.officerDetailRow}>
              <MailIcon size={16} color={themeColors.textSecondary} />
              <Text style={[styles.officerDetailText, { color: themeColors.textPrimary }]}>
                legal@ridhiratnam.com
              </Text>
            </View>

            <View style={styles.officerDetailRow}>
              <PhoneIcon size={16} color={themeColors.textSecondary} />
              <Text style={[styles.officerDetailText, { color: themeColors.textPrimary }]}>
                +91 (0172) 468-9900 (Mon–Fri, 9:30 AM – 6:30 PM IST)
              </Text>
            </View>
          </View>

          {/* Action Acknowledgment Button */}
          <View style={styles.actionSection}>
            <AnimatedButton
              testID="btn-accept-terms"
              title={accepted ? 'Terms Acknowledged ✓' : 'I Acknowledge & Accept Terms'}
              onPress={handleAcknowledge}
              variant={accepted ? 'outline' : 'black'}
              size="large"
            />
          </View>
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

  // 1. Sleek Corporate Navy Top Bar
  blackHeader: {
    backgroundColor: colors.topBarBlack,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: 22,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerSubBadge: {
    color: colors.brandGold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerMainTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 2. Curved Sheet Body
  curvedSheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: spacing.md,
  },

  // Trust Banner
  trustBanner: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  trustBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentGreen,
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  trustDescription: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  trustMetaRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(100, 116, 139, 0.2)',
  },
  trustMetaText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Quick Highlights
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  summaryCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryCardDesc: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Toolbar
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: spacing.md,
  },
  pdfBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  pdfBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  expandAllBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandAllText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Category Chips
  categoryChipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: spacing.md,
  },
  categoryChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
  },

  // Section Cards
  sectionCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clauseContent: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(100, 116, 139, 0.2)',
  },
  sectionNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  paragraphText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },

  // Bullets
  bulletList: {
    marginTop: 10,
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.brandGold,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Officer / Escalation Card
  officerCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  officerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  officerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  officerLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  officerName: {
    fontSize: 15,
    fontWeight: '800',
  },
  officerDivider: {
    height: 1,
    marginVertical: 12,
  },
  officerDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  officerDetailText: {
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },

  // Action
  actionSection: {
    marginTop: 8,
    marginBottom: 20,
  },
});

