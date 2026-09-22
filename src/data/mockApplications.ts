import { ApplicationRecord } from '../types/application';

export const INITIAL_MOCK_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'MOTA/2025-26/NF/10492',
    schemeId: 'national-fellowship-st',
    schemeCode: 'MOTA-NF-04',
    schemeName: 'National Fellowship for Higher Education of ST Students (M.Phil / Ph.D.)',
    submissionDate: '2025-08-14',
    lastUpdated: '2025-09-18',
    currentStageIndex: 3, // At Scrutiny stage
    status: 'PROPOSED_FOR_SELECTION',
    applicant: {
      id: 'APP-ST-8821',
      fullName: 'Sunita Soren',
      fatherOrHusbandName: 'Mangal Soren',
      gender: 'FEMALE',
      dob: '1998-04-12',
      aadhaarNumberMasked: 'XXXXXXXX7819',
      category: 'ST',
      tribeCommunity: 'Santhal',
      mobile: '9845120394',
      email: 'sunita.soren@research.du.ac.in',
      state: 'Jharkhand',
      district: 'Dumka',
      pincode: '814101',
      disabilityStatus: 'NONE'
    },
    academic: {
      currentCourse: 'Ph.D. in Tribal Environmental Ecology',
      institutionName: 'University of Delhi',
      institutionState: 'Delhi',
      aisheCode: 'U-0109',
      rollNumber: 'DU/PHD/ENV/2024/09',
      yearOfStudy: '1st Year',
      previousExamName: 'M.Sc. Environmental Studies',
      previousExamPercentage: 74.5,
      passingYear: '2024',
      boardOrUniversity: 'Delhi University'
    },
    bank: {
      accountHolderName: 'Sunita Soren',
      bankName: 'State Bank of India',
      accountNumberMasked: 'XXXXXXXX4512',
      ifscCode: 'SBIN0001067',
      branchName: 'Delhi University Branch',
      isAadhaarSeeded: true,
      dbtVerifiedDate: '2025-08-15'
    },
    annualFamilyIncome: 180000,
    documents: [
      {
        id: 'DOC-10492-1',
        documentCode: 'ST_CERTIFICATE',
        documentName: 'ST Community Certificate',
        fileUrl: '#',
        fileName: 'Sunita_Soren_Caste_Certificate_Dumka.pdf',
        fileSizeKB: 340,
        uploadedAt: '2025-08-14',
        ocrExtracted: true,
        status: 'VALID'
      },
      {
        id: 'DOC-10492-2',
        documentCode: 'MARKSHEET',
        documentName: 'M.Sc. Consolidated Marksheet',
        fileUrl: '#',
        fileName: 'MSc_Consolidated_Marksheet_DU.pdf',
        fileSizeKB: 680,
        uploadedAt: '2025-08-14',
        ocrExtracted: true,
        status: 'VALID'
      },
      {
        id: 'DOC-10492-3',
        documentCode: 'ADMISSION_LETTER',
        documentName: 'Ph.D. Joining & DRC Approval Report',
        fileUrl: '#',
        fileName: 'DU_PhD_Joining_Report_Signed.pdf',
        fileSizeKB: 520,
        uploadedAt: '2025-08-14',
        ocrExtracted: true,
        status: 'VALID'
      }
    ],
    hasDeficiency: false,
    aiEligibilityResult: {
      overallStatus: 'ELIGIBLE',
      confidenceScore: 0.98,
      ruleMatches: [
        {
          ruleId: 'RULE_NF_CAT',
          label: 'ST Community Check',
          expected: 'ST (Notified Schedule)',
          actual: 'ST (Santhal Tribe - Jharkhand Gazette)',
          status: 'PASS',
          evidenceSnippet: 'Revenue Dept Dumka Ref: ST/DMK/2018/9812 verified against State Central Repository'
        },
        {
          ruleId: 'RULE_NF_QUAL',
          label: 'PG Minimum Score',
          expected: '>= 55.0%',
          actual: '74.50% (Grade A+)',
          status: 'PASS',
          evidenceSnippet: 'M.Sc. Marksheet OCR: Total Marks 1490/2000 (74.5%)'
        },
        {
          ruleId: 'RULE_NF_REG',
          label: 'Enrollment Verification',
          expected: 'Regular Full-time Ph.D.',
          actual: 'Regular Full-time Research Scholar (DU)',
          status: 'PASS',
          evidenceSnippet: 'Letter DU/BR/2024 dated 18-07-2024 signed by Head, Dept of Environmental Studies'
        }
      ]
    },
    meritScore: 84.5,
    officerRemarks: 'All academic credentials and reservation caste credentials vetted and verified. Recommended for National Fellowship 2025-26.',
    auditTrail: [
      {
        id: 'AUD-01',
        timestamp: '2025-08-14 11:24:10',
        actor: 'Sunita Soren',
        actorRole: 'APPLICANT',
        action: 'Application Submitted Online',
        previousStatus: 'DRAFT',
        newStatus: 'SUBMITTED',
        remarks: 'Form submitted along with 3 uploaded certificates.'
      },
      {
        id: 'AUD-02',
        timestamp: '2025-08-14 11:24:15',
        actor: 'MoTA OCR Engine',
        actorRole: 'SYSTEM_AI',
        action: 'Document Information Extraction & Verification Pre-check',
        previousStatus: 'SUBMITTED',
        newStatus: 'DOC_VERIFIED',
        remarks: 'OCR confidence 98%. All 3 mandatory fields matched without mismatch.'
      },
      {
        id: 'AUD-03',
        timestamp: '2025-08-20 15:40:02',
        actor: 'Registrar, University of Delhi',
        actorRole: 'OFFICER',
        action: 'Institution Nodal Officer Vetting',
        previousStatus: 'DOC_VERIFIED',
        newStatus: 'INSTITUTE_VERIFIED',
        remarks: 'Verified scholar registration and full-time attendance on campus.'
      },
      {
        id: 'AUD-04',
        timestamp: '2025-09-18 10:15:30',
        actor: 'Shri Manoj Kumar (Deputy Secretary)',
        actorRole: 'OFFICER',
        action: 'Scrutiny Officer Recommendation',
        previousStatus: 'INSTITUTE_VERIFIED',
        newStatus: 'PROPOSED_FOR_SELECTION',
        remarks: 'Document scrutiny passed. Placed on National Fellowship provisional merit roster.'
      }
    ]
  },
  {
    id: 'MOTA/2025-26/NSTE/07314',
    schemeId: 'national-scholarship-top-class',
    schemeCode: 'MOTA-NSTE-03',
    schemeName: 'National Scholarship for Higher Education of ST Students (Top Class Education)',
    submissionDate: '2025-08-28',
    lastUpdated: '2025-09-20',
    currentStageIndex: 2, // At Deficiency stage
    status: 'DEFICIENCY_NOTIFIED',
    applicant: {
      id: 'APP-ST-6720',
      fullName: 'Rahul Kumar Gond',
      fatherOrHusbandName: 'Ramesh Gond',
      gender: 'MALE',
      dob: '2004-11-20',
      aadhaarNumberMasked: 'XXXXXXXX3312',
      category: 'ST',
      tribeCommunity: 'Gond',
      mobile: '9711048821',
      email: 'rahul.gond@iitb.ac.in',
      state: 'Madhya Pradesh',
      district: 'Mandla',
      pincode: '481661',
      disabilityStatus: 'NONE'
    },
    academic: {
      currentCourse: 'B.Tech in Computer Science & Engineering',
      institutionName: 'Indian Institute of Technology Bombay (IIT Bombay)',
      institutionState: 'Maharashtra',
      aisheCode: 'U-0306',
      rollNumber: '24B030092',
      yearOfStudy: '1st Year',
      previousExamName: 'Class 12 / Higher Secondary (CBSE)',
      previousExamPercentage: 92.4,
      passingYear: '2024',
      boardOrUniversity: 'CBSE'
    },
    bank: {
      accountHolderName: 'Rahul Kumar',
      bankName: 'Canara Bank',
      accountNumberMasked: 'XXXXXXXX8891',
      ifscCode: 'CNRB0000492',
      branchName: 'Powai Branch, Mumbai',
      isAadhaarSeeded: true,
      dbtVerifiedDate: '2025-08-29'
    },
    annualFamilyIncome: 180000,
    documents: [
      {
        id: 'DOC-07314-1',
        documentCode: 'ST_CERTIFICATE',
        documentName: 'ST Certificate',
        fileUrl: '#',
        fileName: 'Rahul_Gond_ST_Mandla.pdf',
        fileSizeKB: 410,
        uploadedAt: '2025-08-28',
        ocrExtracted: true,
        status: 'VALID'
      },
      {
        id: 'DOC-07314-2',
        documentCode: 'INCOME_CERTIFICATE',
        documentName: 'Competent Tehsildar Income Certificate',
        fileUrl: '#',
        fileName: 'Income_Certificate_Old_Expired.pdf',
        fileSizeKB: 290,
        uploadedAt: '2025-08-28',
        ocrExtracted: true,
        status: 'DEFICIENT',
        deficiencyReason: 'Uploaded Income Certificate was issued in Financial Year 2022-23. Valid Certificate for FY 2024-25 is mandatory.'
      },
      {
        id: 'DOC-07314-3',
        documentCode: 'ADMISSION_LETTER',
        documentName: 'IIT Bombay Allotment & Fee Letter',
        fileUrl: '#',
        fileName: 'IITB_JoSAA_Seat_Allotment.pdf',
        fileSizeKB: 720,
        uploadedAt: '2025-08-28',
        ocrExtracted: true,
        status: 'VALID'
      }
    ],
    hasDeficiency: true,
    deficiencyNotes: 'DEFICIENCY DETECTED: Income certificate is outdated (Issued in 2022, requires FY 2024-25). Please upload latest certificate issued by Tehsildar Mandla within 15 calendar days.',
    aiEligibilityResult: {
      overallStatus: 'FLAGGED_DEFICIENCY',
      confidenceScore: 0.89,
      ruleMatches: [
        {
          ruleId: 'RULE_TOP_CAT',
          label: 'ST Community Validity',
          expected: 'ST',
          actual: 'ST (Gond)',
          status: 'PASS',
          evidenceSnippet: 'Certificate verified: Gond ST community MP'
        },
        {
          ruleId: 'RULE_TOP_INC',
          label: 'Income Ceiling Assessment',
          expected: '<= ₹6,00,000 p.a. (FY 2024-25)',
          actual: '₹1,80,000 (Expired Date: 12-05-2022)',
          status: 'WARNING',
          evidenceSnippet: 'OCR extracted issuance date 12/05/2022. Scheme rule requires certificate valid for current assessment year.'
        },
        {
          ruleId: 'RULE_TOP_INST',
          label: 'Premier Institute Check',
          expected: 'Top Class Identified Institute',
          actual: 'IIT Bombay (Notified Institute Code #01)',
          status: 'PASS',
          evidenceSnippet: 'JoSAA seat acceptance verified against IIT Bombay registry'
        }
      ]
    },
    auditTrail: [
      {
        id: 'AUD-10',
        timestamp: '2025-08-28 09:12:00',
        actor: 'Rahul Kumar Gond',
        actorRole: 'APPLICANT',
        action: 'Application Submitted',
        previousStatus: 'DRAFT',
        newStatus: 'SUBMITTED',
        remarks: 'Submitted for Top Class Education Scholarship at IIT Bombay.'
      },
      {
        id: 'AUD-11',
        timestamp: '2025-08-28 09:12:05',
        actor: 'MoTA OCR & Rule Validator',
        actorRole: 'SYSTEM_AI',
        action: 'Deficiency Rule Triggered',
        previousStatus: 'SUBMITTED',
        newStatus: 'DEFICIENCY_NOTIFIED',
        remarks: 'Rule RULE_TOP_INC flagged certificate date mismatch (2022 vs current financial year).'
      },
      {
        id: 'AUD-12',
        timestamp: '2025-09-02 14:10:22',
        actor: 'Smt. Vandana Das (Director)',
        actorRole: 'OFFICER',
        action: 'Deficiency Notice Issued to Applicant',
        previousStatus: 'SUBMITTED',
        newStatus: 'DEFICIENCY_NOTIFIED',
        remarks: 'System deficiency confirmed by scrutiny officer. Notification SMS & Email dispatched.'
      }
    ]
  },
  {
    id: 'MOTA/2025-26/POST/38190',
    schemeId: 'post-matric-st',
    schemeCode: 'MOTA-POST-02',
    schemeName: 'Post-Matric Scholarship for Scheduled Tribe Students (Classes XI to PG)',
    submissionDate: '2025-09-01',
    lastUpdated: '2025-09-15',
    currentStageIndex: 5,
    status: 'DISBURSED_DBT',
    applicant: {
      id: 'APP-ST-4029',
      fullName: 'Birsa Munda Marandi',
      fatherOrHusbandName: 'Shibu Marandi',
      gender: 'MALE',
      dob: '2003-08-15',
      aadhaarNumberMasked: 'XXXXXXXX9921',
      category: 'ST',
      tribeCommunity: 'Munda',
      mobile: '9431109924',
      email: 'birsa.munda@ranchiuniv.ac.in',
      state: 'Jharkhand',
      district: 'Khunti',
      pincode: '835210',
      disabilityStatus: 'NONE'
    },
    academic: {
      currentCourse: 'B.Sc. in Botany (Honours)',
      institutionName: 'St. Xavier’s College, Ranchi',
      institutionState: 'Jharkhand',
      aisheCode: 'C-41484',
      rollNumber: 'BOT/2024/44',
      yearOfStudy: '2nd Year',
      previousExamName: 'B.Sc. 1st Year Annual Exam',
      previousExamPercentage: 68.2,
      passingYear: '2024',
      boardOrUniversity: 'Ranchi University'
    },
    bank: {
      accountHolderName: 'Birsa Munda Marandi',
      bankName: 'Bank of India',
      accountNumberMasked: 'XXXXXXXX1122',
      ifscCode: 'BKID0004910',
      branchName: 'Main Road Khunti',
      isAadhaarSeeded: true,
      dbtVerifiedDate: '2025-09-02'
    },
    annualFamilyIncome: 140000,
    documents: [
      { id: 'DOC-38190-1', documentCode: 'ST_CERTIFICATE', documentName: 'ST Certificate', fileUrl: '#', fileName: 'Munda_ST_Khunti.pdf', fileSizeKB: 380, uploadedAt: '2025-09-01', ocrExtracted: true, status: 'VALID' },
      { id: 'DOC-38190-2', documentCode: 'INCOME_CERTIFICATE', documentName: 'Income Certificate', fileUrl: '#', fileName: 'Income_Certificate_Khunti_24.pdf', fileSizeKB: 310, uploadedAt: '2025-09-01', ocrExtracted: true, status: 'VALID' },
      { id: 'DOC-38190-3', documentCode: 'MARKSHEET', documentName: 'Previous Year Marksheet', fileUrl: '#', fileName: 'BSc_Yr1_Marksheet.pdf', fileSizeKB: 490, uploadedAt: '2025-09-01', ocrExtracted: true, status: 'VALID' }
    ],
    hasDeficiency: false,
    meritScore: 78.2,
    officerRemarks: 'Sanction approved. PFMS Transaction UTR: MOTA20250915904812 credited successfully.',
    auditTrail: [
      { id: 'AUD-30', timestamp: '2025-09-01 10:00:00', actor: 'Birsa Munda', actorRole: 'APPLICANT', action: 'Submitted Renewal Application', previousStatus: 'DRAFT', newStatus: 'SUBMITTED', remarks: 'Year 2 renewal' },
      { id: 'AUD-31', timestamp: '2025-09-04 11:30:00', actor: 'St. Xavier’s College Nodal', actorRole: 'OFFICER', action: 'College Verification Completed', previousStatus: 'SUBMITTED', newStatus: 'INSTITUTE_VERIFIED', remarks: 'Bonafide confirmed' },
      { id: 'AUD-32', timestamp: '2025-09-08 16:00:00', actor: 'DWO Khunti', actorRole: 'OFFICER', action: 'District Level Sanction', previousStatus: 'INSTITUTE_VERIFIED', newStatus: 'APPROVED', remarks: 'Sanction Order released' },
      { id: 'AUD-33', timestamp: '2025-09-15 08:30:00', actor: 'PFMS DBT Gateway', actorRole: 'SYSTEM_AI', action: 'Direct Benefit Transfer Disbursed', previousStatus: 'APPROVED', newStatus: 'DISBURSED_DBT', remarks: '₹14,500 transferred to A/C *********1122 via Aadhaar Bridge.' }
    ]
  },
  {
    id: 'MOTA/2025-26/NOS/00142',
    schemeId: 'national-overseas-scholarship-st',
    schemeCode: 'MOTA-NOS-05',
    schemeName: 'National Overseas Scholarship for ST Students (Masters, Ph.D. Abroad)',
    submissionDate: '2025-09-05',
    lastUpdated: '2025-09-19',
    currentStageIndex: 2,
    status: 'DOC_VERIFIED',
    applicant: {
      id: 'APP-ST-9941',
      fullName: 'Anjali Kerketta',
      fatherOrHusbandName: 'Patras Kerketta',
      gender: 'FEMALE',
      dob: '2000-02-14',
      aadhaarNumberMasked: 'XXXXXXXX6210',
      category: 'ST',
      tribeCommunity: 'Oraon',
      mobile: '9820194821',
      email: 'anjali.kerketta@alumni.jnu.ac.in',
      state: 'Odisha',
      district: 'Sundargarh',
      pincode: '770001',
      disabilityStatus: 'NONE'
    },
    academic: {
      currentCourse: 'M.Sc. in Renewable Energy Systems',
      institutionName: 'University of Edinburgh, United Kingdom (QS Rank 27)',
      institutionState: 'Scotland, UK',
      aisheCode: 'FOREIGN-UK-027',
      rollNumber: 'ED-2025-RE-891',
      yearOfStudy: 'Admitted (Commencing Oct 2025)',
      previousExamName: 'B.Tech Electrical Engineering',
      previousExamPercentage: 81.6,
      passingYear: '2023',
      boardOrUniversity: 'NIT Rourkela'
    },
    bank: {
      accountHolderName: 'Anjali Kerketta',
      bankName: 'State Bank of India Overseas Branch',
      accountNumberMasked: 'XXXXXXXX9984',
      ifscCode: 'SBIN0000691',
      branchName: 'SBI Overseas Branch New Delhi',
      isAadhaarSeeded: true,
      dbtVerifiedDate: '2025-09-06'
    },
    annualFamilyIncome: 420000,
    documents: [
      { id: 'DOC-00142-1', documentCode: 'ST_CERTIFICATE', documentName: 'ST Certificate Sundargarh', fileUrl: '#', fileName: 'Anjali_Oraon_ST_Odisha.pdf', fileSizeKB: 412, uploadedAt: '2025-09-05', ocrExtracted: true, status: 'VALID' },
      { id: 'DOC-00142-2', documentCode: 'INCOME_CERTIFICATE', documentName: 'ITR / Income Certificate', fileUrl: '#', fileName: 'Family_Income_ITR_Sundargarh.pdf', fileSizeKB: 580, uploadedAt: '2025-09-05', ocrExtracted: true, status: 'VALID' },
      { id: 'DOC-00142-3', documentCode: 'ADMISSION_LETTER', documentName: 'Unconditional Admission Letter (Univ of Edinburgh)', fileUrl: '#', fileName: 'Edinburgh_Unconditional_Offer_Letter.pdf', fileSizeKB: 1200, uploadedAt: '2025-09-05', ocrExtracted: true, status: 'VALID' }
    ],
    hasDeficiency: false,
    aiEligibilityResult: {
      overallStatus: 'ELIGIBLE',
      confidenceScore: 0.96,
      ruleMatches: [
        { ruleId: 'RULE_NOS_CAT', label: 'ST Verification', expected: 'ST', actual: 'ST (Oraon)', status: 'PASS', evidenceSnippet: 'Certified ST Odia Gazette' },
        { ruleId: 'RULE_NOS_AGE', label: 'Age Check (<35)', expected: '<= 35', actual: '25 Years', status: 'PASS', evidenceSnippet: 'DOB: 14-02-2000' },
        { ruleId: 'RULE_NOS_INC', label: 'Income Check', expected: '<= ₹6,00,000', actual: '₹4,20,000', status: 'PASS', evidenceSnippet: 'ITR Assessment Year 2024-25' },
        { ruleId: 'RULE_NOS_SCORE', label: 'Academic Merit', expected: '>= 60%', actual: '81.6%', status: 'PASS', evidenceSnippet: 'NIT Rourkela Transcript verified' }
      ]
    },
    meritScore: 89.2,
    officerRemarks: 'Unconditional offer from University of Edinburgh (QS Rank 27, well within Top 500 criteria). Awaiting Inter-Ministerial Steering Committee meeting.',
    auditTrail: [
      { id: 'AUD-40', timestamp: '2025-09-05 14:20:10', actor: 'Anjali Kerketta', actorRole: 'APPLICANT', action: 'Submitted Application for Overseas Fellowship', previousStatus: 'DRAFT', newStatus: 'SUBMITTED', remarks: 'Attached Edinburgh offer letter' },
      { id: 'AUD-41', timestamp: '2025-09-05 14:20:15', actor: 'MoTA OCR & QS Rank Validator', actorRole: 'SYSTEM_AI', action: 'Automated Global University Verification', previousStatus: 'SUBMITTED', newStatus: 'DOC_VERIFIED', remarks: 'University QS rank 27 verified' }
    ]
  }
];
