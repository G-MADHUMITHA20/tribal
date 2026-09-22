import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SchemeConfig } from '../../types/scheme';
import { ApplicationRecord } from '../../types/application';
import { DocumentOcrViewer } from '../../components/document-ai/DocumentOcrViewer';
import { ExplainableEvidenceCard } from '../../components/document-ai/ExplainableEvidenceCard';
import { DigiLockerService, PfmsDbtService, ESignService } from '../../services/integrations';
import {
  User,
  ShieldCheck,
  GraduationCap,
  Landmark,
  FileText,
  Sparkles,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  AlertTriangle,
  Upload,
  ExternalLink
} from 'lucide-react';

export const ApplicationWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { schemes, addApplication, currentUser } = useApp();

  const initialSchemeId = searchParams.get('scheme') || schemes[3].id; // default National Fellowship
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId);

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  // Wizard current step: 1 to 8
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSavedDraft, setIsSavedDraft] = useState<boolean>(false);
  const [isPullingDigiLocker, setIsPullingDigiLocker] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [newGeneratedAppId, setNewGeneratedAppId] = useState<string>('');

  // STEP 1: Profile
  const [fullName, setFullName] = useState<string>('Sunita Soren');
  const [fatherName, setFatherName] = useState<string>('Mangal Soren');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'TRANSGENDER'>('FEMALE');
  const [dob, setDob] = useState<string>('1998-04-12');
  const [maskedAadhaar, setMaskedAadhaar] = useState<string>('XXXXXXXX7819');
  const [category, setCategory] = useState<'ST' | 'PVTG'>('ST');
  const [tribeCommunity, setTribeCommunity] = useState<string>('Santhal');
  const [mobile, setMobile] = useState<string>('9845120394');
  const [email, setEmail] = useState<string>('sunita.soren@research.du.ac.in');
  const [state, setState] = useState<string>('Jharkhand');
  const [district, setDistrict] = useState<string>('Dumka');
  const [pincode, setPincode] = useState<string>('814101');

  // STEP 2: Eligibility Criteria Input
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(180000);
  const [applicantAge, setApplicantAge] = useState<number>(27);

  // STEP 3: Academic Details
  const [currentCourse, setCurrentCourse] = useState<string>('Ph.D. in Tribal Environmental Ecology');
  const [institutionName, setInstitutionName] = useState<string>('University of Delhi');
  const [institutionState, setInstitutionState] = useState<string>('Delhi');
  const [aisheCode, setAisheCode] = useState<string>('U-0109');
  const [rollNumber, setRollNumber] = useState<string>('DU/PHD/ENV/2024/09');
  const [yearOfStudy, setYearOfStudy] = useState<string>('1st Year');
  const [previousExamName, setPreviousExamName] = useState<string>('M.Sc. Environmental Studies');
  const [previousExamPercentage, setPreviousExamPercentage] = useState<number>(74.5);
  const [passingYear, setPassingYear] = useState<string>('2024');
  const [boardOrUniversity, setBoardOrUniversity] = useState<string>('Delhi University');

  // STEP 4: Bank Details (PFMS DBT)
  const [accountHolderName, setAccountHolderName] = useState<string>('Sunita Soren');
  const [bankName, setBankName] = useState<string>('State Bank of India');
  const [accountNumber, setAccountNumber] = useState<string>('309481924512');
  const [ifscCode, setIfscCode] = useState<string>('SBIN0001067');
  const [branchName, setBranchName] = useState<string>('Delhi University Branch');
  const [isAadhaarSeeded, setIsAadhaarSeeded] = useState<boolean>(true);

  // STEP 5: Documents
  const [stCertFile, setStCertFile] = useState<string>('Sunita_Soren_Caste_Certificate_Dumka.pdf');
  const [incCertFile, setIncCertFile] = useState<string>('Income_Certificate_Tehsildar_2024.pdf');
  const [marksheetFile, setMarksheetFile] = useState<string>('MSc_Consolidated_Marksheet_DU.pdf');
  const [admissionFile, setAdmissionFile] = useState<string>('DU_PhD_Joining_Report_Signed.pdf');
  const [isDigiLockerLinked, setIsDigiLockerLinked] = useState<boolean>(false);

  // STEP 8: e-Sign Declaration
  const [eSignConsent, setESignConsent] = useState<boolean>(false);

  const steps = [
    { num: 1, label: 'Profile' },
    { num: 2, label: 'Eligibility' },
    { num: 3, label: 'Academic Details' },
    { num: 4, label: 'Bank Details' },
    { num: 5, label: 'Documents' },
    { num: 6, label: 'AI Pre-Check' },
    { num: 7, label: 'Preview' },
    { num: 8, label: 'Submit' }
  ];

  const handlePullDigiLocker = async () => {
    setIsPullingDigiLocker(true);
    const resp = await DigiLockerService.fetchDocumentFromDigiLocker({
      aadhaarNumber: maskedAadhaar,
      docType: 'CASTE_CERTIFICATE',
      issuerState: state
    });
    setIsPullingDigiLocker(false);
    setIsDigiLockerLinked(true);
    setStCertFile(`DigiLocker_${resp.docName.replace(/\s+/g, '_')}_Verified.pdf`);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eSignConsent) {
      alert('Please accept the statutory Aadhaar e-Sign declaration to complete submission.');
      return;
    }

    setIsSubmitting(true);
    await ESignService.signApplicationDeclaration('NEW', fullName);

    const generatedId = `MOTA/${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}/${selectedScheme.code.split('-')[1]}/${Math.floor(10000 + Math.random() * 90000)}`;
    setNewGeneratedAppId(generatedId);

    const newAppRecord: ApplicationRecord = {
      id: generatedId,
      schemeId: selectedScheme.id,
      schemeCode: selectedScheme.code,
      schemeName: selectedScheme.name,
      submissionDate: new Date().toISOString().substring(0, 10),
      lastUpdated: new Date().toISOString().substring(0, 10),
      currentStageIndex: 2,
      status: 'DOC_VERIFICATION_PENDING',
      applicant: {
        id: 'APP-ST-' + Math.floor(1000 + Math.random() * 9000),
        fullName,
        fatherOrHusbandName: fatherName,
        gender,
        dob,
        aadhaarNumberMasked: maskedAadhaar,
        category,
        tribeCommunity,
        mobile,
        email,
        state,
        district,
        pincode,
        disabilityStatus: 'NONE'
      },
      academic: {
        currentCourse,
        institutionName,
        institutionState,
        aisheCode,
        rollNumber,
        yearOfStudy,
        previousExamName,
        previousExamPercentage,
        passingYear,
        boardOrUniversity
      },
      bank: {
        accountHolderName,
        bankName,
        accountNumberMasked: 'XXXXXXXX' + accountNumber.slice(-4),
        ifscCode,
        branchName,
        isAadhaarSeeded: true,
        dbtVerifiedDate: new Date().toISOString().substring(0, 10)
      },
      annualFamilyIncome,
      documents: [
        {
          id: 'DOC-' + Math.random().toString(36).substring(2, 7),
          documentCode: 'ST_CERTIFICATE',
          documentName: 'ST Community Certificate',
          fileUrl: '#',
          fileName: stCertFile,
          fileSizeKB: 340,
          uploadedAt: new Date().toISOString().substring(0, 10),
          ocrExtracted: true,
          status: 'VALID'
        },
        {
          id: 'DOC-' + Math.random().toString(36).substring(2, 7),
          documentCode: 'INCOME_CERTIFICATE',
          documentName: 'Income Certificate',
          fileUrl: '#',
          fileName: incCertFile,
          fileSizeKB: 290,
          uploadedAt: new Date().toISOString().substring(0, 10),
          ocrExtracted: true,
          status: 'VALID'
        },
        {
          id: 'DOC-' + Math.random().toString(36).substring(2, 7),
          documentCode: 'MARKSHEET',
          documentName: 'Previous Exam Marksheet',
          fileUrl: '#',
          fileName: marksheetFile,
          fileSizeKB: 580,
          uploadedAt: new Date().toISOString().substring(0, 10),
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
            ruleId: 'RULE_ST_CHECK',
            label: 'ST Community Validation',
            expected: 'ST',
            actual: `ST (${tribeCommunity})`,
            status: 'PASS',
            evidenceSnippet: 'Community matched against Presidential Order.'
          },
          {
            ruleId: 'RULE_INC_CHECK',
            label: 'Family Income Check',
            expected: selectedScheme.annualIncomeCap === 0 ? 'No Limit' : `<= ₹${selectedScheme.annualIncomeCap}`,
            actual: `₹${annualFamilyIncome.toLocaleString('en-IN')}`,
            status: 'PASS',
            evidenceSnippet: 'Within configured ceiling.'
          }
        ]
      },
      auditTrail: [
        {
          id: 'AUD-' + Math.random().toString(36).substring(2, 7),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: fullName,
          actorRole: 'APPLICANT',
          action: 'Online Application Submitted with e-Sign',
          previousStatus: 'DRAFT',
          newStatus: 'SUBMITTED',
          remarks: 'Form submitted successfully via Unified MoTA Portal.'
        }
      ]
    };

    addApplication(newAppRecord);
    setIsSubmitting(false);
    setIsSubmittedSuccess(true);
  };

  const handleSaveDraft = () => {
    setIsSavedDraft(true);
    setTimeout(() => setIsSavedDraft(false), 2500);
  };

  if (isSubmittedSuccess) {
    return (
      <div className="bg-white p-8 rounded border border-slate-300 shadow-md text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block">
          Government of India • Ministry of Tribal Affairs
        </span>

        <h2 className="text-2xl font-black text-[#0b2853]">
          Application Submitted Successfully!
        </h2>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs space-y-1">
          <div className="text-slate-500">Your Permanent Application Reference ID:</div>
          <div className="text-xl font-mono font-black text-blue-900 tracking-wider">
            {newGeneratedAppId}
          </div>
          <div className="text-slate-600 font-medium">Scheme: {selectedScheme.name}</div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
          Your application has been registered with Aadhaar e-Sign authentication. The AI Document Verification service will cross-check your uploaded certificates within 24 hours.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate('/applicant/status')}
            className="px-5 py-2.5 bg-[#0b2853] hover:bg-[#134685] text-white font-bold text-xs rounded shadow flex items-center gap-1.5"
          >
            <span>Track Application Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/applicant/dashboard')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded border border-slate-300"
          >
            Go to Applicant Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wizard Header */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Single Platform • Every Scheme
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            Apply for Scholarship / Fellowship
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Target Scheme: <strong className="text-blue-900">{selectedScheme.name}</strong> ({selectedScheme.code})
          </p>
        </div>

        {/* Save Draft button */}
        <div className="flex items-center gap-2">
          {isSavedDraft && (
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 animate-pulse">
              ✓ Draft Saved Locally
            </span>
          )}
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save as Draft</span>
          </button>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[720px] relative">
          {/* Connector line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0"></div>

          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className="flex flex-col items-center cursor-pointer group relative z-10"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-[#0b2853] text-white ring-4 ring-blue-100 shadow'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500 border border-slate-300 group-hover:bg-slate-200'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span
                  className={`text-[11px] mt-1.5 font-semibold text-center whitespace-nowrap ${
                    isCurrent ? 'text-blue-950 font-bold' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white p-6 rounded border border-slate-300 shadow-sm text-xs">
        {/* STEP 1: PROFILE */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2853]">
                Step 1: Applicant Profile & Identity
              </h2>
              <p className="text-slate-500 text-[11px]">
                Pre-filled from verified Aadhaar e-KYC and student registration record.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name (as per Aadhaar):</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Father's / Husband's Name:</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                >
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="TRANSGENDER">Transgender</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth (YYYY-MM-DD):</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar Number (Masked):</label>
                <input
                  type="text"
                  disabled
                  value={maskedAadhaar}
                  className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-mono text-slate-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-bold text-blue-900"
                >
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="PVTG">Particularly Vulnerable Tribal Group (PVTG)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tribe / Sub-Caste Community:</label>
                <input
                  type="text"
                  value={tribeCommunity}
                  onChange={(e) => setTribeCommunity(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number:</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email ID:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Domicile State:</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode:</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ELIGIBILITY & SCHEME SELECT */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2853]">
                Step 2: Target Scheme & Eligibility Parameters
              </h2>
              <p className="text-slate-500 text-[11px]">
                Select the scheme you wish to apply for and declare statutory parameters.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Selected MoTA Scheme:
              </label>
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded font-bold text-blue-900 text-xs sm:text-sm"
              >
                {schemes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Annual Family Income (from all sources in INR):
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={annualFamilyIncome}
                    onChange={(e) => setAnnualFamilyIncome(Number(e.target.value))}
                    className="w-full pl-6 p-2 bg-white border border-slate-300 rounded font-bold"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Ceiling for this scheme: {selectedScheme.annualIncomeCap === 0 ? 'No Upper Limit' : `₹${selectedScheme.annualIncomeCap.toLocaleString('en-IN')} / year`}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Applicant Age (as on 1st April 2025):
                </label>
                <input
                  type="number"
                  value={applicantAge}
                  onChange={(e) => setApplicantAge(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-bold"
                />
              </div>
            </div>

            {/* Configured Criteria Preview */}
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded">
              <span className="font-bold text-blue-950 block mb-1">
                Scheme Rules Evaluated for {selectedScheme.shortName}:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-blue-900 text-[11px]">
                {selectedScheme.eligibilityRules.map((rule) => (
                  <li key={rule.id}>
                    <strong>{rule.label}:</strong> {rule.explanation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* STEP 3: ACADEMIC DETAILS */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2853]">
                Step 3: Academic & Institutional Enrolment Details
              </h2>
              <p className="text-slate-500 text-[11px]">
                Enter your present course of study, university AISHE code, and previous qualifying exam credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Course / Degree:</label>
                <input
                  type="text"
                  value={currentCourse}
                  onChange={(e) => setCurrentCourse(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Institution / University Name:</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">AISHE Code / Institution Code:</label>
                <input
                  type="text"
                  value={aisheCode}
                  onChange={(e) => setAisheCode(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Roll / Enrolment Number:</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Year / Semester:</label>
                <input
                  type="text"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Previous Exam / Degree Passed:</label>
                <input
                  type="text"
                  value={previousExamName}
                  onChange={(e) => setPreviousExamName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Previous Qualifying Marks (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={previousExamPercentage}
                  onChange={(e) => setPreviousExamPercentage(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-bold text-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Year of Passing:</label>
                <input
                  type="text"
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Board / University:</label>
                <input
                  type="text"
                  value={boardOrUniversity}
                  onChange={(e) => setBoardOrUniversity(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BANK DETAILS (PFMS DBT) */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2853]">
                Step 4: Bank Account & PFMS DBT Seeding
              </h2>
              <p className="text-slate-500 text-[11px]">
                Scholarship allowance will be transferred directly to this account via the Aadhaar Payment Bridge (APB).
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="font-bold text-emerald-950 block">
                    PFMS & NPCI Mapper Validation Active
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Aadhaar Number is verified as active on National Payment Corporation of India (NPCI) gateway.
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px] uppercase">
                Aadhaar Seeded
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Holder Name (as per Bank):</label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Account Number:</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">IFSC Code:</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch Name:</label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENTS & DIGILOCKER */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#0b2853]">
                  Step 5: Enclosure of Mandatory Certificates
                </h2>
                <p className="text-slate-500 text-[11px]">
                  Upload legible PDF/JPG scans or pull verified certificates instantly from DigiLocker.
                </p>
              </div>

              {/* DigiLocker Sync Button */}
              <button
                type="button"
                onClick={handlePullDigiLocker}
                disabled={isPullingDigiLocker}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isPullingDigiLocker ? 'Connecting DigiLocker...' : 'Fetch via DigiLocker'}</span>
              </button>
            </div>

            {isDigiLockerLinked && (
              <div className="bg-cyan-50 border border-cyan-300 p-3 rounded text-cyan-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-700" />
                <span>DigiLocker digital certificate pulled with cryptographic PKI verification.</span>
              </div>
            )}

            <div className="space-y-3">
              {/* ST Certificate */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">1. ST Caste / Tribe Community Certificate</div>
                  <div className="text-[11px] text-slate-500 font-mono">Current file: {stCertFile}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    OCR READY
                  </span>
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change File</span>
                    <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && setStCertFile(e.target.files[0].name)} />
                  </label>
                </div>
              </div>

              {/* Income Certificate */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">2. Competent Tehsildar Income Certificate (FY 2024-25)</div>
                  <div className="text-[11px] text-slate-500 font-mono">Current file: {incCertFile}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    OCR READY
                  </span>
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change File</span>
                    <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && setIncCertFile(e.target.files[0].name)} />
                  </label>
                </div>
              </div>

              {/* Marksheet */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">3. Previous Qualifying Marksheet / Degree Certificate</div>
                  <div className="text-[11px] text-slate-500 font-mono">Current file: {marksheetFile}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    OCR READY
                  </span>
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change File</span>
                    <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && setMarksheetFile(e.target.files[0].name)} />
                  </label>
                </div>
              </div>

              {/* Admission Letter */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">4. University Admission / Research Joining Report</div>
                  <div className="text-[11px] text-slate-500 font-mono">Current file: {admissionFile}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    OCR READY
                  </span>
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change File</span>
                    <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && setAdmissionFile(e.target.files[0].name)} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: AI PRE-CHECK & OCR EXTRACTION INSPECTION */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-[#0b2853]">
                  Step 6: AI Document Extraction & Pre-Submission Cross-Check
                </h2>
              </div>
              <p className="text-slate-500 text-[11px]">
                The system has automatically analyzed your uploaded certificates. Review the extracted fields to ensure there are no clerical discrepancies.
              </p>
            </div>

            {/* Simulated OCR Verification Component */}
            <DocumentOcrViewer
              documentType="ST_CERTIFICATE"
              applicantName={fullName}
              declaredIncome={annualFamilyIncome}
              isDeficientScenario={false}
            />

            <DocumentOcrViewer
              documentType="INCOME_CERTIFICATE"
              applicantName={fullName}
              declaredIncome={annualFamilyIncome}
              isDeficientScenario={false}
            />

            {/* Explainable Decision Card */}
            <ExplainableEvidenceCard
              decision="ELIGIBLE"
              schemeName={selectedScheme.name}
              evidenceList={[
                {
                  ruleLabel: 'ST Community Category Match',
                  ruleFormula: 'category == ST',
                  documentSource: 'ST Certificate → Tribe',
                  extractedValue: `Scheduled Tribe (${tribeCommunity})`,
                  declaredValue: 'ST',
                  status: 'SATISFIED',
                  statutoryReference: 'The Constitution (Scheduled Tribes) Order, 1950'
                },
                {
                  ruleLabel: 'Annual Family Income Compliance',
                  ruleFormula: 'annualIncome <= schemeLimit',
                  documentSource: 'Income Certificate → Annual Family Income',
                  extractedValue: `₹${annualFamilyIncome.toLocaleString('en-IN')}`,
                  declaredValue: `₹${annualFamilyIncome.toLocaleString('en-IN')}`,
                  status: 'SATISFIED',
                  statutoryReference: 'MoTA Operational Guidelines'
                },
                {
                  ruleLabel: 'Qualifying Examination Standard',
                  ruleFormula: 'percentage >= minCutoff',
                  documentSource: 'Marksheet → Aggregate %',
                  extractedValue: `${previousExamPercentage}%`,
                  declaredValue: `${previousExamPercentage}%`,
                  status: 'SATISFIED',
                  statutoryReference: 'Academic Selection Regulations'
                }
              ]}
            />
          </div>
        )}

        {/* STEP 7: PREVIEW */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2853]">
                Step 7: Application Summary Preview
              </h2>
              <p className="text-slate-500 text-[11px]">
                Verify all declared parameters before signing the electronic declaration.
              </p>
            </div>

            <div className="border border-slate-300 rounded p-4 space-y-4 bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 uppercase text-xs border-b border-slate-200 pb-1 mb-2">
                  1. Scheme & Personal Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div><span className="text-slate-500">Scheme:</span> <strong>{selectedScheme.shortName}</strong></div>
                  <div><span className="text-slate-500">Applicant:</span> <strong>{fullName}</strong></div>
                  <div><span className="text-slate-500">Father:</span> <strong>{fatherName}</strong></div>
                  <div><span className="text-slate-500">Gender:</span> <strong>{gender}</strong></div>
                  <div><span className="text-slate-500">Category:</span> <strong>ST ({tribeCommunity})</strong></div>
                  <div><span className="text-slate-500">Aadhaar:</span> <strong>{maskedAadhaar}</strong></div>
                  <div><span className="text-slate-500">Annual Income:</span> <strong>₹{annualFamilyIncome.toLocaleString('en-IN')}</strong></div>
                  <div><span className="text-slate-500">State / Dist:</span> <strong>{state}, {district}</strong></div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 uppercase text-xs border-b border-slate-200 pb-1 mb-2">
                  2. Academic & Bank Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div><span className="text-slate-500">Course:</span> <strong>{currentCourse}</strong></div>
                  <div><span className="text-slate-500">Institution:</span> <strong>{institutionName}</strong></div>
                  <div><span className="text-slate-500">AISHE Code:</span> <strong>{aisheCode}</strong></div>
                  <div><span className="text-slate-500">Previous Score:</span> <strong>{previousExamPercentage}%</strong></div>
                  <div><span className="text-slate-500">Bank Name:</span> <strong>{bankName}</strong></div>
                  <div><span className="text-slate-500">IFSC:</span> <strong>{ifscCode}</strong></div>
                  <div><span className="text-slate-500">Account No:</span> <strong>XXXXXXXX{accountNumber.slice(-4)}</strong></div>
                  <div><span className="text-slate-500">Aadhaar Seeded:</span> <strong className="text-emerald-700">Yes (NPCI Verified)</strong></div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 uppercase text-xs border-b border-slate-200 pb-1 mb-2">
                  3. Enclosed Documents
                </h3>
                <div className="text-[11px] space-y-1">
                  <div>✓ ST Certificate: <code>{stCertFile}</code></div>
                  <div>✓ Income Certificate: <code>{incCertFile}</code></div>
                  <div>✓ Marksheet: <code>{marksheetFile}</code></div>
                  <div>✓ Admission Offer: <code>{admissionFile}</code></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: SUBMIT WITH E-SIGN */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2853]">
                Step 8: Statutory Declaration & e-Sign Submission
              </h2>
              <p className="text-slate-500 text-[11px]">
                Electronic signing and digital submission to Ministry of Tribal Affairs Central Gateway.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300 p-4 rounded space-y-3">
              <h4 className="font-bold text-amber-950 uppercase text-xs">
                Statutory Citizen Declaration
              </h4>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                I hereby solemnly declare that all particulars stated in this online application form are true, complete, and correct to the best of my knowledge and belief. I belong to the notified Scheduled Tribe community and my family annual income does not exceed the prescribed limit. If any document is found forged or fraudulent at any stage, my scholarship shall be summarily cancelled and recovered with statutory interest under applicable laws of the Government of India.
              </p>

              <label className="flex items-start gap-2 cursor-pointer pt-2 border-t border-amber-200">
                <input
                  type="checkbox"
                  checked={eSignConsent}
                  onChange={(e) => setESignConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-900 border-slate-400 rounded focus:ring-blue-800"
                />
                <span className="font-bold text-slate-900 text-xs">
                  I agree to the declaration and authorize Ministry of Tribal Affairs to verify my credentials with UIDAI Aadhaar, DigiLocker, and PFMS DBT Gateway.
                </span>
              </label>
            </div>

            <div className="bg-slate-100 p-3.5 rounded border border-slate-300 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-800" />
                <span>e-Sign Certification Mode: <strong>C-DAC / NIC Electronic Signature Service</strong></span>
              </div>
              <span className="text-slate-500 font-mono">Signer: {fullName}</span>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200 mt-6">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-slate-500 text-[11px] font-medium">
            Step {currentStep} of 8: <strong>{steps[currentStep - 1].label}</strong>
          </div>

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 8))}
              className="px-5 py-2 bg-[#0b2853] hover:bg-[#134685] text-white rounded font-bold shadow-sm flex items-center gap-1.5"
            >
              <span>Next: {steps[currentStep].label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || !eSignConsent}
              onClick={handleFinalSubmit}
              className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-extrabold shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Signing & Submitting...' : 'Complete & Submit Application'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
