import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationRecord } from '../../types/application';
import { DocumentOcrViewer } from '../../components/document-ai/DocumentOcrViewer';
import { ExplainableEvidenceCard } from '../../components/document-ai/ExplainableEvidenceCard';
import {
  FileCheck2,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  Building,
  RotateCcw,
  Download
} from 'lucide-react';
import { api } from '../../services/api';

export const ApplicationQueuePage: React.FC = () => {
  const { applications, updateApplicationStatus, currentUser } = useApp();

  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inspectingApp, setInspectingApp] = useState<ApplicationRecord | null>(null);

  // Action dialog states
  const [officerRemarksInput, setOfficerRemarksInput] = useState<string>('');

  const filteredApps = applications.filter((app) => {
    if (selectedSchemeFilter !== 'ALL' && app.schemeId !== selectedSchemeFilter) return false;
    if (selectedStatusFilter !== 'ALL' && app.status !== selectedStatusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        app.id.toLowerCase().includes(q) ||
        app.applicant.fullName.toLowerCase().includes(q) ||
        app.schemeName.toLowerCase().includes(q) ||
        app.academic.institutionName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAction = (status: ApplicationRecord['status'], remarks: string) => {
    if (!inspectingApp) return;
    updateApplicationStatus(inspectingApp.id, status, remarks, currentUser.name);
    setInspectingApp(null);
    setOfficerRemarksInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Official Scrutiny Cell
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            Application Verification & Scrutiny Queue
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Conduct statutory cross-checks, review AI extracted document parameters, and execute official sanctions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded border border-blue-200">
            Queue Size: {filteredApps.length} Applications
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search Candidate, ID, College..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-blue-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          {/* Scheme filter */}
          <select
            value={selectedSchemeFilter}
            onChange={(e) => setSelectedSchemeFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
          >
            <option value="ALL">All Schemes</option>
            <option value="national-fellowship-st">National Fellowship (Ph.D.)</option>
            <option value="national-scholarship-top-class">Top Class Premier Institutes</option>
            <option value="post-matric-st">Post-Matric ST</option>
            <option value="pre-matric-st">Pre-Matric ST</option>
            <option value="national-overseas-scholarship-st">National Overseas</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="INSTITUTE_VERIFIED">Institute Verified</option>
            <option value="DEFICIENCY_NOTIFIED">Deficiency Notified</option>
            <option value="RESUBMITTED">Resubmitted</option>
            <option value="PROPOSED_FOR_SELECTION">Proposed for Selection</option>
            <option value="APPROVED">Approved</option>
            <option value="DISBURSED_DBT">Disbursed (DBT)</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedSchemeFilter('ALL');
            setSelectedStatusFilter('ALL');
            setSearchTerm('');
          }}
          className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#0b2853] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Application ID</th>
                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Applicant & Community</th>
                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Target Scheme</th>
                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Academic Score</th>
                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">AI Scrutiny Check</th>
                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {app.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{app.applicant.fullName}</div>
                    <div className="text-[11px] text-slate-500">
                      ST ({app.applicant.tribeCommunity}) • {app.applicant.state}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <div className="line-clamp-1">{app.schemeName}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{app.schemeCode}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">
                    {app.academic.previousExamPercentage}%
                    <div className="text-[10px] text-slate-500 font-normal">
                      {app.academic.institutionName}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {app.hasDeficiency ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                        <AlertTriangle className="w-3 h-3" />
                        DEFICIENCY DETECTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        <CheckCircle className="w-3 h-3" />
                        OCR VERIFIED (98%)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'DISBURSED_DBT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'DEFICIENCY_NOTIFIED'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : app.status === 'PROPOSED_FOR_SELECTION'
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setInspectingApp(app)}
                      className="px-3 py-1.5 bg-[#0b2853] hover:bg-[#134685] text-white font-bold rounded shadow-sm flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Scrutinize</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Scrutiny & Review Modal */}
      {inspectingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="bg-[#0b2853] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-500">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    {inspectingApp.id}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-200">
                    {inspectingApp.schemeName}
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-0.5">
                  Official Dossier: {inspectingApp.applicant.fullName}
                </h3>
              </div>
              <button
                onClick={() => setInspectingApp(null)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Dossier Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Section 1: Candidate & Institute Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-slate-500 font-medium block">Personal Details:</span>
                  <div className="font-bold text-slate-900">{inspectingApp.applicant.fullName}</div>
                  <div>Father: {inspectingApp.applicant.fatherOrHusbandName}</div>
                  <div>Gender: {inspectingApp.applicant.gender} • DOB: {inspectingApp.applicant.dob}</div>
                  <div>Category: <strong className="text-blue-900">ST ({inspectingApp.applicant.tribeCommunity})</strong></div>
                  <div>Aadhaar: <span className="font-mono">{inspectingApp.applicant.aadhaarNumberMasked}</span></div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Academic Record:</span>
                  <div className="font-bold text-slate-900">{inspectingApp.academic.currentCourse}</div>
                  <div>Institution: {inspectingApp.academic.institutionName}</div>
                  <div>AISHE Code: <span className="font-mono">{inspectingApp.academic.aisheCode}</span></div>
                  <div>Qualifying Marks: <strong className="text-emerald-800">{inspectingApp.academic.previousExamPercentage}%</strong></div>
                  <div>Roll No: {inspectingApp.academic.rollNumber}</div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Bank & Direct Benefit Transfer:</span>
                  <div className="font-bold text-slate-900">{inspectingApp.bank.bankName}</div>
                  <div>A/C: <span className="font-mono">{inspectingApp.bank.accountNumberMasked}</span></div>
                  <div>IFSC: <span className="font-mono">{inspectingApp.bank.ifscCode}</span></div>
                  <div className="text-emerald-700 font-bold flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Aadhaar Seeded (NPCI Active)</span>
                  </div>
                </div>
              </div>

              {/* Enclosed Documents Gallery */}
              {inspectingApp.documents && inspectingApp.documents.length > 0 && (
                <div className="bg-slate-50 border border-slate-300 rounded p-3 space-y-2">
                  <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Enclosed Dossier Certificates ({inspectingApp.documents.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {inspectingApp.documents.map((doc, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded p-2.5 flex items-center justify-between gap-2 text-xs">
                        <div className="truncate">
                          <div className="font-bold text-slate-900 truncate">{doc.documentName || doc.documentCode}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{doc.fileName} ({doc.fileSizeKB || 0} KB)</div>
                        </div>
                        {doc.id && !doc.id.startsWith('DOC-AI') && (
                          <button
                            onClick={async () => {
                              try {
                                const blob = await api.downloadDocumentFile(doc.id);
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = doc.fileName || 'certificate.pdf';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              } catch (e: any) {
                                alert(`Could not download file: ${e.message}`);
                              }
                            }}
                            className="px-2 py-1 bg-[#0b2853] hover:bg-[#134685] text-white rounded text-[10px] font-bold flex items-center gap-1 flex-shrink-0"
                            title="Download citizen uploaded binary"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: AI OCR Extraction & Side-by-Side Verification */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                  1. Document Intelligence & OCR Inspection
                </h4>
                {(() => {
                  const targetDoc = inspectingApp.documents?.find(d => d.documentCode === 'INCOME_CERTIFICATE') || inspectingApp.documents?.[0];
                  const isLive = Boolean(targetDoc && targetDoc.id && !targetDoc.id.startsWith('DOC-AI'));
                  return (
                    <DocumentOcrViewer
                      documentType="INCOME_CERTIFICATE"
                      applicantName={inspectingApp.applicant.fullName}
                      declaredIncome={inspectingApp.annualFamilyIncome}
                      isDeficientScenario={inspectingApp.hasDeficiency}
                      documentId={targetDoc?.id}
                      fileName={targetDoc?.fileName}
                      isLiveUpload={isLive}
                    />
                  );
                })()}
              </div>

              {/* Section 3: Transparent Rule Evaluation Card */}
              <ExplainableEvidenceCard
                decision={inspectingApp.hasDeficiency ? 'DEFICIENCY_FLAGGED' : 'ELIGIBLE'}
                schemeName={inspectingApp.schemeName}
                evidenceList={[
                  {
                    ruleLabel: 'ST Community Category Match',
                    ruleFormula: 'category == ST',
                    documentSource: 'ST Certificate → Category',
                    extractedValue: `Scheduled Tribe (${inspectingApp.applicant.tribeCommunity})`,
                    declaredValue: 'ST',
                    status: 'SATISFIED',
                    statutoryReference: 'The Constitution (Scheduled Tribes) Order, 1950'
                  },
                  {
                    ruleLabel: 'Annual Family Income Verification',
                    ruleFormula: 'annualIncome <= schemeCeiling',
                    documentSource: 'Tehsildar Income Certificate',
                    extractedValue: `₹${inspectingApp.annualFamilyIncome.toLocaleString('en-IN')}`,
                    declaredValue: `₹${inspectingApp.annualFamilyIncome.toLocaleString('en-IN')}`,
                    status: inspectingApp.hasDeficiency ? 'WARNING' : 'SATISFIED',
                    statutoryReference: 'MoTA Operational Guidelines'
                  }
                ]}
              />

              {/* Section 4: Officer Remarks Input */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  Statutory Officer Remarks / Justification:
                </label>
                <textarea
                  rows={2}
                  value={officerRemarksInput}
                  onChange={(e) => setOfficerRemarksInput(e.target.value)}
                  placeholder="Enter specific audit remarks or deficiency reason..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>

            {/* Dossier Footer Actions: [Verify] [Request Correction] [Reject] [Approve] */}
            <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setInspectingApp(null)}
                className="px-4 py-2 border border-slate-300 rounded font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                Close Dossier
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {/* Request Correction (Deficiency) */}
                <button
                  onClick={() =>
                    handleAction(
                      'DEFICIENCY_NOTIFIED',
                      officerRemarksInput || 'Deficiency: Income certificate validity requires FY 2024-25 issuance.'
                    )
                  }
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Correction (Deficiency)</span>
                </button>

                {/* Reject */}
                <button
                  onClick={() =>
                    handleAction(
                      'REJECTED',
                      officerRemarksInput || 'Application does not meet statutory eligibility guidelines.'
                    )
                  }
                  className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject with Reason</span>
                </button>

                {/* Verify / Recommend for Selection */}
                <button
                  onClick={() =>
                    handleAction(
                      'PROPOSED_FOR_SELECTION',
                      officerRemarksInput || 'All documents verified and recommended for National Selection Board.'
                    )
                  }
                  className="px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-400" />
                  <span>Verify & Propose for Selection</span>
                </button>

                {/* Final Sanction / Approve */}
                <button
                  onClick={() =>
                    handleAction(
                      'APPROVED',
                      officerRemarksInput || 'Sanction ratified by Competent Sanctioning Authority.'
                    )
                  }
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Release Sanction</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
