import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchemeCard } from '../../components/scheme/SchemeCard';
import { SmartSchemeSearch } from '../../components/scheme/SmartSchemeSearch';
import { EligibilityPreCheckModal } from '../../components/scheme/EligibilityPreCheckModal';
import { SchemeConfig } from '../../types/scheme';
import { Layers } from 'lucide-react';

export const SchemesPage: React.FC = () => {
  const { schemes } = useApp();
  const [displayedSchemes, setDisplayedSchemes] = useState<SchemeConfig[]>(schemes);
  const [selectedScheme, setSelectedScheme] = useState<SchemeConfig | null>(null);
  const [isPreCheckOpen, setIsPreCheckOpen] = useState<boolean>(false);

  const handleOpenPreCheck = (scheme: SchemeConfig) => {
    setSelectedScheme(scheme);
    setIsPreCheckOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-300 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-1">
          <Layers className="w-4 h-4 text-amber-500" />
          <span>Ministry of Tribal Affairs Schemes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b2853] tracking-tight">
          All Scholarship & Fellowship Schemes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Explore all centrally sponsored and central sector financial assistance schemes for Scheduled Tribe students.
        </p>
      </div>

      {/* Smart Search */}
      <SmartSchemeSearch
        onFilteredResultsChange={(results) => setDisplayedSchemes(results)}
        onOpenPreCheck={handleOpenPreCheck}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSchemes.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            onOpenPreCheck={handleOpenPreCheck}
          />
        ))}
      </div>

      {/* Pre-Check Modal */}
      <EligibilityPreCheckModal
        scheme={selectedScheme}
        isOpen={isPreCheckOpen}
        onClose={() => setIsPreCheckOpen(false)}
      />
    </div>
  );
};
