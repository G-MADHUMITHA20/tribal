import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusTimeline } from '../../components/applicant/StatusTimeline';
import { ExplainableEvidenceCard } from '../../components/document-ai/ExplainableEvidenceCard';
import { Clock, Search, ShieldCheck, History, AlertTriangle, Upload } from 'lucide-react';

export const StatusTrackerPage: React.FC = () => {
  const { applications, currentApplicantApplication, resolveApplicationDeficiency } = useApp();
  const [searchId, setSearchId] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState(currentApplicantApplication || applications[0]);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState<boolean>(false);
  const [replacementFile, setReplacementFile] = useState<string>('Income_Certificate_Tehsildar_FY2024-25_Renewed.pdf');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      const match = applications.find(
        (a) => a.id.toLowerCase().includes(searchId.trim().toLowerCase())
      );
      if (match) {
        setSelectedApp(match);
      } else {
        alert(`No application found matching "${searchId}". Showing demo records.`);
      }
    }
  };

  const handleDeficiencyResolved = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    resolveApplicationDeficiency(selectedApp.id, replacementFile);
    setIsResolveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Official Application Tracking System
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            Track Application Status & Audit History
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time status transparency across Institute Verification, Scrutiny, Selection Board, and PFMS DBT.
          </p>
        </div>

        {/* Quick Search input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Application ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="p-2 text-xs bg-slate-50 border border-slate-300 rounded font-mono w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#0b2853] text-white font-bold text-xs rounded hover:bg-[#134685]"
          >
            Search
          </button>
        </form>
      </div>

      {/* Select Application from demo list */}
      <div className="bg-slate-100 p-3 rounded border border-slate-300 flex items-center justify-between gap-2 text-xs overflow-x-auto">
        <span className="font-bold text-slate-700 whitespace-nowrap">
          Quick Demo Applications:
        </span>
        <div className="flex items-center gap-2">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap ${
                selectedApp.id === app.id
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {app.applicant.fullName} ({app.status.replace(/_/g, ' ')})
            </button>
          ))}
        </div>
      </div>

      {/* 8-Stage Timeline */}
      <StatusTimeline
        application={selectedApp}
        onRectifyDeficiency={() => setIsResolveModalOpen(true)}
      />

      {/* Audit History Log */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
        <div className="bg-slate-100 p-3.5 border-b border-slate-200 flex items-center gap-2">
          <History className="w-4 h-4 text-blue-900" />
          <h3 className="font-bold text-slate-800 uppercase tracking-wider">
            Official Timestamped Audit Log for {selectedApp.id}
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {selectedApp.auditTrail.map((record) => (
            <div key={record.id} className="p-3.5 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-slate-900">{record.action}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-mono">
                    {record.actorRole}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {record.remarks}
                </p>
                <div className="text-[10px] text-slate-400 mt-1">
                  Actor: <strong className="text-slate-600">{record.actor}</strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono flex-shrink-0">
                {record.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deficiency Resolution Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden">
            <div className="bg-rose-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Deficiency Rectification Portal</h3>
              </div>
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="text-slate-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeficiencyResolved} className="p-5 space-y-4 text-xs">
              <div className="bg-rose-50 border-l-4 border-rose-600 p-3 text-rose-950">
                <strong>Current Deficiency:</strong> {selectedApp.deficiencyNotes || 'Income certificate needs valid FY 2024-25 scan.'}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Replacement Document Name:
                </label>
                <input
                  type="text"
                  value={replacementFile}
                  onChange={(e) => setReplacementFile(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded font-bold shadow"
                >
                  Upload & Resubmit to Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
