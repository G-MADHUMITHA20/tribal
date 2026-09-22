import { DocumentVerificationResult } from '../types/verification';

export function simulateDocumentOcr(
  documentType: 'ST_CERTIFICATE' | 'INCOME_CERTIFICATE' | 'MARKSHEET' | 'BANK_PASSBOOK' | 'ADMISSION_LETTER',
  applicantName: string,
  declaredIncome?: number,
  isDeficientScenario: boolean = false
): DocumentVerificationResult {
  if (documentType === 'INCOME_CERTIFICATE') {
    if (isDeficientScenario) {
      return {
        documentId: 'DOC-AI-INC-ERR',
        documentType: 'INCOME_CERTIFICATE',
        documentTitle: 'Income Certificate (Revenue Authority)',
        certificateNumber: 'INC/JH/2022/9021',
        issuingAuthority: 'Office of the Sub-Divisional Magistrate / Tehsildar',
        issueDate: '12-05-2022', // Outdated!
        overallDocStatus: 'DEFICIENCY_DETECTED',
        deficiencyCode: 'DEF_EXPIRED_CERTIFICATE',
        deficiencyMessage: 'Income certificate is issued for FY 2022-23. The scheme requires valid certificate for FY 2024-25.',
        suggestedCorrection: 'Please upload the latest Income Certificate issued on or after 01-04-2024 by Tehsildar or authorized Revenue Officer.',
        rawOcrSnippet: `GOVERNMENT OF MADHYA PRADESH - REVENUE DEPT\nCERTIFICATE OF ANNUAL FAMILY INCOME\nCertificate No: INC/MP/2022/9021\nThis is to certify that Shri Ramesh Gond, Father of ${applicantName}, resident of Mandla, has an annual income of Rs. 1,80,000/-.\nDate of Issue: 12-05-2022`,
        fields: [
          {
            fieldName: 'applicantName',
            fieldLabel: 'Beneficiary Name',
            extractedValue: applicantName,
            confidence: 0.98,
            matchedWithApplication: true,
            applicationValue: applicantName,
            matchType: 'EXACT',
            explanation: 'Full name matches applicant registration profile.'
          },
          {
            fieldName: 'annualIncome',
            fieldLabel: 'Extracted Annual Income',
            extractedValue: '₹1,80,000',
            confidence: 0.96,
            matchedWithApplication: true,
            applicationValue: declaredIncome ? `₹${declaredIncome.toLocaleString('en-IN')}` : '₹1,80,000',
            matchType: 'THRESHOLD_PASS',
            explanation: 'Extracted income is within the statutory ceiling.'
          },
          {
            fieldName: 'issueDate',
            fieldLabel: 'Financial Year Validity',
            extractedValue: '12-05-2022 (FY 2022-23)',
            confidence: 0.94,
            matchedWithApplication: false,
            applicationValue: 'FY 2024-25',
            matchType: 'MISMATCH',
            explanation: 'Document date exceeds validity window (>1 year old). Scheme guidelines require current assessment year certificate.'
          }
        ]
      };
    }

    // Valid Income Certificate
    return {
      documentId: 'DOC-AI-INC-OK',
      documentType: 'INCOME_CERTIFICATE',
      documentTitle: 'Income Certificate (Revenue Authority)',
      certificateNumber: 'INC/JH/2024/49102',
      issuingAuthority: 'Office of the Circle Officer / Tehsildar',
      issueDate: '15-05-2024',
      overallDocStatus: 'VERIFIED',
      rawOcrSnippet: `GOVERNMENT OF JHARKHAND - REVENUE & LAND REFORMS\nANNUAL INCOME CERTIFICATE (FINANCIAL YEAR 2024-25)\nRef No: INC/JH/2024/49102\nCertified that the total annual income of the family of ${applicantName} is Rs. 1,80,000/- (Rupees One Lakh Eighty Thousand Only).\nDigitally Signed by Tehsildar on 15/05/2024.`,
      fields: [
        {
          fieldName: 'applicantName',
          fieldLabel: 'Applicant / Beneficiary Name',
          extractedValue: applicantName,
          confidence: 0.99,
          matchedWithApplication: true,
          applicationValue: applicantName,
          matchType: 'EXACT',
          explanation: 'Exact match with student Aadhaar verified name.'
        },
        {
          fieldName: 'annualIncome',
          fieldLabel: 'Certified Family Income',
          extractedValue: '₹1,80,000',
          confidence: 0.97,
          matchedWithApplication: true,
          applicationValue: declaredIncome ? `₹${declaredIncome.toLocaleString('en-IN')}` : '₹1,80,000',
          matchType: 'THRESHOLD_PASS',
          explanation: 'Within scheme ceiling limit (PASS).'
        },
        {
          fieldName: 'issueDate',
          fieldLabel: 'Financial Year Validity',
          extractedValue: '15-05-2024 (FY 2024-25)',
          confidence: 0.98,
          matchedWithApplication: true,
          applicationValue: 'Current Assessment Year',
          matchType: 'EXACT',
          explanation: 'Certificate is current and valid for 2025-26 scholarship cycle.'
        },
        {
          fieldName: 'digitalSignature',
          fieldLabel: 'Digital Signature & Barcode',
          extractedValue: 'Verified (e-Pramaan PKI Token)',
          confidence: 1.0,
          matchedWithApplication: true,
          matchType: 'EXACT',
          explanation: 'Cryptographic signature from state government repository verified.'
        }
      ]
    };
  }

  if (documentType === 'ST_CERTIFICATE') {
    return {
      documentId: 'DOC-AI-ST-OK',
      documentType: 'ST_CERTIFICATE',
      documentTitle: 'Scheduled Tribe Community Certificate',
      certificateNumber: 'ST/GOV/2019/8491',
      issuingAuthority: 'Sub-Divisional Magistrate (SDM), Revenue Division',
      issueDate: '20-08-2019',
      overallDocStatus: 'VERIFIED',
      rawOcrSnippet: `OFFICE OF THE SUB-DIVISIONAL MAGISTRATE\nSCHEDULED TRIBE CERTIFICATE\nCertificate No: ST/GOV/2019/8491\nThis is to certify that ${applicantName} belongs to the Scheduled Tribe community recognized under the Constitution (Scheduled Tribes) Order, 1950.`,
      fields: [
        {
          fieldName: 'applicantName',
          fieldLabel: 'Name of Candidate',
          extractedValue: applicantName,
          confidence: 0.98,
          matchedWithApplication: true,
          applicationValue: applicantName,
          matchType: 'EXACT',
          explanation: 'Verified against Aadhaar e-KYC profile.'
        },
        {
          fieldName: 'community',
          fieldLabel: 'Tribal Community',
          extractedValue: 'Scheduled Tribe (ST)',
          confidence: 0.99,
          matchedWithApplication: true,
          applicationValue: 'ST',
          matchType: 'EXACT',
          explanation: 'Community recognized under Presidential Order.'
        },
        {
          fieldName: 'issuingAuthority',
          fieldLabel: 'Authorized Issuing Officer',
          extractedValue: 'Sub-Divisional Magistrate',
          confidence: 0.96,
          matchedWithApplication: true,
          matchType: 'EXACT',
          explanation: 'Designated authority authorized under Ministry of Home Affairs guidelines.'
        }
      ]
    };
  }

  // Default Marksheet OCR
  return {
    documentId: 'DOC-AI-MARK-OK',
    documentType: 'MARKSHEET',
    documentTitle: 'Qualifying Degree / Academic Marksheet',
    certificateNumber: 'MRK/UNIV/2024/8812',
    issuingAuthority: 'Controller of Examinations',
    issueDate: '30-06-2024',
    overallDocStatus: 'VERIFIED',
    rawOcrSnippet: `EXAMINATION BRANCH - CONSOLIDATED STATEMENT OF MARKS\nCandidate Name: ${applicantName}\nDegree: Master of Science / Bachelor of Technology\nTotal Marks: 1490 / 2000 | Percentage: 74.50%\nResult: FIRST CLASS WITH DISTINCTION`,
    fields: [
      {
        fieldName: 'candidateName',
        fieldLabel: 'Student Name',
        extractedValue: applicantName,
        confidence: 0.97,
        matchedWithApplication: true,
        applicationValue: applicantName,
        matchType: 'EXACT',
        explanation: 'Matches academic record.'
      },
      {
        fieldName: 'percentageMarks',
        fieldLabel: 'Aggregate Percentage',
        extractedValue: '74.50%',
        confidence: 0.99,
        matchedWithApplication: true,
        applicationValue: '74.50%',
        matchType: 'THRESHOLD_PASS',
        explanation: 'Exceeds minimum qualifying threshold for the scheme (PASS).'
      },
      {
        fieldName: 'division',
        fieldLabel: 'Passing Grade / Division',
        extractedValue: 'First Class with Distinction',
        confidence: 0.98,
        matchedWithApplication: true,
        matchType: 'EXACT',
        explanation: 'Accredited institution passing status confirmed.'
      }
    ]
  };
}
