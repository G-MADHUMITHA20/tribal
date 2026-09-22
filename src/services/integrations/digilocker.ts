/**
 * GOVERNMENT INTEGRATION INTERFACE: DigiLocker National Gateway
 * Note: Prototype implementation with simulated API contracts.
 * Integration Reference: https://partners.digitallocker.gov.in/
 */

export interface DigiLockerDocRequest {
  aadhaarNumber: string;
  docType: 'CASTE_CERTIFICATE' | 'INCOME_CERTIFICATE' | 'CLASS_10_MARKSHEET' | 'CLASS_12_MARKSHEET' | 'RATION_CARD';
  issuerState: string;
}

export interface DigiLockerDocResponse {
  status: 'SUCCESS' | 'NOT_FOUND' | 'CONSENT_DENIED';
  uri: string;
  docName: string;
  issuer: string;
  issuanceDate: string;
  pkiSignatureValid: boolean;
  rawPayload?: Record<string, any>;
}

export const DigiLockerService = {
  isIntegrationLive: false,
  statusNotice: 'Demo Integration Interface: Simulates DigiLocker consent-based document pull API v2.0.',

  fetchDocumentFromDigiLocker: async (req: DigiLockerDocRequest): Promise<DigiLockerDocResponse> => {
    // Simulated roundtrip delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      status: 'SUCCESS',
      uri: `in.gov.digilocker.${req.issuerState.toLowerCase()}.${req.docType.toLowerCase()}-99214`,
      docName: `${req.docType.replace('_', ' ')} (${req.issuerState})`,
      issuer: `Department of Revenue & Land Records, Govt of ${req.issuerState}`,
      issuanceDate: '2024-05-18',
      pkiSignatureValid: true
    };
  }
};
