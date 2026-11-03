import {
  AgentProfile,
  ApplicationStat,
  LoanApplication,
  MonthlyPerformance,
  NotificationItem,
  UploadedDocument,
  DeepAnalysisReport,
} from '../types/dashboard';

export const MOCK_AGENT: AgentProfile = {
  id: 'RRA-AG-1024',
  fullName: 'Rahul Sharma',
  designation: 'Financial Advisor',
  email: 'rahul.agent@ridhiratnam.demo',
  phone: '+91 9876543210',
  branch: 'Chandigarh Branch',
  status: 'Active',
  avatarInitials: 'RS',
  rating: 4.9,
  joinedDate: 'Jan 2024',
};

export const MOCK_STATS: ApplicationStat[] = [
  {
    id: 'stat-total',
    title: 'Total Applications',
    value: 248,
    variant: 'total',
    changeRate: '+14% this month',
    periodLabel: 'All time',
  },
  {
    id: 'stat-pending',
    title: 'Pending Applications',
    value: 42,
    variant: 'pending',
    changeRate: '8 under verification',
    periodLabel: 'Requires action',
  },
  {
    id: 'stat-approved',
    title: 'Approved Applications',
    value: 176,
    variant: 'approved',
    changeRate: '71% success rate',
    periodLabel: 'Disbursed',
  },
  {
    id: 'stat-rejected',
    title: 'Rejected Applications',
    value: 30,
    variant: 'rejected',
    changeRate: 'Low default ratio',
    periodLabel: 'Declined',
  },
];

export const MOCK_DOCS_AMIT: UploadedDocument[] = [
  {
    id: 'doc-1',
    name: 'Permanent Account Number (PAN) Card',
    category: 'Identity Proof',
    fileName: 'pan_card_amit_verma.pdf',
    fileSize: '1.2 MB',
    uploadDate: '02 Nov 2026',
    status: 'Verified',
    verificationSource: 'NSDL Income Tax API Database',
    notes: 'PAN active and legally linked with Aadhaar records.',
  },
  {
    id: 'doc-2',
    name: 'Aadhaar Card (e-KYC Offline XML)',
    category: 'Identity Proof',
    fileName: 'aadhaar_front_back_av.pdf',
    fileSize: '2.4 MB',
    uploadDate: '02 Nov 2026',
    status: 'Verified',
    verificationSource: 'UIDAI OTP-authenticated e-KYC',
    notes: 'Address verified: Sector 17, Chandigarh, 160017.',
  },
  {
    id: 'doc-3',
    name: 'HDFC Bank Statement (6 Months Operating)',
    category: 'Bank Records',
    fileName: 'hdfc_current_statement_may_oct26.pdf',
    fileSize: '4.8 MB',
    uploadDate: '02 Nov 2026',
    status: 'Verified',
    verificationSource: 'Perfios Automated Statement Parser',
    notes: 'Consistent net credit turnover averaging ₹1,85,000/mo. Zero cheque bounces.',
  },
  {
    id: 'doc-4',
    name: 'ITR-4 & Computation of Income (FY 2025-26)',
    category: 'Income Proof',
    fileName: 'itr_acknowledgement_fy25_26.pdf',
    fileSize: '2.1 MB',
    uploadDate: '02 Nov 2026',
    status: 'Verified',
    verificationSource: 'CPC Bengaluru Income Tax Portal',
    notes: 'Gross Total Income declared: ₹11,40,000. Taxes paid in full.',
  },
  {
    id: 'doc-5',
    name: 'GST Registration Certificate & GSTR-3B',
    category: 'Business Compliance',
    fileName: 'gst_certificate_gstr3b_sep26.pdf',
    fileSize: '3.1 MB',
    uploadDate: '02 Nov 2026',
    status: 'Under Review',
    verificationSource: 'GSTN Portal Cross-Verification',
    notes: 'Underwriting advisor cross-checking monthly GSTR-3B with bank credits.',
  },
  {
    id: 'doc-6',
    name: 'Commercial Shop Electricity Utility Bill',
    category: 'Collateral Assets',
    fileName: 'electricity_bill_chandigarh_oct26.pdf',
    fileSize: '1.6 MB',
    uploadDate: '02 Nov 2026',
    status: 'Verified',
    verificationSource: 'Electricity Dept PSPCL Online Bill Verification',
    notes: 'Premises ownership verified in good standing.',
  },
];

