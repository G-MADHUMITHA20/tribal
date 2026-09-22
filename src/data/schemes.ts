import { SchemeConfig } from '../types/scheme';

export const MOTA_SCHEMES: SchemeConfig[] = [
  {
    id: 'pre-matric-st',
    code: 'MOTA-PMS-01',
    name: 'Pre-Matric Scholarship for Scheduled Tribe Students (Class IX & X)',
    shortName: 'Pre-Matric ST',
    category: 'PRE_MATRIC',
    tagline: 'Supporting foundational secondary education and minimizing drop-out rates for ST students',
    description: 'A Centrally Sponsored Scheme implemented through State Governments/UT Administrations to assist ST students studying in Classes IX and X to reduce dropouts at the transitional secondary stage.',
    portalCategory: 'School Education',
    isOpen: true,
    academicYear: '2025-2026',
    applicationDeadline: '2025-11-30',
    targetCommunity: 'Scheduled Tribes (ST)',
    annualIncomeCap: 250000,
    minAcademicPercentage: 40,
    educationLevels: ['CLASS_9_10'],
    eligibilitySummary: [
      'Applicant must belong to a notified Scheduled Tribe (ST) community.',
      'Must be studying as a regular full-time student in Class IX or X in a recognized government or aided school.',
      'Annual family income from all sources must not exceed ₹2,50,000/- per annum.',
      'Should not be receiving any other centrally sponsored scholarship for the same period.'
    ],
    eligibilityRules: [
      {
        id: 'RULE_PMS_CAT',
        field: 'category',
        label: 'Community Category',
        operator: 'EQUALS',
        value: 'ST',
        explanation: 'Applicant community must be certified as Scheduled Tribe (ST) by competent revenue authority.'
      },
      {
        id: 'RULE_PMS_INC',
        field: 'annualFamilyIncome',
        label: 'Family Annual Income Ceiling',
        operator: 'LESS_THAN_OR_EQUAL',
        value: 250000,
        unit: 'INR',
        explanation: 'Total combined parental/guardian annual income must not exceed ₹2,50,000/-.'
      },
      {
        id: 'RULE_PMS_EDU',
        field: 'currentClass',
        label: 'Eligible Classes',
        operator: 'IN',
        value: ['Class 9', 'Class 10'],
        explanation: 'Enrolled in full-time Class 9 or 10 in a recognized school.'
      }
    ],
    requiredDocuments: [
      {
        id: 'DOC_ST_CERT',
        code: 'ST_CERTIFICATE',
        name: 'ST Community Certificate',
        description: 'Issued by designated Revenue Authority (Tehsildar / Sub-Divisional Magistrate).',
        required: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMB: 2,
        ocrVerifiable: true
      },
      {
        id: 'DOC_INC_CERT',
        code: 'INCOME_CERTIFICATE',
        name: 'Competent Income Certificate',
        description: 'Annual income certificate for current financial year issued by authorized authority.',
        required: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMB: 2,
        ocrVerifiable: true
      },
      {
        id: 'DOC_PREV_MARKSHEET',
        code: 'MARKSHEET',
        name: 'Previous Class Passing Certificate / Marksheet',
        description: 'Class 8 / Class 9 marksheet signed by School Headmaster.',
        required: true,
        acceptedFormats: ['PDF'],
        maxSizeMB: 2,
        ocrVerifiable: true
      },
      {
        id: 'DOC_BANK_PASSBOOK',
        code: 'BANK_PASSBOOK',
        name: 'Aadhaar-Linked Bank Passbook',
        description: 'First page showing Student name, Account number, IFSC Code and active status.',
        required: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMB: 2,
        ocrVerifiable: true
      }
    ],
    benefits: [
      {
        item: 'Day Scholar Maintenance Allowance',
        amount: '₹3,500 per annum',
        frequency: 'Annual',
        notes: 'Credited directly via DBT onto Aadhaar-seeded bank account'
      },
      {
        item: 'Hosteller Maintenance Allowance',
        amount: '₹7,000 per annum',
        frequency: 'Annual',
        notes: 'For students residing in government recognized tribal hostels'
      },
      {
        item: 'Books & Stationary Grant',
        amount: '₹1,000 per annum',
        frequency: 'Annual',
        notes: 'Covers study materials and educational essentials'
      }
    ],
    selectionCriteria: {
      method: 'FIRST_COME_FIRST_SERVE',
      meritCalculation: 'All eligible applicants meeting verified criterion are funded under Direct Benefit Transfer.',
      totalSlotsPerYear: 150000,
      femaleReservationPercentage: 33
    },
    workflowStages: [
      { id: 'S1', order: 1, name: 'Application Submission', description: 'Student fills profile and attaches certificates', responsibleRole: 'APPLICANT' },
      { id: 'S2', order: 2, name: 'School Level Verification', description: 'Principal confirms enrollment and attendance', responsibleRole: 'INSTITUTION' },
      { id: 'S3', order: 3, name: 'District Scrutiny (DWDO)', description: 'District Welfare Officer examines documents', responsibleRole: 'SCRUTINY_OFFICER' },
      { id: 'S4', order: 4, name: 'State Level Sanction', description: 'State Nodal Department approves sanction order', responsibleRole: 'SANCTIONING_AUTHORITY' },
      { id: 'S5', order: 5, name: 'PFMS DBT Disbursement', description: 'Direct treasury credit into Aadhaar seeded account', responsibleRole: 'PFMS_GATEWAY' }
    ],
    guidelinePdfUrl: '#',
    faqItems: [
      { question: 'Is day scholar eligible if staying with relative?', answer: 'Yes, provided the student is enrolled as a regular student in an affiliated school within the district.' },
      { question: 'What if income certificate is under renewal?', answer: 'An applicant can upload the acknowledgement receipt and update within 30 days during the deficiency rectification window.' }
    ],
    nodalContact: {
      officer: 'Shri R. K. Meena',
      designation: 'Director (Scholarships)',
      email: 'edu-tribal@nic.in',
      phone: '011-23386341',
      address: 'Room 412, A-Wing, Shastri Bhawan, New Delhi'
    }
  },
  {
    id: 'post-matric-st',
    code: 'MOTA-POST-02',
    name: 'Post-Matric Scholarship for Scheduled Tribe Students (Classes XI to PG)',
    shortName: 'Post-Matric ST',
    category: 'POST_MATRIC',
    tagline: 'Supporting higher and professional education across colleges and universities nationwide',
    description: 'Centrally Sponsored Scheme to provide financial assistance to ST students studying at post-matriculation or post-secondary stage to enable them to complete their education.',
    portalCategory: 'College & Higher Secondary',
    isOpen: true,
    academicYear: '2025-2026',
    applicationDeadline: '2025-12-15',
    targetCommunity: 'Scheduled Tribes (ST)',
    annualIncomeCap: 250000,
    minAcademicPercentage: 45,
    educationLevels: ['CLASS_11_12', 'UNDERGRADUATE', 'POSTGRADUATE'],
    eligibilitySummary: [
      'Applicant must belong to a recognized Scheduled Tribe.',
      'Must have passed Matriculation/Secondary Examination from a recognized Board.',
      'Enrolled in Class XI/XII, Diploma, ITI, Degree, or PG programs.',
      'Parental annual income must not exceed ₹2.50 Lakh from all sources.'
    ],
    eligibilityRules: [
      {
        id: 'RULE_POST_CAT',
        field: 'category',
        label: 'Community Category',
        operator: 'EQUALS',
        value: 'ST',
        explanation: 'Must possess a genuine ST Certificate certified by designated State Revenue Department.'
      },
      {
        id: 'RULE_POST_INC',
        field: 'annualFamilyIncome',
        label: 'Annual Family Income',
        operator: 'LESS_THAN_OR_EQUAL',
        value: 250000,
        unit: 'INR',
        explanation: 'Total family income ceiling is ₹2,50,000/- per year.'
      },
      {
        id: 'RULE_POST_MARKS',
        field: 'previousExamPercentage',
        label: 'Minimum Qualifying Marks',
        operator: 'GREATER_THAN_OR_EQUAL',
        value: 45,
        unit: '%',
        explanation: 'Minimum 45% aggregate in qualifying examination.'
      }
    ],
    requiredDocuments: [
      { id: 'DOC_ST_CERT', code: 'ST_CERTIFICATE', name: 'ST Certificate', description: 'Original Caste Certificate', required: true, acceptedFormats: ['PDF', 'JPG'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_INC_CERT', code: 'INCOME_CERTIFICATE', name: 'Income Certificate', description: 'Tehsildar issued income proof', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_10_MARKSHEET', code: 'MARKSHEET', name: '10th / Secondary Marksheet', description: 'Proof of date of birth and matriculation', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_FEE_RECEIPT', code: 'ADMISSION_LETTER', name: 'Current College Admission & Fee Receipt', description: 'Bonafide certificate with AISHE code', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_BANK_PASSBOOK', code: 'BANK_PASSBOOK', name: 'Aadhaar Seeded Bank Account', description: 'Bank passbook or cancelled cheque', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true }
    ],
    benefits: [
      { item: 'Course Tuition Fee Reimbursement', amount: 'Full non-refundable fee', frequency: 'Annual', notes: 'As approved by the State Fee Regulatory Committee' },
      { item: 'Group 1 (Professional/Technical) Allowance', amount: 'Up to ₹13,500/yr (Hosteller) / ₹7,000/yr (Day Scholar)', frequency: 'Annual', notes: 'Degree in Engineering, Medical, Agriculture, Management' },
      { item: 'Disability Allowance', amount: '₹2,400 to ₹4,000 additional', frequency: 'Annual', notes: 'For Divyang ST students with >40% benchmark disability' }
    ],
    selectionCriteria: {
      method: 'MEANS_CUM_MERIT',
      meritCalculation: 'Universal coverage for all ST applicants meeting income and academic thresholds.',
      totalSlotsPerYear: 220000,
      femaleReservationPercentage: 33
    },
    workflowStages: [
      { id: 'S1', order: 1, name: 'Student Registration & Submission', description: 'Submission on unified MoTA gateway', responsibleRole: 'APPLICANT' },
      { id: 'S2', order: 2, name: 'Institute Nodal Officer (INO) Scrutiny', description: 'College verifies attendance and course fee structure', responsibleRole: 'INSTITUTION' },
      { id: 'S3', order: 3, name: 'District Officer (DNO) Validation', description: 'Verification of income and caste authenticity', responsibleRole: 'SCRUTINY_OFFICER' },
      { id: 'S4', order: 4, name: 'State Sanction Order Generation', description: 'State welfare dept releases fund allocations', responsibleRole: 'SANCTIONING_AUTHORITY' },
      { id: 'S5', order: 5, name: 'Direct Benefit Transfer (DBT)', description: 'PFMS e-payment dispatch directly into student bank', responsibleRole: 'PFMS_GATEWAY' }
    ],
    guidelinePdfUrl: '#',
    faqItems: [
      { question: 'Can students pursuing distance education apply?', answer: 'Yes, non-refundable fees are reimbursed for distance learning programs recognized by UGC/AICTE.' }
    ],
    nodalContact: {
      officer: 'Dr. Ananya Sharma',
      designation: 'Joint Secretary (Post-Matric Schemes)',
      email: 'postmatric-tribal@gov.in',
      phone: '011-23388720',
      address: 'August Kranti Bhawan, Bhikaji Cama Place, New Delhi'
    }
  },
  {
    id: 'national-scholarship-top-class',
    code: 'MOTA-NSTE-03',
    name: 'National Scholarship for Higher Education of ST Students (Top Class Education)',
    shortName: 'National Scholarship',
    category: 'NATIONAL_SCHOLARSHIP',
    tagline: 'Empowering tribal talent to study in Premier Institutes (IITs, IIMs, NITs, AIIMS, NLUs)',
    description: 'Central Sector Scheme to encourage meritorious ST students to pursue quality higher education in 262 identified premier institutes of excellence across India with full financial support.',
    portalCategory: 'Premier Institutes',
    isOpen: true,
    academicYear: '2025-2026',
    applicationDeadline: '2025-10-31',
    targetCommunity: 'Scheduled Tribes (ST)',
    annualIncomeCap: 600000,
    minAcademicPercentage: 60,
    educationLevels: ['UNDERGRADUATE', 'POSTGRADUATE'],
    eligibilitySummary: [
      'ST students who have secured admission in designated Top Class Institutes (IIT, IIM, AIIMS, NIT, NLU, etc.).',
      'Total family income from all sources should not exceed ₹6.00 Lakh per annum.',
      'Scholarship covers full tuition fees, living expenses, book allowances, and computer grants.'
    ],
    eligibilityRules: [
      { id: 'RULE_TOP_CAT', field: 'category', label: 'Caste Category', operator: 'EQUALS', value: 'ST', explanation: 'Valid ST Certificate from competent revenue officer.' },
      { id: 'RULE_TOP_INC', field: 'annualFamilyIncome', label: 'Income Ceiling', operator: 'LESS_THAN_OR_EQUAL', value: 600000, unit: 'INR', explanation: 'Income must not exceed ₹6,00,000/- p.a.' },
      { id: 'RULE_TOP_INST', field: 'isNotifiedInstitute', label: 'Premier Institute Admission', operator: 'BOOLEAN', value: true, explanation: 'Admission confirmed in one of the 262 MoTA identified institutes.' }
    ],
    requiredDocuments: [
      { id: 'DOC_ST_CERT', code: 'ST_CERTIFICATE', name: 'ST Caste Certificate', description: 'Certified tribal certificate', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_INC_CERT', code: 'INCOME_CERTIFICATE', name: 'Family Income Certificate', description: 'Income statement within ₹6.00L', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_ADMISSION_LETTER', code: 'ADMISSION_LETTER', name: 'Institute Admission / Offer Letter', description: 'Showing rank, course, and enrollment', required: true, acceptedFormats: ['PDF'], maxSizeMB: 3, ocrVerifiable: true },
      { id: 'DOC_FEE_RECEIPT', code: 'MARKSHEET', name: 'Fee Schedule & Allotment Memo', description: 'Breakup of institute tuition and hostel charges', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_BANK_PASSBOOK', code: 'BANK_PASSBOOK', name: 'Bank Passbook (Aadhaar Seeded)', description: 'For living expenses stipend credit', required: true, acceptedFormats: ['PDF', 'JPG'], maxSizeMB: 2, ocrVerifiable: true }
    ],
    benefits: [
      { item: 'Full Tuition Fee Reimbursement', amount: 'Actual fees charged by institute', frequency: 'Annual', notes: 'Subject to institute norms and ceiling' },
      { item: 'Living Expenses Allowance', amount: '₹3,000 per month (₹36,000/yr)', frequency: 'Monthly', notes: 'Credited directly to student bank' },
      { item: 'Books and Stationery Allowance', amount: '₹5,000 per annum', frequency: 'Annual', notes: 'One-time per academic session' },
      { item: 'Computer / Laptop Grant', amount: '₹45,000 one-time', frequency: 'One-Time', notes: 'For purchase of personal computer with accessories' }
    ],
    selectionCriteria: {
      method: 'MERIT_ONLY',
      meritCalculation: 'Based on competitive entrance exam score/rank (JEE Advanced, CAT, NEET, CLAT) within allotted institute slots.',
      totalSlotsPerYear: 1000,
      femaleReservationPercentage: 30,
      pvdgSpecialQuota: true
    },
    workflowStages: [
      { id: 'S1', order: 1, name: 'Student Online Application', description: 'Uploads admission memo and rank card', responsibleRole: 'APPLICANT' },
      { id: 'S2', order: 2, name: 'Institute Verification', description: 'Dean/Registrar verifies enrollment and fee demand', responsibleRole: 'INSTITUTION' },
      { id: 'S3', order: 3, name: 'MoTA Scrutiny Cell', description: 'Automated AI document cross-check and officer vetting', responsibleRole: 'SCRUTINY_OFFICER' },
      { id: 'S4', order: 4, name: 'Sanction and Merit List Release', description: 'Sanctioning committee ratifies selection list', responsibleRole: 'SELECTION_COMMITTEE' },
      { id: 'S5', order: 5, name: 'PFMS e-Disbursement', description: 'Tuition direct to college, living expense direct to student', responsibleRole: 'PFMS_GATEWAY' }
    ],
    guidelinePdfUrl: '#',
    faqItems: [
      { question: 'What if my institute is not in the list of 262 notified institutes?', answer: 'Only notified premier institutes are covered under Top Class Scheme. You may apply under the Post-Matric scheme instead.' }
    ],
    nodalContact: {
      officer: 'Smt. Vandana Das',
      designation: 'Director (Top Class Education)',
      email: 'topclass-tribal@nic.in',
      phone: '011-23382583',
      address: 'MoTA, Shastri Bhawan, New Delhi'
    }
  },
  {
    id: 'national-fellowship-st',
    code: 'MOTA-NF-04',
    name: 'National Fellowship for Higher Education of ST Students (M.Phil / Ph.D.)',
    shortName: 'National Fellowship',
    category: 'NATIONAL_FELLOWSHIP',
    tagline: 'Enabling research scholars to pursue Doctoral and Post-Doctoral studies in Indian Universities',
    description: 'Central Sector Scheme dedicated to provide fellowship assistance to Scheduled Tribe students who are enrolled in regular and full-time M.Phil and Ph.D. courses in Humanities, Sciences, Engineering, and Technology in recognized Universities.',
    portalCategory: 'Research & Doctorate',
    isOpen: true,
    academicYear: '2025-2026',
    applicationDeadline: '2025-11-15',
    targetCommunity: 'Scheduled Tribes (ST)',
    annualIncomeCap: 0, // NO INCOME CEILING
    minAcademicPercentage: 55,
    educationLevels: ['MPHIL_PHD'],
    eligibilitySummary: [
      'ST scholars who have taken admission in regular and full-time Ph.D. or M.Phil degree in UGC recognized Indian universities.',
      'Must have qualified UGC-NET / CSIR-NET or University Entrance Examination.',
      'NO parental annual income ceiling applies to this research fellowship.',
      'Maximum tenure: 5 years for Ph.D. (2 years JRF + 3 years SRF).'
    ],
    eligibilityRules: [
      { id: 'RULE_NF_CAT', field: 'category', label: 'Caste Category', operator: 'EQUALS', value: 'ST', explanation: 'Valid ST certificate verified against official database.' },
      { id: 'RULE_NF_QUAL', field: 'previousExamPercentage', label: 'PG Qualifying Marks', operator: 'GREATER_THAN_OR_EQUAL', value: 55, unit: '%', explanation: 'At least 55% marks in Master degree (50% for PwD).' },
      { id: 'RULE_NF_REG', field: 'courseType', label: 'Enrollment Type', operator: 'EQUALS', value: 'REGULAR_FULL_TIME', explanation: 'Must be enrolled in regular and full-time research programme.' },
      { id: 'RULE_NF_INC', field: 'annualFamilyIncome', label: 'Income Limit', operator: 'GREATER_THAN_OR_EQUAL', value: 0, explanation: 'Universal scheme: No upper income ceiling.' }
    ],
    requiredDocuments: [
      { id: 'DOC_ST_CERT', code: 'ST_CERTIFICATE', name: 'ST Certificate', description: 'Original Community Certificate', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_PG_DEGREE', code: 'MARKSHEET', name: 'Post-Graduation Degree & Consolidated Marksheet', description: 'Proof of minimum 55% marks in Master’s', required: true, acceptedFormats: ['PDF'], maxSizeMB: 3, ocrVerifiable: true },
      { id: 'DOC_PHD_JOINING', code: 'ADMISSION_LETTER', name: 'Ph.D. Admission / Research Joining Report', description: 'Signed by Research Guide and Head of Department', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_SYNOPSIS', code: 'MARKSHEET', name: 'Approved Research Synopsis / Topic Summary', description: 'Duly approved by University DRC/Board of Studies', required: true, acceptedFormats: ['PDF'], maxSizeMB: 5, ocrVerifiable: false },
      { id: 'DOC_BANK_PASSBOOK', code: 'BANK_PASSBOOK', name: 'Canara Bank / PFMS Linked Account Passbook', description: 'Designated bank mandate for monthly stipend credit', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true }
    ],
    benefits: [
      { item: 'Junior Research Fellowship (JRF)', amount: '₹37,000 per month', frequency: 'Monthly', notes: 'First 2 years of Ph.D. research' },
      { item: 'Senior Research Fellowship (SRF)', amount: '₹42,000 per month', frequency: 'Monthly', notes: 'Subsequent 3 years upon satisfactory evaluation' },
      { item: 'Contingency Allowance (Humanities & Social Sciences)', amount: '₹12,000 per annum (JRF) / ₹25,000 per annum (SRF)', frequency: 'Annual', notes: 'For books, fieldwork, travel' },
      { item: 'Contingency Allowance (Science & Engineering)', amount: '₹20,000 per annum (JRF) / ₹28,000 per annum (SRF)', frequency: 'Annual', notes: 'For laboratory consumables, chemicals, experiments' },
      { item: 'House Rent Allowance (HRA)', amount: '8% / 16% / 24% as per Govt City Classification', frequency: 'Monthly', notes: 'If hostel accommodation is not provided by university' },
      { item: 'Escorts / Reader Assistance for Divyang ST Scholars', amount: '₹3,000 per month', frequency: 'Monthly', notes: 'For visually challenged research candidates' }
    ],
    selectionCriteria: {
      method: 'MERIT_ONLY',
      meritCalculation: 'Merit list drawn strictly based on Post Graduation percentage and UGC-NET score across 750 annual slots.',
      totalSlotsPerYear: 750,
      femaleReservationPercentage: 33,
      pvdgSpecialQuota: true
    },
    workflowStages: [
      { id: 'S1', order: 1, name: 'Candidate Application', description: 'Scholar submits research details, synopsis & documents', responsibleRole: 'APPLICANT' },
      { id: 'S2', order: 2, name: 'University Nodal Verification', description: 'Dean Research verifies enrollment status and DRC approval', responsibleRole: 'INSTITUTION' },
      { id: 'S3', order: 3, name: 'AI Document Scrutiny & Rule Evaluation', description: 'Automated verification of certificates & PG marks', responsibleRole: 'SCRUTINY_OFFICER' },
      { id: 'S4', order: 4, name: 'National Selection Board Approval', description: 'Expert committee ratifies 750 slots merit list', responsibleRole: 'SELECTION_COMMITTEE' },
      { id: 'S5', order: 5, name: 'Award Letter & Monthly DBT Canara Gateway', description: 'Release of sanction award and monthly stipend generation', responsibleRole: 'PFMS_GATEWAY' }
    ],
    guidelinePdfUrl: '#',
    faqItems: [
      { question: 'Is NET qualification mandatory?', answer: 'Priority is given to UGC-NET / CSIR-NET qualified scholars. However, university entrance qualified scholars are also considered subject to slot availability.' },
      { question: 'Is there any family income limit for National Fellowship?', answer: 'No. The National Fellowship scheme has NO income ceiling.' }
    ],
    nodalContact: {
      officer: 'Shri Manoj Kumar',
      designation: 'Deputy Secretary (Research & Fellowship)',
      email: 'fellowship-tribal@nic.in',
      phone: '011-23381678',
      address: 'Ground Floor, Jeevan Deep Building, Parliament Street, New Delhi'
    }
  },
  {
    id: 'national-overseas-scholarship-st',
    code: 'MOTA-NOS-05',
    name: 'National Overseas Scholarship for ST Students (Masters, Ph.D. Abroad)',
    shortName: 'National Overseas',
    category: 'NATIONAL_OVERSEAS',
    tagline: 'Supporting tribal scholars to pursue Post-Graduation and Doctorate in Top 500 Global Universities',
    description: 'Prestigious Central Sector Scheme providing full financial assistance to selected Scheduled Tribe students to pursue Master’s level courses and Ph.D. in recognized foreign universities/institutions across USA, UK, Europe, Australia, and worldwide.',
    portalCategory: 'International Studies',
    isOpen: true,
    academicYear: '2025-2026',
    applicationDeadline: '2025-10-15',
    targetCommunity: 'Scheduled Tribes (ST)',
    annualIncomeCap: 600000,
    minAge: 21,
    maxAge: 35,
    minAcademicPercentage: 60,
    educationLevels: ['OVERSEAS_POSTGRADUATE', 'MPHIL_PHD'],
    eligibilitySummary: [
      'ST candidates having unconditional admission offer from Top 500 QS/THE World Ranked foreign universities.',
      'Age should be below 35 years as on 1st April of selection year.',
      'Total family income must not exceed ₹6.00 Lakh per annum.',
      'Minimum 60% marks in qualifying Bachelor’s (for Masters) or Master’s (for Ph.D.).',
      'Covers tuition fees, annual maintenance allowance, airfare, medical insurance, and visa charges.'
    ],
    eligibilityRules: [
      { id: 'RULE_NOS_CAT', field: 'category', label: 'Caste Category', operator: 'EQUALS', value: 'ST', explanation: 'Strictly reserved for notified Scheduled Tribe candidates.' },
      { id: 'RULE_NOS_AGE', field: 'applicantAge', label: 'Age Limit', operator: 'LESS_THAN_OR_EQUAL', value: 35, unit: 'Years', explanation: 'Applicant age must be 35 years or below.' },
      { id: 'RULE_NOS_INC', field: 'annualFamilyIncome', label: 'Income Limit', operator: 'LESS_THAN_OR_EQUAL', value: 600000, unit: 'INR', explanation: 'Family income must not exceed ₹6,00,000/- p.a.' },
      { id: 'RULE_NOS_SCORE', field: 'previousExamPercentage', label: 'Academic Minimum', operator: 'GREATER_THAN_OR_EQUAL', value: 60, unit: '%', explanation: 'Minimum 60% marks or equivalent GPA in qualifying degree.' }
    ],
    requiredDocuments: [
      { id: 'DOC_ST_CERT', code: 'ST_CERTIFICATE', name: 'ST Certificate', description: 'Certified Caste Certificate', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_INC_CERT', code: 'INCOME_CERTIFICATE', name: 'Income Certificate (ITR / Tehsildar)', description: 'Showing family income <= ₹6.00 Lakh', required: true, acceptedFormats: ['PDF'], maxSizeMB: 3, ocrVerifiable: true },
      { id: 'DOC_UNCOND_OFFER', code: 'ADMISSION_LETTER', name: 'Unconditional Admission Offer Letter', description: 'From a QS World Top 500 ranked foreign university', required: true, acceptedFormats: ['PDF'], maxSizeMB: 3, ocrVerifiable: true },
      { id: 'DOC_PASSPORT', code: 'MARKSHEET', name: 'Valid Indian Passport', description: 'Valid for at least 18 months', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_MARKSHEET_ALL', code: 'MARKSHEET', name: 'Consolidated Degree Marksheet', description: 'Minimum 60% aggregate qualification', required: true, acceptedFormats: ['PDF'], maxSizeMB: 4, ocrVerifiable: true }
    ],
    benefits: [
      { item: 'Full Foreign Tuition Fees', amount: 'Actual institutional tuition fees paid directly to foreign university', frequency: 'Annual', notes: 'Paid directly through Indian Embassy / Mission abroad' },
      { item: 'Annual Maintenance Allowance (USA & other countries)', amount: 'USD $15,400 per annum', frequency: 'Annual', notes: 'Disbursed in quarterly installments' },
      { item: 'Annual Maintenance Allowance (United Kingdom)', amount: 'GBP £9,900 per annum', frequency: 'Annual', notes: 'Paid directly into scholar’s foreign bank account' },
      { item: 'Air Passage & Visa Fees', amount: 'Economy class airfare to and fro + actual visa fees', frequency: 'One-Time', notes: 'Booked via authorized Govt ticketing agencies' },
      { item: 'Contingency & Equipment Allowance', amount: 'USD $1,500 / GBP £1,100 per annum', frequency: 'Annual', notes: 'Covers mandatory health insurance and books' }
    ],
    selectionCriteria: {
      method: 'MERIT_ONLY',
      meritCalculation: 'QS World Ranking of the host institution and qualifying degree percentage.',
      totalSlotsPerYear: 20,
      femaleReservationPercentage: 30,
      pvdgSpecialQuota: true
    },
    workflowStages: [
      { id: 'S1', order: 1, name: 'Online Application & Offer Upload', description: 'Submission of foreign admission and passport data', responsibleRole: 'APPLICANT' },
      { id: 'S2', order: 2, name: 'AI Document Cross-Check', description: 'Validation of QS rank, caste certificate and income', responsibleRole: 'SCRUTINY_OFFICER' },
      { id: 'S3', order: 3, name: 'Steering Committee Evaluation', description: 'Inter-ministerial committee reviews academic credentials', responsibleRole: 'SELECTION_COMMITTEE' },
      { id: 'S4', order: 4, name: 'Provisional Award Letter & Bond Execution', description: 'Candidate executes surety bond with ministry', responsibleRole: 'SANCTIONING_AUTHORITY' },
      { id: 'S5', order: 5, name: 'Indian Mission Dispatches Tuition & Forex', description: 'Foreign embassy disburses stipend and insurance', responsibleRole: 'PFMS_GATEWAY' }
    ],
    guidelinePdfUrl: '#',
    faqItems: [
      { question: 'Are conditional offers accepted?', answer: 'Only unconditional offer letters from Top 500 QS ranked institutions are accepted.' },
      { question: 'Is work experience required?', answer: 'Work experience is not mandatory, but academic distinction and research publications enhance merit priority.' }
    ],
    nodalContact: {
      officer: 'Dr. Sunita Kindo',
      designation: 'Director (International Co-operation & Overseas)',
      email: 'nos-tribal@nic.in',
      phone: '011-23384592',
      address: 'MoTA, Gate 3, Shastri Bhawan, New Delhi'
    }
  },
  {
    id: 'dbt-fellowship-st',
    code: 'MOTA-DBT-06',
    name: 'Direct Benefit Transfer (DBT) Scheme for ST Students & Research Scholars',
    shortName: 'DBT Fellowship',
    category: 'DBT',
    tagline: 'End-to-end transparent, direct bank transfer without intermediaries',
    description: 'Centralized Direct Benefit Transfer integration channel ensuring rapid, Aadhaar-enabled automated sanctioning and disbursement of book grants, stipend top-ups, and special coaching subsidies directly to ST beneficiaries.',
    portalCategory: 'Direct Benefits',
    isOpen: true,
    academicYear: '2025-2026',
    applicationDeadline: '2025-12-31',
    targetCommunity: 'Scheduled Tribes (ST)',
    annualIncomeCap: 300000,
    minAcademicPercentage: 50,
    educationLevels: ['CLASS_11_12', 'UNDERGRADUATE', 'POSTGRADUATE', 'MPHIL_PHD'],
    eligibilitySummary: [
      'ST students holding active Aadhaar-seeded bank account in any scheduled commercial bank.',
      'Enrolled in recognized skill development, competitive exam coaching or polytechnic diploma.',
      'Annual family income not exceeding ₹3.00 Lakh per annum.',
      'Instant electronic sanctioning through NPCI and PFMS validation.'
    ],
    eligibilityRules: [
      { id: 'RULE_DBT_CAT', field: 'category', label: 'Category', operator: 'EQUALS', value: 'ST', explanation: 'Verified ST community identity.' },
      { id: 'RULE_DBT_AADHAAR', field: 'isAadhaarSeeded', label: 'Aadhaar Payment Bridge', operator: 'BOOLEAN', value: true, explanation: 'Bank account successfully seeded in NPCI mapper.' },
      { id: 'RULE_DBT_INC', field: 'annualFamilyIncome', label: 'Income Limit', operator: 'LESS_THAN_OR_EQUAL', value: 300000, unit: 'INR', explanation: 'Annual parental income under ₹3,00,000/-.' }
    ],
    requiredDocuments: [
      { id: 'DOC_ST_CERT', code: 'ST_CERTIFICATE', name: 'ST Caste Certificate', description: 'Issued by designated authority', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_INC_CERT', code: 'INCOME_CERTIFICATE', name: 'Income Certificate', description: 'Valid Tehsildar income proof', required: true, acceptedFormats: ['PDF'], maxSizeMB: 2, ocrVerifiable: true },
      { id: 'DOC_BANK_PASSBOOK', code: 'BANK_PASSBOOK', name: 'Aadhaar-Seeded Bank Passbook', description: 'Showing NPCI mapping confirmation', required: true, acceptedFormats: ['PDF', 'JPG'], maxSizeMB: 2, ocrVerifiable: true }
    ],
    benefits: [
      { item: 'Coaching & Skill Training Stipend', amount: '₹2,500 per month', frequency: 'Monthly', notes: 'For competitive examination guidance' },
      { item: 'Digital Device Subsidy', amount: '₹15,000 one-time', frequency: 'One-Time', notes: 'For tablet / smartphone purchase' },
      { item: 'Annual Stationary Kit Transfer', amount: '₹2,000 per annum', frequency: 'Annual', notes: 'Direct PFMS transfer' }
    ],
    selectionCriteria: {
      method: 'FIRST_COME_FIRST_SERVE',
      meritCalculation: 'Automated instant grant sanction upon Aadhaar NPCI mapper verification.',
      totalSlotsPerYear: 80000,
      femaleReservationPercentage: 35
    },
    workflowStages: [
      { id: 'S1', order: 1, name: 'Aadhaar e-KYC & Bank Verification', description: 'Instant NPCI active seeding status check', responsibleRole: 'APPLICANT' },
      { id: 'S2', order: 2, name: 'AI Caste & Income Document Check', description: 'Automated verification against state database', responsibleRole: 'SCRUTINY_OFFICER' },
      { id: 'S3', order: 3, name: 'Electronic Sanction Generation', description: 'System signs digital payment mandate', responsibleRole: 'SANCTIONING_AUTHORITY' },
      { id: 'S4', order: 4, name: 'PFMS DBT Transfer', description: 'Zero delay direct credit into beneficiary account', responsibleRole: 'PFMS_GATEWAY' }
    ],
    guidelinePdfUrl: '#',
    faqItems: [
      { question: 'How do I check if my bank account is seeded with Aadhaar?', answer: 'You can check your status on the UIDAI portal under Aadhaar Linking Status or consult your bank branch.' }
    ],
    nodalContact: {
      officer: 'Shri Amitabh Roy',
      designation: 'Director (DBT Mission & Digital Governance)',
      email: 'dbt-tribal@gov.in',
      phone: '011-23387812',
      address: 'MoTA, Shastri Bhawan, New Delhi'
    }
  }
];
