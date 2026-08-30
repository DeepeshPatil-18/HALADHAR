// ---------------------------------------------------------------------------
// Market Matching Logic
// Requirement 9.4: Pure function for matching produce listings to buyers
// ---------------------------------------------------------------------------

export interface ProduceListing {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  quality_grade: string | null;
  expected_price: number | null;
  available_from: string; // ISO date string
  state: string;
  district: string;
  pickup_delivery?: 'pickup' | 'delivery' | 'both';
}

export interface BuyerRequirement {
  id: string;
  product: string;
  quantity_needed: number;
  unit: string;
  quality_grade: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
  required_by: string; // ISO date string
  state: string;
  district: string;
  contact_method: string | null;
}

/**
 * Matches a produce listing against buyer requirements.
 * 
 * **Validates: Requirements 9.3–9.7**
 * 
 * ALL six criteria must hold for a match:
 * 1. Product names match (case-insensitive)
 * 2. Same state AND district
 * 3. Listing quantity ≥ buyer quantity needed
 * 4. Quality grade matches or exceeds (if specified)
 * 5. Listing price within buyer's price range (if specified)
 * 6. Listing available_from ≤ buyer required_by
 * 
 * @param listing - The produce listing to match
 * @param buyerRequirements - Array of buyer requirement records
 * @returns Array of matching buyer records
 */
export function matchListingToBuyers(
  listing: ProduceListing,
  buyerRequirements: BuyerRequirement[]
): BuyerRequirement[] {
  return buyerRequirements.filter((buyer) => {
    // Criterion 1: Product match (case-insensitive)
    if (listing.product.toLowerCase() !== buyer.product.toLowerCase()) {
      return false;
    }

    // Criterion 2: Same state AND district (case-insensitive)
    if (
      listing.state.toLowerCase() !== buyer.state.toLowerCase() ||
      listing.district.toLowerCase() !== buyer.district.toLowerCase()
    ) {
      return false;
    }

    // Criterion 3: Listing quantity ≥ buyer quantity needed
    if (listing.quantity < buyer.quantity_needed) {
      return false;
    }

    // Criterion 4: Quality grade match
    // If buyer specifies a quality grade, listing must meet or exceed it
    if (buyer.quality_grade && listing.quality_grade) {
      // Simple alphabetic comparison: A > B > C
      // If listing quality is "lower" alphabetically than buyer requirement, reject
      if (listing.quality_grade.toLowerCase() > buyer.quality_grade.toLowerCase()) {
        return false;
      }
    } else if (buyer.quality_grade && !listing.quality_grade) {
      // Buyer requires a quality grade but listing doesn't specify one
      return false;
    }

    // Criterion 5: Price within buyer's range
    if (listing.expected_price !== null) {
      if (buyer.price_range_min !== null && listing.expected_price < buyer.price_range_min) {
        return false;
      }
      if (buyer.price_range_max !== null && listing.expected_price > buyer.price_range_max) {
        return false;
      }
    }

    // Criterion 6: Listing available_from ≤ buyer required_by
    const listingDate = new Date(listing.available_from);
    const buyerDate = new Date(buyer.required_by);
    if (listingDate > buyerDate) {
      return false;
    }

    // All criteria passed
    return true;
  });
}