export const MOCK_ANALYSIS_AMIT: DeepAnalysisReport = {
  cibilScore: 785,
  cibilGrade: 'Excellent',
  riskScore: 'Low Risk',
  foirRatio: '36%',
  monthlyIncome: '₹95,000',
  monthlyDebtObligation: '₹34,200',
  averageQuarterlyBalance: '₹1,68,500',
  bankingInflowRate: '+14.2% YoY',
  chequeBounces: 0,
  recommendation: 'Approved for Fast-Track Sanction',
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
      notes: 'No circular or round-tripping transactions detected across 180 days.',
    },
    {
      id: 'chk-3',
      title: 'CIBIL Bureau Delinquency & NPA Scan',
      passed: true,
      notes: 'Zero 30+ DPD overdue accounts in 36 months history. 100% on-time repayment.',
    },
    {
      id: 'chk-4',
      title: 'Debt-to-Income / FOIR Threshold',
      passed: true,
      notes: 'Current obligations are 36% of monthly income, well within 50% risk threshold.',
    },
    {
      id: 'chk-5',
      title: 'GST Business Activity Reconciled',
      passed: true,
      notes: 'Declared business revenue aligns with monthly inward bank deposits.',
    },
    {
      id: 'chk-6',
      title: 'Anti-Money Laundering & PEP Screening',
      passed: true,
      notes: 'Negative list screening cleared. No regulatory compliance flags.',
    },
  ],
};

