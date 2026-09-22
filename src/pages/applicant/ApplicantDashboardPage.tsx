import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusTimeline } from '../../components/applicant/StatusTimeline';
import { ExplainableEvidenceCard } from '../../components/document-ai/ExplainableEvidenceCard';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  ShieldCheck,
  Building,
  Calendar,
  ExternalLink,
  Download,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApplicantDashboardPage: React.FC = () => {
  const {
    currentApplicantApplication,
    resolveApplicationDeficiency,
    currentUser,
    isLoadingApplications,
    applicationError,
    fetchApplications
  } = useApp();

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [newCertFileName, setNewCertFileName] = useState('Income_Certificate_Tehsildar_FY2024-25_Signed.pdf');
  const [isSubmittingFix, setIsSubmittingFix] = useState(false);

  const app = currentApplicantApplication;

  if (isLoadingApplications) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-white p-12 rounded-lg border border-slate-300 shadow-sm text-center space-y-3"
      >
        <div className="w-10 h-10 border-4 border-blue-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-[#0b2853]">Loading your scholarship dossiers from MoTA database...</p>
        <p className="text-xs text-slate-500">Retrieving user-isolated records for {currentUser.email}</p>
      </div>
    );
  }

  if (applicationError) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="bg-rose-50 border-2 border-rose-400 p-8 rounded-lg shadow-sm text-center space-y-4"
      >
        <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-extrabold text-rose-950">Unable to load your applications.</h2>
        <p className="text-xs text-rose-800 max-w-md mx-auto">{applicationError}</p>
        <div>
          <button
            onClick={fetchApplications}
            className="px-5 py-2.5 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="bg-white p-8 rounded-lg border border-slate-300 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 bg-blue-50 border border-blue-200 text-[#0b2853] rounded-full flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0b2853]">No Active Applications Found</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            You do not have any active scholarship or fellowship applications under your citizen account (<strong>{currentUser.email}</strong>).
          </p>
        </div>
        <div>
          <Link
            to="/applicant/apply"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow uppercase tracking-wider transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Apply for a Scholarship Scheme</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleResolveDeficiencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFix(true);
    setTimeout(() => {
      resolveApplicationDeficiency(app.id, newCertFileName);
      setIsSubmittingFix(false);
      setIsResolveModalOpen(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Citizen Application Portal
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            Welcome, {app.applicant.fullName}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Community: <strong>{app.applicant.tribeCommunity} (Scheduled Tribe)</strong> • Domicile: <strong>{app.applicant.district}, {app.applicant.state}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/applicant/apply"
            className="px-3.5 py-2 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow-sm flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Apply for Another Scheme</span>
          </Link>
          <button
            onClick={() => alert(`Downloading Official Acknowledgement Receipt for ${app.id}`)}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Acknowledgement</span>
          </button>
        </div>
      </div>

      {/* DEFICIENCY DETECTED HIGH PRIORITY BANNER */}
      {app.hasDeficiency && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-600 text-white rounded-full flex-shrink-0 animate-bounce">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-rose-800 block">
                  URGENT APPLICANT ACTION REQUIRED • DEFICIENCY NOTIFIED
                </span>
                <h3 className="text-base font-extrabold text-rose-950 mt-0.5">
                  Action Required on Application {app.id}
                </h3>
                <p className="text-xs text-rose-900 leading-relaxed mt-1">
                  <strong>Detected Issue:</strong> {app.deficiencyNotes || 'Income certificate is outdated (Issued FY 2022-23 instead of FY 2024-25).'}
                </p>
                <p className="text-[11px] text-rose-800 mt-1">
                  Required Action: Upload a valid, renewed Income Certificate issued on or after 01-04-2024 to prevent application rejection.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsResolveModalOpen(true)}
              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded shadow-md flex items-center gap-1.5 flex-shrink-0 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Replace Document & Resubmit</span>
            </button>
          </div>
        </div>
      )}

      {/* Application Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Application ID
          </span>
          <div className="text-sm font-black text-blue-950 font-mono">
            {app.id}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Submitted: {app.submissionDate}
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Current Scheme
          </span>
          <div className="text-sm font-bold text-[#0b2853] line-clamp-1">
            {app.schemeName}
          </div>
          <span className="text-[11px] text-blue-800 font-semibold mt-1 block">
            Code: {app.schemeCode}
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Current Status
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider ${
                app.status === 'DISBURSED_DBT'
                  ? 'bg-emerald-100 text-emerald-800'
                  : app.status === 'DEFICIENCY_NOTIFIED'
                  ? 'bg-rose-100 text-rose-800 animate-pulse'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {app.status.replace(/_/g, ' ')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Last Updated: {app.lastUpdated}
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Next Action
          </span>
          <div className="text-xs font-bold text-slate-800">
            {app.hasDeficiency ? 'Upload Valid Income Certificate' : 'Under Selection Board Ratification'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {app.hasDeficiency ? 'Action pending from Applicant' : 'Action pending with MoTA Officers'}
          </span>
        </div>
      </div>

      {/* 8-Stage Interactive Tracking Timeline */}
      <StatusTimeline
        application={app}
        onRectifyDeficiency={() => setIsResolveModalOpen(true)}
      />

      {/* Explainable AI Evidence Breakdown */}
      <ExplainableEvidenceCard
        decision={app.hasDeficiency ? 'DEFICIENCY_FLAGGED' : 'ELIGIBLE'}
        schemeName={app.schemeName}
        evidenceList={[
          {
            ruleLabel: 'ST Community Statutory Criterion',
            ruleFormula: 'category == ST',
            documentSource: 'ST Caste Certificate → Category',
            extractedValue: `Scheduled Tribe (${app.applicant.tribeCommunity})`,
            declaredValue: 'ST',
            status: 'SATISFIED',
            statutoryReference: 'The Constitution (Scheduled Tribes) Order, 1950'
          },
          {
            ruleLabel: 'Income Limit Statutory Criterion',
            ruleFormula: 'annualIncome <= schemeCeiling',
            documentSource: 'Income Certificate → Certified Family Income',
            extractedValue: `₹${app.annualFamilyIncome.toLocaleString('en-IN')}`,
            declaredValue: `₹${app.annualFamilyIncome.toLocaleString('en-IN')}`,
            status: app.hasDeficiency ? 'WARNING' : 'SATISFIED',
            statutoryReference: 'MoTA Operational Guidelines Section 4.2'
          },
          {
            ruleLabel: 'Academic Score Threshold',
            ruleFormula: 'percentage >= minThreshold',
            documentSource: 'Qualifying Marksheet → Aggregate %',
            extractedValue: `${app.academic.previousExamPercentage}%`,
            declaredValue: `${app.academic.previousExamPercentage}%`,
            status: 'SATISFIED',
            statutoryReference: 'Academic Eligibility Matrix Table 1'
          }
        ]}
      />

      {/* Deficiency Rectification Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden">
            <div className="bg-rose-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Replace Deficient Document</h3>
              </div>
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="text-slate-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveDeficiencySubmit} className="p-5 space-y-4 text-xs">
              <div className="bg-rose-50 border-l-4 border-rose-600 p-3 text-rose-950">
                <strong>Deficiency Reason:</strong> {app.deficiencyNotes || 'Income certificate is outdated.'}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Document Type:
                </label>
                <input
                  type="text"
                  disabled
                  value="Competent Tehsildar Income Certificate (FY 2024-25)"
                  className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Select Corrected File (PDF / JPG up to 2MB):
                </label>
                <input
                  type="text"
                  value={newCertFileName}
                  onChange={(e) => setNewCertFileName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono text-slate-900"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Simulated replacement scan: Tehsildar issued and digitally signed with e-Pramaan PKI token.
                </span>
              </div>

              <div className="bg-emerald-50 p-3 rounded border border-emerald-200 text-emerald-900 text-[11px]">
                ✓ AI Verification Pre-check will automatically validate certificate issuance date and annual income upon upload.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFix}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded font-bold shadow flex items-center gap-1.5"
                >
                  {isSubmittingFix ? 'Scanning & Submitting...' : 'Upload & Resubmit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
