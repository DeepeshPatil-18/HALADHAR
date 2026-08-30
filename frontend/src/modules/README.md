# Business Engine Module

The Business Engine is a pure TypeScript module that performs deterministic cost/profit/yield calculations for agricultural enterprises in the KrishiMitra platform.

## Purpose

The Business Engine provides financial planning capabilities for Indian farmers running allied enterprises (poultry, fisheries, apiculture, mushroom cultivation, vermicomposting, dairy, etc.). It helps farmers:

- Estimate total annual costs
- Project gross revenue
- Calculate expected profit/loss
- Determine profit margins
- Identify break-even points
- Compute return on investment (ROI)

## Key Principles

1. **Deterministic**: Same inputs always produce identical outputs. No randomness.
2. **Pure Functions**: No side effects, no external dependencies, no API calls.
3. **No LLM/AI**: All calculations are arithmetic. KisanSLM may provide narrative context around the results but never generates the numbers.
4. **Grounded in Data**: Numbers come from calculations, not invented by AI.

## Usage

```typescript
import { calculateBusinessPlan, BusinessPlanInputs } from './modules/businessEngine';

const inputs: BusinessPlanInputs = {
  enterpriseType: 'poultry',
  scale: 1000,              // 1000 birds
  feedCostPerUnit: 30,      // ₹30 per bird per cycle
  expectedYieldPerCycle: 950, // 950 birds to market
  marketPricePerUnit: 180,  // ₹180 per bird
  cyclesPerYear: 4,         // 4 cycles per year
};

const result = calculateBusinessPlan(inputs);

console.log('Net Profit:', result.netProfit);
console.log('ROI:', result.roi, '%');
```

## Input Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `enterpriseType` | string | Type of agricultural enterprise | 'poultry', 'fishery', 'apiculture' |
| `scale` | number | Scale of operation (units vary by type) | 1000 birds, 500 sq m pond |
| `feedCostPerUnit` | number | Cost per unit per cycle (₹) | 30 per bird |
| `expectedYieldPerCycle` | number | Expected output per cycle | 950 birds, 2500 kg |
| `marketPricePerUnit` | number | Selling price per output unit (₹) | 180 per bird |
| `cyclesPerYear` | number | Production cycles per year | 4 |

## Output Results

| Field | Type | Description |
|-------|------|-------------|
| `totalCost` | number | Total annual cost (₹) |
| `grossRevenue` | number | Total annual revenue (₹) |
| `netProfit` | number | Annual profit/loss (₹) |
| `profitMarginPercent` | number | Profit margin as percentage |
| `breakEvenUnits` | number | Units needed to break even |
| `roi` | number | Return on investment (%) |

All values are rounded to 2 decimal places.

## Validation

The function validates all inputs and throws an error if:
- Scale is zero or negative
- Feed cost is negative
- Expected yield is zero or negative
- Market price is zero or negative
- Cycles per year is zero or negative

## Testing

Unit tests cover:
- Correct calculations for various enterprise types
- Profit, break-even, and loss scenarios
- Edge cases (zero profit, negative profit)
- Input validation
- Deterministic behavior (repeatability)
- Decimal precision

Run tests:
```bash
npm test -- businessEngine
```

## Requirements Validation

**Validates: Requirements 13.1, 13.2**

- ✅ Business Engine performs all calculations (not LLM)
- ✅ All arithmetic is deterministic and pure
- ✅ No randomness or external dependencies
- ✅ KisanSLM only provides narrative context around the numbers

## Files

- `businessEngine.ts` - Core calculation module
- `businessEngine.test.ts` - Unit tests
- `businessEngine.example.ts` - Usage examples
- `README.md` - This documentation
