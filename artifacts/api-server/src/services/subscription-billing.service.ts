export type BillingCycle = "monthly" | "quarterly" | "half_yearly" | "yearly";

const CYCLE_TO_MONTHS: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  half_yearly: 6,
  yearly: 12,
};

/** Single source of truth for expiry date calc — call this everywhere, never re-implement. */
export function calculateSubscriptionEndDate(startDate: string | Date, billingCycle: BillingCycle): string {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + CYCLE_TO_MONTHS[billingCycle]);
  return end.toISOString().split("T")[0];
}

export function calculateTrialEndDate(trialStartDate: string | Date, trialDays: number): string {
  const start = new Date(trialStartDate);
  const end = new Date(start);
  end.setDate(end.getDate() + trialDays);
  return end.toISOString().split("T")[0];
}

export function getPriceForCycle(
  plan: { monthlyPrice: string; quarterlyPrice: string; halfYearlyPrice: string; yearlyPrice: string },
  billingCycle: BillingCycle
): string {
  const map: Record<BillingCycle, string> = {
    monthly: plan.monthlyPrice,
    quarterly: plan.quarterlyPrice,
    half_yearly: plan.halfYearlyPrice,
    yearly: plan.yearlyPrice,
  };
  return map[billingCycle];
}