export const MOCK_LATEST_APPLICATIONS: LoanApplication[] = [
  {
    id: 'RRA-2026-00124',
    clientName: 'Amit Verma',
    clientInitials: 'AV',
    clientPhone: '+91 98140 23456',
    clientEmail: 'amit.verma@example.com',
    loanType: 'Business Expansion Loan',
    loanAmount: 500000,
    formattedAmount: '₹5,00,000',
    submissionDate: '02 Nov 2026',
    status: 'Pending',
    tenureMonths: 36,
    interestRate: '10.5% p.a.',
    emiAmount: '₹16,250 / mo',
    cibilScore: 785,
    notes: 'Awaiting primary GST return verification and bank statement audit.',
    agentAssigned: {
      name: 'Rahul Sharma',
      id: 'RRA-AG-1024',
      phone: '+91 98765 43210',
      branch: 'Chandigarh Branch',
    },
    documents: MOCK_DOCS_AMIT,
    deepAnalysis: MOCK_ANALYSIS_AMIT,
  },
  {
    id: 'RRA-2026-00123',
    clientName: 'Neha Sharma',
    clientInitials: 'NS',
    clientPhone: '+91 98721 87654',
    clientEmail: 'neha.sharma@example.com',
    loanType: 'SME Working Capital',
    loanAmount: 350000,
    formattedAmount: '₹3,50,000',
    submissionDate: '01 Nov 2026',
    status: 'Under Review',
    tenureMonths: 24,
    interestRate: '11.0% p.a.',
    emiAmount: '₹16,300 / mo',
    cibilScore: 780,
    notes: 'Credit risk team reviewing collateral appraisal and income certificate.',
    agentAssigned: {
      name: 'Rahul Sharma',
      id: 'RRA-AG-1024',
      phone: '+91 98765 43210',
      branch: 'Chandigarh Branch',
    },
    documents: [
      {
        id: 'doc-ns-1',
        name: 'PAN Card (Individual)',
        category: 'Identity Proof',
        fileName: 'pan_neha_sharma.pdf',
        fileSize: '1.4 MB',
        uploadDate: '01 Nov 2026',
        status: 'Verified',
        verificationSource: 'NSDL Income Tax Database',
      },
      {
        id: 'doc-ns-2',
        name: 'Salary Slips (Last 3 Months)',
        category: 'Income Proof',
        fileName: 'salary_slips_jul_sep26.pdf',
        fileSize: '3.2 MB',
        uploadDate: '01 Nov 2026',
        status: 'Verified',
        verificationSource: 'Corporate Employer HR Portal',
      },
      {
        id: 'doc-ns-3',
        name: 'Bank Statement (6 Months Salary Inflow)',
        category: 'Bank Records',
        fileName: 'icici_salary_statement.pdf',
        fileSize: '4.1 MB',
        uploadDate: '01 Nov 2026',
        status: 'Under Review',
        verificationSource: 'Automated Account Aggregator',
      },
    ],
    deepAnalysis: {
      cibilScore: 780,
      cibilGrade: 'Good',
      riskScore: 'Low Risk',
      foirRatio: '32%',
      monthlyIncome: '₹78,000',
      monthlyDebtObligation: '₹24,960',
      averageQuarterlyBalance: '₹92,400',
      bankingInflowRate: '+8.5% YoY',
      chequeBounces: 0,
      recommendation: 'Requires Final KYC Video Verification',
      auditChecks: [
        { id: 'ns-chk-1', title: 'Employer Corporate Verification', passed: true, notes: 'Listed Tier-1 corporate employer.' },
        { id: 'ns-chk-2', title: 'Salary Credit Match', passed: true, notes: 'Consistent salary credits on 1st of every month.' },
        { id: 'ns-chk-3', title: 'Delinquency Scan', passed: true, notes: 'Zero late payments.' },
      ],
    },
  },
  {
    id: 'RRA-2026-00122',
    clientName: 'Karan Mehta',
    clientInitials: 'KM',
    clientPhone: '+91 99882 34512',
    clientEmail: 'karan.mehta@example.com',
    loanType: 'Commercial Property Loan',
    loanAmount: 800000,
    formattedAmount: '₹8,00,000',
    submissionDate: '31 Oct 2026',
    status: 'Approved',
    tenureMonths: 48,
    interestRate: '9.75% p.a.',
    emiAmount: '₹20,190 / mo',
    cibilScore: 810,
    notes: 'Sanction letter generated. Disbursement scheduled to client escrow.',
    agentAssigned: {
      name: 'Rahul Sharma',
      id: 'RRA-AG-1024',
      phone: '+91 98765 43210',
      branch: 'Chandigarh Branch',
    },
    documents: [
      {
        id: 'doc-km-1',
        name: 'PAN & Aadhaar Identification',
        category: 'Identity Proof',
        fileName: 'kyc_karan_mehta.pdf',
        fileSize: '2.8 MB',
        uploadDate: '31 Oct 2026',
        status: 'Verified',
        verificationSource: 'UIDAI & NSDL Verification',
      },
      {
        id: 'doc-km-2',
        name: 'Commercial Property Title Deed',
        category: 'Collateral Assets',
        fileName: 'title_deed_plot42_chandigarh.pdf',
        fileSize: '8.4 MB',
        uploadDate: '31 Oct 2026',
        status: 'Verified',
        verificationSource: 'Sub-Registrar Encumbrance Certificate',
      },
      {
        id: 'doc-km-3',
        name: 'Valuer Assessment & Inspection Report',
        category: 'Collateral Assets',
        fileName: 'valuer_inspection_report.pdf',
        fileSize: '5.2 MB',
        uploadDate: '31 Oct 2026',
        status: 'Verified',
        verificationSource: 'Certified Bank Empanelled Valuer',
      },
    ],
    deepAnalysis: {
      cibilScore: 810,
      cibilGrade: 'Excellent',
      riskScore: 'Low Risk',
      foirRatio: '28%',
      monthlyIncome: '₹1,65,000',
      monthlyDebtObligation: '₹46,200',
      averageQuarterlyBalance: '₹3,40,000',
      bankingInflowRate: '+22.4% YoY',
      chequeBounces: 0,
      recommendation: 'Approved for Fast-Track Sanction',
      auditChecks: [
        { id: 'km-chk-1', title: 'Clear Title Ownership Certificate', passed: true, notes: 'Non-encumbered freehold commercial property.' },
        { id: 'km-chk-2', title: 'Legal & Search Audit', passed: true, notes: '30-year legal search verified with 0 litigation flags.' },
        { id: 'km-chk-3', title: 'High Net Worth Cash Flow', passed: true, notes: 'Healthy debt service coverage ratio (DSCR: 2.4).' },
      ],
    },
  },
  {
    id: 'RRA-2026-00121',
    clientName: 'Priya Singh',
    clientInitials: 'PS',
    clientPhone: '+91 97801 65432',
    clientEmail: 'priya.singh@example.com',
    loanType: 'Personal Medical Finance',
    loanAmount: 250000,
    formattedAmount: '₹2,50,000',
    submissionDate: '30 Oct 2026',
    status: 'Rejected',
    tenureMonths: 18,
    interestRate: '12.2% p.a.',
    cibilScore: 615,
    rejectionReason: 'Total debt servicing ratio exceeded underwriting limit (exceeded 58% monthly obligation benchmark).',
    notes: 'Failed minimum bureau risk benchmark and debt-to-income threshold.',
    agentAssigned: {
      name: 'Rahul Sharma',
      id: 'RRA-AG-1024',
      phone: '+91 98765 43210',
      branch: 'Chandigarh Branch',
    },
    documents: [
      {
        id: 'doc-ps-1',
        name: 'PAN & Aadhaar KYC',
        category: 'Identity Proof',
        fileName: 'kyc_priya_singh.pdf',
        fileSize: '1.9 MB',
        uploadDate: '30 Oct 2026',
        status: 'Verified',
      },
      {
        id: 'doc-ps-2',
        name: 'Salary Slips (3 Months)',
        category: 'Income Proof',
        fileName: 'salary_slips_ps.pdf',
        fileSize: '2.5 MB',
        uploadDate: '30 Oct 2026',
        status: 'Needs Re-upload',
        notes: 'Unsigned and illegible pay stamps.',
      },
    ],
    deepAnalysis: {
      cibilScore: 615,
      cibilGrade: 'Poor',
      riskScore: 'High Risk',
      foirRatio: '58%',
      monthlyIncome: '₹42,000',
      monthlyDebtObligation: '₹24,360',
      averageQuarterlyBalance: '₹8,200',
      bankingInflowRate: '-6.2% YoY',
      chequeBounces: 2,
      recommendation: 'Underwriting Decline Recommended',
      auditChecks: [
        { id: 'ps-chk-1', title: 'CIBIL Bureau Delinquency', passed: false, notes: '2 overdue personal loan accounts flagged.' },
        { id: 'ps-chk-2', title: 'FOIR Ratio Compliance', passed: false, notes: 'Debt exceeds maximum 50% threshold.' },
      ],
    },
  },
];

