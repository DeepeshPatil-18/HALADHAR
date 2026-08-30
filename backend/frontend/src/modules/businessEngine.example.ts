/**
 * Example usage of Business Engine module
 * 
 * This file demonstrates how to use the calculateBusinessPlan function
 * for different agricultural enterprises.
 */

import { calculateBusinessPlan, type BusinessPlanInputs } from './businessEngine';

// Example 1: Poultry Farming
console.log('=== Poultry Farming Example ===');
const poultryInputs: BusinessPlanInputs = {
  enterpriseType: 'poultry',
  scale: 1000, // 1000 birds
  feedCostPerUnit: 30, // ₹30 per bird per cycle
  expectedYieldPerCycle: 950, // 950 birds survive to market
  marketPricePerUnit: 180, // ₹180 per bird
  cyclesPerYear: 4, // 4 cycles per year
};

const poultryResult = calculateBusinessPlan(poultryInputs);
console.log('Total Annual Cost: ₹', poultryResult.totalCost);
console.log('Gross Annual Revenue: ₹', poultryResult.grossRevenue);
console.log('Net Profit: ₹', poultryResult.netProfit);
console.log('Profit Margin: ', poultryResult.profitMarginPercent, '%');
console.log('Break-even Units: ', poultryResult.breakEvenUnits, 'birds');
console.log('ROI: ', poultryResult.roi, '%');
console.log('');

// Example 2: Fishery
console.log('=== Fishery Example ===');
const fisheryInputs: BusinessPlanInputs = {
  enterpriseType: 'fishery',
  scale: 500, // 500 sq meters pond area
  feedCostPerUnit: 100, // ₹100 per sq meter per cycle
  expectedYieldPerCycle: 2500, // 2500 kg fish per cycle
  marketPricePerUnit: 250, // ₹250 per kg
  cyclesPerYear: 2, // 2 cycles per year
};

const fisheryResult = calculateBusinessPlan(fisheryInputs);
console.log('Total Annual Cost: ₹', fisheryResult.totalCost);
console.log('Gross Annual Revenue: ₹', fisheryResult.grossRevenue);
console.log('Net Profit: ₹', fisheryResult.netProfit);
console.log('Profit Margin: ', fisheryResult.profitMarginPercent, '%');
console.log('Break-even Units: ', fisheryResult.breakEvenUnits, 'kg');
console.log('ROI: ', fisheryResult.roi, '%');
console.log('');

// Example 3: Apiculture (Beekeeping)
console.log('=== Apiculture Example ===');
const apicultureInputs: BusinessPlanInputs = {
  enterpriseType: 'apiculture',
  scale: 10, // 10 hives
  feedCostPerUnit: 500, // ₹500 per hive per cycle
  expectedYieldPerCycle: 150, // 150 kg honey per cycle
  marketPricePerUnit: 400, // ₹400 per kg
  cyclesPerYear: 2, // 2 harvests per year
};

const apicultureResult = calculateBusinessPlan(apicultureInputs);
console.log('Total Annual Cost: ₹', apicultureResult.totalCost);
console.log('Gross Annual Revenue: ₹', apicultureResult.grossRevenue);
console.log('Net Profit: ₹', apicultureResult.netProfit);
console.log('Profit Margin: ', apicultureResult.profitMarginPercent, '%');
console.log('Break-even Units: ', apicultureResult.breakEvenUnits, 'kg');
console.log('ROI: ', apicultureResult.roi, '%');
console.log('');

// Example 4: Mushroom Cultivation
console.log('=== Mushroom Cultivation Example ===');
const mushroomInputs: BusinessPlanInputs = {
  enterpriseType: 'mushroom',
  scale: 200, // 200 sq ft cultivation area
  feedCostPerUnit: 50, // ₹50 per sq ft per cycle
  expectedYieldPerCycle: 400, // 400 kg per cycle
  marketPricePerUnit: 150, // ₹150 per kg
  cyclesPerYear: 3, // 3 cycles per year
};

const mushroomResult = calculateBusinessPlan(mushroomInputs);
console.log('Total Annual Cost: ₹', mushroomResult.totalCost);
console.log('Gross Annual Revenue: ₹', mushroomResult.grossRevenue);
console.log('Net Profit: ₹', mushroomResult.netProfit);
console.log('Profit Margin: ', mushroomResult.profitMarginPercent, '%');
console.log('Break-even Units: ', mushroomResult.breakEvenUnits, 'kg');
console.log('ROI: ', mushroomResult.roi, '%');
