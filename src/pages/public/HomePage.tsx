import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchemeConfig } from '../../types/scheme';
import { SchemeCard } from '../../components/scheme/SchemeCard';
import { SmartSchemeSearch } from '../../components/scheme/SmartSchemeSearch';
import { EligibilityPreCheckModal } from '../../components/scheme/EligibilityPreCheckModal';
import { SnapshotStatistics } from '../../components/common/SnapshotStatistics';
import { ResourceSection } from '../../components/common/ResourceSection';
import {
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Award,
  ShieldCheck,
  Building2,
  Globe2,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { schemes, language } = useApp();
  const [selectedSchemeForPreCheck, setSelectedSchemeForPreCheck] = useState<SchemeConfig | null>(null);
  const [isPreCheckOpen, setIsPreCheckOpen] = useState(false);
  const [displayedSchemes, setDisplayedSchemes] = useState<SchemeConfig[]>(schemes);

  const handleOpenPreCheck = (scheme: SchemeConfig) => {
    setSelectedSchemeForPreCheck(scheme);
    setIsPreCheckOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero / Introduction Section */}
      <section className="bg-gradient-to-r from-[#0b2853] via-[#134685] to-[#1d63b8] text-white rounded-lg shadow-md border-b-4 border-amber-500 overflow-hidden relative p-6 sm:p-8">
        {/* Subtle decorative watermark */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <svg viewBox="0 0 100 120" className="w-64 h-64 text-white" fill="currentColor">
            <circle cx="50" cy="20" r="10" />
            <path d="M35,32 Q50,26 65,32 L60,65 Q50,68 40,65 Z" />
            <rect x="42" y="66" width="16" height="18" />
            <circle cx="50" cy="94" r="10" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          {/* Official badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Ministry of Tribal Affairs • National Scholarship Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2">
            Scholarship & Fellowship Schemes
          </h1>
          <p className="text-base sm:text-lg text-slate-200 font-medium mb-6 leading-relaxed">
            Financial assistance and fellowship opportunities for Scheduled Tribe students across secondary, professional, research, and international higher education.
          </p>

          {/* Core CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#schemes-list"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded shadow-md text-xs sm:text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/applicant/apply"
              className="bg-white hover:bg-slate-100 text-[#0b2853] font-bold px-5 py-2.5 rounded shadow-md text-xs sm:text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Apply Now</span>
            </Link>

            <Link
              to="/applicant/status"
              className="bg-blue-900/60 hover:bg-blue-900 text-white font-semibold px-4 py-2.5 rounded border border-blue-400/40 text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Track Application</span>
            </Link>
          </div>

          {/* Key Trust Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-700/60 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>262 Premier Institutes</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>750 Ph.D. Fellowships</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-400" />
              <span>QS Top 500 Overseas</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Document Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Scheme Search Component */}
      <SmartSchemeSearch
        onFilteredResultsChange={(results) => setDisplayedSchemes(results)}
        onOpenPreCheck={handleOpenPreCheck}
      />

      {/* Flagship Schemes Section */}
      <section id="schemes-list" aria-label="MoTA Flagship Scholarship Schemes">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight uppercase">
              MoTA Flagship Schemes (Centrally Sponsored & Central Sector)
            </h2>
            <p className="text-xs text-slate-500">
              One Unified Architecture powering all 6 scholarship categories through dynamic rule evaluation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              Showing {displayedSchemes.length} Schemes
            </span>
          </div>
        </div>

        {/* 6 Major Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onOpenPreCheck={handleOpenPreCheck}
            />
          ))}
        </div>
      </section>

      {/* Statistics & Snapshot Section */}
      <SnapshotStatistics />

      {/* Official Resources, Guidelines & Results */}
      <ResourceSection />

      {/* AI Eligibility Pre-Check Modal */}
      <EligibilityPreCheckModal
        scheme={selectedSchemeForPreCheck}
        isOpen={isPreCheckOpen}
        onClose={() => setIsPreCheckOpen(false)}
      />
    </div>
  );
};
