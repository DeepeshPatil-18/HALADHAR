/**
 * Business Engine - Deterministic calculation module for agricultural business planning
 * 
 * This module provides pure functions for cost/profit/yield calculations.
 * No LLM calls, no randomness - all arithmetic is deterministic.
 * 
 * Validates: Requirements 13.1, 13.2
 */

export interface BusinessPlanInputs {
  enterpriseType: string;
  scale: number; // e.g., flock size, pond area, hive count
  feedCostPerUnit: number; // cost per unit (kg, liter, etc.)
  expectedYieldPerCycle: number; // expected output per cycle
  marketPricePerUnit: number; // selling price per unit of output
  cyclesPerYear: number; // number of production cycles per year
}

export interface BusinessPlanResult {
  totalCost: number; // total annual cost
  grossRevenue: number; // total annual revenue
  netProfit: number; // annual profit (revenue - cost)
  profitMarginPercent: number; // profit margin as percentage
  breakEvenUnits: number; // units needed to break even
  roi: number; // return on investment as percentage
}

/**
 * Calculate business plan metrics for an agricultural enterprise
 * 
 * @param inputs - Business plan input parameters
 * @returns Business plan results with financial metrics
 */
export function calculateBusinessPlan(inputs: BusinessPlanInputs): BusinessPlanResult {
  const {
    scale,
    feedCostPerUnit,
    expectedYieldPerCycle,
    marketPricePerUnit,
    cyclesPerYear,
  } = inputs;

  // Validate inputs
  if (scale <= 0 || feedCostPerUnit < 0 || expectedYieldPerCycle <= 0 || 
      marketPricePerUnit <= 0 || cyclesPerYear <= 0) {
    throw new Error('Invalid input: All values must be positive numbers');
  }

  // Calculate annual metrics
  const costPerCycle = scale * feedCostPerUnit;
  const totalCost = costPerCycle * cyclesPerYear;
  
  const revenuePerCycle = expectedYieldPerCycle * marketPricePerUnit;
  const grossRevenue = revenuePerCycle * cyclesPerYear;
  
  const netProfit = grossRevenue - totalCost;
  
  // Calculate profit margin (as percentage)
  const profitMarginPercent = grossRevenue > 0 
    ? (netProfit / grossRevenue) * 100 
    : 0;
  
  // Calculate break-even units (how many units to sell to cover costs)
  const breakEvenUnits = marketPricePerUnit > 0 
    ? totalCost / marketPricePerUnit 
    : 0;
  
  // Calculate ROI (return on investment as percentage)
  // ROI = (Net Profit / Total Cost) * 100
  const roi = totalCost > 0 
    ? (netProfit / totalCost) * 100 
    : 0;

  return {
    totalCost: roundToTwoDecimals(totalCost),
    grossRevenue: roundToTwoDecimals(grossRevenue),
    netProfit: roundToTwoDecimals(netProfit),
    profitMarginPercent: roundToTwoDecimals(profitMarginPercent),
    breakEvenUnits: roundToTwoDecimals(breakEvenUnits),
    roi: roundToTwoDecimals(roi),
  };
}

/**
 * Helper function to round numbers to 2 decimal places
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
