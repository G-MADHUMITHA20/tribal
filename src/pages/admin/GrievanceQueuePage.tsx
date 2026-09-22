import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GrievanceRecord } from '../../data/mockGrievances';
import { HelpCircle, CheckCircle, Clock, MessageSquare, ShieldAlert } from 'lucide-react';

export const GrievanceQueuePage: React.FC = () => {
  const { grievances, updateGrievanceStatus, currentUser } = useApp();
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);
  const [resolutionText, setResolutionText] = useState<string>('');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance || !resolutionText.trim()) return;

    updateGrievanceStatus(selectedGrievance.id, 'RESOLVED', resolutionText);
    setSelectedGrievance(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Tribal Citizen Redressal System
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            Officer Grievance Redressal Desk
          </h1>
          <p className="text-slate-600 mt-0.5">
            Examine applicant appeals regarding document deficiencies, DBT delays, and portal operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded font-bold">
            Open Grievances: {grievances.filter((g) => g.status !== 'RESOLVED').length}
          </span>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#0b2853] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase">Ticket ID</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Applicant Name</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Category</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Subject & Details</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Filed Date</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Priority</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Status</th>
                <th className="px-4 py-3 text-right font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {grievances.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {g.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                    {g.applicantName}
                    {g.applicationId && (
                      <div className="text-[10px] text-slate-500 font-mono">{g.applicationId}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                      {g.category.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800 line-clamp-1">{g.subject}</div>
                    <div className="text-slate-500 text-[11px] line-clamp-1">{g.description}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {g.submittedDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        g.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {g.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        g.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'UNDER_REVIEW'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {g.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedGrievance(g)}
                      className="px-3 py-1.5 bg-[#0b2853] hover:bg-[#134685] text-white font-bold rounded shadow-sm"
                    >
                      Process Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Grievance Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden">
            <div className="bg-[#0b2853] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Grievance Resolution: {selectedGrievance.id}</h3>
              <button onClick={() => setSelectedGrievance(null)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleResolve} className="p-5 space-y-4">
              <div>
                <span className="text-slate-500 font-medium block">Applicant & Subject:</span>
                <strong className="text-slate-900 text-sm">{selectedGrievance.applicantName}</strong>
                <p className="text-slate-700 font-semibold mt-1">{selectedGrievance.subject}</p>
                <div className="p-2.5 bg-slate-100 rounded text-slate-600 mt-2">
                  {selectedGrievance.description}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Ministry Resolution / Instructions to Applicant:
                </label>
                <textarea
                  rows={4}
                  required
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Enter official resolution, time extension granted, or DBT re-seeding instructions..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow"
                >
                  Mark as Resolved & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
