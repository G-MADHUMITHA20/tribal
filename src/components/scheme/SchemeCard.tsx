import React from 'react';
import { SchemeConfig } from '../../types/scheme';
import { getSchemeWindowStatus } from '../../utils/schemeWindow';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  Wallet,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileCheck2
} from 'lucide-react';

interface SchemeCardProps {
  scheme: SchemeConfig;
  onOpenPreCheck: (scheme: SchemeConfig) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onOpenPreCheck }) => {
  const windowStatus = getSchemeWindowStatus(scheme);

  // Category-specific icons and colors
  const getCategoryIcon = () => {
    switch (scheme.category) {
      case 'PRE_MATRIC':
        return <BookOpen className="w-6 h-6 text-blue-800" />;
      case 'POST_MATRIC':
        return <GraduationCap className="w-6 h-6 text-indigo-800" />;
      case 'NATIONAL_SCHOLARSHIP':
        return <Award className="w-6 h-6 text-amber-700" />;
      case 'NATIONAL_FELLOWSHIP':
        return <FileCheck2 className="w-6 h-6 text-emerald-800" />;
      case 'NATIONAL_OVERSEAS':
        return <Globe className="w-6 h-6 text-sky-800" />;
      case 'DBT':
        return <Wallet className="w-6 h-6 text-cyan-800" />;
      default:
        return <Award className="w-6 h-6 text-blue-800" />;
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group">
      {/* Top Banner / Category header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
          {scheme.portalCategory}
        </span>
        
        {windowStatus.state === 'OPEN' ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200" title={windowStatus.message}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            OPEN
          </span>
        ) : windowStatus.state === 'CLOSING_SOON' ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200" title={windowStatus.message}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            CLOSING SOON
          </span>
        ) : windowStatus.state === 'NOT_STARTED' ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200" title={windowStatus.message}>
            NOT YET OPEN
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200" title={windowStatus.message}>
            CLOSED
          </span>
        )}
      </div>

      <div className="px-4 pt-2 text-[10px] font-bold text-center text-slate-500 bg-slate-50 border-b border-slate-100">
        {windowStatus.message}
      </div>

      {/* Main Content */}
      <div className="p-4 flex-1">
        <div className="flex items-start gap-3 mb-2.5">
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded flex-shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
            {getCategoryIcon()}
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">
              {scheme.code}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#0b2853] leading-snug group-hover:text-blue-900">
              <Link to={`/schemes/${scheme.id}`}>
                {scheme.name}
              </Link>
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {scheme.tagline}
        </p>

        {/* Eligibility Snapshot Highlights */}
        <div className="bg-slate-50/80 rounded p-2.5 border border-slate-200 mb-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Income Ceiling:</span>
            <span className="font-semibold text-slate-800">
              {scheme.annualIncomeCap === 0
                ? 'No Upper Limit (Universal)'
                : `₹${(scheme.annualIncomeCap / 100000).toFixed(1)} Lakh / year`}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Target Group:</span>
            <span className="font-semibold text-blue-900">Scheduled Tribes (ST)</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Key Support:</span>
            <span className="font-semibold text-emerald-800 truncate max-w-[160px] text-right">
              {scheme.benefits[0]?.amount || 'Full Financial Support'}
            </span>
          </div>
        </div>

        {/* Eligibility checklist preview */}
        <div className="space-y-1 mb-2">
          {scheme.eligibilitySummary.slice(0, 2).map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
              <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Pre-check trigger */}
        <button
          onClick={() => onOpenPreCheck(scheme)}
          className="text-xs font-semibold text-blue-800 hover:text-blue-950 flex items-center justify-center gap-1 py-1 px-2 rounded hover:bg-blue-50 border border-blue-200 transition-colors"
          title="Instant AI rule-based eligibility evaluation"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Check Eligibility</span>
        </button>

        {/* View Details & Apply CTA */}
        <div className="flex items-center gap-1.5">
          <Link
            to={`/schemes/${scheme.id}`}
            className="flex-1 sm:flex-none text-center text-xs font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-100 transition-colors"
          >
            Details
          </Link>
          {windowStatus.isOpen ? (
            <Link
              to={`/applicant/apply?scheme=${scheme.id}`}
              className="flex-1 sm:flex-none text-center text-xs font-bold text-white bg-[#0b2853] hover:bg-[#134685] px-3 py-1.5 rounded shadow-sm flex items-center justify-center gap-1 transition-colors"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 sm:flex-none text-center text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded cursor-not-allowed"
              title={windowStatus.message}
            >
              Closed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
