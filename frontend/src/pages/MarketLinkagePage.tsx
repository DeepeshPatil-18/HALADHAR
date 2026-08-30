import { useState, useEffect } from 'react';
import { GovHeader } from '../components/GovHeader';
import LoadingSpinner from '../components/LoadingSpinner';

// Kopergaon location context
const LOCATION = {
  name: 'Kopergaon',
  district: 'Ahmednagar',
  state: 'Maharashtra',
  lat: 19.8826,
  lon: 74.4764
};

// Image mapping for different place types/categories
const getPlaceImage = (name: string, _type: string, keywords: string[], index: number = 0): string => {
  const nameLower = name.toLowerCase();
  const keywordsStr = keywords.join(' ').toLowerCase();
  
  // Use place name hash for variety within same category
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageVariant = (nameHash + index) % 3; // 3 variants per category
  
  // Dairy/Milk - 3 variants
  if (nameLower.includes('milk') || nameLower.includes('dairy') || nameLower.includes('dudh') || keywordsStr.includes('rtsmbt')) {
    const milkImages = [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&h=500&fit=crop', // Milk bottles
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=500&fit=crop', // Dairy farm
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=500&fit=crop'  // Milk collection
    ];
    return milkImages[imageVariant];
  }
  
  // Vegetable Market - 3 variants
  if (nameLower.includes('vegetable') || nameLower.includes('bhaji') || nameLower.includes('sabzi') || keywordsStr.includes('mktman')) {
    const vegImages = [
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop', // Colorful vegetables
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop', // Market stall
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&h=500&fit=crop'  // Fresh produce
    ];
    return vegImages[imageVariant];
  }
  
  // Fruit Market - 3 variants
  if (nameLower.includes('fruit') || nameLower.includes('phal')) {
    const fruitImages = [
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&h=500&fit=crop', // Fruit display
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=500&fit=crop', // Fruit market
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&h=500&fit=crop'  // Fresh fruits
    ];
    return fruitImages[imageVariant];
  }
  
  // Fish Market - 3 variants
  if (nameLower.includes('fish') || nameLower.includes('machli')) {
    const fishImages = [
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800&h=500&fit=crop', // Fish market
      'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&h=500&fit=crop', // Fresh fish
      'https://images.unsplash.com/photo-1580959375944-b9c8f7a58e10?w=800&h=500&fit=crop'  // Seafood
    ];
    return fishImages[imageVariant];
  }
  
  // Poultry/Chicken - 3 variants
  if (nameLower.includes('poultry') || nameLower.includes('chicken') || nameLower.includes('murgi') || nameLower.includes('egg')) {
    const poultryImages = [
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=500&fit=crop', // Eggs
      'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800&h=500&fit=crop', // Chickens
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&h=500&fit=crop'  // Poultry farm
    ];
    return poultryImages[imageVariant];
  }
  
  // General Market/Mandi - 3 variants
  if (nameLower.includes('market') || nameLower.includes('mandi') || nameLower.includes('bazar')) {
    const marketImages = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop', // Indian market
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=500&fit=crop', // Market scene
      'https://images.unsplash.com/photo-1582650228939-91b1686f7f90?w=800&h=500&fit=crop'  // Local market
    ];
    return marketImages[imageVariant];
  }
  
  // Default: Agricultural scenes - 3 variants
  const defaultImages = [
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=500&fit=crop', // Farm
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop', // Agriculture
    'https://images.unsplash.com/photo-1595855759920-86a011b6a394?w=800&h=500&fit=crop'  // Crops
  ];
  return defaultImages[imageVariant];
};

// Popular products in Kopargaon/Maharashtra with emojis
const POPULAR_PRODUCTS = [
  { name: 'Onion', emoji: '🧅', label: 'प्याज' },
  { name: 'Tomato', emoji: '🍅', label: 'टमाटर' },
  { name: 'Wheat', emoji: '🌾', label: 'गेहूं' },
  { name: 'Milk', emoji: '🥛', label: 'दूध' },
  { name: 'Sugarcane', emoji: '🍬', label: 'ऊख' },
  { name: 'Cotton', emoji: '🌿', label: 'कपास' },
  { name: 'Potato', emoji: '🥔', label: 'आलू' },
  { name: 'Vegetables', emoji: '🥬', label: 'सब्जी' },
  { name: 'Fruits', emoji: '🍎', label: 'फल' },
  { name: 'Eggs', emoji: '🥚', label: 'अंडे' },
  { name: 'Poultry', emoji: '🐔', label: 'मुर्गी' }
];

interface SellingPoint {
  name: string;
  type: string;
  address: string;
  distance: string;
  distance_meters: number;
  contact?: string;
  email?: string;
  place_id: string;
  source: string;
  keywords?: string[];
}

