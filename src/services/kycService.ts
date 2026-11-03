import {
  KycSubmission,
  KycStatus,
  KycStatItem,
  KycDocument,
  DEFAULT_KYC_DOCUMENT_CONFIGS,
} from '../types/kyc';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'agent' | 'client';
  branch?: string;
}

// Development credentials specified in project requirements
export const MOCK_USERS: UserAccount[] = [
  {
    id: 'RRA-AG-1024',
    name: 'Rahul Sharma',
    email: 'rahul.agent@ridhiratnam.demo',
    mobile: '+91 9876543210',
    password: 'Agent@123',
    role: 'agent',
    branch: 'Chandigarh Branch',
  },
  {
    id: 'RRA-CL-1001',
    name: 'Amit Verma',
    email: 'amit.client@ridhiratnam.demo',
    mobile: '+91 9876543210',
    password: 'Client@123',
    role: 'client',
    branch: 'Chandigarh',
  },
];

// Pre-configured realistic sample KYC documents
export const SAMPLE_DOCS_AMIT: KycDocument[] = [
  {
    id: 'doc-amit-1',
    type: 'aadhaar',
    name: 'Aadhaar Card',
    fileName: 'aadhaar_card_amit_verma.pdf',
    fileSize: '1.8 MB',
    uploadDate: '02 Nov 2026',
    status: 'Pending',
    notes: 'Aadhaar XML e-KYC verified with masked 12-digit number.',
  },
  {
    id: 'doc-amit-2',
    type: 'pan',
    name: 'PAN Card',
    fileName: 'pan_card_amit_verma.jpg',
    fileSize: '850 KB',
    uploadDate: '02 Nov 2026',
    status: 'Pending',
    notes: 'Permanent Account Number clearly visible with photograph.',
  },
  {
    id: 'doc-amit-3',
    type: 'address_proof',
    name: 'Address Proof',
    fileName: 'electricity_bill_oct26.pdf',
    fileSize: '1.2 MB',
    uploadDate: '02 Nov 2026',
    status: 'Pending',
    notes: 'Utility bill dated within 60 days.',
  },
  {
    id: 'doc-amit-4',
    type: 'photograph',
    name: 'Passport-size Photograph',
    fileName: 'passport_photo_amit.jpg',
    fileSize: '420 KB',
    uploadDate: '02 Nov 2026',
    status: 'Pending',
    notes: 'High-contrast portrait against studio white background.',
  },
];

