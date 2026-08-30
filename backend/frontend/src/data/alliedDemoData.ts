/**
 * EXPERIMENTAL DATA FOR ALLIED FARMING BAZAR UI
 * 
 * IMPORTANT: This section is currently experimental.
 * For actual allied market information, refer to e-NAM website: https://enam.gov.in
 * 
 * This data will be replaced by actual API integration when
 * reliable Allied commodity data sources become available.
 */

export interface AlliedProduct {
  id: string;
  name: string;
  category: 'egg' | 'poultry' | 'fish' | 'meat' | 'milk' | 'beekeeping';
  price: number;
  unit: string;
  minPrice?: number;
  maxPrice?: number;
  region: string;
  popularIn: string[]; // Maharashtra, Kopargaon, etc.
  lastUpdated: string;
  icon: string;
  trend?: 'up' | 'down' | 'same';
  change?: number;
  description?: string;
}

/**
 * EXPERIMENTAL Allied Products for Maharashtra/Kopargaon region
 * 
 * Priority order based on regional relevance:
 * 1. Dairy/Milk (most important in Kopargaon/Ahmednagar)
 * 2. Poultry/Eggs
 * 3. Goat farming
 * 4. Fish farming
 * 5. Beekeeping
 */
export const DEMO_ALLIED_PRODUCTS: AlliedProduct[] = [
  // DAIRY / MILK (Top priority for Kopargaon)
  {
    id: 'milk-buffalo',
    name: 'Buffalo Milk',
    category: 'milk',
    price: 65,
    unit: 'litre',
    minPrice: 60,
    maxPrice: 70,
    region: 'Maharashtra',
    popularIn: ['Maharashtra', 'Kopargaon'],
    lastUpdated: new Date().toISOString(),
    icon: '🥛',
    trend: 'up',
    change: 2,
    description: 'Fresh buffalo milk - popular in dairy belt'
  },
  {
    id: 'milk-cow',
    name: 'Cow Milk',
    category: 'milk',
    price: 55,
    unit: 'litre',
    minPrice: 50,
    maxPrice: 60,
    region: 'Maharashtra',
    popularIn: ['Maharashtra', 'Kopargaon'],
    lastUpdated: new Date().toISOString(),
    icon: '🥛',
    trend: 'same',
    description: 'Fresh cow milk - dairy farming'
  },
  
  // EGGS (Popular across Maharashtra)
  {
    id: 'egg-layer',
    name: 'Farm Fresh Eggs',
    category: 'egg',
    price: 6,
    unit: 'piece',
    minPrice: 5,
    maxPrice: 7,
    region: 'Maharashtra',
    popularIn: ['Maharashtra', 'Kopargaon'],
    lastUpdated: new Date().toISOString(),
    icon: '🥚',
    trend: 'down',
    change: -0.5,
    description: 'Layer eggs - poultry farming'
  },
  {
    id: 'egg-tray',
    name: 'Egg Tray (30 pieces)',
    category: 'egg',
    price: 180,
    unit: 'tray',
    minPrice: 150,
    maxPrice: 210,
    region: 'Maharashtra',
    popularIn: ['Maharashtra'],
    lastUpdated: new Date().toISOString(),
    icon: '🥚',
    trend: 'down',
    change: -15,
    description: 'Wholesale egg tray'
  },
  
  // POULTRY (Common in region)
  {
    id: 'chicken-broiler',
    name: 'Broiler Chicken',
    category: 'poultry',
    price: 220,
    unit: 'kg',
    minPrice: 200,
    maxPrice: 240,
    region: 'Maharashtra',
    popularIn: ['Maharashtra', 'Kopargaon'],
    lastUpdated: new Date().toISOString(),
    icon: '🐔',
    trend: 'same',
    description: 'Live broiler chicken - poultry farming'
  },
  {
    id: 'chicken-live',
    name: 'Desi Chicken',
    category: 'poultry',
    price: 380,
    unit: 'kg',
    minPrice: 350,
    maxPrice: 420,
    region: 'Maharashtra',
    popularIn: ['Maharashtra'],
    lastUpdated: new Date().toISOString(),
    icon: '🐔',
    trend: 'up',
    change: 20,
    description: 'Country chicken - free range'
  },
  
  // GOAT FARMING (Regional importance)
  {
    id: 'goat-live',
    name: 'Live Goat',
    category: 'meat',
    price: 650,
    unit: 'kg',
    minPrice: 600,
    maxPrice: 700,
    region: 'Maharashtra',
    popularIn: ['Maharashtra', 'Kopargaon'],
    lastUpdated: new Date().toISOString(),
    icon: '🐐',
    trend: 'up',
    change: 25,
    description: 'Live goat - goat rearing'
  },
  {
    id: 'mutton',
    name: 'Mutton',
    category: 'meat',
    price: 750,
    unit: 'kg',
    minPrice: 700,
    maxPrice: 800,
    region: 'Maharashtra',
    popularIn: ['Maharashtra'],
    lastUpdated: new Date().toISOString(),
    icon: '🥩',
    trend: 'up',
    change: 30,
    description: 'Fresh mutton - goat meat'
  },
  
  // FISH FARMING
  {
    id: 'fish-rohu',
    name: 'Rohu',
    category: 'fish',
    price: 180,
    unit: 'kg',
    minPrice: 160,
    maxPrice: 200,
    region: 'Maharashtra',
    popularIn: ['Maharashtra'],
    lastUpdated: new Date().toISOString(),
    icon: '🐟',
    trend: 'same',
    description: 'Rohu fish - freshwater aquaculture'
  },
  {
    id: 'fish-katla',
    name: 'Katla',
    category: 'fish',
    price: 200,
    unit: 'kg',
    minPrice: 180,
    maxPrice: 220,
    region: 'Maharashtra',
    popularIn: ['Maharashtra'],
    lastUpdated: new Date().toISOString(),
    icon: '🐟',
    trend: 'same',
    description: 'Katla fish - freshwater farming'
  },
  {
    id: 'fish-catfish',
    name: 'Catfish',
    category: 'fish',
    price: 150,
    unit: 'kg',
    minPrice: 130,
    maxPrice: 170,
    region: 'Maharashtra',
    popularIn: ['Maharashtra'],
    lastUpdated: new Date().toISOString(),
    icon: '🐟',
    trend: 'down',
    change: -10,
    description: 'Catfish - aquaculture'
  },
  
  // BEEKEEPING (Relevant for region)
  {
    id: 'honey',
    name: 'Raw Honey',
    category: 'beekeeping',
    price: 400,
    unit: 'kg',
    minPrice: 350,
    maxPrice: 450,
    region: 'Maharashtra',
    popularIn: ['Maharashtra', 'Kopargaon'],
    lastUpdated: new Date().toISOString(),
    icon: '🍯',
    trend: 'same',
    description: 'Natural honey - beekeeping'
  },
  {
    id: 'beeswax',
    name: 'Beeswax',
    category: 'beekeeping',
    price: 600,
    unit: 'kg',
    minPrice: 550,
    maxPrice: 650,
    region: 'Maharashtra',
    popularIn: ['Maharashtra'],
    lastUpdated: new Date().toISOString(),
    icon: '🐝',
    trend: 'up',
    change: 20,
    description: 'Pure beeswax - apiculture'
  }
];