export const MOCK_ALL_APPLICATIONS: LoanApplication[] = [
  ...MOCK_LATEST_APPLICATIONS,
  {
    id: 'RRA-2026-00120',
    clientName: 'Rajesh Kumar',
    clientInitials: 'RK',
    clientPhone: '+91 98150 99887',
    clientEmail: 'rajesh.k@example.com',
    loanType: 'Equipment Financing',
    loanAmount: 620000,
    formattedAmount: '₹6,20,000',
    submissionDate: '28 Oct 2026',
    status: 'Approved',
    tenureMonths: 36,
    interestRate: '10.25% p.a.',
    cibilScore: 770,
    documents: MOCK_DOCS_AMIT.slice(0, 4),
    deepAnalysis: MOCK_ANALYSIS_AMIT,
  },
  {
    id: 'RRA-2026-00119',
    clientName: 'Deepak Chopra',
    clientInitials: 'DC',
    clientPhone: '+91 98888 12345',
    clientEmail: 'deepak.c@example.com',
    loanType: 'Micro Enterprise Loan',
    loanAmount: 180000,
    formattedAmount: '₹1,80,000',
    submissionDate: '25 Oct 2026',
    status: 'Pending',
    tenureMonths: 12,
    interestRate: '11.5% p.a.',
    cibilScore: 720,
    documents: MOCK_DOCS_AMIT.slice(0, 3),
    deepAnalysis: MOCK_ANALYSIS_AMIT,
  },
  {
    id: 'RRA-2026-00118',
    clientName: 'Ananya Gupta',
    clientInitials: 'AG',
    clientPhone: '+91 94170 54321',
    clientEmail: 'ananya.g@example.com',
    loanType: 'Home Renovation Loan',
    loanAmount: 450000,
    formattedAmount: '₹4,50,000',
    submissionDate: '22 Oct 2026',
    status: 'Approved',
    tenureMonths: 36,
    interestRate: '9.85% p.a.',
    cibilScore: 795,
    documents: MOCK_DOCS_AMIT.slice(0, 4),
    deepAnalysis: MOCK_ANALYSIS_AMIT,
  },
];

export const MOCK_MONTHLY_PERFORMANCE: MonthlyPerformance = {
  month: 'November 2026',
  handled: 45,
  approved: 32,
  rejected: 8,
  pending: 5,
  approvalPercentage: 71.1,
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Loan Sanctioned',
    message: 'Application RRA-2026-00122 (Karan Mehta) has been approved for ₹8,00,000.',
    time: '10 mins ago',
    unread: true,
    type: 'approval',
  },
  {
    id: 'notif-2',
    title: 'Document Uploaded',
    message: 'Neha Sharma uploaded audited financial statements for RRA-2026-00123.',
    time: '2 hours ago',
    unread: true,
    type: 'review',
  },
  {
    id: 'notif-3',
    title: 'New Lead Assigned',
    message: 'New application RRA-2026-00124 (Amit Verma) assigned to your branch queue.',
    time: '5 hours ago',
    unread: false,
    type: 'submission',
  },
  {
    id: 'notif-4',
    title: 'Monthly Milestone Met',
    message: 'You have crossed 70% approval conversion for November cycle.',
    time: 'Yesterday',
    unread: false,
    type: 'system',
  },
];

export const getAgentProfile = async (): Promise<AgentProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_AGENT), 250);
  });
};

export const getDashboardStats = async (): Promise<ApplicationStat[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_STATS), 250);
  });
};

export const getLatestApplications = async (): Promise<LoanApplication[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_LATEST_APPLICATIONS), 300);
  });
};

export const getAllApplications = async (): Promise<LoanApplication[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ALL_APPLICATIONS), 350);
  });
};

export const getMonthlyPerformance = async (): Promise<MonthlyPerformance> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MONTHLY_PERFORMANCE), 250);
  });
};

export const getNotifications = async (): Promise<NotificationItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_NOTIFICATIONS), 200);
  });
};
