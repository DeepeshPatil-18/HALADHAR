/**
 * Example usage of the scheme ranking function
 * 
 * This file demonstrates how to use rankSchemes() in your React components.
 */

import { rankSchemes, type Scheme, type FarmerProfile } from './schemeRanking';

// Example: Fetching schemes from Supabase and ranking them
async function getAndRankSchemes(farmerProfile: FarmerProfile) {
  // 1. Fetch schemes from Supabase (this would be your actual fetch logic)
  const schemes: Scheme[] = [
    {
      id: '1',
      name: 'PM-KISAN Scheme',
      description: 'Direct income support to farmers',
      applicable_states: ['Maharashtra', 'Gujarat', 'Madhya Pradesh'],
      applicable_enterprise_types: ['poultry', 'dairy', 'fisheries'],
      applicable_districts: ['Pune', 'Mumbai'],
      official_link: 'https://pmkisan.gov.in',
    },
    {
      id: '2',
      name: 'National Livestock Mission',
      description: 'Support for livestock farmers',
      applicable_states: ['Maharashtra'],
      applicable_enterprise_types: ['poultry', 'dairy'],
      applicable_districts: ['Pune', 'Nagpur', 'Ahmednagar'],
      official_link: 'https://dahd.nic.in',
    },
  ];

  // 2. Rank the schemes based on farmer profile
  const rankedSchemes = rankSchemes(schemes, farmerProfile);

  // 3. Use the ranked schemes in your UI
  return rankedSchemes;
}

// Example farmer profile
const exampleProfile: FarmerProfile = {
  state: 'Maharashtra',
  district: 'Pune',
  enterprise_type: 'poultry',
};

// Example of calling the function with the example profile
// const rankedSchemes = await getAndRankSchemes(exampleProfile);

// Usage in a React component (pseudocode):
/*
function SchemesPage() {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState<RankedScheme[]>([]);

  useEffect(() => {
    async function loadSchemes() {
      // Get farmer profile from Supabase
      const { data: profile } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch all schemes
      const { data: allSchemes } = await supabase
        .from('schemes')
        .select('*');

      // Rank schemes
      const ranked = rankSchemes(allSchemes, {
        state: profile.state,
        district: profile.district,
        enterprise_type: profile.enterprise_type,
      });

      setSchemes(ranked);
    }

    loadSchemes();
  }, [user]);

  return (
    <div>
      {schemes.map(scheme => (
        <SchemeCard
          key={scheme.id}
          scheme={scheme}
          isRecommended={scheme.recommended}
          score={scheme.score}
        />
      ))}
    </div>
  );
}
*/

// Example: Filtering to show only recommended schemes
function getRecommendedSchemes(
  schemes: Scheme[],
  farmerProfile: FarmerProfile
) {
  const rankedSchemes = rankSchemes(schemes, farmerProfile);
  return rankedSchemes.filter(scheme => scheme.recommended);
}

// Example: Getting top N schemes
function getTopNSchemes(
  schemes: Scheme[],
  farmerProfile: FarmerProfile,
  count: number
) {
  const rankedSchemes = rankSchemes(schemes, farmerProfile);
  return rankedSchemes.slice(0, count);
}

export { getAndRankSchemes, getRecommendedSchemes, getTopNSchemes, exampleProfile };