export default function MarketLinkagePage() {
  const [productQuery, setProductQuery] = useState('');
  const [searchedProduct, setSearchedProduct] = useState('');
  const [sellingPoints, setSellingPoints] = useState<SellingPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load default nearby places on mount
  useEffect(() => {
    loadDefaultPlaces();
  }, []);

  // Load default general selling points (markets, etc.)
  const loadDefaultPlaces = async () => {
    setLoading(true);
    setError(null);
    setSearchedProduct('');

    try {
      // Search for general markets/selling points
      const params = new URLSearchParams({
        product: 'Vegetables', // Default to vegetables as it gives good variety
        location: LOCATION.name,
        radius: '5000'
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/nearby-selling-points?${params}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.selling_points && data.selling_points.length > 0) {
        setSellingPoints(data.selling_points);
        setError(null);
      } else {
        setSellingPoints([]);
      }
      
    } catch (err: any) {
      console.error('Load error:', err);
      setError('कुछ गलत हुआ। कृपया फिर से प्रयास करें।');
      setSellingPoints([]);
    } finally {
      setLoading(false);
    }
  };

  // Search for nearby selling points
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!productQuery.trim()) return;

    console.log('Searching for:', productQuery);
    setLoading(true);
    setError(null);
    setSearchedProduct(productQuery);

    try {
      const params = new URLSearchParams({
        product: productQuery,
        location: LOCATION.name,
        radius: '5000'
      });

      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/nearby-selling-points?${params}`;
      console.log('Fetching:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.selling_points && data.selling_points.length > 0) {
        setSellingPoints(data.selling_points);
        setError(null);
      } else {
        setSellingPoints([]);
        setError(`"${productQuery}" के लिए कोई जगह नहीं मिली। कोई और product try करें।`);
      }
      
    } catch (err: any) {
      console.error('Search error:', err);
      setError('कुछ गलत हुआ। कृपया फिर से प्रयास करें।');
      setSellingPoints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (product: string) => {
    console.log('Quick search for:', product);
    setProductQuery(product);
    setSearchedProduct(product);
    setLoading(true);
    setError(null);
    
    // Trigger search after state updates
    setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          product: product,
          location: LOCATION.name,
          radius: '5000'
        });

        const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/nearby-selling-points?${params}`;
        console.log('Quick search fetching:', url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Quick search response:', data);
        
        if (data.selling_points && data.selling_points.length > 0) {
          setSellingPoints(data.selling_points);
          setError(null);
        } else {
          setSellingPoints([]);
          setError(`"${product}" के लिए कोई जगह नहीं मिली। कोई और product try करें।`);
        }
        
      } catch (err: any) {
        console.error('Search error:', err);
        setError('कुछ गलत हुआ। कृपया फिर से प्रयास करें।');
        setSellingPoints([]);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const handleReset = () => {
    setProductQuery('');
    setSearchedProduct('');
    loadDefaultPlaces();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <GovHeader />
      
      <main className="flex-1 content-with-nav">
        {/* Header Section */}
        <div className="bg-white border-b-4 border-[#0b5e2c]">
          <div className="max-w-[420px] mx-auto px-4 py-5">
            <h1 className="text-[24px] font-bold text-[#0b5e2c] mb-2">
              🏪 मुझे बेचना है
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
              अपना product search करें और आस-पास कहां बेच सकते हैं, देखें।
            </p>

            {/* Search Input - Always visible with better alignment */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Product खोजें... (जैसे: प्याज, दूध, अंडे)"
                  className="w-full px-4 py-3.5 pr-16 border-2 border-gray-300 rounded-xl 
                            focus:outline-none focus:border-[#0b5e2c] text-[15px]
                            placeholder:text-gray-400 transition-colors"
                  style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                />
                <button
                  type="submit"
                  disabled={!productQuery.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 
                            w-12 h-12 bg-[#0b5e2c] text-white rounded-lg text-[20px]
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:bg-[#094d24] transition-colors 
                            flex items-center justify-center"
                >
                  🔍
                </button>
              </div>
            </form>

            {/* Popular Products */}
            <div>
              <div className="text-[13px] text-gray-600 font-semibold mb-2.5"
                   style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                लोकप्रिय उत्पाद:
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_PRODUCTS.map((product) => (
                  <button
                    key={product.name}
                    onClick={() => handleQuickSearch(product.name)}
                    disabled={loading}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-[#0b5e2c] hover:text-white
                              text-[13px] rounded-full transition-colors border border-gray-200
                              disabled:opacity-50 disabled:cursor-not-allowed
                              flex items-center gap-1.5 font-medium"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                  >
                    <span>{product.emoji}</span>
                    <span>{product.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-[420px] mx-auto px-4 py-4">

          
          {/* Section Header */}
          {!loading && sellingPoints.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">
                📍 नजदीकी बिक्री स्थल
              </h2>
              <p className="text-[13px] text-gray-600">
                {LOCATION.name} के आस-पास {sellingPoints.length} जगह मिली
                {searchedProduct && ` (${searchedProduct})`}
              </p>
              {searchedProduct && (
                <button
                  onClick={handleReset}
                  className="mt-2 text-[13px] text-[#0b5e2c] font-semibold hover:underline"
                >
                  ← सभी जगह देखें
                </button>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <LoadingSpinner message={searchedProduct ? `${searchedProduct} के लिए जगह ढूंढ रहे हैं...` : 'जगह ढूंढ रहे हैं...'} />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-[20px]">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-900 text-[14px] font-semibold">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* FEED: Nearby Selling Points - YouTube/Visual Style */}
          {!loading && sellingPoints.length > 0 && (
            <div className="space-y-5 mb-6">
              {sellingPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-md overflow-hidden
                            hover:shadow-xl transition-all duration-300"
                >
                  {/* Large Image Thumbnail */}
                  <div className="relative w-full h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={getPlaceImage(point.name, point.type, point.keywords || [], idx)}
                      alt={point.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback: show gradient background
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Distance Badge Overlay - Top Right */}
                    <div className="absolute top-3 right-3 bg-[#0b5e2c] text-white px-3 py-1.5 rounded-full
                                  text-[14px] font-bold shadow-lg backdrop-blur-sm">
                      {point.distance} दूर
                    </div>
                  </div>

                  {/* Content Below Image */}
                  <div className="p-4">
                    {/* Place Name and Distance */}
                    <div className="mb-3">
                      <h3 className="text-[17px] font-bold text-gray-900 mb-1 flex items-start gap-2 leading-tight">
                        <span className="text-[20px] flex-shrink-0 mt-0.5">📍</span>
                        <span className="flex-1">{point.name}</span>
                      </h3>
                    </div>

                    {/* Address */}
                    <p className="text-[13px] text-gray-600 mb-3 leading-relaxed">
                      {point.address}
                    </p>

                    {/* Metadata Row */}
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                      {/* Type Badge */}
                      {point.type && (
                        <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 
                                       rounded-md text-[11px] font-semibold border border-green-200">
                          {point.type}
                        </span>
                      )}
                      
                      {/* Contact if available */}
                      {point.contact && (
                        <span className="text-[12px] text-gray-600 flex items-center gap-1">
                          <span>📞</span>
                          <span>{point.contact}</span>
                        </span>
                      )}
                    </div>

                    {/* Directions Button - Full Width */}
                    <a
                      href={`https://maps.mappls.com/direction?destination=${point.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#0b5e2c] text-white rounded-lg text-[15px] font-bold
                                hover:bg-[#094d24] active:bg-[#083d1f] transition-colors 
                                flex items-center justify-center gap-2 shadow-sm no-underline"
                    >
                      <span className="text-[18px]">📍</span>
                      <span>दिशा-निर्देश</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State - No Results */}
          {!loading && sellingPoints.length === 0 && !error && (
            <div className="bg-white rounded-lg p-8 text-center mb-6 shadow-sm">
              <div className="text-[48px] mb-3">📍</div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-2">
                कोई नजदीकी जगह नहीं मिली
              </h3>
              {searchedProduct && (
                <p className="text-[14px] text-gray-600 mb-4">
                  "{searchedProduct}" के लिए {LOCATION.name} के आस-पास कोई जगह नहीं मिली।
                </p>
              )}
              <p className="text-[13px] text-gray-500 mb-4">
                कोई और product search करके देखें।
              </p>
              <button
                onClick={() => setProductQuery('')}
                className="px-6 py-2 bg-[#0b5e2c] text-white rounded-lg text-[14px] font-semibold
                          hover:bg-[#094d24] transition-colors"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                🔍 नया search करें
              </button>
            </div>
          )}

          {/* How Else Can You Sell Section */}
          {!loading && (
            <div className="mb-4">
              <h2 className="text-[18px] font-bold text-gray-900 mb-3">
                और कैसे बेच सकते हैं?
              </h2>
              
              <div className="space-y-3">
                
                {/* Option 1: Government */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-[40px]">🏛️</div>
                    <div className="flex-1">
                      <h3 className="text-[17px] font-bold text-gray-900 mb-1">
                        सरकार को बेचें
                      </h3>
                      <p className="text-[13px] text-gray-700 leading-relaxed">
                        किसानों के लिए सरकारी खरीद के अवसर देखें।
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://enam.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-blue-600 text-white rounded-lg text-[15px] font-bold
                              text-center hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    सरकारी बिक्री देखें
                  </a>
                  <div className="mt-2 text-center text-[11px] text-gray-600">
                    e-NAM Portal
                  </div>
                </div>

                {/* Option 2: Organizations - Coming Soon */}
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 opacity-75">
                  <div className="flex items-start gap-3">
                    <div className="text-[40px] grayscale">🏢</div>
                    <div className="flex-1">
                      <h3 className="text-[17px] font-bold text-gray-700 mb-1">
                        संस्थाओं को बेचें
                      </h3>
                      <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                        सीधे organizations और buyers से जुड़ें।
                      </p>
                      <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[12px] font-semibold">
                        🚧 जल्द आ रहा है
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Info Footer */}
          <div className="text-center text-[11px] text-gray-500 py-4">
            <div>📍 Location: {LOCATION.name}, {LOCATION.state}</div>
            <div className="mt-1">Powered by Mappls</div>
          </div>

        </div>
      </main>
    </div>
  );
}
