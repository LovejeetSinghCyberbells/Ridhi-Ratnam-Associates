export type KycStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type KycStatusDisplay =
  | 'Not Submitted'
  | 'Pending Verification'
  | 'Approved'
  | 'Rejected';

export type KycDocumentType =
  | 'aadhaar'
  | 'pan'
  | 'address_proof'
  | 'photograph'
  | 'additional';

export interface KycDocumentConfig {
  id: KycDocumentType;
  name: string;
  category: string;
  required: boolean;
  description: string;
  allowedFormats: string[];
  maxSizeMb: number;
}

export interface KycDocument {
  id: string;
  type: KycDocumentType;
  name: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  fileUri?: string;
  fileType?: string; // 'application/pdf' | 'image/jpeg' | 'image/png'
  status: 'Uploaded' | 'Pending' | 'Verified' | 'Rejected';
  notes?: string;
}

export interface KycHistoryRecord {
  id: string;
  action: 'SUBMITTED' | 'RESUBMITTED' | 'APPROVED' | 'REJECTED';
  date: string;
  agentId?: string;
  agentName?: string;
  remarks?: string;
  rejectionReason?: string;
}

export interface KycSubmission {
  id: string; // e.g. KYC-2026-00124
  clientId: string; // e.g. RRA-CL-1001
  clientName: string; // Amit Verma
  clientEmail: string;
  clientPhone: string;
  submissionDate: string;
  status: KycStatus;
  documents: KycDocument[];
  reviewedBy?: string; // e.g. RRA-AG-1024
  reviewerName?: string; // Rahul Sharma
  reviewedAt?: string;
  rejectionReason?: string;
  agentRemarks?: string;
  history: KycHistoryRecord[];
}

export interface KycStatItem {
  id: string;
  title: string;
  value: number;
  variant: 'total' | 'pending' | 'approved' | 'rejected';
  count?: number;
  label?: string;
  subtext?: string;
  color?: string;
  changeRate?: string;
  periodLabel?: string;
}

export const DEFAULT_KYC_DOCUMENT_CONFIGS: KycDocumentConfig[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    category: 'Identity Proof',
    required: true,
    description: 'Clear copy of front & back of Aadhaar card or e-KYC masked copy',
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMb: 5,
  },
  {
    id: 'pan',
    name: 'PAN Card',
    category: 'Identity Proof',
    required: true,
    description: 'Permanent Account Number (PAN) card of the primary applicant',
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMb: 5,
  },
  {
    id: 'address_proof',
    name: 'Address Proof',
    category: 'Residence Proof',
    required: true,
    description: 'Utility bill (electricity, water, gas) or bank passbook (under 3 months)',
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMb: 5,
  },
  {
    id: 'photograph',
    name: 'Passport-size Photograph',
    category: 'Photograph',
    required: true,
    description: 'Recent colored passport photograph against a white background',
    allowedFormats: ['JPG', 'PNG'],
    maxSizeMb: 5,
  },
  {
    id: 'additional',
    name: 'Additional Supporting Document',
    category: 'Optional Supporting',
    required: false,
    description: 'Voter ID, Passport, Driving License, or Rent Agreement (Optional)',
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMb: 5,
  },
];
