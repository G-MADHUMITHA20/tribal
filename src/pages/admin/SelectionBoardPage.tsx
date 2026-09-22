import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationRecord } from '../../types/application';
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Scale
} from 'lucide-react';

export const SelectionBoardPage: React.FC = () => {
  const { applications, updateApplicationStatus, addAuditLog, currentUser } = useApp();

  const [selectedScheme, setSelectedScheme] = useState<string>('national-fellowship-st');
  const [overrideModalApp, setOverrideModalApp] = useState<ApplicationRecord | null>(null);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overrideAction, setOverrideAction] = useState<'SELECT' | 'DESELECT'>('SELECT');

  const schemeApps = applications.filter((a) => a.schemeId === selectedScheme);

  // Merit sorted list: based on previousExamPercentage descending
  const sortedRoster = [...schemeApps].sort(
    (a, b) => b.academic.previousExamPercentage - a.academic.previousExamPercentage
  );

  const handleApproveProposal = (app: ApplicationRecord) => {
    updateApplicationStatus(
      app.id,
      'APPROVED',
      'Officially approved and ratified under National Merit Selection Board quota.',
      currentUser.name
    );
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideModalApp || !overrideReason.trim()) return;

    const newStatus = overrideAction === 'SELECT' ? 'APPROVED' : 'REJECTED';

    updateApplicationStatus(
      overrideModalApp.id,
      newStatus,
      `OFFICER STATUTORY OVERRIDE: ${overrideReason}`,
      currentUser.name
    );

    addAuditLog({
      actor: currentUser.name,
      role: 'OFFICER',
      action: `Selection Roster Override (${overrideAction})`,
      applicationId: overrideModalApp.id,
      schemeCode: overrideModalApp.schemeCode,
      previousStatus: overrideModalApp.status,
      newStatus,
      reason: `Officer Override Justification: ${overrideReason}`,
      ipAddress: '10.14.88.22'
    });

    setOverrideModalApp(null);
    setOverrideReason('');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Merit & Quota Governance
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              AI Selection Proposal Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            National Selection Board & Merit Roster
          </h1>
          <p className="text-slate-600 mt-0.5">
            Automated generation of merit proposals subject to authorized officer statutory ratification.
          </p>
        </div>

        {/* Scheme Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Scheme Roster:</label>
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-300 rounded font-bold text-blue-900"
          >
            <option value="national-fellowship-st">National Fellowship (750 Ph.D. Slots)</option>
            <option value="national-scholarship-top-class">Top Class Premier Institutes (1,000 Slots)</option>
            <option value="national-overseas-scholarship-st">National Overseas Scholarship (20 Slots)</option>
            <option value="post-matric-st">Post-Matric ST Universal Quota</option>
          </select>
        </div>
      </div>

      {/* Statutory Human Control Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-amber-950 flex items-start gap-3 shadow-sm">
        <Scale className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-950 font-bold text-xs">
            Mandatory Human-in-the-Loop Governance Directive:
          </strong>
          <p className="text-slate-700 leading-relaxed text-[11px] mt-0.5">
            The AI engine generates a transparent "Selection Proposal" based on verified qualifying examination percentage, tribal reservation criteria, and gender quotas. No applicant is rejected or selected without final authorized officer signature. Any administrative override mandates documented justification and is recorded immutably in the MoTA Audit Trail.
          </p>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#0b2853] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase">Rank / Slot</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Application ID</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Applicant Name</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Academic Score</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Category & Priority</th>
                <th className="px-4 py-3 text-left font-bold uppercase">AI Merit Score</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Current Status</th>
                <th className="px-4 py-3 text-right font-bold uppercase">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {sortedRoster.map((app, idx) => {
                const meritScore = (app.academic.previousExamPercentage * 0.8 + 20).toFixed(1);
                const isProposed = app.status === 'PROPOSED_FOR_SELECTION';
                const isApproved = app.status === 'APPROVED' || app.status === 'DISBURSED_DBT';

                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      #{idx + 1}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {app.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{app.applicant.fullName}</div>
                      <div className="text-[10px] text-slate-500">{app.academic.institutionName}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {app.academic.previousExamPercentage}%
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-blue-950">ST ({app.applicant.tribeCommunity})</span>
                      <div className="text-[10px] text-slate-500">
                        {app.applicant.gender === 'FEMALE' ? '33% Women Reservation Quota' : 'General ST Quota'}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-extrabold text-indigo-900">
                      {meritScore} / 100
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isProposed
                            ? 'bg-indigo-100 text-indigo-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isApproved && (
                          <button
                            onClick={() => handleApproveProposal(app)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow-sm"
                          >
                            Approve Proposal
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setOverrideModalApp(app);
                            setOverrideAction(isApproved ? 'DESELECT' : 'SELECT');
                          }}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-[10px]"
                        >
                          Manual Override
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Officer Override Dialog */}
      {overrideModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden">
            <div className="bg-[#0b2853] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Authorized Statutory Override</h3>
              <button onClick={() => setOverrideModalApp(null)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleOverrideSubmit} className="p-5 space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-600 p-3 text-amber-950 text-[11px]">
                <strong>Statutory Notice:</strong> Overriding the AI merit proposal requires an official audit reason pursuant to Ministry of Tribal Affairs guidelines.
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Applicant Dossier:</span>
                <strong className="text-slate-900 text-sm">{overrideModalApp.applicant.fullName}</strong>
                <span className="text-slate-500 font-mono block">{overrideModalApp.id}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Override Action:</label>
                <select
                  value={overrideAction}
                  onChange={(e) => setOverrideAction(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-bold"
                >
                  <option value="SELECT">Grant Special Statutory Approval (Select Candidate)</option>
                  <option value="DESELECT">Disqualify / Withhold from Merit Roster</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mandatory Statutory Justification:
                </label>
                <textarea
                  rows={3}
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="E.g., PVTG affirmative action clause 5.3 / verified sports quota / manual document re-evaluation..."
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setOverrideModalApp(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0b2853] text-white rounded font-bold shadow hover:bg-[#134685]"
                >
                  Sign & Commit Override Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
