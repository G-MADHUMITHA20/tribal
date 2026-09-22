import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, Plus, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export const ApplicantGrievancesPage: React.FC = () => {
  const { grievances, addGrievance, currentApplicantApplication } = useApp();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const [category, setCategory] = useState<any>('DOCUMENT_DEFICIENCY');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const app = currentApplicantApplication;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    addGrievance({
      applicantName: app?.applicant.fullName || 'Citizen Applicant',
      applicationId: app?.id,
      schemeName: app?.schemeName || 'MoTA Scholarship Scheme',
      category,
      subject,
      description,
      status: 'SUBMITTED',
      priority: 'HIGH',
      assignedOfficer: 'Shri Manoj Kumar (Deputy Secretary)'
    });

    setSubject('');
    setDescription('');
    setIsSubmitOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            MoTA Grievance Redressal Cell
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            Online Grievance Submission & Tracking
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Log grievances regarding document verification queries, deficiency disputes, or PFMS DBT status.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Lodge New Grievance</span>
        </button>
      </div>

      {/* Lodged Grievance Tickets List */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
        <div className="bg-slate-100 p-3.5 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider">
            My Registered Grievance Tickets
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {grievances.map((g) => (
            <div key={g.id} className="p-4 hover:bg-slate-50 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-900">{g.id}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                    {g.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400">Filed on: {g.submittedDate}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    g.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : g.status === 'UNDER_REVIEW'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {g.status.replace(/_/g, ' ')}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{g.subject}</h4>
              <p className="text-slate-600 leading-relaxed text-xs">{g.description}</p>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <span>
                  Assigned Officer: <strong className="text-slate-800">{g.assignedOfficer}</strong>
                </span>
                {g.resolutionRemarks && (
                  <span className="text-emerald-800 font-medium">
                    ✓ Official Reply: "{g.resolutionRemarks}"
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lodge New Grievance Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden">
            <div className="bg-[#0b2853] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Lodge Grievance with Ministry</h3>
              <button onClick={() => setIsSubmitOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Grievance Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-medium"
                >
                  <option value="DOCUMENT_DEFICIENCY">Document Deficiency or OCR Discrepancy</option>
                  <option value="DBT_PAYMENT_DELAY">DBT Remittance / NPCI Bank Issue</option>
                  <option value="ELIGIBILITY_REJECTION">Eligibility Interpretation Appeal</option>
                  <option value="INSTITUTE_VERIFICATION">College / Institute Nodal Officer Delay</option>
                  <option value="TECHNICAL_PORTAL">Technical Portal Issue</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject:</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete explanation including certificate references..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0b2853] text-white rounded font-bold hover:bg-[#134685]"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
