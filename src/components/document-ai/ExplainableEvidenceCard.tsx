import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Scale, FileText, ChevronRight } from 'lucide-react';

interface EvidenceItem {
  ruleLabel: string;
  ruleFormula: string;
  documentSource: string;
  extractedValue: string;
  declaredValue: string;
  status: 'SATISFIED' | 'BREACHED' | 'WARNING';
  statutoryReference: string;
}

interface ExplainableEvidenceCardProps {
  decision: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'DEFICIENCY_FLAGGED';
  evidenceList: EvidenceItem[];
  schemeName: string;
}

export const ExplainableEvidenceCard: React.FC<ExplainableEvidenceCardProps> = ({
  decision,
  evidenceList,
  schemeName
}) => {
  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden text-xs">
      {/* Header */}
      <div className="bg-[#0b2853] text-white p-3.5 border-b-2 border-amber-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <div>
            <h4 className="font-bold text-sm tracking-wide">
              Explainable AI Scrutiny & Rule Traceability
            </h4>
            <p className="text-[11px] text-slate-300">
              Transparent, statutory justification for {schemeName} (No Black-Box Decisions)
            </p>
          </div>
        </div>

        {/* Decision Badge */}
        <div>
          {decision === 'ELIGIBLE' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 text-white font-extrabold uppercase tracking-wider text-xs">
              <CheckCircle2 className="w-4 h-4" />
              DECISION: ELIGIBLE
            </span>
          )}
          {decision === 'DEFICIENCY_FLAGGED' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-600 text-white font-extrabold uppercase tracking-wider text-xs animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              DECISION: DEFICIENCY DETECTED
            </span>
          )}
          {decision === 'NOT_ELIGIBLE' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 text-rose-300 font-extrabold uppercase tracking-wider text-xs">
              DECISION: NOT ELIGIBLE
            </span>
          )}
        </div>
      </div>

      {/* Rationale and statutory evidence list */}
      <div className="p-4 space-y-3">
        <div className="text-slate-600 text-[11px]">
          The following deterministic rules were applied against verified government document fields:
        </div>

        <div className="space-y-2.5">
          {evidenceList.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                item.status === 'SATISFIED'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {item.status === 'SATISFIED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0" />
                  )}
                  <span className="font-bold text-slate-900 text-xs">
                    {item.ruleLabel}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    Rule: {item.ruleFormula}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pl-6">
                  <span>
                    <strong>Document Field:</strong> {item.documentSource}
                  </span>
                  <span>
                    <strong>Extracted Value:</strong> <span className="font-semibold text-slate-800">{item.extractedValue}</span>
                  </span>
                  <span>
                    <strong>Declared Value:</strong> <span className="font-semibold text-slate-800">{item.declaredValue}</span>
                  </span>
                </div>

                <div className="pl-6 text-[10px] text-slate-500 italic">
                  Legal Reference: {item.statutoryReference}
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex-shrink-0 self-start md:self-center">
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                    item.status === 'SATISFIED'
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-rose-200 text-rose-900'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Human Scrutiny Override Notice */}
        <div className="bg-slate-100 p-2.5 rounded border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-800" />
            <span>AI Scrutiny is assistive. Final statutory approval remains with designated MoTA Scrutiny Officers.</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Audit Rule Engine v2.4</span>
        </div>
      </div>
    </div>
  );
};
