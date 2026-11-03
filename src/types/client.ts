import { UploadedDocument, DeepAnalysisReport } from './dashboard';

export type ClientAppStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Pending';

export interface ClientProfile {
  id: string; // RRA-CL-1001
  fullName: string; // Amit Verma
  name?: string;
  avatarUrl?: string;
  email: string; // amit.client@ridhiratnam.demo
  phone: string; // +91 9876543210
  branch: string; // Chandigarh
  avatarInitials: string; // AV
  accountStatus: 'Active' | 'Pending';
  memberSince: string;
}

export type ApplicationStepStatus = 'completed' | 'current' | 'pending';

export interface ApplicationStep {
  id: number;
  label: string;
  status: ApplicationStepStatus;
  date?: string;
  description?: string;
}

export interface ClientLoanApplication {
  id: string; // e.g. RRA-2026-00124
  loanType: string; // e.g. Business Loan, Personal Loan
  amount: number; // 500000
  formattedAmount: string; // ₹5,00,000
  submissionDate: string; // 02 Nov 2026
  status: ClientAppStatus;
  tenureMonths: number;
  interestRate?: string;
  emiAmount?: string;
  currentStepIndex: number; // 0: Submitted, 1: Verification, 2: Review, 3: Final Decision
  steps: ApplicationStep[];
  agentAssigned?: {
    name: string;
    id: string;
    phone: string;
    branch: string;
  };
  rejectionReason?: string;
  requestedDocuments?: string[];
  notes?: string;
  canEdit?: boolean;
  documents?: UploadedDocument[];
  deepAnalysis?: DeepAnalysisReport;
  applicantName?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  employmentType?: string;
  companyName?: string;
  monthlyIncome?: number;
  existingEmiObligations?: number;
  purpose?: string;
  servicingBranch?: string;
}

export interface ClientStats {
  total: number; // 4
  approved: number; // 2
  pending: number; // 1
  rejected?: number; // 1
}

export type ClientTab = 'home' | 'upload' | 'apply' | 'history' | 'profile';
