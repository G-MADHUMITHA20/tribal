/**
 * GOVERNMENT INTEGRATION INTERFACE: PFMS (Public Financial Management System) / Direct Benefit Transfer (DBT)
 * Reference: https://pfms.nic.in/
 */

export interface PfmsValidationRequest {
  beneficiaryName: string;
  bankAccountNumber: string;
  ifscCode: string;
  aadhaarNumberMasked: string;
  schemeCode: string;
}

export interface PfmsValidationResponse {
  statusCode: 'PFMS_AC_VALID' | 'PFMS_AC_INVALID' | 'NPCI_MAPPING_FAILED';
  isAadhaarSeeded: boolean;
  npciBankName: string;
  bankAccountValid: boolean;
  dbtEligibilityStatus: 'ELIGIBLE_FOR_DBT' | 'RE-SEEDING_REQUIRED';
  timestamp: string;
}

export const PfmsDbtService = {
  isIntegrationLive: false,
  statusNotice: 'Demo Integration Interface: Simulates Ministry of Finance PFMS DBT & NPCI Mapper Validation.',

  validateAccountWithPfms: async (req: PfmsValidationRequest): Promise<PfmsValidationResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      statusCode: 'PFMS_AC_VALID',
      isAadhaarSeeded: true,
      npciBankName: 'State Bank of India',
      bankAccountValid: true,
      dbtEligibilityStatus: 'ELIGIBLE_FOR_DBT',
      timestamp: new Date().toISOString()
    };
  }
};
