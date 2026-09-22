import { SchemeConfig, EligibilityCriterion } from '../types/scheme';

export interface EligibilityEvaluationResult {
  overallStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'MORE_INFO_REQUIRED';
  confidenceScore: number;
  criteriaResults: {
    criterion: EligibilityCriterion;
    userValue: any;
    passed: boolean;
    reason: string;
  }[];
  explanationSummary: string;
}

export function evaluateApplicantEligibility(
  scheme: SchemeConfig,
  applicantData: {
    category?: string;
    annualFamilyIncome?: number;
    educationLevel?: string;
    previousExamPercentage?: number;
    currentClass?: string;
    applicantAge?: number;
    isAadhaarSeeded?: boolean;
    isNotifiedInstitute?: boolean;
    courseType?: string;
  }
): EligibilityEvaluationResult {
  const criteriaResults: EligibilityEvaluationResult['criteriaResults'] = [];
  let allPassed = true;
  let anyMissing = false;

  for (const criterion of scheme.eligibilityRules) {
    const userVal = (applicantData as any)[criterion.field];
    let passed = false;
    let reason = '';

    if (userVal === undefined || userVal === null || userVal === '') {
      anyMissing = true;
      passed = false;
      reason = `Value for '${criterion.label}' not provided.`;
    } else {
      switch (criterion.operator) {
        case 'EQUALS':
          passed = String(userVal).trim().toUpperCase() === String(criterion.value).trim().toUpperCase();
          reason = passed
            ? `Matches required value (${criterion.value}).`
            : `Expected ${criterion.value}, but got ${userVal}.`;
          break;

        case 'LESS_THAN_OR_EQUAL':
          passed = Number(userVal) <= Number(criterion.value);
          reason = passed
            ? `Value ₹${Number(userVal).toLocaleString('en-IN')} is within maximum ceiling ₹${Number(criterion.value).toLocaleString('en-IN')}.`
            : `Value ₹${Number(userVal).toLocaleString('en-IN')} exceeds permissible ceiling of ₹${Number(criterion.value).toLocaleString('en-IN')}.`;
          break;

        case 'GREATER_THAN_OR_EQUAL':
          passed = Number(userVal) >= Number(criterion.value);
          reason = passed
            ? `Value ${userVal} satisfies minimum threshold ${criterion.value}.`
            : `Value ${userVal} falls below minimum requirement of ${criterion.value}.`;
          break;

        case 'IN':
          if (Array.isArray(criterion.value)) {
            passed = criterion.value.some(
              v => String(v).toLowerCase() === String(userVal).toLowerCase()
            );
            reason = passed
              ? `Satisfies enrolled category (${userVal}).`
              : `Selected ${userVal} is not among accepted levels: ${criterion.value.join(', ')}.`;
          }
          break;

        case 'BOOLEAN':
          passed = Boolean(userVal) === Boolean(criterion.value);
          reason = passed
            ? `Condition '${criterion.label}' is verified.`
            : `Condition '${criterion.label}' is unverified.`;
          break;

        default:
          passed = true;
          reason = 'Evaluated';
      }
    }

    if (!passed) {
      allPassed = false;
    }

    criteriaResults.push({
      criterion,
      userValue: userVal,
      passed,
      reason
    });
  }

  let overallStatus: EligibilityEvaluationResult['overallStatus'] = 'ELIGIBLE';
  let explanationSummary = '';

  if (allPassed) {
    overallStatus = 'ELIGIBLE';
    explanationSummary = `Applicant satisfies all ${scheme.eligibilityRules.length} statutory criteria for ${scheme.shortName}.`;
  } else if (anyMissing) {
    overallStatus = 'MORE_INFO_REQUIRED';
    explanationSummary = 'Some essential parameters are pending input to determine conclusive eligibility.';
  } else {
    overallStatus = 'NOT_ELIGIBLE';
    const failed = criteriaResults.filter(c => !c.passed).map(c => c.criterion.label);
    explanationSummary = `Does not meet the following criteria: ${failed.join(', ')}.`;
  }

  const passedCount = criteriaResults.filter(c => c.passed).length;
  const confidenceScore = criteriaResults.length > 0 ? (passedCount / criteriaResults.length) : 1;

  return {
    overallStatus,
    confidenceScore,
    criteriaResults,
    explanationSummary
  };
}
