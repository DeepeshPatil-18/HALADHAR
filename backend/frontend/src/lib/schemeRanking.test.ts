import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { rankSchemes, type Scheme, type FarmerProfile } from './schemeRanking';

describe('rankSchemes', () => {
  const mockSchemes: Scheme[] = [
    {
      id: '1',
      name: 'Poultry Development Scheme',
      description: 'Support for poultry farmers',
      applicable_states: ['Maharashtra', 'Gujarat'],
      applicable_enterprise_types: ['poultry'],
      applicable_districts: ['Pune', 'Mumbai'],
    },
    {
      id: '2',
      name: 'Fisheries Subsidy Program',
      description: 'Subsidy for fisheries',
      applicable_states: ['Kerala', 'West Bengal'],
      applicable_enterprise_types: ['fisheries'],
      applicable_districts: ['Ernakulam'],
    },
    {
      id: '3',
      name: 'General Agriculture Scheme',
      description: 'Support for all farmers',
      applicable_states: ['Maharashtra'],
      applicable_enterprise_types: ['poultry', 'dairy', 'fisheries'],
      applicable_districts: ['Pune', 'Nagpur'],
    },
    {
      id: '4',
      name: 'National Dairy Scheme',
      description: 'Support for dairy farmers',
      applicable_states: ['Maharashtra', 'Punjab', 'Haryana'],
      applicable_enterprise_types: ['dairy'],
      applicable_districts: ['Pune'],
    },
  ];

  describe('scoring logic', () => {
    it('should award 10 points for state match', () => {
      const profile: FarmerProfile = {
        state: 'Kerala',
        district: 'Trivandrum',
        enterprise_type: 'mushroom',
      };

      const result = rankSchemes(mockSchemes, profile);
      const fisheriesScheme = result.find((s) => s.id === '2');

      expect(fisheriesScheme?.score).toBe(10); // State match only
    });

    it('should award 15 points for enterprise type match', () => {
      const profile: FarmerProfile = {
        state: 'Tamil Nadu',
        district: 'Chennai',
        enterprise_type: 'fisheries',
      };

      const result = rankSchemes(mockSchemes, profile);
      const fisheriesScheme = result.find((s) => s.id === '2');

      expect(fisheriesScheme?.score).toBe(15); // Enterprise type match only
    });

    it('should award 5 points for district match', () => {
      const profile: FarmerProfile = {
        state: 'Rajasthan',
        district: 'Pune',
        enterprise_type: 'apiculture',
      };

      const result = rankSchemes(mockSchemes, profile);
      const poultryScheme = result.find((s) => s.id === '1');

      expect(poultryScheme?.score).toBe(5); // District match only
    });

    it('should award combined points for multiple matches', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'poultry',
      };

      const result = rankSchemes(mockSchemes, profile);
      const poultryScheme = result.find((s) => s.id === '1');

      // State (10) + Enterprise type (15) + District (5) = 30
      expect(poultryScheme?.score).toBe(30);
    });

    it('should award 0 points for no matches', () => {
      const profile: FarmerProfile = {
        state: 'Rajasthan',
        district: 'Jaipur',
        enterprise_type: 'apiculture',
      };

      const result = rankSchemes(mockSchemes, profile);
      
      // All schemes should have 0 score as none match
      result.forEach(scheme => {
        if (scheme.id === '1' || scheme.id === '2' || scheme.id === '3' || scheme.id === '4') {
          expect(scheme.score).toBe(0);
        }
      });
    });
  });

  describe('sorting behavior', () => {
    it('should return schemes sorted by descending score', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'dairy',
      };

      const result = rankSchemes(mockSchemes, profile);

      // Verify descending order
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].score).toBeGreaterThanOrEqual(result[i + 1].score);
      }

      // Two schemes have score 30: "General Agriculture Scheme" (id=3) and "National Dairy Scheme" (id=4)
      // When sorted alphabetically, "General" comes before "National"
      expect(result[0].score).toBe(30);
      expect(result[0].id).toBe('3'); // General Agriculture Scheme
      expect(result[1].score).toBe(30);
      expect(result[1].id).toBe('4'); // National Dairy Scheme
    });

    it('should sort by name when scores are equal (determinism)', () => {
      const schemes: Scheme[] = [
        {
          name: 'Zebra Scheme',
          applicable_states: ['State A'],
          applicable_enterprise_types: [],
          applicable_districts: [],
        },
        {
          name: 'Alpha Scheme',
          applicable_states: ['State A'],
          applicable_enterprise_types: [],
          applicable_districts: [],
        },
        {
          name: 'Beta Scheme',
          applicable_states: ['State A'],
          applicable_enterprise_types: [],
          applicable_districts: [],
        },
      ];

      const profile: FarmerProfile = {
        state: 'State A',
        district: 'District X',
        enterprise_type: 'type X',
      };

      const result = rankSchemes(schemes, profile);

      // All have same score (10), should be sorted alphabetically
      expect(result[0].name).toBe('Alpha Scheme');
      expect(result[1].name).toBe('Beta Scheme');
      expect(result[2].name).toBe('Zebra Scheme');
    });
  });

  describe('recommendation flag', () => {
    it('should mark schemes with score >= 15 as recommended', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'poultry',
      };

      const result = rankSchemes(mockSchemes, profile);
      const poultryScheme = result.find((s) => s.id === '1');

      expect(poultryScheme?.score).toBe(30);
      expect(poultryScheme?.recommended).toBe(true);
    });

    it('should not mark schemes with score < 15 as recommended', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Chennai',
        enterprise_type: 'mushroom',
      };

      const result = rankSchemes(mockSchemes, profile);
      
      result.forEach(scheme => {
        if (scheme.score < 15) {
          expect(scheme.recommended).toBe(false);
        }
      });
    });

    it('should mark scheme with exactly 15 points as recommended', () => {
      const profile: FarmerProfile = {
        state: 'Tamil Nadu',
        district: 'Chennai',
        enterprise_type: 'fisheries',
      };

      const result = rankSchemes(mockSchemes, profile);
      const fisheriesScheme = result.find((s) => s.id === '2');

      expect(fisheriesScheme?.score).toBe(15);
      expect(fisheriesScheme?.recommended).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should return empty array when schemes array is empty', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'poultry',
      };

      const result = rankSchemes([], profile);
      expect(result).toEqual([]);
    });

    it('should handle null/undefined scheme arrays gracefully', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'poultry',
      };

      const result1 = rankSchemes(null as any, profile);
      const result2 = rankSchemes(undefined as any, profile);
      
      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
    });

    it('should handle empty farmer profile', () => {
      const profile: FarmerProfile = {};

      const result = rankSchemes(mockSchemes, profile);
      
      // All schemes should have 0 score
      result.forEach(scheme => {
        expect(scheme.score).toBe(0);
        expect(scheme.recommended).toBe(false);
      });
    });

    it('should handle schemes with missing applicable arrays', () => {
      const schemesWithMissing: Scheme[] = [
        {
          name: 'Incomplete Scheme',
          description: 'Missing applicable arrays',
        },
      ];

      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'poultry',
      };

      const result = rankSchemes(schemesWithMissing, profile);
      
      expect(result[0].score).toBe(0);
      expect(result[0].recommended).toBe(false);
    });

    it('should handle case-insensitive matching', () => {
      const profile: FarmerProfile = {
        state: 'maharashtra', // lowercase
        district: 'PUNE', // uppercase
        enterprise_type: 'PoUlTrY', // mixed case
      };

      const result = rankSchemes(mockSchemes, profile);
      const poultryScheme = result.find((s) => s.id === '1');

      // Should match despite case differences
      expect(poultryScheme?.score).toBe(30);
    });

    it('should handle whitespace in profile fields', () => {
      const profile: FarmerProfile = {
        state: '  Maharashtra  ',
        district: ' Pune ',
        enterprise_type: ' poultry ',
      };

      const result = rankSchemes(mockSchemes, profile);
      const poultryScheme = result.find((s) => s.id === '1');

      // Should match despite whitespace
      expect(poultryScheme?.score).toBe(30);
    });
  });

  describe('determinism', () => {
    it('should return identical results for identical inputs', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'poultry',
      };

      const result1 = rankSchemes(mockSchemes, profile);
      const result2 = rankSchemes(mockSchemes, profile);
      const result3 = rankSchemes(mockSchemes, profile);

      // Results should be identical
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);

      // Order should be identical
      for (let i = 0; i < result1.length; i++) {
        expect(result1[i].id).toBe(result2[i].id);
        expect(result1[i].score).toBe(result2[i].score);
        expect(result1[i].recommended).toBe(result2[i].recommended);
      }
    });

    it('should maintain deterministic ordering across multiple calls', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'dairy',
      };

      const results = Array(10).fill(null).map(() => 
        rankSchemes(mockSchemes, profile)
      );

      // All results should have identical ordering
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toEqual(results[0]);
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should handle Maharashtra poultry farmer in Pune', () => {
      const profile: FarmerProfile = {
        state: 'Maharashtra',
        district: 'Pune',
        enterprise_type: 'poultry',
      };

      const result = rankSchemes(mockSchemes, profile);

      // Both schemes have 30 points, sorted alphabetically:
      // "General Agriculture Scheme" comes before "Poultry Development Scheme"
      
      // General Agriculture Scheme: 10 + 15 + 5 = 30 (recommended)
      expect(result[0].id).toBe('3');
      expect(result[0].score).toBe(30);
      expect(result[0].recommended).toBe(true);

      // Poultry Development Scheme: 10 + 15 + 5 = 30 (recommended)
      expect(result[1].id).toBe('1');
      expect(result[1].score).toBe(30);
      expect(result[1].recommended).toBe(true);
    });

    it('should handle Kerala fisheries farmer', () => {
      const profile: FarmerProfile = {
        state: 'Kerala',
        district: 'Ernakulam',
        enterprise_type: 'fisheries',
      };

      const result = rankSchemes(mockSchemes, profile);

      // Fisheries Subsidy Program: 10 + 15 + 5 = 30
      const fisheriesScheme = result.find((s) => s.id === '2');
      expect(fisheriesScheme?.score).toBe(30);
      expect(fisheriesScheme?.recommended).toBe(true);
    });

    it('should show all schemes even with 0 score', () => {
      const profile: FarmerProfile = {
        state: 'Rajasthan',
        district: 'Jaipur',
        enterprise_type: 'apiculture',
      };

      const result = rankSchemes(mockSchemes, profile);

      // Should return all schemes, even with 0 score
      expect(result.length).toBe(mockSchemes.length);
      
      // All should have 0 score and not recommended
      result.forEach(scheme => {
        expect(scheme.score).toBe(0);
        expect(scheme.recommended).toBe(false);
      });
    });
  });

  describe('property-based tests', () => {
    /**
     * **Validates: Requirements 7.3**
     * 
     * Property 3: Scheme Ranking Determinism
     * 
     * Given the same farmer profile and the same set of schemes as input,
     * the ranking algorithm must always return the same ordered result.
     * No randomness or instability in ordering.
     */
    it('should return identical ordered results for identical inputs (determinism)', () => {
      // Generators for test data
      const stateArb = fc.oneof(
        fc.constant('Maharashtra'),
        fc.constant('Kerala'),
        fc.constant('Gujarat'),
        fc.constant('Punjab'),
        fc.constant('Tamil Nadu'),
        fc.constant(undefined)
      );

      const districtArb = fc.oneof(
        fc.constant('Pune'),
        fc.constant('Mumbai'),
        fc.constant('Ernakulam'),
        fc.constant('Ahmedabad'),
        fc.constant(undefined)
      );

      const enterpriseTypeArb = fc.oneof(
        fc.constant('poultry'),
        fc.constant('fisheries'),
        fc.constant('dairy'),
        fc.constant('apiculture'),
        fc.constant('mushroom'),
        fc.constant(undefined)
      );

      const farmerProfileArb = fc.record({
        state: stateArb,
        district: districtArb,
        enterprise_type: enterpriseTypeArb,
      });

      const schemeArb = fc.record({
        id: fc.option(fc.string(), { nil: undefined }),
        name: fc.string({ minLength: 1 }),
        description: fc.option(fc.string(), { nil: undefined }),
        eligibility: fc.option(fc.string(), { nil: undefined }),
        benefits: fc.option(fc.string(), { nil: undefined }),
        required_documents: fc.option(fc.array(fc.string()), { nil: undefined }),
        application_process: fc.option(fc.string(), { nil: undefined }),
        official_link: fc.option(fc.string(), { nil: undefined }),
        source_url: fc.option(fc.string(), { nil: undefined }),
        applicable_states: fc.option(
          fc.array(
            fc.oneof(
              fc.constant('Maharashtra'),
              fc.constant('Kerala'),
              fc.constant('Gujarat'),
              fc.constant('Punjab'),
              fc.constant('Tamil Nadu')
            ),
            { minLength: 0, maxLength: 5 }
          ),
          { nil: undefined }
        ),
        applicable_enterprise_types: fc.option(
          fc.array(
            fc.oneof(
              fc.constant('poultry'),
              fc.constant('fisheries'),
              fc.constant('dairy'),
              fc.constant('apiculture'),
              fc.constant('mushroom')
            ),
            { minLength: 0, maxLength: 5 }
          ),
          { nil: undefined }
        ),
        applicable_districts: fc.option(
          fc.array(
            fc.oneof(
              fc.constant('Pune'),
              fc.constant('Mumbai'),
              fc.constant('Ernakulam'),
              fc.constant('Ahmedabad')
            ),
            { minLength: 0, maxLength: 4 }
          ),
          { nil: undefined }
        ),
        last_fetched: fc.option(fc.string(), { nil: undefined }),
      });

      const schemesArb = fc.array(schemeArb, { minLength: 0, maxLength: 20 });

      fc.assert(
        fc.property(schemesArb, farmerProfileArb, (schemes, profile) => {
          // Call rankSchemes multiple times with identical inputs
          const result1 = rankSchemes(schemes, profile);
          const result2 = rankSchemes(schemes, profile);
          const result3 = rankSchemes(schemes, profile);

          // All results should be identical in length
          expect(result1.length).toBe(result2.length);
          expect(result2.length).toBe(result3.length);

          // All results should have identical ordering and scores
          for (let i = 0; i < result1.length; i++) {
            // Same name
            expect(result1[i].name).toBe(result2[i].name);
            expect(result2[i].name).toBe(result3[i].name);

            // Same score
            expect(result1[i].score).toBe(result2[i].score);
            expect(result2[i].score).toBe(result3[i].score);

            // Same recommended flag
            expect(result1[i].recommended).toBe(result2[i].recommended);
            expect(result2[i].recommended).toBe(result3[i].recommended);

            // Same id (if present)
            expect(result1[i].id).toBe(result2[i].id);
            expect(result2[i].id).toBe(result3[i].id);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});
