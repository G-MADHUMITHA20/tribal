import React, { useState, useEffect } from 'react';
import { SchemeConfig } from '../../types/scheme';
import { evaluateApplicantEligibility, EligibilityEvaluationResult } from '../../services/eligibilityEngine';
import {
  X,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EligibilityPreCheckModalProps {
  scheme: SchemeConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EligibilityPreCheckModal: React.FC<EligibilityPreCheckModalProps> = ({
  scheme,
  isOpen,
  onClose
}) => {
  if (!isOpen || !scheme) return null;

  // Form input state
  const [category, setCategory] = useState<string>('ST');
  const [annualIncome, setAnnualIncome] = useState<number>(180000);
  const [academicPercentage, setAcademicPercentage] = useState<number>(72);
  const [applicantAge, setApplicantAge] = useState<number>(24);
  const [currentClass, setCurrentClass] = useState<string>('Class 10');
  const [isNotifiedInstitute, setIsNotifiedInstitute] = useState<boolean>(true);
  const [courseType, setCourseType] = useState<string>('REGULAR_FULL_TIME');
  const [isAadhaarSeeded, setIsAadhaarSeeded] = useState<boolean>(true);

  // Result state
  const [evaluationResult, setEvaluationResult] = useState<EligibilityEvaluationResult | null>(null);

  // Run initial evaluation on load or change
  useEffect(() => {
    runEvaluation();
  }, [scheme, category, annualIncome, academicPercentage, applicantAge, currentClass, isNotifiedInstitute, courseType, isAadhaarSeeded]);

  const runEvaluation = () => {
    if (!scheme) return;
    const res = evaluateApplicantEligibility(scheme, {
      category,
      annualFamilyIncome: Number(annualIncome),
      previousExamPercentage: Number(academicPercentage),
      applicantAge: Number(applicantAge),
      currentClass,
      isNotifiedInstitute,
      courseType,
      isAadhaarSeeded
    });
    setEvaluationResult(res);
  };

  const handleResetToEligibleValues = () => {
    setCategory('ST');
    setAnnualIncome(180000);
    setAcademicPercentage(75);
    setApplicantAge(24);
    setIsNotifiedInstitute(true);
    setCourseType('REGULAR_FULL_TIME');
    setIsAadhaarSeeded(true);
  };

  const handleSimulateIneligible = () => {
    setCategory('GENERAL'); // Will trigger non-ST breach
    setAnnualIncome(900000); // Exceeds limits
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#0b2853] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                AI Rule Engine Pre-Check
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Check Your Eligibility: {scheme.shortName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-blue-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Official Disclaimer Alert */}
          <div className="bg-amber-50 border-l-4 border-amber-600 p-3 rounded-r text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-amber-950">Statutory Prototype Notice:</strong>
              <span>
                Pre-check result based on configured scheme rules. Final eligibility is subject to official scrutiny and verification of submitted certificates by competent authority.
              </span>
            </div>
          </div>

          {/* Quick Simulation Toggles */}
          <div className="flex items-center justify-between bg-slate-100 p-2 rounded text-xs">
            <span className="font-medium text-slate-600">Quick Test Scenarios:</span>
            <div className="flex gap-1.5">
              <button
                onClick={handleResetToEligibleValues}
                className="px-2.5 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded font-semibold text-[11px]"
              >
                ✓ Eligible Applicant
              </button>
              <button
                onClick={handleSimulateIneligible}
                className="px-2.5 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded font-semibold text-[11px]"
              >
                ✕ Ineligible Test
              </button>
            </div>
          </div>

          {/* Questionnaire Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* Field 1: Category */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Social Category / Community:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-800"
              >
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="PVTG">Particularly Vulnerable Tribal Group (PVTG)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="OBC">Other Backward Classes (OBC)</option>
                <option value="GENERAL">General / Unreserved</option>
              </select>
            </div>

            {/* Field 2: Annual Income */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Annual Family Income (INR):
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  step="10000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full pl-6 p-2 bg-slate-50 border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>

            {/* Field 3: Academic Percentage */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Qualifying Degree / Exam Marks (%):
              </label>
              <input
                type="number"
                min="30"
                max="100"
                value={academicPercentage}
                onChange={(e) => setAcademicPercentage(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-800"
              />
            </div>

            {/* Field 4: Age */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Candidate Age (as on 1st April):
              </label>
              <input
                type="number"
                min="14"
                max="60"
                value={applicantAge}
                onChange={(e) => setApplicantAge(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-800"
              />
            </div>

            {/* Scheme specific: Enrollment / Institute */}
            {scheme.category === 'PRE_MATRIC' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Enrolled Class:</label>
                <select
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium"
                >
                  <option value="Class 9">Class 9 (Secondary)</option>
                  <option value="Class 10">Class 10 (Secondary)</option>
                  <option value="Class 11">Class 11 (Higher Secondary)</option>
                </select>
              </div>
            )}

            {scheme.category === 'NATIONAL_SCHOLARSHIP' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Premier Institute Allotment:</label>
                <select
                  value={isNotifiedInstitute ? 'YES' : 'NO'}
                  onChange={(e) => setIsNotifiedInstitute(e.target.value === 'YES')}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium"
                >
                  <option value="YES">Admitted in IIT / IIM / AIIMS / NIT / NLU (Notified)</option>
                  <option value="NO">Other Non-Notified Private College</option>
                </select>
              </div>
            )}

            {scheme.category === 'NATIONAL_FELLOWSHIP' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Research Registration Mode:</label>
                <select
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium"
                >
                  <option value="REGULAR_FULL_TIME">Regular Full-Time M.Phil / Ph.D.</option>
                  <option value="PART_TIME">Part-Time / Distance Research</option>
                </select>
              </div>
            )}
          </div>

          {/* Evaluation Result Display */}
          {evaluationResult && (
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Rule Evaluation Outcome
                </span>
                
                {/* Result Pill */}
                {evaluationResult.overallStatus === 'ELIGIBLE' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs tracking-wider shadow-sm">
                    <CheckCircle className="w-4 h-4" />
                    ELIGIBLE (PRE-CHECK PASSED)
                  </span>
                )}

                {evaluationResult.overallStatus === 'NOT_ELIGIBLE' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs tracking-wider shadow-sm">
                    <XCircle className="w-4 h-4" />
                    NOT ELIGIBLE
                  </span>
                )}

                {evaluationResult.overallStatus === 'MORE_INFO_REQUIRED' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-900 font-extrabold text-xs tracking-wider shadow-sm">
                    <AlertCircle className="w-4 h-4" />
                    MORE INFORMATION REQUIRED
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 font-medium mb-3">
                {evaluationResult.explanationSummary}
              </p>

              {/* Detailed Breakdown of evaluated rules */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Configured Criteria Evaluation:
                </span>
                {evaluationResult.criteriaResults.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded text-xs border flex items-start justify-between gap-2 ${
                      item.passed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/60 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {item.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">{item.criterion.label}</div>
                        <div className="text-[11px] text-slate-600">{item.reason}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        item.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {item.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 bg-white hover:bg-slate-50"
          >
            Close
          </button>

          {evaluationResult?.overallStatus === 'ELIGIBLE' ? (
            <Link
              to={`/applicant/apply?scheme=${scheme.id}`}
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 bg-[#0b2853] hover:bg-[#134685] text-white rounded text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Proceed to Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/schemes"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded text-xs font-medium text-center"
            >
              Explore Other Eligible Schemes
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
