// Goal solvers built on the deterministic engine.

import { Scenario, ProjectionResult, SensitivityResult } from './types';
import { simulate, ymToIndex, indexToYm } from './engine';

/** Highest flat retirement spend (£/month today's money) the plan supports to plan age. */
export function sustainableMonthlyIncome(scenario: Scenario): number {
  let lo = 0;
  let hi = 50000;
  for (let iter = 0; iter < 18; iter++) {
    const mid = (lo + hi) / 2;
    const r = simulate(scenario, { flatRetirementSpendOverride: mid });
    if (r.metrics.successToPlanAge) lo = mid; else hi = mid;
  }
  return Math.floor(lo);
}

/**
 * Earliest retirement date (shifting every retirement date earlier in lockstep)
 * such that the plan still succeeds to plan age. Returns null if even the
 * planned date fails. Success is monotone in the retirement date (retiring
 * later never hurts), so a binary search on "months earlier" suffices.
 */
export function earliestRetirementDate(scenario: Scenario, maxEarlierYears = 25): string | null {
  const baseline = simulate(scenario);
  if (!baseline.metrics.successToPlanAge) return null;

  const baseIdx = ymToIndex(baseline.metrics.retirementDate);
  const nowIdx = ymToIndex(new Date().toISOString().slice(0, 7));
  let lo = 0; // months earlier that still succeeds
  let hi = Math.min(maxEarlierYears * 12, baseIdx - nowIdx - 1); // can't retire in the past
  while (lo < hi) {
    const mid = Math.ceil((lo + hi + 1) / 2);
    const r = simulate(scenario, { retirementShiftMonths: -mid });
    if (r.metrics.successToPlanAge) lo = mid; else hi = mid - 1;
  }
  return indexToYm(baseIdx - lo);
}

/** Copy of the scenario with every retirement date moved to `date`. */
export function withRetirementDate(scenario: Scenario, date: string): Scenario {
  return { ...scenario, employments: scenario.employments.map((e) => ({ ...e, retirementDate: date })) };
}

/**
 * "Can I retire on my target date / with my target income?" Forward check.
 * Returns the sustainable income with every retirement date moved to the goal.
 */
export function goalCheck(scenario: Scenario): {
  targetDate: string | null;
  targetIncomeMonthly: number | null;
  sustainableAtTarget: number;
  meetsIncomeGoal: boolean | null;
} {
  const targetDate = scenario.goals.targetRetirementDate ?? null;
  const targetIncome = scenario.goals.targetMonthlyIncome ?? null;
  const s = targetDate ? withRetirementDate(scenario, targetDate) : scenario;
  const sustainable = sustainableMonthlyIncome(s);
  return {
    targetDate,
    targetIncomeMonthly: targetIncome,
    sustainableAtTarget: sustainable,
    meetsIncomeGoal: targetIncome !== null ? sustainable >= targetIncome : null,
  };
}

export interface GoalPlanResult {
  targetDate: string;
  targetIncome: number;
  sustainableAtTarget: number; // £/month today's money, retiring on the target date
  met: boolean;
  /** Extra £/month saving (today's money, invested) that closes the gap; null when met or unattainable. */
  extraMonthlySaving: number | null;
  /** First retirement date at which the income goal becomes sustainable; null if never within 30 years. */
  laterDateMeetingGoal: string | null;
}

/**
 * What it takes to hit both goals: checks the target date + income, and when
 * short, solves for (a) the extra monthly saving that closes the gap and
 * (b) the later retirement date that meets the income goal as it stands.
 */
export function goalPlan(scenario: Scenario): GoalPlanResult | null {
  const targetDate = scenario.goals.targetRetirementDate;
  const targetIncome = scenario.goals.targetMonthlyIncome;
  if (!targetDate || !targetIncome) return null;

  const atTarget = withRetirementDate(scenario, targetDate);
  const sustainableAtTarget = sustainableMonthlyIncome(atTarget);
  const met = sustainableAtTarget >= targetIncome;

  let extraMonthlySaving: number | null = null;
  let laterDateMeetingGoal: string | null = null;

  if (!met) {
    // (a) extra monthly saving, via a synthetic ISA contribution (overflow
    // beyond the allowance spills to a taxable account inside the engine)
    const boosted = (monthly: number): Scenario => ({
      ...atTarget,
      accounts: [...atTarget.accounts, {
        id: '__goal-extra__', personId: atTarget.people[0].id, name: 'Extra saving (goal)',
        type: 'isa', value: 0, monthlyContribution: monthly,
        assetId: 'mixed-60-40', growthPct: 5, feesPct: 0.25,
      }],
    });
    const cap = 20000;
    if (sustainableMonthlyIncome(boosted(cap)) >= targetIncome) {
      let lo = 0; let hi = cap;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (sustainableMonthlyIncome(boosted(mid)) >= targetIncome) hi = mid; else lo = mid;
      }
      extraMonthlySaving = Math.ceil(hi / 25) * 25;
    }

    // (b) retiring later instead — income is monotone in the retirement date
    const base = ymToIndex(targetDate);
    const okAt = (months: number) =>
      sustainableMonthlyIncome(withRetirementDate(scenario, indexToYm(base + months))) >= targetIncome;
    const maxMonths = 30 * 12;
    if (okAt(maxMonths)) {
      let lo = 0; let hi = maxMonths;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (okAt(mid)) hi = mid; else lo = mid + 1;
      }
      laterDateMeetingGoal = indexToYm(base + lo);
    }
  }

  return { targetDate, targetIncome, sustainableAtTarget, met, extraMonthlySaving, laterDateMeetingGoal };
}

/** Standard sensitivity grid: returns, inflation, retirement date, longevity, crash. */
export function sensitivityGrid(scenario: Scenario): SensitivityResult[] {
  const cases: { label: string; delta: string; opt: Parameters<typeof simulate>[1] }[] = [
    { label: 'Base case', delta: 'Your assumptions as entered', opt: {} },
    { label: 'Lower returns', delta: 'All growth rates −2 percentage points', opt: { returnDeltaPct: -2 } },
    { label: 'Higher returns', delta: 'All growth rates +2 percentage points', opt: { returnDeltaPct: 2 } },
    { label: 'Higher inflation', delta: 'Inflation +1.5 percentage points', opt: { inflationDeltaPct: 1.5 } },
    { label: 'Retire 2 years earlier', delta: 'Every retirement date moved 24 months earlier', opt: { retirementShiftMonths: -24 } },
    { label: 'Retire 2 years later', delta: 'Every retirement date moved 24 months later', opt: { retirementShiftMonths: 24 } },
    { label: 'Live to 100', delta: 'Plan horizon extended to age 100', opt: { planToAgeOverride: 100 } },
    { label: 'Market crash at retirement', delta: '−30% on invested assets in the first retirement month', opt: { crashYearOnePct: -30 } },
  ];
  return cases.map((c) => {
    const r = simulate(scenario, c.opt);
    return {
      label: c.label,
      delta: c.delta,
      runOutAge: r.metrics.runOutAge,
      netWorthAtPlanAge: r.metrics.estateAtPlanAge,
      sustainableMonthlyIncome: 0, // expensive; filled lazily by UI on demand
    };
  });
}

/** Full projection with solver-derived metrics filled in. */
export function fullProjection(scenario: Scenario): ProjectionResult {
  const r = simulate(scenario);
  r.metrics.sustainableMonthlyIncome = sustainableMonthlyIncome(scenario);
  r.metrics.earliestRetirementDate = earliestRetirementDate(scenario);
  return r;
}
