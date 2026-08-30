/**
 * Scheme ranking and filtering utilities
 * 
 * Pure function that ranks schemes based on farmer profile matching.
 * Validates: Requirements 7.3
 */

export interface Scheme {
  id?: string;
  name: string;
  description?: string;
  eligibility?: string;
  benefits?: string;
  required_documents?: string[];
  application_process?: string;
  official_link?: string;
  source_url?: string;
  applicable_states?: string[];
  applicable_enterprise_types?: string[];
  applicable_districts?: string[];
  last_fetched?: string;
}

export interface FarmerProfile {
  state?: string;
  district?: string;
  enterprise_type?: string;
}

export interface RankedScheme extends Scheme {
  score: number;
  recommended: boolean;
}

/**
 * Scoring weights for scheme matching
 */
const SCORING_WEIGHTS = {
  STATE_MATCH: 10,
  ENTERPRISE_TYPE_MATCH: 15,
  DISTRICT_MATCH: 5,
};

/**
 * Threshold for marking a scheme as "Recommended"
 */
const RECOMMENDATION_THRESHOLD = 15;

/**
 * Ranks schemes based on farmer profile matching.
 * 
 * Awards points for:
 * - State match: 10 points
 * - Enterprise type match: 15 points
 * - District match: 5 points
 * 
 * Returns schemes sorted by descending score.
 * Schemes with score >= 15 are marked as "Recommended".
 * 
 * This function is deterministic: same inputs always produce the same output.
 * 
 * @param schemes - Array of scheme records from the database
 * @param farmerProfile - Farmer profile containing state, district, and enterprise_type
 * @returns Array of ranked schemes sorted by descending score
 */
export function rankSchemes(
  schemes: Scheme[],
  farmerProfile: FarmerProfile
): RankedScheme[] {
  // Handle edge cases
  if (!schemes || schemes.length === 0) {
    return [];
  }

  const { state, district, enterprise_type } = farmerProfile;

  // Normalize inputs for case-insensitive matching
  const normalizedState = state?.toLowerCase().trim();
  const normalizedDistrict = district?.toLowerCase().trim();
  const normalizedEnterpriseType = enterprise_type?.toLowerCase().trim();

  // Score each scheme
  const scoredSchemes: RankedScheme[] = schemes.map((scheme) => {
    let score = 0;

    // State match
    if (normalizedState && scheme.applicable_states) {
      const hasStateMatch = scheme.applicable_states.some(
        (s) => s.toLowerCase().trim() === normalizedState
      );
      if (hasStateMatch) {
        score += SCORING_WEIGHTS.STATE_MATCH;
      }
    }

    // Enterprise type match
    if (normalizedEnterpriseType && scheme.applicable_enterprise_types) {
      const hasEnterpriseMatch = scheme.applicable_enterprise_types.some(
        (et) => et.toLowerCase().trim() === normalizedEnterpriseType
      );
      if (hasEnterpriseMatch) {
        score += SCORING_WEIGHTS.ENTERPRISE_TYPE_MATCH;
      }
    }

    // District match
    if (normalizedDistrict && scheme.applicable_districts) {
      const hasDistrictMatch = scheme.applicable_districts.some(
        (d) => d.toLowerCase().trim() === normalizedDistrict
      );
      if (hasDistrictMatch) {
        score += SCORING_WEIGHTS.DISTRICT_MATCH;
      }
    }

    return {
      ...scheme,
      score,
      recommended: score >= RECOMMENDATION_THRESHOLD,
    };
  });

  // Sort by score descending, then by name ascending for deterministic ordering
  // When scores are equal, sorting by name ensures consistent ordering
  scoredSchemes.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Secondary sort by name for deterministic ordering when scores are equal
    return a.name.localeCompare(b.name);
  });

  return scoredSchemes;
}
