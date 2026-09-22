export interface GrievanceRecord {
  id: string; // e.g. "GRV-2025-0812"
  applicantName: string;
  applicationId?: string;
  schemeName: string;
  category: 'DOCUMENT_DEFICIENCY' | 'DBT_PAYMENT_DELAY' | 'ELIGIBILITY_REJECTION' | 'INSTITUTE_VERIFICATION' | 'TECHNICAL_PORTAL';
  subject: string;
  description: string;
  submittedDate: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESPONSE_REQUIRED' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedOfficer: string;
  resolutionRemarks?: string;
  resolvedDate?: string;
}

export const INITIAL_GRIEVANCES: GrievanceRecord[] = [
  {
    id: 'GRV/2025/0812',
    applicantName: 'Rahul Kumar Gond',
    applicationId: 'MOTA/2025-26/NSTE/07314',
    schemeName: 'National Scholarship for Higher Education of ST Students (Top Class Education)',
    category: 'DOCUMENT_DEFICIENCY',
    subject: 'Request for extension of time to upload renewed Income Certificate',
    description: 'The Tehsildar office in Mandla is currently processing my renewal of the income certificate. Kindly grant 7 additional days extension so that my seat allotment in IIT Bombay is not cancelled.',
    submittedDate: '2025-09-03',
    status: 'UNDER_REVIEW',
    priority: 'HIGH',
    assignedOfficer: 'Smt. Vandana Das (Director Top Class)',
    resolutionRemarks: 'Extension granted till 25th September 2025. Deficiency portal portal reopened for re-upload.'
  },
  {
    id: 'GRV/2025/0744',
    applicantName: 'Kishore Bodo',
    applicationId: 'MOTA/2025-26/POST/11923',
    schemeName: 'Post-Matric Scholarship for Scheduled Tribe Students',
    category: 'DBT_PAYMENT_DELAY',
    subject: 'Aadhaar payment bridge error code NPCI-72',
    description: 'My application was sanctioned on 10th August 2025, but PFMS status displays NPCI inactive bank account. I have re-seeded my account at SBI Kokrajhar.',
    submittedDate: '2025-08-25',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    assignedOfficer: 'Shri Amitabh Roy (DBT Mission)',
    resolutionRemarks: 'NPCI mapper re-queried and updated. DBT batch re-queued for disbursement.',
    resolvedDate: '2025-08-29'
  },
  {
    id: 'GRV/2025/0901',
    applicantName: 'Manju Marandi',
    applicationId: 'MOTA/2025-26/NF/10550',
    schemeName: 'National Fellowship for Higher Education of ST Students',
    category: 'INSTITUTE_VERIFICATION',
    subject: 'College Nodal Officer pending verification past deadline',
    description: 'University of Hyderabad nodal officer has not completed bi-annual verification on the portal. Request Ministry intervention.',
    submittedDate: '2025-09-12',
    status: 'SUBMITTED',
    priority: 'HIGH',
    assignedOfficer: 'Shri Manoj Kumar (Deputy Secretary)'
  }
];
