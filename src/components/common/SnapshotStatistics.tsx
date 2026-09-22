import React from 'react';
import { Users, IndianRupee, Landmark, Zap, ShieldCheck, FileCheck } from 'lucide-react';

export const SnapshotStatistics: React.FC = () => {
  const stats = [
    {
      label: 'ST Beneficiaries Funded',
      value: '3,84,210+',
      subtext: 'Across all 6 Centrally Sponsored & Sector Schemes',
      icon: <Users className="w-5 h-5 text-blue-700" />,
      highlightColor: 'border-l-blue-600'
    },
    {
      label: 'Total DBT Disbursed',
      value: '₹1,482 Cr',
      subtext: 'Direct treasury credit via Aadhaar Payment Bridge (PFMS)',
      icon: <IndianRupee className="w-5 h-5 text-emerald-700" />,
      highlightColor: 'border-l-emerald-600'
    },
    {
      label: 'Premier Institutes Covered',
      value: '262',
      subtext: 'IITs, IIMs, AIIMS, NITs, NLUs, and National Institutes',
      icon: <Landmark className="w-5 h-5 text-indigo-700" />,
      highlightColor: 'border-l-indigo-600'
    },
    {
      label: 'AI Verification Turnaround',
      value: '< 48 Hours',
      subtext: 'Automated OCR extraction & instant deficiency feedback',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      highlightColor: 'border-l-amber-600'
    }
  ];

  return (
    <section aria-label="Portal Statistics Snapshot" className="my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#0b2853] uppercase tracking-wide">
            Performance Snapshot & DBT Metrics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time disbursement efficiency under Ministry of Tribal Affairs Direct Benefit Transfer Mission
          </p>
        </div>

        {/* Demo Data Notice Badge */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-semibold w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          Demo Data (Simulated MoTA Annual Statistics)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 rounded border border-slate-300 shadow-sm border-l-4 ${item.highlightColor} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {item.label}
              </span>
              <div className="p-1.5 bg-slate-100 rounded">
                {item.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {item.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                {item.subtext}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
