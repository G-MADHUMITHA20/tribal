import React from 'react';
import { ApplicationRecord, ApplicationStatus } from '../../types/application';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  Landmark,
  FileCheck2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface StatusTimelineProps {
  application: ApplicationRecord;
  onRectifyDeficiency?: () => void;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  application,
  onRectifyDeficiency
}) => {
  // Define 8 standard government lifecycle stages
  const stages = [
    {
      index: 1,
      title: 'Application Submitted',
      description: 'Registration & online submission with verified e-KYC',
      responsibleAuthority: 'Applicant / Citizen Gateway',
      isCompleted: true,
      date: application.submissionDate,
      remarks: 'Application received and registered successfully on MoTA portal.'
    },
    {
      index: 2,
      title: 'Document & OCR Verification',
      description: 'Automated AI extraction and cross-verification of ST & Income proofs',
      responsibleAuthority: 'MoTA AI Verification Engine',
      isCompleted: ['DOCUMENT_VERIFICATION', 'ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'SELECTION', 'APPROVED'].includes(application.status),
      isDeficient: application.status === 'DEFICIENT',
      date: application.lastUpdated,
      remarks: application.status === 'DEFICIENT'
        ? application.deficiencyNotes || 'Deficiency detected in certificate validity.'
        : 'All mandatory certificates verified with statutory confidence score.'
    },
    {
      index: 3,
      title: 'Institute Verification (INO)',
      description: 'Confirmation of regular enrollment, attendance, and fee structure',
      responsibleAuthority: 'University / Institute Nodal Officer',
      isCompleted: ['ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'SELECTION', 'APPROVED'].includes(application.status),
      date: '2026-02-20',
      remarks: 'Institute Nodal Officer verified bonafide enrollment and DRC approval.'
    },
    {
      index: 4,
      title: 'Official Scrutiny Cell',
      description: 'State / Ministry Scrutiny Officer examination and rule cross-check',
      responsibleAuthority: 'MoTA Scrutiny Cell (Shastri Bhawan)',
      isCompleted: ['SCRUTINY', 'SELECTION', 'APPROVED'].includes(application.status),
      date: '2026-03-01',
      remarks: application.officerRemarks || 'Statutory eligibility criteria passed.'
    },
    {
      index: 5,
      title: 'Selection Roster Proposal',
      description: 'Merit ranking and slot recommendation',
      responsibleAuthority: 'Selection Proposal Engine',
      isCompleted: ['SELECTION', 'APPROVED'].includes(application.status),
      date: '2026-03-10',
      remarks: application.meritScore ? `Merit Score: ${application.meritScore} points. Recommended for selection.` : 'Under selection matrix evaluation.'
    },
    {
      index: 6,
      title: 'Competent Officer Approval',
      description: 'Sanctioning Authority ratification and approval signature',
      responsibleAuthority: 'Director / Joint Secretary (MoTA)',
      isCompleted: application.status === 'APPROVED',
      date: application.status === 'APPROVED' ? application.lastUpdated : 'Pending',
      remarks: application.status === 'APPROVED' ? 'Sanction Order released.' : 'Awaiting National Selection Board ratification.'
    },
    {
      index: 7,
      title: 'Sanction Order & Award Letter',
      description: 'Electronic award letter generation with unique sanction number',
      responsibleAuthority: 'Ministry Sanctioning Authority',
      isCompleted: application.status === 'APPROVED',
      date: application.status === 'APPROVED' ? application.lastUpdated : 'Pending',
      remarks: application.status === 'APPROVED' ? 'Sanction Order generated.' : 'Pending sanction issuance.'
    },
    {
      index: 8,
      title: 'PFMS / DBT Direct Disbursement',
      description: 'Direct Treasury transfer into Aadhaar-seeded bank account',
      responsibleAuthority: 'PFMS DBT Gateway (Ministry of Finance)',
      isCompleted: application.status === 'APPROVED',
      date: application.status === 'APPROVED' ? application.lastUpdated : 'Pending',
      remarks: application.status === 'APPROVED'
        ? 'Direct bank transfer credited via Aadhaar Payment Bridge.'
        : 'Disbursement queued post-sanction.'
    }
  ];

  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0b2853] text-white p-4 border-b-2 border-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
            End-to-End Tracking Lifecycle
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white">
            Application Status: {application.id}
          </h3>
        </div>

        {/* Current status badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">Current Stage:</span>
          <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${
            application.status === 'APPROVED'
              ? 'bg-emerald-600 text-white'
              : application.status === 'DEFICIENT'
              ? 'bg-rose-600 text-white animate-pulse'
              : application.status === 'REJECTED'
              ? 'bg-red-600 text-white'
              : 'bg-amber-400 text-slate-950'
          }`}>
            {application.status === 'DOCUMENT_VERIFICATION' ? 'Document Verification'
              : application.status === 'ELIGIBILITY_VERIFICATION' ? 'Eligibility Verification'
              : application.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Deficiency Action Callout (if active) */}
      {application.hasDeficiency && (
        <div className="bg-rose-50 border-b border-rose-300 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 text-xs sm:text-sm">
                DEFICIENCY DETECTED • URGENT RECTIFICATION REQUIRED
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed mt-0.5">
                {application.deficiencyNotes || 'Income certificate requires current financial year validation.'}
              </p>
            </div>
          </div>

          {onRectifyDeficiency && (
            <button
              onClick={onRectifyDeficiency}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded shadow flex-shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <span>Replace Document & Resubmit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 8-Stage Timeline Steps */}
      <div className="p-6">
        <div className="relative border-l-2 border-slate-300 ml-4 sm:ml-6 space-y-6">
          {stages.map((stage) => {
            const isCurrent = (application.status === 'DEFICIENT' && stage.index === 2) ||
              (application.status === 'SELECTION' && stage.index === 5) ||
              (application.status === 'APPROVED' && stage.index === 6);

            return (
              <div key={stage.index} className="relative pl-6 sm:pl-8 group">
                {/* Node icon / circle */}
                <div
                  className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                    stage.isDeficient
                      ? 'bg-rose-600 border-rose-700 text-white'
                      : stage.isCompleted
                      ? 'bg-emerald-700 border-emerald-800 text-white'
                      : isCurrent
                      ? 'bg-amber-500 border-amber-600 text-slate-950'
                      : 'bg-white border-slate-400 text-slate-400'
                  }`}
                >
                  {stage.isDeficient ? (
                    <AlertTriangle className="w-4 h-4 text-white" />
                  ) : stage.isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span>{stage.index}</span>
                  )}
                </div>

                {/* Card details */}
                <div className={`p-4 rounded border text-xs transition-colors ${
                  stage.isDeficient
                    ? 'bg-rose-50/80 border-rose-300'
                    : stage.isCompleted
                    ? 'bg-white border-slate-300'
                    : 'bg-slate-50/60 border-slate-200 text-slate-500'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {stage.index}. {stage.title}
                      </span>
                      {stage.isCompleted && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase">
                          Completed
                        </span>
                      )}
                      {stage.isDeficient && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 uppercase">
                          Action Required
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      Date: <strong className="text-slate-700">{stage.date}</strong>
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] mb-2">
                    {stage.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">
                      Responsible Authority: <strong className="text-slate-800">{stage.responsibleAuthority}</strong>
                    </span>
                    <span className="text-slate-700 italic">
                      Remarks: "{stage.remarks}"
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
