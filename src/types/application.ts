export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'INSTITUTE_VERIFIED'
  | 'DOC_VERIFICATION_PENDING'
  | 'DOC_VERIFIED'
  | 'DEFICIENCY_NOTIFIED'
  | 'RESUBMITTED'
  | 'SCRUTINY_PASSED'
  | 'PROPOSED_FOR_SELECTION'
  | 'APPROVED'
  | 'REJECTED'
  | 'SANCTIONED'
  | 'DISBURSED_DBT';

export interface ApplicantProfile {
  id: string;
  fullName: string;
  fatherOrHusbandName: string;
  gender: 'MALE' | 'FEMALE' | 'TRANSGENDER';
  dob: string;
  aadhaarNumberMasked: string;
  category: 'ST' | 'PVTG';
  tribeCommunity: string;
  mobile: string;
  email: string;
  state: string;
  district: string;
  pincode: string;
  disabilityStatus: 'NONE' | 'YES';
  disabilityPercentage?: number;
}

export interface AcademicDetails {
  currentCourse: string;
  institutionName: string;
  institutionState: string;
  aisheCode: string;
  rollNumber: string;
  yearOfStudy: string;
  previousExamName: string;
  previousExamPercentage: number;
  passingYear: string;
  boardOrUniversity: string;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  branchName: string;
  isAadhaarSeeded: boolean; // Vital for PFMS DBT
  dbtVerifiedDate?: string;
}

export interface ApplicationDocument {
  id: string;
  documentCode: string;
  documentName: string;
  fileUrl: string;
  fileName: string;
  fileSizeKB: number;
  uploadedAt: string;
  ocrExtracted: boolean;
  status: 'PENDING' | 'VALID' | 'DEFICIENT';
  deficiencyReason?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'APPLICANT' | 'OFFICER' | 'ADMIN' | 'SYSTEM_AI';
  action: string;
  previousStatus?: ApplicationStatus;
  newStatus?: ApplicationStatus;
  remarks: string;
}

export interface ApplicationRecord {
  id: string; // e.g. "MOTA/2026/NF/10492"
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  submissionDate: string;
  lastUpdated: string;
  currentStageIndex: number;
  status: ApplicationStatus;
  applicant: ApplicantProfile;
  academic: AcademicDetails;
  bank: BankDetails;
  annualFamilyIncome: number;
  documents: ApplicationDocument[];
  hasDeficiency: boolean;
  deficiencyNotes?: string;
  aiEligibilityResult?: {
    overallStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'FLAGGED_DEFICIENCY';
    confidenceScore: number;
    ruleMatches: {
      ruleId: string;
      label: string;
      expected: string;
      actual: string;
      status: 'PASS' | 'FAIL' | 'WARNING';
      evidenceSnippet: string;
    }[];
  };
  meritScore?: number;
  officerRemarks?: string;
  overrideNotes?: string;
  auditTrail: AuditRecord[];
}
