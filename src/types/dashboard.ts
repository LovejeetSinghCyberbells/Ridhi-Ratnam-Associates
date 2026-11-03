export type ApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export interface AgentProfile {
  id: string; // e.g. RRA-AG-1024
  fullName: string; // Rahul Sharma
  name?: string;
  designation: string; // Financial Advisor
  email: string; // rahul.agent@ridhiratnam.demo
  phone: string; // +91 9876543210
  branch: string; // Chandigarh Branch
  status: 'Active' | 'Inactive' | 'Pending';
  avatarInitials: string;
  avatarUrl?: string;
  rating?: number;
  joinedDate?: string;
}

export type StatVariant = 'total' | 'pending' | 'approved' | 'rejected';

export interface ApplicationStat {
  id: string;
  title: string;
  value: number;
  variant: StatVariant;
  changeRate?: string;
  periodLabel?: string;
}

export type DocumentVerificationStatus =
  | 'Verified'
  | 'Under Review'
  | 'Needs Re-upload'
  | 'Pending';

export interface UploadedDocument {
  id: string;
  name: string;
  category: 'Identity Proof' | 'Income Proof' | 'Bank Records' | 'Business Compliance' | 'Collateral Assets';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: DocumentVerificationStatus;
  verificationSource?: string;
  notes?: string;
}

export interface AuditCheckItem {
  id: string;
  title: string;
  passed: boolean;
  notes: string;
}

export interface DeepAnalysisReport {
  cibilScore: number;
  cibilGrade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  riskScore: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  foirRatio: string; // Fixed Obligation to Income Ratio, e.g. "36%"
  monthlyIncome: string; // "₹95,000"
  monthlyDebtObligation: string; // "₹34,200"
  averageQuarterlyBalance: string; // "₹1,68,500"
  bankingInflowRate: string; // "+14.2% YoY"
  chequeBounces: number;
  recommendation: string;
  auditChecks: AuditCheckItem[];
}

export interface LoanApplication {
  id: string; // e.g. RRA-2026-00124
  clientName: string; // Amit Verma
  clientInitials: string; // AV
  clientPhone: string;
  clientEmail: string;
  loanType: string; // e.g. Business Loan, Personal Loan
  loanAmount: number; // 500000
  formattedAmount: string; // ₹5,00,000
  submissionDate: string; // 02 Nov 2026
  status: ApplicationStatus;
  tenureMonths?: number;
  interestRate?: string;
  emiAmount?: string;
  cibilScore?: number;
  notes?: string;
  rejectionReason?: string;
  requestedDocuments?: string[];
  agentAssigned?: {
    name: string;
    id: string;
    phone: string;
    branch: string;
  };
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

export interface MonthlyPerformance {
  month: string;
  handled: number; // 45
  approved: number; // 32
  rejected: number; // 8
  pending: number; // 5
  approvalPercentage: number; // 71.1
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'approval' | 'submission' | 'system' | 'review';
}

export type DashboardTab = 'dashboard' | 'applications' | 'submissions' | 'history' | 'profile';
