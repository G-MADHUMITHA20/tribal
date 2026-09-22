export interface ResourceItem {
  id: string;
  category: 'CIRCULAR' | 'GUIDELINE' | 'NEWS' | 'RESULT' | 'MANUAL' | 'ACHIEVEMENT';
  title: string;
  referenceNumber?: string;
  publishDate: string;
  fileSize?: string;
  downloadUrl: string;
  description: string;
  isNew?: boolean;
}

export const OFFICIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'RES-01',
    category: 'GUIDELINE',
    title: 'Comprehensive Guidelines for National Fellowship for Higher Education of ST Students (2025-26)',
    referenceNumber: 'MoTA/Edu/NF/2025/11',
    publishDate: '2025-07-01',
    fileSize: '1.8 MB (PDF)',
    downloadUrl: '#',
    description: 'Updated operational norms covering 750 annual slots, enhanced JRF stipend of ₹37,000/month, and biometric attendance norms.'
  },
  {
    id: 'RES-02',
    category: 'CIRCULAR',
    title: 'Mandatory Aadhaar Seeding on NPCI Mapper for DBT Disbursement for Academic Year 2025-26',
    referenceNumber: 'MoTA/DBT/Aadhaar/2025/89',
    publishDate: '2025-08-10',
    fileSize: '450 KB (PDF)',
    downloadUrl: '#',
    description: 'Advisory to all State Nodal Departments and Institutions regarding NPCI mapper validation to prevent remittance failures.',
    isNew: true
  },
  {
    id: 'RES-03',
    category: 'RESULT',
    title: 'Provisional Selection List: National Overseas Scholarship for ST Candidates (Batch 2025-26)',
    referenceNumber: 'MoTA/NOS/Selection/2025/03',
    publishDate: '2025-09-10',
    fileSize: '980 KB (PDF)',
    downloadUrl: '#',
    description: 'List of 20 tribal scholars selected for admission into QS Top 500 World Universities with country-wise stipend allocations.',
    isNew: true
  },
  {
    id: 'RES-04',
    category: 'MANUAL',
    title: 'User Manual for Institute Nodal Officers (INO) - Automated Document Scrutiny & Bonafide Verification',
    referenceNumber: 'NIC/MoTA/Manual/2025/v2',
    publishDate: '2025-06-15',
    fileSize: '3.2 MB (PDF)',
    downloadUrl: '#',
    description: 'Step-by-step operational handbook for university deans and college principals to review student applications and report fees.'
  },
  {
    id: 'RES-05',
    category: 'NEWS',
    title: 'MoTA launches Unified AI-Assisted Document Scrutiny to eliminate repetitive clerical queries for ST Applicants',
    publishDate: '2025-09-01',
    downloadUrl: '#',
    description: 'Press release on national launch of instant OCR discrepancy detection and transparent deficiency correction portal.'
  },
  {
    id: 'RES-06',
    category: 'ACHIEVEMENT',
    title: 'Over 3.8 Lakh ST Students Empowered through Direct Benefit Transfer with 99.4% Timely Disbursement',
    publishDate: '2025-08-15',
    downloadUrl: '#',
    description: 'Performance review of Pre-Matric, Post-Matric, and Top Class schemes demonstrating direct benefit delivery.'
  }
];
