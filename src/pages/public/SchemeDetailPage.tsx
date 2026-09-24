import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getHindiScheme } from '../../data/translations/hi';
import { EligibilityPreCheckModal } from '../../components/scheme/EligibilityPreCheckModal';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Download,
  CheckCircle,
  FileText,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Clock,
  Layers,
  Award,
  BookOpen,
  IndianRupee,
  UserCheck,
  Building,
  Mail,
  Phone
} from 'lucide-react';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { schemes, language } = useApp();
  const navigate = useNavigate();

  const scheme = schemes.find((s) => s.id === id) || schemes[0];
  const displayedScheme = language === 'HI' ? getHindiScheme(scheme) : scheme;
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isPreCheckOpen, setIsPreCheckOpen] = useState<boolean>(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'eligibility', label: 'Eligibility Criteria' },
    { id: 'benefits', label: 'Benefits & Allowances' },
    { id: 'documents', label: 'Required Documents' },
    { id: 'selection', label: 'Selection Process' },
    { id: 'stages', label: 'Workflow Stages' },
    { id: 'guidelines', label: 'Guidelines & Orders' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'nodal', label: 'Nodal Contact' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/schemes" className="hover:text-blue-900 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Schemes</span>
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">{displayedScheme.shortName}</span>
      </div>

      {/* Scheme Header Card */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-[#0b2853] text-white p-6 border-b-2 border-amber-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-blue-900 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded border border-blue-700 uppercase tracking-wide">
                  {scheme.code}
                </span>
                <span className="bg-white/10 text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded">
                  {displayedScheme.portalCategory}
                </span>
                {scheme.isOpen ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Applications Open (AY {scheme.academicYear})
                  </span>
                ) : (
                  <span className="bg-slate-700 text-slate-300 text-[11px] font-bold px-2 py-0.5 rounded">
                    Applications Closed
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1 text-white">
                {displayedScheme.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
                {displayedScheme.tagline}
              </p>
            </div>

            {/* Actions: Apply Now, Check Eligibility, Download Guidelines */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 flex-shrink-0">
              <Link
                to={`/applicant/apply?scheme=${scheme.id}`}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded shadow text-center uppercase tracking-wider transition-all transform hover:scale-[1.02]"
              >
                Apply Now
              </Link>
              <button
                onClick={() => setIsPreCheckOpen(true)}
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded border border-blue-600 flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Check Eligibility</span>
              </button>
              <a
                href={scheme.guidelinePdfUrl}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading Official Scheme Guidelines for ${scheme.shortName}`);
                }}
                className="bg-white/10 hover:bg-white/20 text-slate-200 text-xs px-3 py-1.5 rounded border border-white/20 flex items-center justify-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Guidelines</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Meta Strip */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Deadline: <strong className="text-slate-900">{scheme.applicationDeadline}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <IndianRupee className="w-4 h-4 text-slate-400" />
            <span>
              Income Ceiling: <strong className="text-slate-900">{scheme.annualIncomeCap === 0 ? 'No Upper Limit' : `₹${(scheme.annualIncomeCap / 100000).toFixed(1)} Lakh / Year`}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Beneficiary: <strong className="text-blue-900">{scheme.targetCommunity}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="flex items-center border-b border-slate-200 overflow-x-auto bg-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-900 text-blue-900 bg-white font-extrabold shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  About the Scheme
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {displayedScheme.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Summary of Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayedScheme.eligibilitySummary.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Selection Roster & Annual Slots
                </h3>
                <div className="bg-blue-50/70 border border-blue-200 p-4 rounded text-xs text-blue-950 space-y-1">
                  <div><strong>Total Annual Slots:</strong> {scheme.selectionCriteria.totalSlotsPerYear.toLocaleString('en-IN')} Beneficiaries</div>
                  <div><strong>Selection Methodology:</strong> {scheme.selectionCriteria.meritCalculation}</div>
                  {scheme.selectionCriteria.femaleReservationPercentage && (
                    <div><strong>Gender Reservation:</strong> {scheme.selectionCriteria.femaleReservationPercentage}% slots earmarked for ST female candidates</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY */}
          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Configured Statutory Eligibility Criteria
                </h3>
                <button
                  onClick={() => setIsPreCheckOpen(true)}
                  className="text-xs font-bold text-blue-800 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Run Live AI Pre-Check</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-bold uppercase">Criterion</th>
                      <th className="px-4 py-2.5 text-left font-bold uppercase">Target Field</th>
                      <th className="px-4 py-2.5 text-left font-bold uppercase">Condition / Threshold</th>
                      <th className="px-4 py-2.5 text-left font-bold uppercase">Official Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {scheme.eligibilityRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{rule.label}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{rule.field}</td>
                        <td className="px-4 py-3 text-blue-900 font-bold">
                          {rule.operator} {String(rule.value)} {rule.unit || ''}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{rule.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Financial Assistance & Allowance Schedule
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-bold uppercase">Benefit Component</th>
                      <th className="px-4 py-2.5 text-left font-bold uppercase">Amount / Grant</th>
                      <th className="px-4 py-2.5 text-left font-bold uppercase">Frequency</th>
                      <th className="px-4 py-2.5 text-left font-bold uppercase">Disbursement Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {scheme.benefits.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{b.item}</td>
                        <td className="px-4 py-3 font-bold text-emerald-800">{b.amount}</td>
                        <td className="px-4 py-3 text-slate-600">{b.frequency}</td>
                        <td className="px-4 py-3 text-slate-500">{b.notes || 'PFMS DBT Direct Bank Credit'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REQUIRED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Mandatory Enclosures & Certificates
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  All documents subject to AI OCR automated cross-verification
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheme.requiredDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{doc.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                        {doc.required ? 'MANDATORY' : 'OPTIONAL'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{doc.description}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span>Accepted: {doc.acceptedFormats.join(', ')}</span>
                      <span>Max: {doc.maxSizeMB} MB</span>
                      {doc.ocrVerifiable && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> OCR Auto-verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SELECTION PROCESS */}
          {activeTab === 'selection' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Merit Generation & Official Approval Policy
              </h3>
              <p className="text-slate-700 leading-relaxed">
                The unified portal implements an AI-assisted Selection Proposal engine that aggregates qualifying marks, verified category documents, and priority parameters. Final award is ratified exclusively by the authorized National Selection Board / Competent Authority.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-amber-950">
                <strong>Human-in-the-Loop Governance:</strong> The AI engine proposes ranking based on statutory criteria. Any officer override requires documented statutory rationale and is immutably logged into the MoTA Audit Trail.
              </div>
            </div>
          )}

          {/* TAB 6: WORKFLOW STAGES */}
          {activeTab === 'stages' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Configured Scheme Workflow Lifecycle
              </h3>
              <div className="space-y-3">
                {scheme.workflowStages.map((stage) => (
                  <div key={stage.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                    <div className="w-7 h-7 rounded-full bg-[#0b2853] text-white flex items-center justify-center font-bold flex-shrink-0">
                      {stage.order}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">{stage.name}</h4>
                        <span className="text-[10px] uppercase font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {stage.responsibleRole}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GUIDELINES */}
          {activeTab === 'guidelines' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Official Gazettes, Notifications & Guidelines
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Operational Guidelines for {scheme.name}
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Comprehensive booklet issued by Ministry of Tribal Affairs (Revision 2025-26)
                  </p>
                </div>
                <button
                  onClick={() => alert('Download initiated')}
                  className="px-3 py-1.5 bg-[#0b2853] text-white rounded font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                Frequently Asked Questions
              </h3>
              {scheme.faqItems.map((faq, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-800" />
                    <span>Q{idx + 1}: {faq.question}</span>
                  </div>
                  <p className="text-slate-600 pl-5 text-[11px]">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 9: NODAL CONTACT */}
          {activeTab === 'nodal' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Nodal Administrative Officers & Helpdesk
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2 max-w-lg">
                <div className="font-bold text-slate-900 text-sm">{scheme.nodalContact.officer}</div>
                <div className="text-slate-600">{scheme.nodalContact.designation}</div>
                <div className="text-slate-600 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{scheme.nodalContact.address}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{scheme.nodalContact.phone}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{scheme.nodalContact.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pre-Check Modal */}
      <EligibilityPreCheckModal
        scheme={scheme}
        isOpen={isPreCheckOpen}
        onClose={() => setIsPreCheckOpen(false)}
      />
    </div>
  );
};
