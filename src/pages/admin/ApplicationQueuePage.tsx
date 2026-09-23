import React, { useState, useMemo, useEffect } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { getSchemeWindowStatus } from '../../utils/schemeWindow';

export const ApplicationQueuePage: React.FC = () => {
  const { applications, schemes, updateApplicationStatus, addAuditLog, currentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inspectingApp, setInspectingApp] = useState<ApplicationRecord | null>(null);

  // Action dialog states
  const [officerRemarksInput, setOfficerRemarksInput] = useState<string>('');
  const [confirmActionType, setConfirmActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

  const selectedScheme = useMemo(() => {
    return schemes.find(s => s.id === selectedSchemeId || s.code === selectedSchemeId) || null;
  }, [schemes, selectedSchemeId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const schemeCode = params.get('scheme');
    const appId = params.get('app');

    if (schemeCode && schemes.length > 0) {
      setSelectedSchemeId(schemeCode);
      if (appId && applications.length > 0) {
        const appToInspect = applications.find(a => a.id === appId && (a.schemeCode === schemeCode || a.schemeId === schemeCode));
        if (appToInspect) {
          setInspectingApp(appToInspect);
          // Optional: clear params so refresh doesn't reopen if closed
          navigate('/admin/applications', { replace: true });
        }
      }
    }
  }, [location.search, schemes, applications, navigate]);

  const filteredApps = useMemo(() => {
    if (!selectedScheme) return [];
    
    return applications.filter((app) => {
      // 1. Strict scheme matching
      const matchesScheme = app.schemeCode === selectedScheme.code || app.schemeId === selectedScheme.id;
      if (!matchesScheme) return false;
      
      // 2. Status matching
      if (selectedStatusFilter !== 'ALL' && app.status !== selectedStatusFilter) return false;
      
      // 3. Search matching
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          app.id.toLowerCase().includes(q) ||
          app.applicant.fullName.toLowerCase().includes(q) ||
          app.academic.institutionName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, selectedScheme, selectedStatusFilter, searchTerm]);

  const schemeStats = useMemo(() => {
    return schemes.map(s => {
      const schemeApps = applications.filter(a => a.schemeCode === s.code || a.schemeId === s.id);
      return {
        scheme: s,
        windowStatus: getSchemeWindowStatus(s),
        total: schemeApps.length,
        draft: schemeApps.filter(a => a.status === 'DRAFT').length,
        submitted: schemeApps.filter(a => ['SUBMITTED', 'RESUBMITTED'].includes(a.status)).length,
        verificationPending: schemeApps.filter(a => ['DOCUMENT_VERIFICATION', 'ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'DEFICIENT'].includes(a.status)).length,
        approved: schemeApps.filter(a => ['APPROVED', 'SELECTION'].includes(a.status)).length,
        rejected: schemeApps.filter(a => a.status === 'REJECTED').length,
      };
    });
  }, [applications, schemes]);

  const handleAction = (status: ApplicationRecord['status'], remarks: string) => {
    if (!inspectingApp) return;
    
    updateApplicationStatus(inspectingApp.id, status, remarks, currentUser.name);
    
    if (status === 'APPROVED' || status === 'REJECTED') {
      addAuditLog({
        actor: currentUser.name,
        role: currentUser.role,
        action: status === 'APPROVED' ? 'Application Approved' : 'Application Rejected',
        applicationId: inspectingApp.id,
        schemeCode: inspectingApp.schemeCode,
        previousStatus: inspectingApp.status,
        newStatus: status,
        remarks: remarks,
        reason: remarks,
        ipAddress: '10.14.88.22'
      });
    }
    
    setInspectingApp(null);
    setOfficerRemarksInput('');
    setConfirmActionType(null);
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

      {/* Conditional Rendering: Scheme Selection vs Application Queue */}
      {!selectedScheme ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-slate-800">Select Scheme to Manage Applications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemeStats.map(stat => (
              <div 
                key={stat.scheme.id}
                onClick={() => setSelectedSchemeId(stat.scheme.id)}
                className="bg-white border border-slate-300 rounded p-4 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] font-mono font-bold text-slate-500">{stat.scheme.code}</div>
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${stat.windowStatus.state === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : stat.windowStatus.state === 'CLOSING_SOON' ? 'bg-amber-100 text-amber-800' : stat.windowStatus.state === 'NOT_STARTED' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-800'}`}>
                      {stat.windowStatus.state === 'OPEN' ? 'OPEN' : stat.windowStatus.state === 'CLOSING_SOON' ? 'CLOSING SOON' : stat.windowStatus.state === 'NOT_STARTED' ? 'NOT OPEN' : 'CLOSED'}
                    </div>
                  </div>
                  <h3 className="font-bold text-blue-950 mb-1 line-clamp-2">{stat.scheme.name}</h3>
                  <div className="text-[10px] text-slate-500 mb-2">
                    {stat.scheme.applicationDeadline ? `Deadline: ${stat.scheme.applicationDeadline}` : 'No Deadline'}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Total</div>
                    <div className="font-black text-lg text-slate-800">{stat.total}</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded border border-blue-100">
                    <div className="text-blue-600 text-[10px] uppercase font-bold">Submitted</div>
                    <div className="font-black text-lg text-blue-900">{stat.submitted}</div>
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-100">
                    <div className="text-amber-600 text-[10px] uppercase font-bold">Pending</div>
                    <div className="font-black text-lg text-amber-900">{stat.verificationPending}</div>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                    <div className="text-emerald-600 text-[10px] uppercase font-bold">Approved</div>
                    <div className="font-black text-lg text-emerald-900">{stat.approved}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button 
                onClick={() => {
                  setSelectedSchemeId(null);
                  setSearchTerm('');
                  setSelectedStatusFilter('ALL');
                }}
                className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1 mb-2"
              >
                ← Back to Scheme Selection
              </button>
              <h2 className="text-lg font-bold text-slate-800">
                {selectedScheme.name}
              </h2>
              <div className="text-xs text-slate-500 font-mono mt-0.5">{selectedScheme.code}</div>
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

              {/* Status filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="DOCUMENT_VERIFICATION">Document Verification</option>
                <option value="ELIGIBILITY_VERIFICATION">Eligibility Verification</option>
                <option value="SCRUTINY">Scrutiny</option>
                <option value="SELECTION">Selection</option>
                <option value="DEFICIENT">Deficient</option>
                <option value="RESUBMITTED">Resubmitted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <button
              onClick={() => {
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
          {filteredApps.length === 0 ? (
            <div className="bg-white border border-slate-300 rounded shadow-sm p-10 text-center flex flex-col items-center">
              <FileCheck2 className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-slate-700 font-bold text-sm">No applications found</h3>
              <p className="text-slate-500 text-xs mt-1">
                No applications have been submitted for this scheme yet matching the current filters.
              </p>
            </div>
          ) : (
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
                        app.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'DEFICIENT'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : app.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : app.status === 'SELECTION'
                          ? 'bg-indigo-100 text-indigo-900'
                          : app.status === 'SCRUTINY'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {app.status === 'DOCUMENT_VERIFICATION' ? 'Document Verification'
                        : app.status === 'ELIGIBILITY_VERIFICATION' ? 'Eligibility Verification'
                        : app.status.replace(/_/g, ' ')}
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
          )}
        </div>
      )}

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
                {/* Request Correction (Deficiency) - Available during verification & scrutiny */}
                {['SUBMITTED', 'RESUBMITTED', 'DOCUMENT_VERIFICATION', 'ELIGIBILITY_VERIFICATION', 'SCRUTINY'].includes(inspectingApp.status) && (
                  <button
                    onClick={() =>
                      handleAction(
                        'DEFICIENT',
                        officerRemarksInput || 'Deficiency: Document requires re-upload and correction.'
                      )
                    }
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Request Correction (Deficiency)</span>
                  </button>
                )}

                {/* Reject - Available before terminal state */}
                {!['APPROVED', 'REJECTED', 'DRAFT'].includes(inspectingApp.status) && (
                  <button
                    onClick={() => {
                      if (!officerRemarksInput.trim()) {
                        alert("Rejection reason is required. Please provide a reason in the remarks field.");
                        return;
                      }
                      setConfirmActionType('REJECT');
                    }}
                    className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject with Reason</span>
                  </button>
                )}

                {/* Canonical Forward Progression */}
                {inspectingApp.status === 'SUBMITTED' || inspectingApp.status === 'RESUBMITTED' ? (
                  <button
                    onClick={() =>
                      handleAction(
                        'DOCUMENT_VERIFICATION',
                        officerRemarksInput || 'Commencing official document and certificate verification.'
                      )
                    }
                    className="px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    <span>Verify Documents</span>
                  </button>
                ) : inspectingApp.status === 'DOCUMENT_VERIFICATION' ? (
                  <button
                    onClick={() =>
                      handleAction(
                        'ELIGIBILITY_VERIFICATION',
                        officerRemarksInput || 'Document verification passed. Forwarded to Eligibility Verification.'
                      )
                    }
                    className="px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    <span>Pass Document Verification</span>
                  </button>
                ) : inspectingApp.status === 'ELIGIBILITY_VERIFICATION' ? (
                  <button
                    onClick={() =>
                      handleAction(
                        'SCRUTINY',
                        officerRemarksInput || 'Eligibility criteria satisfied. Forwarded to Official Scrutiny.'
                      )
                    }
                    className="px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    <span>Pass to Scrutiny Cell</span>
                  </button>
                ) : inspectingApp.status === 'SCRUTINY' ? (
                  <button
                    onClick={() =>
                      handleAction(
                        'SELECTION',
                        officerRemarksInput || 'Official scrutiny passed. Recommended for National Selection Board.'
                      )
                    }
                    className="px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    <span>Recommend for Selection</span>
                  </button>
                ) : inspectingApp.status === 'SELECTION' ? (
                  <button
                    onClick={() => setConfirmActionType('APPROVE')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Release Sanction</span>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Confirmation Dialog Overlay */}
            {confirmActionType && (
              <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                  <h3 className="text-lg font-black text-[#0b2853] mb-4">
                    {confirmActionType === 'APPROVE' ? 'Approve this application?' : 'Reject this application?'}
                  </h3>
                  <div className="space-y-2 mb-6 text-sm text-slate-700 bg-slate-50 p-4 rounded border border-slate-200">
                    <p><strong>Applicant:</strong> {inspectingApp.applicant.fullName}</p>
                    <p><strong>Scheme:</strong> {inspectingApp.schemeName}</p>
                    <p><strong>Application ID:</strong> <span className="font-mono text-blue-900 font-bold">{inspectingApp.id}</span></p>
                    <p><strong>Current Status:</strong> {inspectingApp.status.replace(/_/g, ' ')}</p>
                    {confirmActionType === 'REJECT' && (
                      <p className="mt-2 pt-2 border-t border-slate-300">
                        <strong className="text-rose-700 block mb-1">Rejection Reason:</strong> 
                        {officerRemarksInput}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setConfirmActionType(null)}
                      className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-bold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (confirmActionType === 'APPROVE') {
                           handleAction('APPROVED', officerRemarksInput || 'Sanction ratified by Competent Sanctioning Authority.');
                        } else {
                           handleAction('REJECTED', officerRemarksInput);
                        }
                      }}
                      className={`px-4 py-2 text-white font-bold rounded shadow-sm ${
                        confirmActionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                      }`}
                    >
                      {confirmActionType === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
