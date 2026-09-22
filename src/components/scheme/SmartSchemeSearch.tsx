import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchemeConfig } from '../../types/scheme';
import { Filter, Search, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SmartSchemeSearchProps {
  onFilteredResultsChange?: (results: SchemeConfig[]) => void;
  onOpenPreCheck: (scheme: SchemeConfig) => void;
}

export const SmartSchemeSearch: React.FC<SmartSchemeSearchProps> = ({ onFilteredResultsChange, onOpenPreCheck }) => {
  const { schemes } = useApp();

  // Filters state
  const [educationLevel, setEducationLevel] = useState<string>('ALL');
  const [incomeRange, setIncomeRange] = useState<string>('ALL');
  const [schemeCategory, setSchemeCategory] = useState<string>('ALL');
  const [stateUt, setStateUt] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Filter evaluation logic
  const filteredSchemes = schemes.filter((scheme) => {
    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (
        scheme.name.toLowerCase().includes(q) ||
        scheme.description.toLowerCase().includes(q) ||
        scheme.code.toLowerCase().includes(q) ||
        scheme.portalCategory.toLowerCase().includes(q)
      );
      if (!matchText) return false;
    }

    // Category
    if (schemeCategory !== 'ALL' && scheme.category !== schemeCategory) {
      return false;
    }

    // Education Level
    if (educationLevel !== 'ALL') {
      if (!scheme.educationLevels.includes(educationLevel as any)) {
        return false;
      }
    }

    // Income Range
    if (incomeRange !== 'ALL') {
      const limit = scheme.annualIncomeCap;
      if (incomeRange === 'BELOW_2_5L') {
        // Fits into schemes with <= 2.5L cap or no cap
        // All schemes allow below 2.5L
      } else if (incomeRange === '2_5L_TO_6L') {
        // Excludes pre-matric / post-matric that have 2.5L cap
        if (limit > 0 && limit <= 250000) return false;
      } else if (incomeRange === 'ABOVE_6L') {
        // Only schemes with no cap (0) allow above 6L (e.g. National Fellowship)
        if (limit > 0) return false;
      }
    }

    return true;
  });

  const handleReset = () => {
    setEducationLevel('ALL');
    setIncomeRange('ALL');
    setSchemeCategory('ALL');
    setStateUt('ALL');
    setSearchQuery('');
    setHasSearched(false);
    if (onFilteredResultsChange) {
      onFilteredResultsChange(schemes);
    }
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (onFilteredResultsChange) {
      onFilteredResultsChange(filteredSchemes);
    }
  };

  const statesList = [
    'All States / UTs (Pan India)',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Chhattisgarh',
    'Gujarat',
    'Jharkhand',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Rajasthan',
    'Tripura',
    'West Bengal'
  ];

  return (
    <section aria-label="Find the right scholarship" className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-[#0b2853] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-500">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="font-bold text-sm sm:text-base tracking-wide uppercase">
              Find the Right Scholarship (Smart Scheme Discovery)
            </h2>
            <p className="text-[11px] text-slate-300">
              Select your academic and financial criteria to instantly identify MoTA schemes for which you are eligible.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Filters</span>
        </button>
      </div>

      {/* Filter Form Controls */}
      <form onSubmit={handleApplyFilter} className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Filter 1: Education Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              1. I am currently studying:
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
            >
              <option value="ALL">All Education Levels</option>
              <option value="CLASS_9_10">School Student (Class 9 & 10)</option>
              <option value="CLASS_11_12">Higher Secondary (Class 11 & 12)</option>
              <option value="UNDERGRADUATE">College Undergraduate (B.Tech, MBBS, B.Sc, BA)</option>
              <option value="POSTGRADUATE">Postgraduate / Masters (M.Tech, MBA, M.Sc)</option>
              <option value="MPHIL_PHD">Doctoral / Research (M.Phil / Ph.D.)</option>
              <option value="OVERSEAS_POSTGRADUATE">Studies Abroad (World Top 500)</option>
            </select>
          </div>

          {/* Filter 2: Annual Family Income */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              2. Annual Family Income:
            </label>
            <select
              value={incomeRange}
              onChange={(e) => setIncomeRange(e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
            >
              <option value="ALL">Any Annual Income</option>
              <option value="BELOW_2_5L">Up to ₹2,50,000 / year (Priority ST Bracket)</option>
              <option value="2_5L_TO_6L">₹2,50,001 to ₹6,00,000 / year</option>
              <option value="ABOVE_6L">Above ₹6,00,000 / year (Universal Research Scheme)</option>
            </select>
          </div>

          {/* Filter 3: Scheme Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              3. Scheme Category:
            </label>
            <select
              value={schemeCategory}
              onChange={(e) => setSchemeCategory(e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="PRE_MATRIC">Pre-Matric Schemes</option>
              <option value="POST_MATRIC">Post-Matric Schemes</option>
              <option value="NATIONAL_SCHOLARSHIP">Top Class Premier Institutes</option>
              <option value="NATIONAL_FELLOWSHIP">National Research Fellowships</option>
              <option value="NATIONAL_OVERSEAS">National Overseas (Abroad)</option>
              <option value="DBT">Direct Benefit Transfer (DBT)</option>
            </select>
          </div>

          {/* Filter 4: State / Domicile */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              4. Domicile State / UT:
            </label>
            <select
              value={stateUt}
              onChange={(e) => setStateUt(e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input and submit buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Keyword (e.g. Fellowship, IIT, Overseas, Hosteller)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2 text-xs font-bold text-white bg-[#0b2853] hover:bg-[#134685] rounded shadow-sm flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Find Eligible Schemes</span>
            </button>
          </div>
        </div>
      </form>

      {/* Real-time Results Banner */}
      <div className="px-5 py-3 bg-white flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">
            Matching Schemes: <span className="text-blue-900 font-extrabold text-sm">{filteredSchemes.length}</span> of {schemes.length}
          </span>
          {hasSearched && (
            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Filters Applied
            </span>
          )}
        </div>

        <div className="text-slate-500 text-[11px]">
          Target Beneficiary: <strong className="text-slate-800">Scheduled Tribe (ST) Students of India</strong>
        </div>
      </div>
    </section>
  );
};
