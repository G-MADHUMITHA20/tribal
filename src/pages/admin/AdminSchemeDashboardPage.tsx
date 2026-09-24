import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getSchemeWindowStatus } from '../../utils/schemeWindow';
import {
  ArrowLeft,
  Calendar,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export const AdminSchemeDashboardPage: React.FC = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { schemes, applications } = useApp();
  const navigate = useNavigate();

  const scheme = useMemo(() => {
    return schemes.find((s) => s.id === schemeId || s.code === schemeId);
  }, [schemes, schemeId]);

  if (!scheme) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <h2 className="text-xl font-bold mb-2">Scheme Not Found</h2>
        <p className="mb-4">The scheme you are looking for does not exist or you don't have access.</p>
        <Link to="/admin" className="text-blue-700 font-bold flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Schemes
        </Link>
      </div>
    );
  }

  const windowStatus = getSchemeWindowStatus(scheme);

  const schemeApps = useMemo(() => {
    return applications.filter((a) => a.schemeCode === scheme.code || a.schemeId === scheme.id);
  }, [applications, scheme]);

  const totalApps = schemeApps.length;
  const startedCount = schemeApps.filter((a) => a.status === 'DRAFT').length;
  const submittedCount = schemeApps.filter((a) => a.status === 'SUBMITTED' || a.status === 'RESUBMITTED').length;
  const pendingVerificationCount = schemeApps.filter((a) => ['DOCUMENT_VERIFICATION', 'ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'SELECTION'].includes(a.status)).length;
  const deficientCount = schemeApps.filter((a) => a.hasDeficiency || a.status === 'DEFICIENT' || a.status === 'DEFICIENCY_NOTIFIED').length;
  const rejectedCount = schemeApps.filter((a) => a.status === 'REJECTED').length;
  const approvedCount = schemeApps.filter((a) => a.status === 'APPROVED').length;

  const handleStatClick = (statusFilter: string) => {
    navigate(`/admin/applications?scheme=${scheme.code}&status=${statusFilter}`);
  };

  const statusBreakdownData = [
    { name: 'Submitted', value: submittedCount, color: '#64748b', status: 'SUBMITTED' },
    { name: 'Pending Verification', value: pendingVerificationCount, color: '#f59e0b', status: 'DOCUMENT_VERIFICATION' }, // Mapped to the earliest pending state
    { name: 'Deficient', value: deficientCount, color: '#ef4444', status: 'DEFICIENT' },
    { name: 'Rejected', value: rejectedCount, color: '#475569', status: 'REJECTED' },
    { name: 'Approved', value: approvedCount, color: '#10b981', status: 'APPROVED' },
  ].filter((d) => d.value > 0);

  const pipelineStages = [
    { label: 'Started / Draft', count: startedCount, color: 'bg-slate-100 border-slate-300 text-slate-700', status: 'DRAFT' },
    { label: 'Submitted', count: submittedCount, color: 'bg-blue-50 border-blue-200 text-blue-800', status: 'SUBMITTED' },
    { label: 'Pending Verification', count: pendingVerificationCount, color: 'bg-amber-50 border-amber-200 text-amber-800', status: 'DOCUMENT_VERIFICATION' },
    { label: 'Deficient', count: deficientCount, color: 'bg-rose-50 border-rose-200 text-rose-800', status: 'DEFICIENT' },
    { label: 'Approved & Disbursed', count: approvedCount, color: 'bg-emerald-50 border-emerald-200 text-emerald-800', status: 'APPROVED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm">
        <Link to="/admin" className="text-blue-700 hover:text-blue-900 font-bold text-xs inline-block mb-3">
          <ArrowLeft className="w-3.5 h-3.5 mr-1 align-middle" /> Back to Schemes
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                {scheme.code}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                windowStatus.state === 'OPEN' ? 'bg-emerald-100 text-emerald-800' :
                windowStatus.state === 'CLOSING_SOON' ? 'bg-amber-100 text-amber-800' :
                windowStatus.state === 'NOT_STARTED' ? 'bg-slate-200 text-slate-700' :
                'bg-rose-100 text-rose-800'
              }`}>
                {windowStatus.state.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
              {scheme.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: <strong className="text-slate-800">{scheme.applicationDeadline || 'No Deadline'}</strong></span>
              <span>Category: <strong className="text-slate-800">{scheme.category.replace('_', ' ')}</strong></span>
            </p>
          </div>
          <button
            onClick={() => navigate(`/admin/applications?scheme=${scheme.code}`)}
            className="px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>View All Applications</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div onClick={() => handleStatClick('ALL')} className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-blue-800 cursor-pointer hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Total Apps</span>
          <div className="text-lg font-black text-slate-900">{totalApps.toLocaleString('en-IN')}</div>
        </div>

        <div onClick={() => handleStatClick('SUBMITTED')} className="bg-white p-3 rounded border border-slate-300 shadow-sm border-t-4 border-t-blue-500 cursor-pointer hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Submitted</span>
          <div className="text-lg font-black text-blue-700">{submittedCount.toLocaleString('en-IN')}</div>
        </div>

        <div onClick={() => handleStatClick('DOCUMENT_VERIFICATION')} className="bg-amber-50 p-3 rounded border border-amber-200 shadow-sm border-t-4 border-t-amber-500 cursor-pointer hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Pending Check</span>
          <div className="text-lg font-black text-amber-900">{pendingVerificationCount.toLocaleString('en-IN')}</div>
        </div>

        <div onClick={() => handleStatClick('DEFICIENT')} className="bg-rose-50 p-3 rounded border border-rose-200 shadow-sm border-t-4 border-t-rose-500 cursor-pointer hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">Deficient</span>
          <div className="text-lg font-black text-rose-900">{deficientCount.toLocaleString('en-IN')}</div>
        </div>

        <div onClick={() => handleStatClick('APPROVED')} className="bg-emerald-50 p-3 rounded border border-emerald-200 shadow-sm border-t-4 border-t-emerald-500 cursor-pointer hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Approved/DBT</span>
          <div className="text-lg font-black text-emerald-900">{approvedCount.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline / Funnel */}
        <div className="lg:col-span-2 bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Application Status Pipeline
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {pipelineStages.map((stage, i) => (
              <div key={i} className="flex items-center">
                <div onClick={() => handleStatClick(stage.status)} className={`flex-1 flex items-center justify-between px-4 py-2.5 rounded border cursor-pointer hover:opacity-80 transition-opacity ${stage.color}`}>
                  <span className="font-bold text-xs uppercase">{stage.label}</span>
                  <span className="text-sm font-black">{stage.count.toLocaleString('en-IN')}</span>
                </div>
                {i < pipelineStages.length - 1 && (
                  <div className="px-2">
                    <div className="w-px h-6 bg-slate-300 mx-auto"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Chart */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Status Breakdown
          </h3>
          <div className="h-64">
            {statusBreakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(data, index) => {
                      if (data?.payload?.status) handleStatClick(data.payload.status);
                    }}
                    className="cursor-pointer"
                  >
                    {statusBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => Number(value ?? 0).toLocaleString('en-IN')} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No active applications yet.
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
            {statusBreakdownData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 cursor-pointer hover:opacity-80" onClick={() => handleStatClick(d.status)}>
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-700 font-medium">{d.name}</span>
                <span className="text-slate-500 ml-auto font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-800" />
            Recent Applications
          </h3>
          <button
            onClick={() => navigate(`/admin/applications?scheme=${scheme.code}`)}
            className="text-[11px] text-blue-700 hover:text-blue-900 font-bold"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3">Application ID</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">State</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schemeApps.slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-900">
                    <button onClick={() => navigate(`/admin/applications?scheme=${scheme.code}&app=${app.id}`)} className="hover:underline">
                      {app.id}
                    </button>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{app.applicant.fullName}</td>
                  <td className="p-3 text-slate-600">{app.applicant.state || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'DEFICIENT' ? 'bg-rose-100 text-rose-800' :
                      app.status === 'REJECTED' ? 'bg-slate-200 text-slate-700' :
                      ['DOCUMENT_VERIFICATION', 'ELIGIBILITY_VERIFICATION', 'SCRUTINY', 'SELECTION'].includes(app.status) ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono text-[10px]">{app.lastUpdated}</td>
                </tr>
              ))}
              {schemeApps.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    No applications submitted for this scheme yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
