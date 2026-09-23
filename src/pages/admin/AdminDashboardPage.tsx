import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  Wallet,
  ShieldAlert,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSchemeWindowStatus } from '../../utils/schemeWindow';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';

export const AdminDashboardPage: React.FC = () => {
  const { applications, schemes, auditLogs } = useApp();

  // Metrics calculation
  const totalApps = applications.length;
  const pendingVerification = applications.filter((a) => ['DOCUMENT_VERIFICATION', 'SUBMITTED', 'RESUBMITTED'].includes(a.status)).length;
  const eligibleCount = applications.filter((a) => ['ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'SELECTION'].includes(a.status)).length;
  const deficientCount = applications.filter((a) => a.hasDeficiency || a.status === 'DEFICIENT').length;
  const selectedCount = applications.filter((a) => ['SELECTION', 'APPROVED'].includes(a.status)).length;
  const disbursedCount = applications.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;
  const pendingOfficerActions = applications.filter((a) => ['DOCUMENT_VERIFICATION', 'ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'SELECTION'].includes(a.status)).length;

  // Chart 1: Applications by Scheme
  const dataByScheme = schemes.map(s => {
    const schemeApps = applications.filter(a => a.schemeCode === s.code || a.schemeId === s.id);
    return {
      name: s.shortName || s.name,
      applications: schemeApps.length,
      sanctioned: schemeApps.filter(a => a.status === 'APPROVED').length
    };
  });

  // Recent Activity
  const recentActivity = auditLogs
    .filter(log => ['Application Started', 'New Application Submitted', 'Application Submitted', 'Application Resubmitted', 'Application Approved', 'Application Rejected'].includes(log.action))
    .slice(0, 8);

  // Chart 3: Application Status Funnel / Outcome
  const dataStatusPie = [
    { name: 'Disbursed via DBT', value: 88, color: '#10b981' },
    { name: 'Selection / Scrutiny', value: 5, color: '#0284c7' },
    { name: 'Pending Verification', value: 4, color: '#f59e0b' },
    { name: 'Deficiency Correction', value: 2, color: '#ef4444' },
    { name: 'Rejected', value: 1, color: '#64748b' }
  ];

  // Scheme Deadlines
  const schemeDeadlines = schemes.map(s => {
    const status = getSchemeWindowStatus(s);
    const schemeApps = applications.filter(a => a.schemeCode === s.code || a.schemeId === s.id).length;
    return {
      id: s.id,
      name: s.shortName || s.name,
      code: s.code,
      deadline: s.applicationDeadline || 'No Deadline',
      apps: schemeApps,
      status
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
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              Demo Portal Prototype Data
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            Administrative Dashboard & Decision Support
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time monitoring across 6 schemes, state nodal scrutiny, AI OCR verification, and PFMS disbursement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/applications"
            className="px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow flex items-center gap-1.5"
          >
            <span>Open Application Scrutiny Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 8 Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-blue-800">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Total Applied</span>
          <div className="text-lg font-black text-slate-900">{totalApps.toLocaleString('en-IN')}</div>
          <span className="text-[9px] text-slate-500">Pan-India ST</span>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-amber-500">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pending Check</span>
          <div className="text-lg font-black text-amber-700">{pendingVerification}</div>
          <span className="text-[9px] text-slate-500">AI / INO Queue</span>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-emerald-600">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Eligible</span>
          <div className="text-lg font-black text-emerald-700">{eligibleCount}</div>
          <span className="text-[9px] text-slate-500">Rules Passed</span>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-rose-500">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deficient</span>
          <div className="text-lg font-black text-rose-700">{deficientCount}</div>
          <span className="text-[9px] text-rose-600 font-semibold">Action Sent</span>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-slate-500">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Rejected</span>
          <div className="text-lg font-black text-slate-700">{rejectedCount}</div>
          <span className="text-[9px] text-slate-500">Non-ST/Cap</span>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-indigo-600">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Selected</span>
          <div className="text-lg font-black text-indigo-800">{selectedCount}</div>
          <span className="text-[9px] text-slate-500">Merit Roster</span>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-emerald-700">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Disbursed</span>
          <div className="text-lg font-black text-emerald-900">{disbursedCount.toLocaleString('en-IN')}</div>
          <span className="text-[9px] text-emerald-700 font-semibold">PFMS Success</span>
        </div>

        <div className="bg-amber-50 p-3 rounded border border-amber-300 shadow-sm border-t-4 border-t-amber-600">
          <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">Officer Action</span>
          <div className="text-lg font-black text-amber-950">{pendingOfficerActions}</div>
          <span className="text-[9px] text-amber-800 font-bold">Pending Sign</span>
        </div>
      </div>

      {/* Row 1 Charts: Applications by Scheme + Application Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: By Scheme Bar Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Applications & Sanctions by Flagship Scheme
            </h3>
            <span className="text-[11px] text-slate-500">AY 2025-26</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByScheme} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => Number(val).toLocaleString('en-IN')} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="applications" name="Total Applied" fill="#134685" radius={[3, 3, 0, 0]} />
                <Bar dataKey="sanctioned" name="Sanctioned (DBT)" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Breakdown Pie */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Overall Status Breakdown (%)
            </h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatusPie}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name ? String(name).split(' ')[0] : ''} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  labelLine={false}
                >
                  {dataStatusPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t border-slate-200">
            {dataStatusPie.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600 truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: State-wise Distribution + Monthly Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme Application Windows */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-800" />
              Scheme Application Windows
            </h3>
          </div>
          <div className="h-60 overflow-y-auto pr-2 space-y-3">
            {schemeDeadlines.map((sd) => (
              <div key={sd.id} className="p-3 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0b2853] mb-0.5">{sd.name}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span>{sd.apps} Applications</span>
                    {sd.deadline !== 'No Deadline' && (
                      <span>Deadline: {sd.deadline}</span>
                    )}
                  </div>
                </div>
                <div>
                  {sd.status.state === 'OPEN' && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      OPEN
                    </span>
                  )}
                  {sd.status.state === 'CLOSING_SOON' && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                      CLOSING SOON
                    </span>
                  )}
                  {sd.status.state === 'NOT_STARTED' && (
                    <span className="px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">
                      NOT OPEN YET
                    </span>
                  )}
                  {sd.status.state === 'CLOSED' && (
                    <span className="px-2 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">
                      CLOSED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly intake trajectory replaced with Recent Activity */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recent Application Activity
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold">Real-time Stream</span>
          </div>
          <div className="h-60 overflow-y-auto pr-2">
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
                      <p className="text-xs text-slate-500">
                        {log.actor} • <span className="font-mono text-blue-800">{log.applicationId}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {log.schemeCode}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400 whitespace-nowrap">
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
  );
};
