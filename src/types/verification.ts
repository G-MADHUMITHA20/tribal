export interface ExtractedField {
  fieldName: string;
  fieldLabel: string;
  extractedValue: string | number;
  confidence: number; // 0 to 1
  matchedWithApplication: boolean;
  applicationValue?: string | number;
  matchType: 'EXACT' | 'FUZZY_MATCH' | 'MISMATCH' | 'THRESHOLD_PASS' | 'THRESHOLD_FAIL';
  explanation: string;
}

export interface DocumentVerificationResult {
  documentId: string;
  documentType: 'ST_CERTIFICATE' | 'INCOME_CERTIFICATE' | 'MARKSHEET' | 'BANK_PASSBOOK' | 'ADMISSION_LETTER';
  documentTitle: string;
  certificateNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  overallDocStatus: 'VERIFIED' | 'DEFICIENCY_DETECTED' | 'MANUAL_REVIEW_REQUIRED';
  fields: ExtractedField[];
  deficiencyCode?: string;
  deficiencyMessage?: string;
  suggestedCorrection?: string;
  rawOcrSnippet?: string;
}

export interface ExplainableRuleEvidence {
  criterionTitle: string;
  ruleFormula: string;
  documentSource: string;
  extractedDataPoint: string;
  applicantDeclared: string;
  verificationOutcome: 'SATISFIED' | 'BREACHED' | 'INCONCLUSIVE';
  statutoryReference: string;
}
