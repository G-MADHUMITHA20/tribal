export type SchemeCategory = 
  | 'PRE_MATRIC'
  | 'POST_MATRIC'
  | 'NATIONAL_SCHOLARSHIP'
  | 'NATIONAL_FELLOWSHIP'
  | 'NATIONAL_OVERSEAS'
  | 'DBT';

export type EducationLevel = 
  | 'CLASS_9_10'
  | 'CLASS_11_12'
  | 'UNDERGRADUATE'
  | 'POSTGRADUATE'
  | 'MPHIL_PHD'
  | 'OVERSEAS_POSTGRADUATE';

export interface EligibilityCriterion {
  id: string;
  field: string;
  label: string;
  operator: 'EQUALS' | 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN_OR_EQUAL' | 'IN' | 'BOOLEAN';
  value: string | number | string[] | boolean;
  unit?: string;
  explanation: string;
}

export interface RequiredDocument {
  id: string;
  code: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSizeMB: number;
  ocrVerifiable: boolean;
  samplePlaceholder?: string;
}

export interface BenefitTier {
  item: string;
  amount: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'One-Time';
  notes?: string;
}

export interface WorkflowStageDefinition {
  id: string;
  order: number;
  name: string;
  description: string;
  responsibleRole: 'APPLICANT' | 'INSTITUTION' | 'SCRUTINY_OFFICER' | 'SELECTION_COMMITTEE' | 'SANCTIONING_AUTHORITY' | 'PFMS_GATEWAY';
}

export interface SchemeConfig {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: SchemeCategory;
  tagline: string;
  description: string;
  portalCategory: string;
  isOpen: boolean;
  isDatasetOriginal?: boolean;
  academicYear: string;
  applicationDeadline: string;
  targetCommunity: string; // "Scheduled Tribes (ST)"
  annualIncomeCap: number; // in INR, 0 if no cap
  minAge?: number;
  maxAge?: number;
  minAcademicPercentage?: number;
  educationLevels: EducationLevel[];
  eligibilitySummary: string[];
  eligibilityRules: EligibilityCriterion[];
  requiredDocuments: RequiredDocument[];
  benefits: BenefitTier[];
  selectionCriteria: {
    method: 'MERIT_ONLY' | 'MEANS_CUM_MERIT' | 'FIRST_COME_FIRST_SERVE' | 'RESERVATION_QUOTA';
    meritCalculation: string;
    totalSlotsPerYear: number;
    femaleReservationPercentage?: number;
    pvdgSpecialQuota?: boolean;
  };
  workflowStages: WorkflowStageDefinition[];
  guidelinePdfUrl: string;
  faqItems: { question: string; answer: string }[];
  nodalContact: {
    officer: string;
    designation: string;
    email: string;
    phone: string;
    address: string;
  };
}
