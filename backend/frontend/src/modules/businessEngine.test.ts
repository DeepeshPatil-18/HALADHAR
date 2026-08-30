/**
 * Unit tests for Business Engine calculation module
 * 
 * Tests verify deterministic calculations for cost, revenue, profit, margins, and ROI
 */

import { describe, it, expect } from 'vitest';
import { calculateBusinessPlan, type BusinessPlanInputs } from './businessEngine';

describe('Business Engine - calculateBusinessPlan', () => {
  it('should calculate correct business metrics for poultry farming', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'poultry',
      scale: 1000, // 1000 birds
      feedCostPerUnit: 30, // ₹30 per bird per cycle
      expectedYieldPerCycle: 950, // 950 birds survive to market
      marketPricePerUnit: 180, // ₹180 per bird
      cyclesPerYear: 4, // 4 cycles per year
    };

    const result = calculateBusinessPlan(inputs);

    // Total cost = 1000 birds × ₹30 × 4 cycles = ₹120,000
    expect(result.totalCost).toBe(120000);

    // Gross revenue = 950 birds × ₹180 × 4 cycles = ₹684,000
    expect(result.grossRevenue).toBe(684000);

    // Net profit = ₹684,000 - ₹120,000 = ₹564,000
    expect(result.netProfit).toBe(564000);

    // Profit margin = (564000 / 684000) × 100 ≈ 82.46%
    expect(result.profitMarginPercent).toBeCloseTo(82.46, 1);

    // Break-even units = 120000 / 180 ≈ 666.67 birds
    expect(result.breakEvenUnits).toBeCloseTo(666.67, 1);

    // ROI = (564000 / 120000) × 100 = 470%
    expect(result.roi).toBe(470);
  });

  it('should calculate correct business metrics for fishery', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'fishery',
      scale: 500, // 500 sq meters pond
      feedCostPerUnit: 100, // ₹100 per sq meter per cycle
      expectedYieldPerCycle: 2500, // 2500 kg fish per cycle
      marketPricePerUnit: 250, // ₹250 per kg
      cyclesPerYear: 2, // 2 cycles per year
    };

    const result = calculateBusinessPlan(inputs);

    // Total cost = 500 × ₹100 × 2 = ₹100,000
    expect(result.totalCost).toBe(100000);

    // Gross revenue = 2500 kg × ₹250 × 2 = ₹1,250,000
    expect(result.grossRevenue).toBe(1250000);

    // Net profit = ₹1,250,000 - ₹100,000 = ₹1,150,000
    expect(result.netProfit).toBe(1150000);

    // Profit margin = (1150000 / 1250000) × 100 = 92%
    expect(result.profitMarginPercent).toBe(92);

    // Break-even units = 100000 / 250 = 400 kg
    expect(result.breakEvenUnits).toBe(400);

    // ROI = (1150000 / 100000) × 100 = 1150%
    expect(result.roi).toBe(1150);
  });

  it('should handle small-scale enterprise calculations', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'apiculture',
      scale: 10, // 10 hives
      feedCostPerUnit: 500, // ₹500 per hive per cycle
      expectedYieldPerCycle: 150, // 150 kg honey per cycle
      marketPricePerUnit: 400, // ₹400 per kg
      cyclesPerYear: 2, // 2 harvests per year
    };

    const result = calculateBusinessPlan(inputs);

    // Total cost = 10 × ₹500 × 2 = ₹10,000
    expect(result.totalCost).toBe(10000);

    // Gross revenue = 150 kg × ₹400 × 2 = ₹120,000
    expect(result.grossRevenue).toBe(120000);

    // Net profit = ₹120,000 - ₹10,000 = ₹110,000
    expect(result.netProfit).toBe(110000);

    // Profit margin = (110000 / 120000) × 100 ≈ 91.67%
    expect(result.profitMarginPercent).toBeCloseTo(91.67, 1);

    // Break-even units = 10000 / 400 = 25 kg
    expect(result.breakEvenUnits).toBe(25);

    // ROI = (110000 / 10000) × 100 = 1100%
    expect(result.roi).toBe(1100);
  });

  it('should handle zero profit scenario', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'mushroom',
      scale: 100, // 100 sq ft
      feedCostPerUnit: 50, // ₹50 per sq ft
      expectedYieldPerCycle: 100, // 100 kg per cycle
      marketPricePerUnit: 50, // ₹50 per kg
      cyclesPerYear: 1,
    };

    const result = calculateBusinessPlan(inputs);

    // Total cost = 100 × ₹50 × 1 = ₹5,000
    expect(result.totalCost).toBe(5000);

    // Gross revenue = 100 kg × ₹50 × 1 = ₹5,000
    expect(result.grossRevenue).toBe(5000);

    // Net profit = ₹5,000 - ₹5,000 = ₹0
    expect(result.netProfit).toBe(0);

    // Profit margin = 0%
    expect(result.profitMarginPercent).toBe(0);

    // Break-even units = 5000 / 50 = 100 kg
    expect(result.breakEvenUnits).toBe(100);

    // ROI = 0%
    expect(result.roi).toBe(0);
  });

  it('should handle loss scenario (negative profit)', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'dairy',
      scale: 20, // 20 cattle
      feedCostPerUnit: 5000, // ₹5000 per cattle per cycle
      expectedYieldPerCycle: 800, // 800 liters milk per cycle
      marketPricePerUnit: 45, // ₹45 per liter
      cyclesPerYear: 1,
    };

    const result = calculateBusinessPlan(inputs);

    // Total cost = 20 × ₹5000 × 1 = ₹100,000
    expect(result.totalCost).toBe(100000);

    // Gross revenue = 800 L × ₹45 × 1 = ₹36,000
    expect(result.grossRevenue).toBe(36000);

    // Net profit = ₹36,000 - ₹100,000 = -₹64,000 (loss)
    expect(result.netProfit).toBe(-64000);

    // Profit margin = (-64000 / 36000) × 100 ≈ -177.78%
    expect(result.profitMarginPercent).toBeCloseTo(-177.78, 1);

    // Break-even units = 100000 / 45 ≈ 2222.22 liters
    expect(result.breakEvenUnits).toBeCloseTo(2222.22, 1);

    // ROI = (-64000 / 100000) × 100 = -64%
    expect(result.roi).toBe(-64);
  });

  it('should round results to 2 decimal places', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'vermicompost',
      scale: 3, // 3 beds
      feedCostPerUnit: 333.33, // ₹333.33 per bed
      expectedYieldPerCycle: 77.77, // 77.77 kg per cycle
      marketPricePerUnit: 12.99, // ₹12.99 per kg
      cyclesPerYear: 3,
    };

    const result = calculateBusinessPlan(inputs);

    // Check that all values are rounded to 2 decimals
    expect(result.totalCost.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(result.grossRevenue.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(result.netProfit.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(result.profitMarginPercent.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(result.breakEvenUnits.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(result.roi.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });

  it('should throw error for invalid scale (zero)', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'poultry',
      scale: 0, // Invalid: zero scale
      feedCostPerUnit: 30,
      expectedYieldPerCycle: 950,
      marketPricePerUnit: 180,
      cyclesPerYear: 4,
    };

    expect(() => calculateBusinessPlan(inputs)).toThrow('Invalid input: All values must be positive numbers');
  });

  it('should throw error for invalid scale (negative)', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'poultry',
      scale: -100, // Invalid: negative scale
      feedCostPerUnit: 30,
      expectedYieldPerCycle: 950,
      marketPricePerUnit: 180,
      cyclesPerYear: 4,
    };

    expect(() => calculateBusinessPlan(inputs)).toThrow('Invalid input: All values must be positive numbers');
  });

  it('should throw error for negative feed cost', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'poultry',
      scale: 1000,
      feedCostPerUnit: -30, // Invalid: negative cost
      expectedYieldPerCycle: 950,
      marketPricePerUnit: 180,
      cyclesPerYear: 4,
    };

    expect(() => calculateBusinessPlan(inputs)).toThrow('Invalid input: All values must be positive numbers');
  });

  it('should throw error for zero expected yield', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'poultry',
      scale: 1000,
      feedCostPerUnit: 30,
      expectedYieldPerCycle: 0, // Invalid: zero yield
      marketPricePerUnit: 180,
      cyclesPerYear: 4,
    };

    expect(() => calculateBusinessPlan(inputs)).toThrow('Invalid input: All values must be positive numbers');
  });

  it('should throw error for zero market price', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'poultry',
      scale: 1000,
      feedCostPerUnit: 30,
      expectedYieldPerCycle: 950,
      marketPricePerUnit: 0, // Invalid: zero price
      cyclesPerYear: 4,
    };

    expect(() => calculateBusinessPlan(inputs)).toThrow('Invalid input: All values must be positive numbers');
  });

  it('should throw error for zero cycles per year', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'poultry',
      scale: 1000,
      feedCostPerUnit: 30,
      expectedYieldPerCycle: 950,
      marketPricePerUnit: 180,
      cyclesPerYear: 0, // Invalid: zero cycles
    };

    expect(() => calculateBusinessPlan(inputs)).toThrow('Invalid input: All values must be positive numbers');
  });

  it('should be deterministic (same inputs produce same outputs)', () => {
    const inputs: BusinessPlanInputs = {
      enterpriseType: 'poultry',
      scale: 1000,
      feedCostPerUnit: 30,
      expectedYieldPerCycle: 950,
      marketPricePerUnit: 180,
      cyclesPerYear: 4,
    };

    const result1 = calculateBusinessPlan(inputs);
    const result2 = calculateBusinessPlan(inputs);
    const result3 = calculateBusinessPlan(inputs);

    // All three calls should produce identical results
    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });
});
