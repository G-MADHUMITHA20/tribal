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
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

export const AdminDashboardPage: React.FC = () => {
  const { applications, grievances, schemes } = useApp();

  // Metrics calculation
  const totalApps = 384210; // Demo population scale
  const pendingVerification = applications.filter((a) => a.status === 'DOC_VERIFICATION_PENDING' || a.status === 'SUBMITTED').length + 420;
  const eligibleCount = applications.filter((a) => a.status === 'DOC_VERIFIED' || a.status === 'PROPOSED_FOR_SELECTION').length + 1850;
  const deficientCount = applications.filter((a) => a.hasDeficiency).length + 312;
  const selectedCount = applications.filter((a) => a.status === 'PROPOSED_FOR_SELECTION' || a.status === 'APPROVED').length + 940;
  const disbursedCount = applications.filter((a) => a.status === 'DISBURSED_DBT').length + 382000;
  const pendingOfficerActions = applications.filter((a) => a.status === 'INSTITUTE_VERIFIED' || a.status === 'PROPOSED_FOR_SELECTION').length;

  // Chart 1: Applications by Scheme
  const dataByScheme = [
    { name: 'Pre-Matric ST', applications: 142000, sanctioned: 139500 },
    { name: 'Post-Matric ST', applications: 228000, sanctioned: 221000 },
    { name: 'National Scholarship', applications: 4800, sanctioned: 1000 },
    { name: 'National Fellowship', applications: 3900, sanctioned: 750 },
    { name: 'National Overseas', applications: 450, sanctioned: 20 },
    { name: 'DBT Direct Grants', applications: 76000, sanctioned: 74500 }
  ];

  // Chart 2: Applications by State/UT
  const dataByState = [
    { state: 'Jharkhand', applications: 68400 },
    { state: 'Madhya Pradesh', applications: 74200 },
    { state: 'Odisha', applications: 61800 },
    { state: 'Chhattisgarh', applications: 49500 },
    { state: 'Maharashtra', applications: 38200 },
    { state: 'Assam & NE', applications: 44100 },
    { state: 'Gujarat', applications: 28900 },
    { state: 'Rajasthan', applications: 19110 }
  ];

  // Chart 3: Application Status Funnel / Outcome
  const dataStatusPie = [
    { name: 'Disbursed via DBT', value: 88, color: '#10b981' },
    { name: 'Selection / Scrutiny', value: 5, color: '#0284c7' },
    { name: 'Pending Verification', value: 4, color: '#f59e0b' },
    { name: 'Deficiency Correction', value: 2, color: '#ef4444' },
    { name: 'Rejected', value: 1, color: '#64748b' }
  ];

  // Chart 4: Monthly Intake Trend
  const dataMonthly = [
    { month: 'Apr', intake: 12000, verified: 10500 },
    { month: 'May', intake: 28000, verified: 26000 },
    { month: 'Jun', intake: 65000, verified: 62000 },
    { month: 'Jul', intake: 98000, verified: 94000 },
    { month: 'Aug', intake: 115000, verified: 110000 },
    { month: 'Sep', intake: 66210, verified: 62500 }
  ];

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
          <div className="text-lg font-black text-slate-700">142</div>
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
        {/* State-wise applications */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              State / UT-wise ST Beneficiary Outreach
            </h3>
            <span className="text-[11px] text-slate-500">Top Tribal States</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByState} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 10 }} width={75} />
                <Tooltip formatter={(v: any) => Number(v).toLocaleString('en-IN')} />
                <Bar dataKey="applications" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly intake trajectory */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Monthly Intake vs AI Verification Trajectory
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold">98.2% Auto-Scrutiny</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataMonthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: any) => Number(v).toLocaleString('en-IN')} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="intake" name="Submitted" stroke="#134685" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="verified" name="OCR Verified" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
