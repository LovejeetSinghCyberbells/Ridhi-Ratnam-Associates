import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { CustomInput } from '../CustomInput';
import { AnimatedButton } from '../AnimatedButton';
import { PillChip } from '../PillChip';
import { ClientLoanApplication } from '../../types/client';
import { UploadedDocument } from '../../types/dashboard';
import {
  ShieldIcon,
  TrendingUpIcon,
  CheckIcon,
  ClockIcon,
  UploadCloudIcon,
  FileTextIcon,
  BuildingIcon,
  IdBadgeIcon,
  AlertCircleIcon,
  CrossIcon,
} from '../Icons';

interface LoanApplicationFormProps {
  onSubmitSuccess: (newApp: ClientLoanApplication) => void;
  onCancel: () => void;
}

interface AttachedDocState extends UploadedDocument {
  isAttached: boolean;
}

const DEFAULT_DOCUMENTS: AttachedDocState[] = [
  {
    id: 'form-doc-1',
    name: 'Permanent Account Number (PAN) Card',
    category: 'Identity Proof',
    fileName: 'pan_card_applicant.pdf',
    fileSize: '1.2 MB',
    uploadDate: 'Today',
    status: 'Verified',
    verificationSource: 'NSDL Income Tax Portal',
    notes: 'PAN seeded with Aadhaar and legally verified.',
    isAttached: true,
  },
  {
    id: 'form-doc-2',
    name: 'Aadhaar Card (e-KYC Offline XML)',
    category: 'Identity Proof',
    fileName: 'aadhaar_ekyc_offline.pdf',
    fileSize: '2.4 MB',
    uploadDate: 'Today',
    status: 'Verified',
    verificationSource: 'UIDAI OTP-authenticated e-KYC',
    notes: 'Address verified: Sector 17, Chandigarh, 160017.',
    isAttached: true,
  },
  {
    id: 'form-doc-3',
    name: 'Operating Bank Statement (6 Months PDF)',
    category: 'Bank Records',
    fileName: 'bank_statement_6m_primary.pdf',
    fileSize: '4.8 MB',
    uploadDate: 'Today',
    status: 'Verified',
    verificationSource: 'Perfios Automated Statement Parser',
    notes: 'Net monthly credit turnover averaging ₹1,85,000. 0 cheque bounces.',
    isAttached: true,
  },
  {
    id: 'form-doc-4',
    name: 'ITR-4 & Computation of Income (FY 2025-26)',
    category: 'Income Proof',
    fileName: 'itr_acknowledgement_fy25_26.pdf',
    fileSize: '2.1 MB',
    uploadDate: 'Today',
    status: 'Verified',
    verificationSource: 'CPC Bengaluru Income Tax Portal',
    notes: 'Gross Total Income declared: ₹11,40,000. Full tax compliance.',
    isAttached: true,
  },
  {
    id: 'form-doc-5',
    name: 'GST Registration Certificate & GSTR-3B',
    category: 'Business Compliance',
    fileName: 'gst_registration_gstr3b.pdf',
    fileSize: '3.1 MB',
    uploadDate: 'Today',
    status: 'Under Review',
    verificationSource: 'GSTN Portal Cross-Verification',
    notes: 'Underwriting advisor cross-checking monthly GSTR-3B with bank credits.',
    isAttached: true,
  },
  {
    id: 'form-doc-6',
    name: 'Commercial Premises Electricity Utility Bill',
    category: 'Collateral Assets',
    fileName: 'electricity_bill_chandigarh.pdf',
    fileSize: '1.6 MB',
    uploadDate: 'Today',
    status: 'Verified',
    verificationSource: 'PSPCL Online Bill Verification',
    notes: 'Premises ownership and electricity active connection verified.',
    isAttached: true,
  },
];

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  onSubmitSuccess,
  onCancel,
}) => {
  // Facility terms
  const [selectedType, setSelectedType] = useState('Business Growth Loan');
  const [amount, setAmount] = useState('500000');
  const [tenure, setTenure] = useState(36);
  const [purpose, setPurpose] = useState('Inventory stocking and working capital expansion');

  // KYC & Business Details
  const [applicantName, setApplicantName] = useState('Amit Verma');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [aadhaarNumber, setAadhaarNumber] = useState('541289012345');
  const [employmentType, setEmploymentType] = useState('Business Owner / Proprietorship');
  const [companyName, setCompanyName] = useState('Verma Textile Traders');
  const [operatingBank, setOperatingBank] = useState('HDFC Bank');
  const [monthlyIncome, setMonthlyIncome] = useState('95000');
  const [existingEmi, setExistingEmi] = useState('34200');
  const [servicingBranch, setServicingBranch] = useState('Chandigarh Main Branch');

  // Document Attachments
  const [documents, setDocuments] = useState<AttachedDocState[]>(DEFAULT_DOCUMENTS);
  const [previewDoc, setPreviewDoc] = useState<AttachedDocState | null>(null);

  // Regulatory Consents
  const [cibilConsent, setCibilConsent] = useState(true);
  const [dataAccuracyDeclaration, setDataAccuracyDeclaration] = useState(true);

  // Loading & Form Validation
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const loanTypes = [
    'Business Growth Loan',
    'Working Capital Line',
    'Machinery & Equipment',
    'Personal Loan',
    'Commercial Property',
  ];

  const quickAmounts = [
    { label: '₹1 Lakh', val: '100000' },
    { label: '₹3 Lakh', val: '300000' },
    { label: '₹5 Lakh', val: '500000' },
    { label: '₹10 Lakh', val: '1000000' },
    { label: '₹25 Lakh', val: '2500000' },
  ];

  const tenures = [12, 24, 36, 48, 60];

  const employmentOptions = [
    'Business Owner / Proprietorship',
    'Pvt Ltd / LLP Director',
    'Self-Employed Professional',
    'Salaried Executive',
  ];

  const bankOptions = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank'];
  const branchOptions = ['Chandigarh Main Branch', 'Mohali Sector 62', 'Panchkula Sector 9'];

  // Calculate approximate EMI (10.5% p.a.)
  const numericAmount = parseFloat(amount.replace(/[^0-9]/g, '')) || 0;
  const annualRate = 0.105;
  const monthlyRate = annualRate / 12;
  const calculatedEmi =
    numericAmount > 0 && tenure > 0
      ? Math.round(
          (numericAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
            (Math.pow(1 + monthlyRate, tenure) - 1)
        )
      : 0;

  // Real-time FOIR calculation
  const numIncome = parseFloat(monthlyIncome.replace(/[^0-9]/g, '')) || 0;
  const numObligations = parseFloat(existingEmi.replace(/[^0-9]/g, '')) || 0;
  const totalMonthlyCommitment = numObligations + calculatedEmi;
  const foirPercent = numIncome > 0 ? Math.round((totalMonthlyCommitment / numIncome) * 100) : 0;

  const attachedCount = documents.filter((d) => d.isAttached).length;

  const handleToggleDocAttachment = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.isAttached;
          return {
            ...d,
            isAttached: nextState,
            status: nextState ? 'Verified' : 'Pending',
          };
        }
        return d;
      })
    );
  };

  const handleAttachAll = () => {
    setDocuments((prev) =>
      prev.map((d) => ({
        ...d,
        isAttached: true,
        status: 'Verified',
      }))
    );
    Alert.alert('Documents Attached', 'All mandatory institutional compliance documents attached and validated.');
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!applicantName.trim()) {
      newErrors.applicantName = 'Full legal name as per PAN is required';
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (!panNumber.trim() || !panRegex.test(panNumber.trim())) {
      newErrors.panNumber = 'Valid 10-character PAN number required (e.g. ABCDE1234F)';
    }

    const cleanAadhaar = aadhaarNumber.replace(/[^0-9]/g, '');
    if (cleanAadhaar.length < 12) {
      newErrors.aadhaarNumber = 'Valid 12-digit Aadhaar number required';
    }

    if (!numericAmount || numericAmount < 25000) {
      newErrors.amount = 'Minimum loan amount is ₹25,000';
    }

    if (!numIncome || numIncome <= 0) {
      newErrors.monthlyIncome = 'Monthly income is required for underwriting debt ratios';
    }

    if (!purpose.trim()) {
      newErrors.purpose = 'Please state the primary purpose of this loan facility';
    }

    if (attachedCount < 3) {
      newErrors.documents = 'Please attach at least PAN, Aadhaar, and 6-Month Bank Statement';
    }

    if (!cibilConsent) {
      newErrors.cibilConsent = 'Credit Bureau query authorization is required by RBI guidelines';
    }

    if (!dataAccuracyDeclaration) {
      newErrors.declaration = 'Please accept the true declaration compliance';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert(
        'Incomplete Application',
        'Please complete the highlighted mandatory loan fields and document attachments.'
      );
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const generatedId = `RRA-2026-00${Math.floor(130 + Math.random() * 800)}`;
      const formatted = `₹${numericAmount.toLocaleString('en-IN')}`;

      // Convert attached documents to full UploadedDocument list
      const attachedList: UploadedDocument[] = documents
        .filter((d) => d.isAttached)
        .map((d) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          fileName: d.fileName,
          fileSize: d.fileSize,
          uploadDate: 'Today',
          status: d.status,
          verificationSource: d.verificationSource,
          notes: d.notes,
        }));

      const newApplication: ClientLoanApplication = {
        id: generatedId,
        loanType: selectedType,
        amount: numericAmount,
        formattedAmount: formatted,
        submissionDate: 'Today',
        status: 'Under Review',
        tenureMonths: tenure,
        interestRate: '10.5% p.a.',
        emiAmount: `₹${calculatedEmi.toLocaleString('en-IN')} / mo`,
        currentStepIndex: 1, // Document Verification
        applicantName: applicantName.trim(),
        panNumber: panNumber.trim().toUpperCase(),
        aadhaarNumber: `•••• •••• ${cleanAadhaar.slice(-4)}`,
        employmentType,
        companyName: companyName.trim(),
        monthlyIncome: numIncome,
        existingEmiObligations: numObligations,
        purpose: purpose.trim(),
        servicingBranch,
        steps: [
          {
            id: 1,
            label: 'Application Submitted',
            status: 'completed',
            date: 'Today',
            description: `Dossier submitted with ${attachedList.length} compliance documents attached.`,
          },
          {
            id: 2,
            label: 'Document Verification',
            status: 'current',
            description: 'NSDL PAN, UIDAI e-KYC, and Perfios bank parsing in progress.',
          },
          {
            id: 3,
            label: 'Application Review',
            status: 'pending',
            description: 'Credit assessment team evaluating debt capacity and CIBIL score.',
          },
          {
            id: 4,
            label: 'Final Decision',
            status: 'pending',
            description: 'Sanction letter issuance and loan escrow disbursement.',
          },
        ],
        agentAssigned: {
          name: 'Rahul Sharma',
          id: 'RRA-AG-1024',
          phone: '+91 98765 43210',
          branch: servicingBranch,
        },
        documents: attachedList,
        deepAnalysis: {
          cibilScore: 780,
          cibilGrade: 'Excellent',
          riskScore: foirPercent <= 50 ? 'Low Risk' : 'Moderate Risk',
          foirRatio: `${foirPercent}%`,
          monthlyIncome: `₹${numIncome.toLocaleString('en-IN')}`,
          monthlyDebtObligation: `₹${totalMonthlyCommitment.toLocaleString('en-IN')}`,
          averageQuarterlyBalance: `₹${Math.round(numIncome * 1.75).toLocaleString('en-IN')}`,
          bankingInflowRate: '+14.2% YoY',
          chequeBounces: 0,
          recommendation:
            foirPercent <= 50
              ? 'Approved for Fast-Track Sanction'
              : 'Requires Senior Underwriter Co-signer Review',
          auditChecks: [
            {
              id: 'chk-1',
              title: 'Identity & Biometric Authentication',
              passed: true,
              notes: 'PAN-Aadhaar seeding verified with 100% facial and name matching score.',
            },
            {
              id: 'chk-2',
              title: 'Bank Cash Flow & Inflow Continuity',
              passed: true,
              notes: 'Operating bank credits verified with Perfios parsing. Zero bounces.',
            },
            {
              id: 'chk-3',
              title: 'CIBIL Bureau Delinquency & NPA Scan',
              passed: true,
              notes: 'Zero 30+ DPD overdue accounts in 36 months history.',
            },
            {
              id: 'chk-4',
              title: 'Debt-to-Income / FOIR Threshold',
              passed: foirPercent <= 50,
              notes: `Total monthly commitments are ${foirPercent}% of monthly income.`,
            },
            {
              id: 'chk-5',
              title: 'GST Business Activity Reconciled',
              passed: true,
              notes: 'Declared business turnover aligns with monthly inward bank deposits.',
            },
            {
              id: 'chk-6',
              title: 'Anti-Money Laundering & PEP Screening',
              passed: true,
              notes: 'Negative list screening cleared. No regulatory compliance flags.',
            },
          ],
        },
        notes: `Application registered with ${attachedList.length} documents. Assigned advisor Rahul Sharma will review within 24 hours.`,
      };

      onSubmitSuccess(newApplication);

      Alert.alert(
        'Loan Dossier Submitted',
        `Your application for ${formatted} (${selectedType}) has been logged under ID: ${generatedId}.\n\nAttached Documents: ${attachedList.length}\nAssigned Advisor: Rahul Sharma (${servicingBranch}).`,
        [
          {
            text: 'Track in Dashboard',
            onPress: () => {},
          },
        ]
      );
    }, 1000);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Title & Badge */}
      <View style={styles.titleCard}>
        <View style={styles.badgeRow}>
          <ShieldIcon size={14} color={colors.brandGold} />
          <Text style={styles.badgeText}>INSTANT FINANCIAL EVALUATION • RBI NBFC REGULATED</Text>
        </View>
        <Text style={styles.mainTitle}>Apply for a Loan</Text>
        <Text style={styles.subTitle}>
          Submit your comprehensive credit dossier with mandatory documentation for prompt underwriting.
        </Text>
      </View>

      {/* ================= SECTION 1: FACILITY & TERMS ================= */}
      <View style={styles.formCard}>
        <Text style={styles.cardHeaderTitle}>1. Facility & Loan Requirements</Text>

        <Text style={styles.sectionLabel}>Select Loan Facility</Text>
        <View style={styles.typeChipsGrid}>
          {loanTypes.map((type) => {
            const isSelected = selectedType === type;
            return (
              <PillChip
                key={type}
                label={type}
                selected={isSelected}
                onPress={() => setSelectedType(type)}
                accentColor={colors.primaryBlack}
                style={styles.typeChip}
              />
            );
          })}
        </View>

        {/* Amount Selection */}
        <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Requested Loan Amount (INR)</Text>
        <View style={styles.quickAmountRow}>
          {quickAmounts.map((qa) => {
            const isSelected = amount === qa.val;
            return (
              <TouchableOpacity
                key={qa.val}
                activeOpacity={0.7}
                onPress={() => setAmount(qa.val)}
                style={[styles.quickPill, isSelected && styles.quickPillSelected]}
              >
                <Text style={[styles.quickPillText, isSelected && styles.quickPillTextSelected]}>
                  {qa.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <CustomInput
          testID="input-loan-amount"
          label="Loan Sanction Amount (INR) *"
          placeholder="e.g. 500000"
          value={amount}
          onChangeText={(val) => {
            setAmount(val);
            if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
          }}
          keyboardType="numeric"
          error={errors.amount}
          accentColor={colors.primaryBlack}
        />

        {/* Repayment Tenure */}
        <Text style={styles.sectionLabel}>Repayment Tenure</Text>
        <View style={styles.tenureRow}>
          {tenures.map((t) => {
            const isSelected = tenure === t;
            return (
              <TouchableOpacity
                key={t}
                activeOpacity={0.7}
                onPress={() => setTenure(t)}
                style={[styles.tenureBtn, isSelected && styles.tenureBtnSelected]}
              >
                <Text style={[styles.tenureText, isSelected && styles.tenureTextSelected]}>
                  {t}M
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Live EMI Estimator Callout */}
        <View style={styles.emiBanner}>
          <TrendingUpIcon size={16} color={colors.statusApproved} />
          <View style={styles.emiTextCol}>
            <Text style={styles.emiLabel}>Estimated Monthly EMI</Text>
            <Text style={styles.emiValue}>
              ₹{calculatedEmi.toLocaleString('en-IN')} / month
            </Text>
          </View>
          <Text style={styles.emiRate}>@ 10.5% p.a.</Text>
        </View>

        {/* Purpose */}
        <CustomInput
          testID="input-loan-purpose"
          label="Detailed Purpose of Loan *"
          placeholder="e.g. Working capital inventory expansion for seasonal cycle"
          value={purpose}
          onChangeText={(val) => {
            setPurpose(val);
            if (errors.purpose) setErrors((prev) => ({ ...prev, purpose: '' }));
          }}
          error={errors.purpose}
          accentColor={colors.primaryBlack}
        />
      </View>

      {/* ================= SECTION 2: APPLICANT KYC & BUSINESS PROFILE ================= */}
      <View style={styles.formCard}>
        <Text style={styles.cardHeaderTitle}>2. Applicant KYC & Business Profile</Text>

        <CustomInput
          testID="input-applicant-name"
          label="Full Legal Name (as per PAN Card) *"
          placeholder="Amit Verma"
          value={applicantName}
          onChangeText={(val) => {
            setApplicantName(val);
            if (errors.applicantName) setErrors((prev) => ({ ...prev, applicantName: '' }));
          }}
          error={errors.applicantName}
        />

        <View style={styles.twoColRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <CustomInput
              testID="input-pan-number"
              label="PAN Card Number *"
              placeholder="ABCDE1234F"
              value={panNumber}
              autoCapitalize="characters"
              maxLength={10}
              onChangeText={(val) => {
                setPanNumber(val);
                if (errors.panNumber) setErrors((prev) => ({ ...prev, panNumber: '' }));
              }}
              error={errors.panNumber}
            />
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <CustomInput
              testID="input-aadhaar-number"
              label="Aadhaar Number *"
              placeholder="541289012345"
              value={aadhaarNumber}
              keyboardType="numeric"
              maxLength={12}
              onChangeText={(val) => {
                setAadhaarNumber(val);
                if (errors.aadhaarNumber) setErrors((prev) => ({ ...prev, aadhaarNumber: '' }));
              }}
              error={errors.aadhaarNumber}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Employment / Business Entity Type</Text>
        <View style={styles.typeChipsGrid}>
          {employmentOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              activeOpacity={0.7}
              onPress={() => setEmploymentType(opt)}
              style={[
                styles.smallOptionChip,
                employmentType === opt && styles.smallOptionChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.smallOptionText,
                  employmentType === opt && styles.smallOptionTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomInput
          testID="input-company-name"
          label="Enterprise / Employer Name *"
          placeholder="e.g. Verma Textile Traders"
          value={companyName}
          onChangeText={setCompanyName}
        />

        <View style={styles.twoColRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <CustomInput
              testID="input-monthly-income"
              label="Gross Monthly Inflow (₹) *"
              placeholder="e.g. 95000"
              value={monthlyIncome}
              keyboardType="numeric"
              onChangeText={(val) => {
                setMonthlyIncome(val);
                if (errors.monthlyIncome) setErrors((prev) => ({ ...prev, monthlyIncome: '' }));
              }}
              error={errors.monthlyIncome}
            />
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <CustomInput
              testID="input-existing-emi"
              label="Existing Monthly EMIs (₹)"
              placeholder="e.g. 34200"
              value={existingEmi}
              keyboardType="numeric"
              onChangeText={setExistingEmi}
            />
          </View>
        </View>

        {/* Real-time FOIR Debt Capacity Pill */}
        <View style={[styles.foirBadge, foirPercent <= 50 ? styles.foirHealthy : styles.foirCaution]}>
          <ShieldIcon size={14} color={foirPercent <= 50 ? colors.statusApproved : colors.statusPending} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.foirTitle, { color: foirPercent <= 50 ? colors.statusApproved : colors.statusPending }]}>
              Estimated FOIR: {foirPercent}% {foirPercent <= 50 ? '(Healthy Capacity)' : '(High Debt Ratio)'}
            </Text>
            <Text style={styles.foirSub}>
              Benchmark: Underwriting threshold is &lt; 50% of verified monthly inflow.
            </Text>
          </View>
        </View>

        {/* Servicing Branch */}
        <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Servicing Branch</Text>
        <View style={styles.typeChipsGrid}>
          {branchOptions.map((br) => (
            <TouchableOpacity
              key={br}
              activeOpacity={0.7}
              onPress={() => setServicingBranch(br)}
              style={[
                styles.smallOptionChip,
                servicingBranch === br && styles.smallOptionChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.smallOptionText,
                  servicingBranch === br && styles.smallOptionTextSelected,
                ]}
              >
                {br}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ================= SECTION 3: MANDATORY DOCUMENT ATTACHMENTS ================= */}
      <View style={styles.formCard}>
        <View style={styles.docsHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardHeaderTitle}>3. Mandatory Document Attachments</Text>
            <Text style={styles.docsSubHeader}>
              Attach legally mandated identity, income, and business documents.
            </Text>
          </View>

          <TouchableOpacity
            testID="btn-attach-all-docs"
            activeOpacity={0.7}
            onPress={handleAttachAll}
            style={styles.quickAttachAllBtn}
          >
            <Text style={styles.quickAttachAllText}>Attach All (6)</Text>
          </TouchableOpacity>
        </View>

        {/* Document Attachment Progress Bar */}
        <View style={styles.docsProgressStrip}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressLabel}>
              {attachedCount} of {documents.length} Mandatory Documents Attached
            </Text>
            <Text style={styles.progressPercent}>
              {Math.round((attachedCount / documents.length) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(attachedCount / documents.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {errors.documents ? (
          <View style={styles.errorNotice}>
            <AlertCircleIcon size={14} color={colors.error} />
            <Text style={styles.errorNoticeText}>{errors.documents}</Text>
          </View>
        ) : null}

        {/* Document Items List */}
        <View style={styles.docsList}>
          {documents.map((doc) => (
            <View key={doc.id} style={styles.docItemCard}>
              <View style={styles.docTopRow}>
                <View style={[styles.docIconBox, doc.isAttached && styles.docIconBoxAttached]}>
                  <FileTextIcon size={16} color={doc.isAttached ? colors.statusApproved : colors.textPrimary} />
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docCategory}>
                    {doc.category} • {doc.isAttached ? `${doc.fileName} (${doc.fileSize})` : 'Upload Required'}
                  </Text>
                </View>

                {/* Status Chip */}
                <View
                  style={[
                    styles.docStatusBadge,
                    doc.isAttached ? styles.docStatusAttached : styles.docStatusPending,
                  ]}
                >
                  {doc.isAttached ? (
                    <CheckIcon size={10} color={colors.statusApproved} />
                  ) : (
                    <ClockIcon size={10} color={colors.statusPending} />
                  )}
                  <Text
                    style={[
                      styles.docStatusBadgeText,
                      { color: doc.isAttached ? colors.statusApproved : colors.statusPending },
                    ]}
                  >
                    {doc.isAttached ? 'Attached' : 'Required'}
                  </Text>
                </View>
              </View>

              {/* Action Buttons for Document */}
              <View style={styles.docActionRow}>
                <TouchableOpacity
                  testID={`btn-toggle-doc-${doc.id}`}
                  activeOpacity={0.7}
                  onPress={() => handleToggleDocAttachment(doc.id)}
                  style={[
                    styles.docToggleBtn,
                    doc.isAttached ? styles.docToggleBtnAttached : styles.docToggleBtnAttach,
                  ]}
                >
                  <UploadCloudIcon size={12} color={doc.isAttached ? colors.error : colors.textPrimary} />
                  <Text
                    style={[
                      styles.docToggleBtnText,
                      { color: doc.isAttached ? colors.error : colors.textPrimary },
                    ]}
                  >
                    {doc.isAttached ? 'Remove File' : 'Attach Document'}
                  </Text>
                </TouchableOpacity>

                {doc.isAttached && (
                  <TouchableOpacity
                    testID={`btn-preview-form-doc-${doc.id}`}
                    activeOpacity={0.7}
                    onPress={() => setPreviewDoc(doc)}
                    style={styles.docViewBtn}
                  >
                    <Text style={styles.docViewBtnText}>Preview File</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ================= SECTION 4: UNDERWRITING DECLARATIONS & REVIEW ================= */}
      <View style={styles.formCard}>
        <Text style={styles.cardHeaderTitle}>4. Regulatory Consents & Declarations</Text>

        {/* Consent 1 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCibilConsent(!cibilConsent)}
          style={styles.consentItemRow}
        >
          <View style={[styles.checkboxBox, cibilConsent && styles.checkboxBoxChecked]}>
            {cibilConsent && <CheckIcon size={12} color={colors.white} />}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.consentTitle}>Credit Bureau Query Authorization</Text>
            <Text style={styles.consentDesc}>
              I authorize Ridhi Ratnam Associates and its lending partners to retrieve and evaluate my CIBIL / Experian Credit Bureau records.
            </Text>
          </View>
        </TouchableOpacity>
        {errors.cibilConsent ? (
          <Text style={styles.errorInlineText}>{errors.cibilConsent}</Text>
        ) : null}

        {/* Consent 2 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setDataAccuracyDeclaration(!dataAccuracyDeclaration)}
          style={[styles.consentItemRow, { borderBottomWidth: 0 }]}
        >
          <View style={[styles.checkboxBox, dataAccuracyDeclaration && styles.checkboxBoxChecked]}>
            {dataAccuracyDeclaration && <CheckIcon size={12} color={colors.white} />}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.consentTitle}>Data Accuracy & Legal Compliance</Text>
            <Text style={styles.consentDesc}>
              I confirm that all financial disclosures and uploaded documents are authentic and lawful under RBI digital lending directions.
            </Text>
          </View>
        </TouchableOpacity>
        {errors.declaration ? (
          <Text style={styles.errorInlineText}>{errors.declaration}</Text>
        ) : null}

        {/* Submit Button */}
        <AnimatedButton
          testID="btn-submit-loan-application"
          title={loading ? 'Transmitting Credit Dossier...' : 'Submit Loan Application'}
          showChevronTriple={!loading}
          variant="black"
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitBtn}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onCancel}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelText}>Cancel and return to dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 90 }} />

      {/* Document Preview Modal */}
      <Modal
        visible={previewDoc !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewDoc(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalCategory}>ATTACHED AUDIT FILE</Text>
                <Text style={styles.modalTitle}>{previewDoc?.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setPreviewDoc(null)}
                style={styles.modalCloseBtn}
              >
                <CrossIcon size={14} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.docPreviewCard}>
              <View style={styles.stampBadge}>
                <CheckIcon size={14} color={colors.statusApproved} />
                <Text style={styles.stampText}>ATTACHED COMPLIANCE ASSET</Text>
              </View>

              <Text style={styles.previewMeta}>
                File: {previewDoc?.fileName} • {previewDoc?.fileSize}
              </Text>
              <Text style={styles.previewSource}>
                Category: {previewDoc?.category}
              </Text>
              <Text style={styles.previewNotes}>
                Verification Source: {previewDoc?.verificationSource}
              </Text>
            </View>

            <AnimatedButton
              title="Close Preview"
              variant="outline"
              onPress={() => setPreviewDoc(null)}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  titleCard: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.brandGoldDark,
    letterSpacing: 0.6,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 13,
    color: colors.slate500,
    lineHeight: 18,
    marginTop: 3,
  },
  formCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate600,
    marginBottom: 8,
  },
  typeChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeChip: {
    marginBottom: 4,
  },
  quickAmountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  quickPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate300,
  },
  quickPillSelected: {
    backgroundColor: colors.topBarBlack,
    borderColor: colors.topBarBlack,
  },
  quickPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.slate600,
  },
  quickPillTextSelected: {
    color: colors.white,
  },
  tenureRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tenureBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tenureBtnSelected: {
    backgroundColor: colors.topBarBlack,
    borderColor: colors.topBarBlack,
  },
  tenureText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.slate600,
  },
  tenureTextSelected: {
    color: colors.white,
  },
  emiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusApprovedBg,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.statusApprovedBorder,
    marginBottom: 14,
  },
  emiTextCol: {
    flex: 1,
    marginLeft: 8,
  },
  emiLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.statusApproved,
  },
  emiValue: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.statusApproved,
  },
  emiRate: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  twoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallOptionChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  smallOptionChipSelected: {
    backgroundColor: colors.topBarBlack,
    borderColor: colors.topBarBlack,
  },
  smallOptionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.slate500,
  },
  smallOptionTextSelected: {
    color: colors.white,
  },
  foirBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 10,
  },
  foirHealthy: {
    backgroundColor: colors.statusApprovedBg,
    borderColor: colors.statusApprovedBorder,
  },
  foirCaution: {
    backgroundColor: colors.statusPendingBg,
    borderColor: colors.statusPendingBorder,
  },
  foirTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  foirSub: {
    fontSize: 11,
    color: colors.slate500,
    marginTop: 2,
    lineHeight: 15,
  },
  docsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  docsSubHeader: {
    fontSize: 11.5,
    color: colors.slate500,
    marginTop: 2,
    lineHeight: 16,
  },
  quickAttachAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.slate300,
  },
  quickAttachAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  docsProgressStrip: {
    backgroundColor: colors.slate50,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressPercent: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.statusApproved,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  docsList: {
    gap: 10,
  },
  docItemCard: {
    backgroundColor: colors.slate50,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconBoxAttached: {
    backgroundColor: colors.statusApprovedBg,
  },
  docName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  docCategory: {
    fontSize: 11,
    color: colors.slate500,
    marginTop: 2,
  },
  docStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 3,
  },
  docStatusAttached: {
    backgroundColor: colors.statusApprovedBg,
  },
  docStatusPending: {
    backgroundColor: colors.statusPendingBg,
  },
  docStatusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  docActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  docToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
  },
  docToggleBtnAttach: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.slate300,
  },
  docToggleBtnAttached: {
    backgroundColor: colors.statusRejectedBg,
    borderWidth: 1,
    borderColor: colors.statusRejectedBorder,
  },
  docToggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  docViewBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.slate300,
  },
  docViewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  consentItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: colors.slate300,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxBoxChecked: {
    backgroundColor: colors.topBarBlack,
    borderColor: colors.topBarBlack,
  },
  consentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  consentDesc: {
    fontSize: 11.5,
    color: colors.slate500,
    lineHeight: 16,
    marginTop: 2,
  },
  errorInlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.error,
    marginTop: 4,
    marginBottom: 8,
  },
  errorNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusRejectedBg,
    padding: 10,
    borderRadius: 10,
    gap: 6,
    marginBottom: 12,
  },
  errorNoticeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.error,
  },
  submitBtn: {
    width: '100%',
    marginTop: 18,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 6,
  },
  cancelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.slate500,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.slate400,
    letterSpacing: 0.8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docPreviewCard: {
    backgroundColor: colors.slate50,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  stampBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusApprovedBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
    marginBottom: 10,
  },
  stampText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.statusApproved,
  },
  previewMeta: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  previewSource: {
    fontSize: 12,
    color: colors.slate600,
    marginBottom: 2,
  },
  previewNotes: {
    fontSize: 11.5,
    color: colors.slate500,
    textAlign: 'center',
  },
});
