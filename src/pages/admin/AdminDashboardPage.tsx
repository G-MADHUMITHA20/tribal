import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  UserPlus,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSchemeWindowStatus } from '../../utils/schemeWindow';

export const AdminDashboardPage: React.FC = () => {
  const { applications, schemes, auditLogs } = useApp();
  const navigate = useNavigate();

  // Recent Activity
  const recentActivity = auditLogs
    .filter(log => ['Application Started', 'New Application Submitted', 'Application Submitted', 'Application Resubmitted', 'Application Approved', 'Application Rejected'].includes(log.action))
    .slice(0, 8);

  // Scheme Stats
  const schemeStats = schemes.map(s => {
    const schemeApps = applications.filter(a => a.schemeCode === s.code || a.schemeId === s.id);
    const windowStatus = getSchemeWindowStatus(s);
    return {
      scheme: s,
      windowStatus,
      total: schemeApps.length,
      submitted: schemeApps.filter(a => a.status === 'SUBMITTED' || a.status === 'RESUBMITTED').length,
      pending: schemeApps.filter(a => ['DOCUMENT_VERIFICATION', 'ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'SELECTION'].includes(a.status)).length,
      eligible: schemeApps.filter(a => ['ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'SELECTION', 'APPROVED'].includes(a.status)).length,
      deficient: schemeApps.filter(a => a.hasDeficiency || a.status === 'DEFICIENT' || a.status === 'DEFICIENCY_NOTIFIED').length,
      approved: schemeApps.filter(a => a.status === 'APPROVED').length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Executive Analytics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-500" />
            Scholarship & Fellowship Schemes
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Select a scheme to view specific analytics, application pipelines, and perform official scrutiny.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Scheme Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schemeStats.map(stat => (
              <div key={stat.scheme.id} className="bg-white border border-slate-300 rounded p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{stat.scheme.code}</div>
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      stat.windowStatus.state === 'OPEN' ? 'bg-emerald-100 text-emerald-800' :
                      stat.windowStatus.state === 'CLOSING_SOON' ? 'bg-amber-100 text-amber-800' :
                      stat.windowStatus.state === 'NOT_STARTED' ? 'bg-slate-200 text-slate-700' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {stat.windowStatus.state.replace('_', ' ')}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#0b2853] mb-1 line-clamp-2">{stat.scheme.name}</h3>
                  <div className="text-[10px] text-slate-500 mb-3 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {stat.scheme.applicationDeadline ? `Deadline: ${stat.scheme.applicationDeadline}` : 'No Deadline'}
                  </div>
                </div>

                <div className="mt-2 mb-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 flex flex-col items-center">
                    <span className="text-slate-500 text-[9px] uppercase font-bold text-center">Total</span>
                    <span className="font-black text-slate-800">{stat.total}</span>
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-100 flex flex-col items-center">
                    <span className="text-amber-700 text-[9px] uppercase font-bold text-center">Pending</span>
                    <span className="font-black text-amber-900">{stat.pending}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded border border-emerald-100 flex flex-col items-center">
                    <span className="text-emerald-700 text-[9px] uppercase font-bold text-center">Eligible</span>
                    <span className="font-black text-emerald-900">{stat.eligible}</span>
                  </div>
                  <div className="bg-blue-50 p-2 rounded border border-blue-100 flex flex-col items-center">
                    <span className="text-blue-700 text-[9px] uppercase font-bold text-center">Submitted</span>
                    <span className="font-black text-blue-900">{stat.submitted}</span>
                  </div>
                  <div className="bg-rose-50 p-2 rounded border border-rose-100 flex flex-col items-center">
                    <span className="text-rose-700 text-[9px] uppercase font-bold text-center">Deficient</span>
                    <span className="font-black text-rose-900">{stat.deficient}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded border border-emerald-100 flex flex-col items-center">
                    <span className="text-emerald-700 text-[9px] uppercase font-bold text-center">Approved</span>
                    <span className="font-black text-emerald-900">{stat.approved}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/admin/schemes/${stat.scheme.id}`)}
                  className="w-full py-2 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statutory Notice */}
          <div className="bg-amber-50 p-4 rounded border border-amber-200 shadow-sm text-amber-900 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Statutory Notice
            </div>
            <p>
              All application approvals, rejections, and scrutiny actions are cryptographically logged with IP and Aadhaar digital token. Access is restricted to authorized Nodal Officers.
            </p>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                System Activity Log
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Real-time</span>
            </div>
            <div className="h-96 overflow-y-auto pr-2">
              {recentActivity.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                  No recent activity recorded.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map(log => (
                    <div key={log.id} className="flex gap-3 text-sm">
                      <div className="mt-0.5">
                        {log.action.includes('Started') ? <UserPlus className="w-4 h-4 text-blue-500" /> :
                         log.action.includes('Resubmitted') ? <RotateCcw className="w-4 h-4 text-amber-500" /> :
                         log.action.includes('Submitted') ? <FileText className="w-4 h-4 text-slate-500" /> :
                         log.action.includes('Approved') ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                         <XCircle className="w-4 h-4 text-rose-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{log.action}</p>
                        <p className="text-[11px] text-slate-500">
                          {log.actor} • <span className="font-mono text-blue-800">{log.applicationId}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {log.schemeCode}
                        </p>
                      </div>
                      <div className="text-[9px] text-slate-400 whitespace-nowrap">
                        {log.timestamp.substring(11, 16)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
