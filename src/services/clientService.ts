import {
  ClientProfile,
  ClientLoanApplication,
  ClientStats,
} from '../types/client';
import { MOCK_DOCS_AMIT, MOCK_ANALYSIS_AMIT } from './dashboardService';

export const MOCK_CLIENT_PROFILE: ClientProfile = {
  id: 'RRA-CL-1001',
  fullName: 'Amit Verma',
  email: 'amit.client@ridhiratnam.demo',
  phone: '+91 9876543210',
  branch: 'Chandigarh',
  avatarInitials: 'AV',
  accountStatus: 'Active',
  memberSince: 'August 2025',
};

export const MOCK_CLIENT_STATS: ClientStats = {
  total: 4,
  approved: 2,
  pending: 1,
  rejected: 1,
};

export const MOCK_CLIENT_APPLICATIONS: ClientLoanApplication[] = [
  {
    id: 'RRA-2026-00124',
    loanType: 'Business Growth Loan',
    amount: 500000,
    formattedAmount: '₹5,00,000',
    submissionDate: '02 Nov 2026',
    status: 'Under Review',
    tenureMonths: 36,
    interestRate: '10.5% p.a.',
    emiAmount: '₹16,250 / mo',
    currentStepIndex: 2, // Application Review
    steps: [
      {
        id: 1,
        label: 'Application Submitted',
        status: 'completed',
        date: '02 Nov 2026',
        description: 'Application received and registered in agency queue.',
      },
      {
        id: 2,
        label: 'Document Verification',
        status: 'completed',
        date: '02 Nov 2026',
        description: 'KYC, PAN, and bank statement verification completed.',
      },
      {
        id: 3,
        label: 'Application Review',
        status: 'current',
        description: 'Credit assessment team evaluating debt capacity.',
      },
      {
        id: 4,
        label: 'Final Decision',
        status: 'pending',
        description: 'Sanction letter issuance and fund disbursement.',
      },
    ],
    agentAssigned: {
      name: 'Rahul Sharma',
      id: 'RRA-AG-1024',
      phone: '+91 98765 43210',
      branch: 'Chandigarh Branch',
    },
    requestedDocuments: [
      'Self-attested 6-month bank statement',
      'Recent GST return acknowledgement',
    ],
    notes: 'Telephonic credit verification scheduled with your assigned advisor Rahul Sharma.',
    canEdit: false,
    documents: MOCK_DOCS_AMIT,
    deepAnalysis: MOCK_ANALYSIS_AMIT,
  },
  {
    id: 'RRA-2026-00098',
    loanType: 'Personal Finance Facility',
    amount: 300000,
    formattedAmount: '₹3,00,000',
    submissionDate: '15 Oct 2026',
    status: 'Approved',
    tenureMonths: 24,
    interestRate: '11.0% p.a.',
    emiAmount: '₹13,980 / mo',
    currentStepIndex: 3,
    steps: [
      { id: 1, label: 'Application Submitted', status: 'completed', date: '15 Oct 2026' },
      { id: 2, label: 'Document Verification', status: 'completed', date: '16 Oct 2026' },
      { id: 3, label: 'Application Review', status: 'completed', date: '17 Oct 2026' },
      { id: 4, label: 'Final Decision', status: 'completed', date: '18 Oct 2026' },
    ],
    agentAssigned: {
      name: 'Rahul Sharma',
      id: 'RRA-AG-1024',
      phone: '+91 98765 43210',
      branch: 'Chandigarh Branch',
    },
    notes: 'Loan disbursed to verified bank account ending in **4821.',
    canEdit: false,
    documents: MOCK_DOCS_AMIT.slice(0, 4),
    deepAnalysis: MOCK_ANALYSIS_AMIT,
  },
  {
    id: 'RRA-2026-00075',
    loanType: 'Emergency Credit Line',
    amount: 200000,
    formattedAmount: '₹2,00,000',
    submissionDate: '01 Sep 2026',
    status: 'Rejected',
    tenureMonths: 18,
    interestRate: '12.5% p.a.',
    currentStepIndex: 3,
    steps: [
      { id: 1, label: 'Application Submitted', status: 'completed', date: '01 Sep 2026' },
      { id: 2, label: 'Document Verification', status: 'completed', date: '02 Sep 2026' },
      { id: 3, label: 'Application Review', status: 'completed', date: '03 Sep 2026' },
      { id: 4, label: 'Final Decision', status: 'completed', date: '04 Sep 2026' },
    ],
    rejectionReason: 'Total debt servicing ratio exceeded underwriting limit (exceeded 55% monthly obligation threshold).',
    notes: 'You may reapply with a joint co-applicant or after 90 days.',
    canEdit: false,
    documents: MOCK_DOCS_AMIT.slice(0, 3),
    deepAnalysis: {
      ...MOCK_ANALYSIS_AMIT,
      cibilScore: 615,
      cibilGrade: 'Poor',
      riskScore: 'High Risk',
      foirRatio: '55%',
      recommendation: 'Underwriting Decline Recommended',
    },
  },
  {
    id: 'RRA-2026-00042',
    loanType: 'SME Machinery Purchase',
    amount: 400000,
    formattedAmount: '₹4,00,000',
    submissionDate: '10 Jun 2026',
    status: 'Approved',
    tenureMonths: 36,
    interestRate: '10.25% p.a.',
    emiAmount: '₹12,960 / mo',
    currentStepIndex: 3,
    steps: [
      { id: 1, label: 'Application Submitted', status: 'completed', date: '10 Jun 2026' },
      { id: 2, label: 'Document Verification', status: 'completed', date: '11 Jun 2026' },
      { id: 3, label: 'Application Review', status: 'completed', date: '12 Jun 2026' },
      { id: 4, label: 'Final Decision', status: 'completed', date: '13 Jun 2026' },
    ],
    notes: 'Fully repaid on schedule.',
    canEdit: false,
    documents: MOCK_DOCS_AMIT.slice(0, 4),
    deepAnalysis: MOCK_ANALYSIS_AMIT,
  },
];

export const getClientProfile = async (): Promise<ClientProfile> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLIENT_PROFILE), 250));
};

export const getClientStats = async (): Promise<ClientStats> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLIENT_STATS), 250));
};

export const getActiveClientApplication = async (): Promise<ClientLoanApplication | null> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLIENT_APPLICATIONS[0]), 300));
};

export const getRecentClientApplications = async (): Promise<ClientLoanApplication[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLIENT_APPLICATIONS.slice(0, 3)), 300));
};

export const getAllClientApplications = async (): Promise<ClientLoanApplication[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLIENT_APPLICATIONS), 350));
};
