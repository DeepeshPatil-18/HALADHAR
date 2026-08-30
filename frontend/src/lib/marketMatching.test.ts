// ---------------------------------------------------------------------------
// Market Matching Logic Tests
// Validates Property 4: Produce-Buyer Match Correctness
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import { matchListingToBuyers, type ProduceListing, type BuyerRequirement } from './marketMatching';

describe('matchListingToBuyers', () => {
  const baseListing: ProduceListing = {
    id: '1',
    product: 'Tomato',
    quantity: 100,
    unit: 'kg',
    quality_grade: 'A',
    expected_price: 50,
    available_from: '2024-01-01',
    state: 'Maharashtra',
    district: 'Pune',
  };

  const baseBuyer: BuyerRequirement = {
    id: 'b1',
    product: 'Tomato',
    quantity_needed: 50,
    unit: 'kg',
    quality_grade: 'A',
    price_range_min: 40,
    price_range_max: 60,
    required_by: '2024-01-15',
    state: 'Maharashtra',
    district: 'Pune',
    contact_method: '+919876543210',
  };

  it('should match when all criteria are satisfied', () => {
    const result = matchListingToBuyers(baseListing, [baseBuyer]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b1');
  });

  it('should NOT match when product name differs', () => {
    const buyer = { ...baseBuyer, product: 'Potato' };
    const result = matchListingToBuyers(baseListing, [buyer]);
    expect(result).toHaveLength(0);
  });

  it('should match product names case-insensitively', () => {
    const buyer = { ...baseBuyer, product: 'TOMATO' };
    const result = matchListingToBuyers(baseListing, [buyer]);
    expect(result).toHaveLength(1);
  });

  it('should NOT match when state differs', () => {
    const buyer = { ...baseBuyer, state: 'Gujarat' };
    const result = matchListingToBuyers(baseListing, [buyer]);
    expect(result).toHaveLength(0);
  });

  it('should NOT match when district differs', () => {
    const buyer = { ...baseBuyer, district: 'Mumbai' };
    const result = matchListingToBuyers(baseListing, [buyer]);
    expect(result).toHaveLength(0);
  });

  it('should match state and district case-insensitively', () => {
    const buyer = { ...baseBuyer, state: 'maharashtra', district: 'PUNE' };
    const result = matchListingToBuyers(baseListing, [buyer]);
    expect(result).toHaveLength(1);
  });

  it('should NOT match when listing quantity is less than buyer needs', () => {
    const listing = { ...baseListing, quantity: 30 };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(0);
  });

  it('should match when listing quantity equals buyer needs', () => {
    const listing = { ...baseListing, quantity: 50 };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(1);
  });

  it('should match when listing quantity exceeds buyer needs', () => {
    const listing = { ...baseListing, quantity: 150 };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(1);
  });

  it('should NOT match when listing quality is lower than buyer requirement', () => {
    const listing = { ...baseListing, quality_grade: 'C' };
    const buyer = { ...baseBuyer, quality_grade: 'A' };
    const result = matchListingToBuyers(listing, [buyer]);
    expect(result).toHaveLength(0);
  });

  it('should match when listing quality meets buyer requirement', () => {
    const listing = { ...baseListing, quality_grade: 'A' };
    const buyer = { ...baseBuyer, quality_grade: 'A' };
    const result = matchListingToBuyers(listing, [buyer]);
    expect(result).toHaveLength(1);
  });

  it('should match when listing quality exceeds buyer requirement', () => {
    const listing = { ...baseListing, quality_grade: 'A' };
    const buyer = { ...baseBuyer, quality_grade: 'B' };
    const result = matchListingToBuyers(listing, [buyer]);
    expect(result).toHaveLength(1);
  });

  it('should NOT match when listing has no quality but buyer requires one', () => {
    const listing = { ...baseListing, quality_grade: null };
    const buyer = { ...baseBuyer, quality_grade: 'A' };
    const result = matchListingToBuyers(listing, [buyer]);
    expect(result).toHaveLength(0);
  });

  it('should match when buyer has no quality requirement', () => {
    const listing = { ...baseListing, quality_grade: null };
    const buyer = { ...baseBuyer, quality_grade: null };
    const result = matchListingToBuyers(listing, [buyer]);
    expect(result).toHaveLength(1);
  });

  it('should NOT match when price is below buyer minimum', () => {
    const listing = { ...baseListing, expected_price: 30 };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(0);
  });

  it('should NOT match when price is above buyer maximum', () => {
    const listing = { ...baseListing, expected_price: 70 };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(0);
  });

  it('should match when price equals buyer minimum', () => {
    const listing = { ...baseListing, expected_price: 40 };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(1);
  });

  it('should match when price equals buyer maximum', () => {
    const listing = { ...baseListing, expected_price: 60 };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(1);
  });

  it('should match when price is within buyer range', () => {
    const listing = { ...baseListing, expected_price: 50 };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(1);
  });

  it('should match when listing has no price', () => {
    const listing = { ...baseListing, expected_price: null };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(1);
  });

  it('should NOT match when available date is after required date', () => {
    const listing = { ...baseListing, available_from: '2024-01-20' };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(0);
  });

  it('should match when available date equals required date', () => {
    const listing = { ...baseListing, available_from: '2024-01-15' };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(1);
  });

  it('should match when available date is before required date', () => {
    const listing = { ...baseListing, available_from: '2024-01-05' };
    const result = matchListingToBuyers(listing, [baseBuyer]);
    expect(result).toHaveLength(1);
  });

  it('should return multiple matches when multiple buyers match', () => {
    const buyer2 = { ...baseBuyer, id: 'b2' };
    const buyer3 = { ...baseBuyer, id: 'b3', state: 'Gujarat' }; // won't match
    const result = matchListingToBuyers(baseListing, [baseBuyer, buyer2, buyer3]);
    expect(result).toHaveLength(2);
    expect(result.map(b => b.id).sort()).toEqual(['b1', 'b2']);
  });

  it('should return empty array when no buyers match', () => {
    const buyer = { ...baseBuyer, product: 'Potato', state: 'Gujarat' };
    const result = matchListingToBuyers(baseListing, [buyer]);
    expect(result).toHaveLength(0);
  });

  it('should fail if ANY single criterion is violated', () => {
    // All criteria good except product
    const buyer1 = { ...baseBuyer, product: 'Potato' };
    expect(matchListingToBuyers(baseListing, [buyer1])).toHaveLength(0);

    // All criteria good except state
    const buyer2 = { ...baseBuyer, state: 'Gujarat' };
    expect(matchListingToBuyers(baseListing, [buyer2])).toHaveLength(0);

    // All criteria good except quantity
    const listing3 = { ...baseListing, quantity: 20 };
    expect(matchListingToBuyers(listing3, [baseBuyer])).toHaveLength(0);

    // All criteria good except quality
    const listing4 = { ...baseListing, quality_grade: 'D' };
    expect(matchListingToBuyers(listing4, [baseBuyer])).toHaveLength(0);

    // All criteria good except price
    const listing5 = { ...baseListing, expected_price: 100 };
    expect(matchListingToBuyers(listing5, [baseBuyer])).toHaveLength(0);

    // All criteria good except date
    const listing6 = { ...baseListing, available_from: '2024-02-01' };
    expect(matchListingToBuyers(listing6, [baseBuyer])).toHaveLength(0);
  });
});