/**
 * Category metadata for UI
 */
export const ALLIED_CATEGORIES = {
  milk: {
    name: 'Dairy / Milk',
    icon: '🥛',
    color: 'blue',
    description: 'Buffalo & cow milk, dairy farming',
    priority: 1
  },
  egg: {
    name: 'Eggs',
    icon: '🥚',
    color: 'amber',
    description: 'Layer eggs, poultry egg production',
    priority: 2
  },
  poultry: {
    name: 'Poultry',
    icon: '🐔',
    color: 'orange',
    description: 'Broiler, desi chicken farming',
    priority: 3
  },
  meat: {
    name: 'Meat / Goat',
    icon: '🐐',
    color: 'red',
    description: 'Goat rearing, mutton, livestock',
    priority: 4
  },
  fish: {
    name: 'Fish',
    icon: '🐟',
    color: 'cyan',
    description: 'Freshwater aquaculture, fish farming',
    priority: 5
  },
  beekeeping: {
    name: 'Beekeeping',
    icon: '🍯',
    color: 'yellow',
    description: 'Honey, beeswax, apiculture',
    priority: 6
  }
} as const;

/**
 * Quick filter options
 */
export const QUICK_FILTERS = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'maharashtra', label: 'Maharashtra', icon: '📍' },
  { id: 'kopargaon', label: 'Kopargaon', icon: '🏘️' },
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
  { id: 'poultry', label: 'Poultry', icon: '🐔' },
  { id: 'fish', label: 'Fish', icon: '🐟' },
  { id: 'goat', label: 'Goat', icon: '🐐' },
  { id: 'beekeeping', label: 'Honey', icon: '🍯' }
];

/**
 * Helper functions
 */
export function filterProducts(
  products: AlliedProduct[],
  searchQuery: string,
  activeFilter: string
): AlliedProduct[] {
  let filtered = [...products];
  
  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  }
  
  // Apply category/region filter
  if (activeFilter !== 'all') {
    if (activeFilter === 'maharashtra') {
      filtered = filtered.filter(p => p.popularIn.includes('Maharashtra'));
    } else if (activeFilter === 'kopargaon') {
      filtered = filtered.filter(p => p.popularIn.includes('Kopargaon'));
    } else if (activeFilter === 'dairy') {
      filtered = filtered.filter(p => p.category === 'milk');
    } else if (activeFilter === 'goat') {
      filtered = filtered.filter(p => 
        p.category === 'meat' || p.name.toLowerCase().includes('goat')
      );
    } else {
      filtered = filtered.filter(p => p.category === activeFilter);
    }
  }
  
  return filtered;
}

export function getPopularProducts(products: AlliedProduct[]): AlliedProduct[] {
  return products.filter(p => p.popularIn.includes('Kopargaon')).slice(0, 6);
}
