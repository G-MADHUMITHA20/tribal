export interface ResourceItem {
  id: string;
  category: 'CIRCULAR' | 'GUIDELINE' | 'NEWS' | 'RESULT' | 'MANUAL' | 'ACHIEVEMENT';
  title: string;
  titleHi: string;
  referenceNumber?: string;
  publishDate: string;
  fileSize?: string;
  downloadUrl: string;
  description: string;
  descriptionHi: string;
  isNew?: boolean;
}

export const OFFICIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'RES-01',
    category: 'GUIDELINE',
    title: 'Comprehensive Guidelines for National Fellowship for Higher Education of ST Students (2025-26)',
    titleHi: 'ST छात्रों की उच्च शिक्षा के लिए राष्ट्रीय अध्येतावृत्ति के व्यापक दिशानिर्देश (2025-26)',
    referenceNumber: 'MoTA/Edu/NF/2025/11',
    publishDate: '2025-07-01',
    fileSize: '1.8 MB (PDF)',
    downloadUrl: '#',
    description: 'Updated operational norms covering 750 annual slots, enhanced JRF stipend of ₹37,000/month, and biometric attendance norms.'
    ,descriptionHi: '750 वार्षिक सीटों, बढ़ी हुई JRF छात्रवृत्ति ₹37,000 प्रति माह और बायोमेट्रिक उपस्थिति मानदंडों को शामिल करने वाले अद्यतन संचालन नियम।'
  },
  {
    id: 'RES-02',
    category: 'CIRCULAR',
    title: 'Mandatory Aadhaar Seeding on NPCI Mapper for DBT Disbursement for Academic Year 2025-26',
    titleHi: 'शैक्षणिक वर्ष 2025-26 के लिए डीबीटी वितरण हेतु NPCI मैपर पर अनिवार्य आधार सीडिंग',
    referenceNumber: 'MoTA/DBT/Aadhaar/2025/89',
    publishDate: '2025-08-10',
    fileSize: '450 KB (PDF)',
    downloadUrl: '#',
    description: 'Advisory to all State Nodal Departments and Institutions regarding NPCI mapper validation to prevent remittance failures.',
    descriptionHi: 'धन प्रेषण विफलताओं को रोकने के लिए NPCI मैपर सत्यापन के संबंध में सभी राज्य नोडल विभागों और संस्थानों के लिए सलाह।',
    isNew: true
  },
  {
    id: 'RES-03',
    category: 'RESULT',
    title: 'Provisional Selection List: National Overseas Scholarship for ST Candidates (Batch 2025-26)',
    titleHi: 'अनंतिम चयन सूची: ST उम्मीदवारों के लिए राष्ट्रीय विदेशी छात्रवृत्ति (बैच 2025-26)',
    referenceNumber: 'MoTA/NOS/Selection/2025/03',
    publishDate: '2025-09-10',
    fileSize: '980 KB (PDF)',
    downloadUrl: '#',
    description: 'List of 20 tribal scholars selected for admission into QS Top 500 World Universities with country-wise stipend allocations.',
    descriptionHi: 'QS शीर्ष 500 विश्व विश्वविद्यालयों में प्रवेश के लिए चुने गए 20 जनजातीय विद्वानों की सूची और देशवार छात्रवृत्ति आवंटन।',
    isNew: true
  },
  {
    id: 'RES-04',
    category: 'MANUAL',
    title: 'User Manual for Institute Nodal Officers (INO) - Automated Document Scrutiny & Bonafide Verification',
    titleHi: 'संस्थान नोडल अधिकारियों (INO) के लिए उपयोगकर्ता पुस्तिका - स्वचालित दस्तावेज़ जांच एवं बोनाफाइड सत्यापन',
    referenceNumber: 'NIC/MoTA/Manual/2025/v2',
    publishDate: '2025-06-15',
    fileSize: '3.2 MB (PDF)',
    downloadUrl: '#',
    description: 'Step-by-step operational handbook for university deans and college principals to review student applications and report fees.'
    ,descriptionHi: 'विश्वविद्यालय के डीन और कॉलेज प्राचार्यों के लिए छात्र आवेदनों की समीक्षा और शुल्क रिपोर्ट करने की चरणबद्ध संचालन पुस्तिका।'
  },
  {
    id: 'RES-05',
    category: 'NEWS',
    title: 'MoTA launches Unified AI-Assisted Document Scrutiny to eliminate repetitive clerical queries for ST Applicants',
    titleHi: 'MoTA ने ST आवेदकों के लिए बार-बार होने वाले लिपिकीय प्रश्नों को समाप्त करने हेतु एकीकृत एआई-सहायित दस्तावेज़ जांच शुरू की',
    publishDate: '2025-09-01',
    downloadUrl: '#',
    description: 'Press release on national launch of instant OCR discrepancy detection and transparent deficiency correction portal.'
    ,descriptionHi: 'तत्काल OCR विसंगति पहचान और पारदर्शी कमी सुधार पोर्टल के राष्ट्रीय शुभारंभ पर प्रेस विज्ञप्ति।'
  },
  {
    id: 'RES-06',
    category: 'ACHIEVEMENT',
    title: 'Over 3.8 Lakh ST Students Empowered through Direct Benefit Transfer with 99.4% Timely Disbursement',
    titleHi: '99.4% समय पर वितरण के साथ प्रत्यक्ष लाभ अंतरण द्वारा 3.8 लाख से अधिक ST छात्र सशक्त',
    publishDate: '2025-08-15',
    downloadUrl: '#',
    description: 'Performance review of Pre-Matric, Post-Matric, and Top Class schemes demonstrating direct benefit delivery.'
    ,descriptionHi: 'प्रत्यक्ष लाभ वितरण दर्शाने वाली प्री-मैट्रिक, पोस्ट-मैट्रिक और टॉप क्लास योजनाओं की प्रदर्शन समीक्षा।'
  }
];