// In-memory submissions repository
export let kycSubmissionsStore: KycSubmission[] = [
  {
    id: 'KYC-2026-00124',
    clientId: 'RRA-CL-1001',
    clientName: 'Amit Verma',
    clientEmail: 'amit.client@ridhiratnam.demo',
    clientPhone: '+91 9876543210',
    submissionDate: '02 Nov 2026',
    status: 'PENDING',
    documents: SAMPLE_DOCS_AMIT,
    history: [
      {
        id: 'hist-1',
        action: 'SUBMITTED',
        date: '02 Nov 2026',
        remarks: 'Client uploaded Aadhaar, PAN, Address Proof, and Photograph.',
      },
    ],
  },
  {
    id: 'KYC-2026-00123',
    clientId: 'RRA-CL-1002',
    clientName: 'Neha Sharma',
    clientEmail: 'neha.sharma@example.com',
    clientPhone: '+91 98721 87654',
    submissionDate: '01 Nov 2026',
    status: 'PENDING',
    documents: [
      {
        id: 'doc-neha-1',
        type: 'aadhaar',
        name: 'Aadhaar Card',
        fileName: 'aadhaar_neha.pdf',
        fileSize: '1.4 MB',
        uploadDate: '01 Nov 2026',
        status: 'Pending',
      },
      {
        id: 'doc-neha-2',
        type: 'pan',
        name: 'PAN Card',
        fileName: 'pan_neha.jpg',
        fileSize: '720 KB',
        uploadDate: '01 Nov 2026',
        status: 'Pending',
      },
      {
        id: 'doc-neha-3',
        type: 'address_proof',
        name: 'Address Proof',
        fileName: 'rent_agreement_chandigarh.pdf',
        fileSize: '2.1 MB',
        uploadDate: '01 Nov 2026',
        status: 'Pending',
      },
      {
        id: 'doc-neha-4',
        type: 'photograph',
        name: 'Passport-size Photograph',
        fileName: 'neha_portrait.png',
        fileSize: '510 KB',
        uploadDate: '01 Nov 2026',
        status: 'Pending',
      },
    ],
    history: [
      {
        id: 'hist-neha-1',
        action: 'SUBMITTED',
        date: '01 Nov 2026',
        remarks: 'Awaiting agent verification.',
      },
    ],
  },
  {
    id: 'KYC-2026-00098',
    clientId: 'RRA-CL-1003',
    clientName: 'Karan Mehta',
    clientEmail: 'karan.mehta@example.com',
    clientPhone: '+91 98150 11223',
    submissionDate: '15 Oct 2026',
    status: 'APPROVED',
    documents: [
      {
        id: 'doc-km-1',
        type: 'aadhaar',
        name: 'Aadhaar Card',
        fileName: 'aadhaar_km.pdf',
        fileSize: '1.5 MB',
        uploadDate: '15 Oct 2026',
        status: 'Verified',
      },
      {
        id: 'doc-km-2',
        type: 'pan',
        name: 'PAN Card',
        fileName: 'pan_km.jpg',
        fileSize: '680 KB',
        uploadDate: '15 Oct 2026',
        status: 'Verified',
      },
      {
        id: 'doc-km-3',
        type: 'address_proof',
        name: 'Address Proof',
        fileName: 'gas_bill_km.pdf',
        fileSize: '1.1 MB',
        uploadDate: '15 Oct 2026',
        status: 'Verified',
      },
      {
        id: 'doc-km-4',
        type: 'photograph',
        name: 'Passport-size Photograph',
        fileName: 'photo_km.jpg',
        fileSize: '400 KB',
        uploadDate: '15 Oct 2026',
        status: 'Verified',
      },
    ],
    reviewedBy: 'RRA-AG-1024',
    reviewerName: 'Rahul Sharma',
    reviewedAt: '18 Oct 2026',
    agentRemarks: 'All 4 documents verified successfully against official databases.',
    history: [
      {
        id: 'hist-km-1',
        action: 'SUBMITTED',
        date: '15 Oct 2026',
      },
      {
        id: 'hist-km-2',
        action: 'APPROVED',
        date: '18 Oct 2026',
        agentId: 'RRA-AG-1024',
        agentName: 'Rahul Sharma',
        remarks: 'All documents authenticated and verified.',
      },
    ],
  },
  {
    id: 'KYC-2026-00072',
    clientId: 'RRA-CL-1004',
    clientName: 'Priya Singh',
    clientEmail: 'priya.singh@example.com',
    clientPhone: '+91 98880 44556',
    submissionDate: '08 Oct 2026',
    status: 'REJECTED',
    documents: [
      {
        id: 'doc-ps-1',
        type: 'aadhaar',
        name: 'Aadhaar Card',
        fileName: 'aadhaar_blurred.jpg',
        fileSize: '410 KB',
        uploadDate: '08 Oct 2026',
        status: 'Rejected',
        notes: 'Blurred scan; unreadable text and photo.',
      },
      {
        id: 'doc-ps-2',
        type: 'pan',
        name: 'PAN Card',
        fileName: 'pan_ps.pdf',
        fileSize: '950 KB',
        uploadDate: '08 Oct 2026',
        status: 'Verified',
      },
      {
        id: 'doc-ps-3',
        type: 'address_proof',
        name: 'Address Proof',
        fileName: 'water_bill_ps.pdf',
        fileSize: '1.3 MB',
        uploadDate: '08 Oct 2026',
        status: 'Verified',
      },
      {
        id: 'doc-ps-4',
        type: 'photograph',
        name: 'Passport-size Photograph',
        fileName: 'photo_ps.jpg',
        fileSize: '390 KB',
        uploadDate: '08 Oct 2026',
        status: 'Verified',
      },
    ],
    reviewedBy: 'RRA-AG-1024',
    reviewerName: 'Rahul Sharma',
    reviewedAt: '10 Oct 2026',
    rejectionReason: 'Aadhaar Card copy is blurred and unreadable. Please re-upload a clear scanned copy.',
    agentRemarks: 'Please upload a high-resolution scan or DigiLocker-certified Aadhaar copy.',
    history: [
      {
        id: 'hist-ps-1',
        action: 'SUBMITTED',
        date: '08 Oct 2026',
      },
      {
        id: 'hist-ps-2',
        action: 'REJECTED',
        date: '10 Oct 2026',
        agentId: 'RRA-AG-1024',
        agentName: 'Rahul Sharma',
        rejectionReason: 'Aadhaar Card copy is blurred and unreadable.',
        remarks: 'Please upload a clear scanned copy.',
      },
    ],
  },
];

