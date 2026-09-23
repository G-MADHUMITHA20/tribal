/**
 * GOVERNMENT INTEGRATION INTERFACE: Aadhaar e-KYC (UIDAI) & e-Sign (C-DAC/NSDL)
 */

export interface EkycRequest {
  aadhaarNumber: string;
  consentGranted: boolean;
  authMode: 'OTP' | 'BIOMETRIC_FINGERPRINT' | 'IRIS';
}

export interface EkycResponse {
  authStatus: 'SUCCESS' | 'FAILED';
  maskedAadhaar: string;
  name: string;
  gender: string;
  dob: string;
  address: {
    district: string;
    state: string;
    pincode: string;
  };
  photoBase64Placeholder?: string;
}

export const AadhaarEkycService = {
  isIntegrationLive: false,
  statusNotice: 'Demo Integration Interface: Simulates UIDAI Aadhaar OTP e-KYC Authentication.',

  verifyCitizenEkyc: async (req: EkycRequest): Promise<EkycResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      authStatus: 'SUCCESS',
      maskedAadhaar: 'XXXXXXXX' + req.aadhaarNumber.slice(-4),
      name: 'Verified Citizen',
      gender: 'OTHER',
      dob: '2000-01-01',
      address: {
        district: '',
        state: '',
        pincode: ''
      }
    };
  }
};

export const ESignService = {
  isIntegrationLive: false,
  signApplicationDeclaration: async (applicationId: string, applicantName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      eSignTransactionId: 'ESIGN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      signedBy: applicantName,
      signedTimestamp: new Date().toISOString(),
      certifyingAuthority: 'C-DAC / NIC Electronic Signature Service'
    };
  }
};
