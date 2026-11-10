export type ProviderType = 
  | 'Individual Practitioner'
  | 'Group Practice'
  | 'Hospital / Inpatient Facility'
  | 'Ambulatory Surgical Center'
  | 'Diagnostic & Imaging'
  | 'Allied Health Professional';

export type EnrollmentStatus = 
  | 'Active'
  | 'Pending Review'
  | 'Under Investigation'
  | 'Suspended'
  | 'Terminated'
  | 'Incomplete';

export type ReviewTransactionType = 
  | 'Initial Enrollment'
  | 'Re-credentialing'
  | 'EFT Pre-Note Verification'
  | 'Address & Location Change'
  | 'Change of Ownership (CHOW)'
  | 'Specialty Addition';

export type SlaStatus = 'normal' | 'approaching' | 'breached';

export interface ProviderCertification {
  id: string;
  type: 'State Medical License' | 'DEA Registration' | 'Board Certification' | 'CLIA Certificate' | 'CDS Registration';
  identifier: string;
  state?: string;
  issuingBody: string;
  issueDate: string;
  expirationDate: string;
  daysUntilExpiration: number;
  verificationStatus: 'Primary Source Verified' | 'Pending Verification' | 'Expired' | 'Disciplinary Flag';
  verificationSource: string;
}

export interface ProviderRecord {
  id: string;
  npi: string;
  medicaidId: string;
  legalName: string;
  dba?: string;
  providerType: ProviderType;
  primarySpecialty: string;
  taxonomyCode: string;
  status: EnrollmentStatus;
  effectiveDate: string;
  renewalDueDate: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  taxIdMasked: string; // e.g. ***-**-4892
  certificationsCount: number;
  certifications: ProviderCertification[];
  activeEft: boolean;
  eftVerificationStatus: 'Final - Verified' | 'Pending Pre-Note' | 'Final - Rejected' | 'Exempt/Waived';
  lastAuditTimestamp: string;
}

export interface ReviewQueueItem {
  id: string;
  providerId: string;
  providerName: string;
  npi: string;
  providerType: ProviderType;
  primarySpecialty: string;
  transactionType: ReviewTransactionType;
  submissionDate: string;
  slaTargetDate: string;
  daysInQueue: number;
  slaStatus: SlaStatus;
  assignedReviewer: string;
  priority: 'High' | 'Medium' | 'Routine';
  status: 'Pending Review' | 'In Progress' | 'Information Requested' | 'Approved' | 'Rejected';
  summaryNotes: string;
  checksCompleted: {
    oigSamExclusion: boolean;
    licenseVerification: boolean;
    malpracticeHistory: boolean;
    eftPreNoteCheck: boolean;
    boardCertification: boolean;
  };
}

export interface DashboardMetrics {
  totalProviders: {
    count: number;
    activeCount: number;
    pendingCount: number;
    suspendedCount: number;
    momGrowthPercent: number;
    weekTrendPercent: number; // e.g. +2.4
    breakdown: {
      individuals: number;
      groups: number;
      facilities: number;
      alliedHealth: number;
    };
  };
  activeCertifications: {
    count: number;
    verifiedPercent: number;
    expiringIn30Days: number;
    expiringIn60Days: number;
    expiringIn90Days: number;
    weekTrendPercent: number; // e.g. +1.8
    breakdown: {
      stateLicenses: number;
      deaRegistrations: number;
      boardCertifications: number;
      cliaCertificates: number;
    };
  };
  pendingReviews: {
    totalQueueCount: number;
    slaComplianceRate: number;
    highPriorityCount: number;
    weekTrendPercent: number; // e.g. -4.8
    breakdown: {
      initialEnrollments: number;
      recredentialing: number;
      eftVerifications: number;
      addressChanges: number;
      chowTransactions: number;
    };
  };
}