export const getKycStats = async (): Promise<KycStatItem[]> => {
  // Realistic dashboard mock values as requested in project specifications
  return [
    {
      id: 'stat-total',
      title: 'Total Submissions',
      value: 248,
      variant: 'total',
      changeRate: '+18% this month',
      periodLabel: 'All time',
    },
    {
      id: 'stat-pending',
      title: 'Pending Verification',
      value: 42,
      variant: 'pending',
      changeRate: 'Requires agent action',
      periodLabel: 'Pending audit',
    },
    {
      id: 'stat-approved',
      title: 'Approved',
      value: 176,
      variant: 'approved',
      changeRate: '71% verified rate',
      periodLabel: 'Completed',
    },
    {
      id: 'stat-rejected',
      title: 'Rejected',
      value: 30,
      variant: 'rejected',
      changeRate: 'Awaiting client re-upload',
      periodLabel: 'Action needed',
    },
  ];
};

export const getLatestSubmissions = async (): Promise<KycSubmission[]> => {
  return [...kycSubmissionsStore].slice(0, 4);
};

export const getAllSubmissions = async (
  query?: string,
  filterStatus?: KycStatus | 'ALL'
): Promise<KycSubmission[]> => {
  return kycSubmissionsStore.filter((sub) => {
    const matchesFilter =
      !filterStatus || filterStatus === 'ALL' || sub.status === filterStatus;
    const q = (query || '').toLowerCase().trim();
    const matchesQuery =
      !q ||
      sub.clientName.toLowerCase().includes(q) ||
      sub.id.toLowerCase().includes(q) ||
      sub.clientId.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });
};

export const getSubmissionById = async (
  id: string
): Promise<KycSubmission | null> => {
  const match = kycSubmissionsStore.find((s) => s.id === id);
  return match ? { ...match } : null;
};

export const getClientLatestSubmission = async (
  clientId: string
): Promise<KycSubmission | null> => {
  const matches = kycSubmissionsStore.filter((s) => s.clientId === clientId);
  return matches.length > 0 ? { ...matches[0] } : null;
};

export const getLatestClientSubmission = getClientLatestSubmission;

export const getClientSubmissions = async (
  clientId: string
): Promise<KycSubmission[]> => {
  return kycSubmissionsStore.filter((s) => s.clientId === clientId);
};

export const submitKycDocuments = async (payload: {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  documents: KycDocument[];
}): Promise<KycSubmission> => {
  const newId = `KYC-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')} Nov 2026`;

  const newSubmission: KycSubmission = {
    id: newId,
    clientId: payload.clientId,
    clientName: payload.clientName,
    clientEmail: payload.clientEmail,
    clientPhone: payload.clientPhone,
    submissionDate: dateStr,
    status: 'PENDING',
    documents: payload.documents,
    history: [
      {
        id: `hist-${Date.now()}`,
        action: 'SUBMITTED',
        date: dateStr,
        remarks: 'Client uploaded documents for verification.',
      },
    ],
  };

  kycSubmissionsStore = [newSubmission, ...kycSubmissionsStore];
  return newSubmission;
};

export const resubmitKycDocuments = async (
  submissionId: string,
  updatedDocs: KycDocument[]
): Promise<KycSubmission | null> => {
  const index = kycSubmissionsStore.findIndex((s) => s.id === submissionId);
  if (index === -1) return null;

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')} Nov 2026`;

  const existing = kycSubmissionsStore[index];
  const updated: KycSubmission = {
    ...existing,
    status: 'PENDING',
    submissionDate: dateStr,
    documents: updatedDocs,
    rejectionReason: undefined,
    history: [
      {
        id: `hist-${Date.now()}`,
        action: 'RESUBMITTED',
        date: dateStr,
        remarks: 'Client corrected and replaced requested documents.',
      },
      ...existing.history,
    ],
  };

  kycSubmissionsStore[index] = updated;
  return updated;
};

