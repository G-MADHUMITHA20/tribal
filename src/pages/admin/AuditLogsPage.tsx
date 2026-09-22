import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, Filter, ShieldCheck, Download } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (roleFilter !== 'ALL' && log.role !== roleFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.applicationId.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Digital Accountability
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cryptographic Audit Chain Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            System Audit Trail & State Transitions
          </h1>
          <p className="text-slate-600 mt-0.5">
            Tamper-evident logs of all officer actions, deficiency issuances, AI OCR validations, and status overrides.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting Official Cryptographic Audit Trail CSV/PDF')}
          className="px-4 py-2 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search Actor, App ID, Action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded font-medium"
          >
            <option value="ALL">All Roles</option>
            <option value="OFFICER">Officers Only</option>
            <option value="ADMIN">Admins Only</option>
            <option value="SYSTEM_AI">System AI Engine</option>
            <option value="APPLICANT">Applicants</option>
          </select>
        </div>

        <span className="text-slate-500 text-[11px]">
          Total Audit Records: <strong>{filteredLogs.length}</strong>
        </span>
      </div>

      {/* Audit Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#0b2853] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left font-bold uppercase">User / Actor</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Role</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Action</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Application ID</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Previous Status</th>
                <th className="px-4 py-3 text-left font-bold uppercase">New Status</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Reason / Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.role === 'OFFICER'
                          ? 'bg-indigo-100 text-indigo-900'
                          : log.role === 'SYSTEM_AI'
                          ? 'bg-amber-100 text-amber-900'
                          : log.role === 'ADMIN'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {log.applicationId}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {log.previousStatus}
                  </td>
                  <td className="px-4 py-3 text-emerald-800 font-mono font-bold text-[11px] whitespace-nowrap">
                    {log.newStatus}
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs">
                    {log.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
