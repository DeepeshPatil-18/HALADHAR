# KrishiMitra Frontend Utilities

This directory contains utility functions and modules used throughout the KrishiMitra frontend application.

## Scheme Ranking (`schemeRanking.ts`)

The `rankSchemes()` function implements the scheme ranking and filtering logic for the frontend.

### Features

- **Pure function**: No side effects, deterministic output
- **Scoring system**: Awards points for profile matches
  - State match: 10 points
  - Enterprise type match: 15 points
  - District match: 5 points
- **Automatic sorting**: Returns schemes sorted by descending score
- **Recommendation flag**: Schemes with score ≥ 15 are marked as "Recommended"
- **Case-insensitive**: Handles variations in case and whitespace
- **Deterministic**: Same inputs always produce the same ordered output

### Usage

```typescript
import { rankSchemes } from './lib/schemeRanking';

const farmerProfile = {
  state: 'Maharashtra',
  district: 'Pune',
  enterprise_type: 'poultry',
};

const rankedSchemes = rankSchemes(allSchemes, farmerProfile);

// Use in your UI
rankedSchemes.forEach(scheme => {
  console.log(`${scheme.name}: Score ${scheme.score}`);
  if (scheme.recommended) {
    console.log('  ⭐ Recommended for you');
  }
});
```

### Testing

Comprehensive unit tests cover:
- Scoring logic for all match types
- Sorting behavior
- Recommendation flag logic
- Edge cases (empty arrays, missing data, case sensitivity)
- Determinism guarantees
- Real-world scenarios

Run tests:
```bash
npm test -- schemeRanking.test.ts
```

### Validation

**Validates: Requirements 7.3**

This implementation satisfies the acceptance criteria:
- "Schemes are filtered and ranked by the farmer's state, district, and enterprise type"
- "High-relevance schemes are tagged 'Recommended for you'"

**Validates: Property 3 (Design Document)**

The function maintains determinism: given the same farmer profile and scheme set, it always returns the same ordered result.