export const approveSubmission = async (
  submissionId: string,
  agentId: string = 'RRA-AG-1024',
  remarks?: string
): Promise<KycSubmission | null> => {
  const index = kycSubmissionsStore.findIndex((s) => s.id === submissionId);
  if (index === -1) return null;

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')} Nov 2026`;

  const existing = kycSubmissionsStore[index];
  const updated: KycSubmission = {
    ...existing,
    status: 'APPROVED',
    reviewedBy: agentId,
    reviewerName: 'Rahul Sharma',
    reviewedAt: dateStr,
    agentRemarks: remarks || 'All KYC documents verified successfully.',
    documents: existing.documents.map((d) => ({
      ...d,
      status: 'Verified' as const,
    })),
    history: [
      {
        id: `hist-${Date.now()}`,
        action: 'APPROVED',
        date: dateStr,
        agentId,
        agentName: 'Rahul Sharma',
        remarks: remarks || 'All KYC documents verified successfully.',
      },
      ...existing.history,
    ],
  };

  kycSubmissionsStore[index] = updated;
  return updated;
};

export const rejectSubmission = async (
  submissionId: string,
  agentId: string = 'RRA-AG-1024',
  reason: string,
  remarks?: string
): Promise<KycSubmission | null> => {
  const index = kycSubmissionsStore.findIndex((s) => s.id === submissionId);
  if (index === -1) return null;

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')} Nov 2026`;

  const existing = kycSubmissionsStore[index];
  const updated: KycSubmission = {
    ...existing,
    status: 'REJECTED',
    reviewedBy: agentId,
    reviewerName: 'Rahul Sharma',
    reviewedAt: dateStr,
    rejectionReason: reason,
    agentRemarks: remarks,
    documents: existing.documents.map((d) => ({
      ...d,
      status: d.type === 'aadhaar' ? ('Rejected' as const) : d.status,
    })),
    history: [
      {
        id: `hist-${Date.now()}`,
        action: 'REJECTED',
        date: dateStr,
        agentId,
        agentName: 'Rahul Sharma',
        rejectionReason: reason,
        remarks: remarks || reason,
      },
      ...existing.history,
    ],
  };

  kycSubmissionsStore[index] = updated;
  return updated;
};

export const getAgentReviewedHistory = async (
  agentId: string = 'RRA-AG-1024'
): Promise<KycSubmission[]> => {
  return kycSubmissionsStore.filter(
    (s) =>
      (s.reviewedBy === agentId || s.status === 'APPROVED' || s.status === 'REJECTED') &&
      s.status !== 'PENDING'
  );
};

export const authenticateUser = async (
  identifier: string,
  password?: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> => {
  const cleanId = identifier.trim().toLowerCase();

  // Agent check
  if (
    cleanId === 'rahul.agent@ridhiratnam.demo' ||
    cleanId === 'rra-ag-1024' ||
    cleanId.includes('agent')
  ) {
    if (password && password !== 'Agent@123') {
      return { success: false, error: 'Incorrect agent password.' };
    }
    return { success: true, user: MOCK_USERS[0] };
  }

  // Client check
  const matchedClient = MOCK_USERS.find(
    (u) =>
      u.role === 'client' &&
      (u.email.toLowerCase() === cleanId ||
        u.id.toLowerCase() === cleanId ||
        u.mobile === cleanId ||
        u.mobile.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
  );

  if (matchedClient) {
    if (password && password !== matchedClient.password) {
      return { success: false, error: 'Incorrect client password.' };
    }
    return { success: true, user: matchedClient };
  }

  // Any other registered client credentials allowed during simulation
  return {
    success: true,
    user: {
      id: `RRA-CL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: identifier.split('@')[0] || 'Registered Client',
      email: identifier.includes('@') ? identifier : 'client@ridhiratnam.demo',
      mobile: identifier.includes('@') ? '+91 9876543210' : identifier,
      password: password || 'Client@123',
      role: 'client',
      branch: 'Chandigarh',
    },
  };
};

export const registerClientAccount = async (payload: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}): Promise<UserAccount> => {
  const newClient: UserAccount = {
    id: `RRA-CL-${Math.floor(1000 + Math.random() * 9000)}`,
    name: payload.fullName,
    email: payload.email,
    mobile: payload.mobile,
    password: payload.password,
    role: 'client',
    branch: 'Chandigarh',
  };
  MOCK_USERS.push(newClient);
  return newClient;
};
