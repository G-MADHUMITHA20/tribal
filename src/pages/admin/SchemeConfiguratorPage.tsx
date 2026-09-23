import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchemeConfig, EligibilityCriterion, RequiredDocument } from '../../types/scheme';
import {
  Sliders,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  FileCode,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const SchemeConfiguratorPage: React.FC = () => {
  const { schemes, updateScheme, currentUser } = useApp();

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0].id);
  const scheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  // Editable configuration state
  const [schemeName, setSchemeName] = useState<string>(scheme.name);
  const [schemeCode, setSchemeCode] = useState<string>(scheme.code);
  const [tagline, setTagline] = useState<string>(scheme.tagline);
  const [annualIncomeCap, setAnnualIncomeCap] = useState<number>(scheme.annualIncomeCap);
  const [minAcademicPercentage, setMinAcademicPercentage] = useState<number>(scheme.minAcademicPercentage || 45);
  const [applicationStartDate, setApplicationStartDate] = useState<string>(scheme.applicationStartDate || '');
  const [applicationDeadline, setApplicationDeadline] = useState<string>(scheme.applicationDeadline);
  const [isOpen, setIsOpen] = useState<boolean>(scheme.isOpen);

  // Structured rules
  const [rules, setRules] = useState<EligibilityCriterion[]>(scheme.eligibilityRules);

  // New rule builder form
  const [newRuleField, setNewRuleField] = useState<string>('annualFamilyIncome');
  const [newRuleLabel, setNewRuleLabel] = useState<string>('Parental Annual Income Limit');
  const [newRuleOperator, setNewRuleOperator] = useState<EligibilityCriterion['operator']>('LESS_THAN_OR_EQUAL');
  const [newRuleValue, setNewRuleValue] = useState<string>('250000');
  const [newRuleExplanation, setNewRuleExplanation] = useState<string>('Family income must not exceed threshold.');

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isProtected = scheme.isDatasetOriginal;

  // Synchronize fields when selecting another scheme
  const handleSelectScheme = (id: string) => {
    const s = schemes.find((item) => item.id === id);
    if (s) {
      setSelectedSchemeId(s.id);
      setSchemeName(s.name);
      setSchemeCode(s.code);
      setTagline(s.tagline);
      setAnnualIncomeCap(s.annualIncomeCap);
      setMinAcademicPercentage(s.minAcademicPercentage || 45);
      setApplicationStartDate(s.applicationStartDate || '');
      setApplicationDeadline(s.applicationDeadline);
      setIsOpen(s.isOpen);
      setRules(s.eligibilityRules);
      setSaveError(null);
    }
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProtected) return;
    const newCriterion: EligibilityCriterion = {
      id: 'RULE_CUSTOM_' + Math.floor(1000 + Math.random() * 9000),
      field: newRuleField,
      label: newRuleLabel,
      operator: newRuleOperator,
      value: isNaN(Number(newRuleValue)) ? newRuleValue : Number(newRuleValue),
      explanation: newRuleExplanation
    };

    setRules((prev) => [...prev, newCriterion]);
    setNewRuleLabel('');
    setNewRuleExplanation('');
  };

  const handleDeleteRule = (id: string) => {
    if (isProtected) return;
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveConfiguration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProtected) {
      setSaveError('Cannot save changes to a protected dataset scheme.');
      return;
    }
    setIsSaving(true);
    setSaveError(null);

    const updatedConfig: SchemeConfig = {
      ...scheme,
      name: schemeName,
      code: schemeCode,
      tagline,
      annualIncomeCap: Number(annualIncomeCap),
      minAcademicPercentage: Number(minAcademicPercentage),
      applicationStartDate: applicationStartDate || undefined,
      applicationDeadline,
      isOpen,
      eligibilityRules: rules
    };

    try {
      await updateScheme(updatedConfig);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to persist scheme configuration to database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Core Architectural Innovation
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              ONE PLATFORM → EVERY SCHEME
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0b2853] tracking-tight">
            No-Code Visual Scheme Configurator
          </h1>
          <p className="text-slate-600 mt-0.5">
            Dynamically configure scheme guidelines, statutory income limits, required enclosures, and deterministic rule trees without code modifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saveSuccess && (
            <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded border border-emerald-300 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              Rules Committed to MongoDB Atlas!
            </span>
          )}
          {saveError && (
            <span className="text-rose-700 font-bold bg-rose-50 px-3 py-1.5 rounded border border-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {saveError}
            </span>
          )}
          <button
            onClick={handleSaveConfiguration}
            disabled={isSaving || isProtected}
            className={`px-5 py-2 ${isProtected ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0b2853] hover:bg-[#134685]'} text-white font-black text-xs rounded shadow flex items-center gap-1.5 uppercase tracking-wider transition-opacity ${
              isSaving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-amber-400 rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-amber-400" />
            )}
            <span>{isSaving ? 'Saving to Atlas...' : (isProtected ? 'Protected Scheme' : 'Save & Apply Rule Configuration')}</span>
          </button>
        </div>
      </div>

      {/* Scheme Selector */}
      <div className="bg-slate-100 p-3 rounded border border-slate-300 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="font-bold text-slate-700 whitespace-nowrap">
          Configuring Scheme:
        </span>
        <div className="flex items-center gap-2">
          {schemes.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectScheme(s.id)}
              className={`px-3 py-1.5 rounded font-bold transition-colors whitespace-nowrap text-xs ${
                selectedSchemeId === s.id
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.shortName}
            </button>
          ))}
        </div>
      </div>

      {isProtected && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-xs">Official Dataset Scheme (Protected)</h4>
            <p className="text-amber-800 text-[11px] mt-1">
              This scheme is part of the original MoTA dataset and cannot be edited or overwritten. 
              You can view the configuration but saving changes is disabled.
            </p>
          </div>
        </div>
      )}

      {/* Basic Metadata Configuration Grid */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-200 pb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-900" />
          <span>1. Scheme Identification & Cycle Norms</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Scheme Name:</label>
            <input
              type="text"
              disabled={isProtected}
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Scheme Code:</label>
            <input
              type="text"
              disabled={isProtected}
              value={schemeCode}
              onChange={(e) => setSchemeCode(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Income Cap (INR, 0 for Universal):</label>
            <input
              type="number"
              step="10000"
              disabled={isProtected}
              value={annualIncomeCap}
              onChange={(e) => setAnnualIncomeCap(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-blue-950 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Min Academic Marks (%):</label>
            <input
              type="number"
              disabled={isProtected}
              value={minAcademicPercentage}
              onChange={(e) => setMinAcademicPercentage(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Application Start Date:</label>
            <input
              type="date"
              disabled={isProtected}
              value={applicationStartDate}
              onChange={(e) => setApplicationStartDate(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Application Deadline:</label>
            <input
              type="date"
              disabled={isProtected}
              min={applicationStartDate}
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Portal Application Status:</label>
            <select
              value={isOpen ? 'OPEN' : 'CLOSED'}
              disabled={isProtected}
              onChange={(e) => setIsOpen(e.target.value === 'OPEN')}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold disabled:opacity-60"
            >
              <option value="OPEN">Online Applications OPEN</option>
              <option value="CLOSED">Online Applications CLOSED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual IF-THEN Rule Builder */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-900" />
            <span>2. Visual Rule Engine: Configured Criteria Tree</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Deterministic JSON Schema Representation (Zero arbitrary eval)
          </span>
        </div>

        {/* Existing Rules List */}
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-mono font-bold text-[10px]">
                  IF
                </span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                  {rule.field}
                </span>
                <span className="font-bold text-blue-900">
                  {rule.operator}
                </span>
                <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                  {String(rule.value)} {rule.unit || ''}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-mono font-bold text-[10px]">
                  THEN PASS
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-600 italic text-[11px]">
                  "{rule.explanation}"
                </span>
                {!isProtected && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 rounded text-rose-600 hover:bg-rose-50"
                    title="Remove Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Rule Builder Block */}
        <form onSubmit={handleAddRule} className="p-4 bg-blue-50/60 border border-blue-200 rounded space-y-3">
          <span className="font-bold text-blue-950 uppercase tracking-wide block">
            Add Structured Statutory Rule:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Field:</label>
              <select
                value={newRuleField}
                onChange={(e) => setNewRuleField(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
              >
                <option value="annualFamilyIncome">annualFamilyIncome</option>
                <option value="category">category</option>
                <option value="previousExamPercentage">previousExamPercentage</option>
                <option value="applicantAge">applicantAge</option>
                <option value="isAadhaarSeeded">isAadhaarSeeded</option>
                <option value="isNotifiedInstitute">isNotifiedInstitute</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Operator:</label>
              <select
                value={newRuleOperator}
                onChange={(e) => setNewRuleOperator(e.target.value as any)}
                className="w-full p-2 bg-white border border-slate-300 rounded font-bold text-blue-900"
              >
                <option value="LESS_THAN_OR_EQUAL">&lt;= (Less Than or Equal)</option>
                <option value="GREATER_THAN_OR_EQUAL">&gt;= (Greater Than or Equal)</option>
                <option value="EQUALS">== (Exact Match)</option>
                <option value="BOOLEAN">BOOLEAN (True/False)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Comparison Value:</label>
              <input
                type="text"
                required
                value={newRuleValue}
                onChange={(e) => setNewRuleValue(e.target.value)}
                placeholder="Value..."
                className="w-full p-2 bg-white border border-slate-300 rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Rule Label:</label>
              <input
                type="text"
                required
                value={newRuleLabel}
                onChange={(e) => setNewRuleLabel(e.target.value)}
                placeholder="e.g. Parental Income Cap"
                className="w-full p-2 bg-white border border-slate-300 rounded"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isProtected}
                className={`w-full py-2 ${isProtected ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0b2853] hover:bg-[#134685]'} text-white rounded font-bold flex items-center justify-center gap-1 shadow-sm`}
              >
                <Plus className="w-4 h-4" />
                <span>Append Rule</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* JSON Schema Representation Preview */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-900" />
            <span>3. Active Dynamic Schema Configuration Payload</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Real-time reactive JSON</span>
        </div>
        <pre className="bg-slate-900 text-emerald-400 p-4 rounded font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
          {JSON.stringify(
            {
              schemeId: scheme.id,
              schemeCode,
              annualIncomeCap,
              minAcademicPercentage,
              eligibilityRules: rules,
              requiredDocumentsCount: scheme.requiredDocuments.length,
              workflowStagesCount: scheme.workflowStages.length
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
