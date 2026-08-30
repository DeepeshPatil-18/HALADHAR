import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GovHeader } from '../components/GovHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../i18n/useTranslation';

// Kopergaon location
const LOCATION = {
  name: 'Kopergaon',
  district: 'Ahmednagar',
  state: 'Maharashtra'
};

// Popular crops in the region - choosing ones with more data availability
const POPULAR_CROPS = ['Onion', 'Tomato', 'Potato', 'Cotton'];

// More crops for search
const ALL_CROPS = [
  'Onion', 'Tomato', 'Potato', 'Cotton', 'Sugarcane', 'Wheat', 'Rice',
  'Bajra', 'Jowar', 'Groundnut', 'Soyabean', 'Chilli', 'Turmeric',
  'Coriander', 'Garlic', 'Ginger', 'Cabbage', 'Cauliflower'
];

interface MandiPrice {
  commodity: string;
  state: string;
  district: string;
  market: string;
  variety: string;
  grade: string;
  price_per_quintal: number;
  min_price: number;
  max_price: number;
  date: string;
  fetched_at: string;
  source: string;
  // Farmer.in API additions
  trend?: 'up' | 'down' | 'same';
  change?: number;
  unit?: string;
  msp?: number | null;
  season?: string;
  major_states?: string[];
  markets_count?: number;
}

export function WhatsAroundMePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch popular crop prices for Kopergaon
  useEffect(() => {
    fetchAllPrices();
  }, []);

  const fetchAllPrices = async () => {
    setLoading(true);
    setError(null);
    setIsSearching(false);
    
    try {
      // Fetch all crops in parallel for better performance
      const fetchPromises = POPULAR_CROPS.map(async (crop) => {
        try {
          const params = new URLSearchParams({
            commodity: crop,
            state: LOCATION.state,
          });

          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/mandi-price?${params}`
          );

          if (response.ok) {
            const data = await response.json();
            // Return prices if available
            if (data.prices && data.prices.length > 0 && data.availability === 'available') {
              return data.prices[0]; // Take first price record per crop
            }
          }
          return null;
        } catch (err) {
          console.error(`Error fetching ${crop}:`, err);
          return null;
        }
      });

      // Wait for all requests to complete
      const results = await Promise.all(fetchPromises);
      
      // Filter out null results and set prices
      const validPrices = results.filter(p => p !== null);
      setPrices(validPrices);
      
      if (validPrices.length === 0) {
        setError(t('mandi.noResults'));
      }
    } catch (err: any) {
      setError(t('mandi.loading'));
      console.error('Price fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchCrop = async (cropName: string) => {
    if (!cropName.trim()) return;
    
    setIsSearching(true);
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        commodity: cropName,
        state: LOCATION.state,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/mandi-price?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        
        // Check if data is available
        if (data.availability === 'not_available' || data.availability === 'not_available_in_state') {
          // Show helpful message
          setError(data.message || t('mandi.noResults'));
          setPrices([]);
        } else if (data.prices && data.prices.length > 0) {
          // Farmer.in provides state-level aggregated prices
          setPrices(data.prices);
        } else {
          setError(t('mandi.unavailable'));
          setPrices([]);
        }
      } else {
        setError(t('mandi.unavailable'));
        setPrices([]);
      }
    } catch (err: any) {
      setError(t('error.networkError'));
      console.error('Search error:', err);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchCrop(searchQuery);
    }
  };

  const handleQuickSearch = (crop: string) => {
    setSearchQuery(crop);
    searchCrop(crop);
  };

  const handleBackToFeed = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchAllPrices();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return { icon: '↑', color: 'text-green-600', bg: 'bg-green-50', label: t('mandi.latestUpdates') };
      case 'down':
        return { icon: '↓', color: 'text-red-600', bg: 'bg-red-50', label: t('error.dataUnavailable') };
      case 'same':
        return { icon: '→', color: 'text-gray-600', bg: 'bg-gray-50', label: 'Stable' };
      default:
        return null;
    }
  };

  const formatChange = (change?: number) => {
    if (change === undefined || change === null || change === 0) return null;
    const sign = change > 0 ? '+' : '';
    return `${sign}₹${Math.abs(change).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <GovHeader />
      
      <main className="flex-1 content-with-nav">
        {/* Header Section */}
        <div className="bg-white border-b-4 border-[#0b5e2c]">
          <div className="max-w-[420px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-[22px] font-bold text-[#0b5e2c]">
                📍 {t('home.whatsAroundMe')}
              </h1>
              <div className="text-right">
                <div className="text-[13px] font-semibold text-gray-900">{LOCATION.name}</div>
                <div className="text-[11px] text-gray-600">{LOCATION.district}, {LOCATION.state}</div>
              </div>
            </div>
            <div className="text-[13px] text-gray-600">
              {t('mandi.todayRates')}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-[420px] mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="bg-white rounded-lg p-3 mb-4 shadow-sm border border-gray-200">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('mandi.searchPlaceholder')}
                  className="w-full px-4 py-3 pr-24 border-2 border-gray-200 rounded-lg 
                            focus:outline-none focus:border-[#0b5e2c] text-[14px]"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 
                            px-4 py-2 bg-[#0b5e2c] text-white rounded-lg text-[13px] font-semibold
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:bg-[#094d24] transition-colors"
                >
                  {t('mandi.search')}
                </button>
              </div>
            </form>

            {/* Quick Search Buttons */}
            <div className="flex flex-wrap gap-2">
              {ALL_CROPS.slice(0, 8).map((crop) => (
                <button
                  key={crop}
                  onClick={() => handleQuickSearch(crop)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-[#0b5e2c] hover:text-white
                            text-[12px] rounded-full transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {crop}
                </button>
              ))}
            </div>

            {/* Back to Feed Button (when searching) */}
            {isSearching && (
              <button
                onClick={handleBackToFeed}
                className="mt-3 w-full py-2 text-[13px] text-[#0b5e2c] font-semibold
                          border-2 border-[#0b5e2c] rounded-lg hover:bg-green-50 transition-colors"
              >
                ← {t('mandi.backToFeed')}
              </button>
            )}
          </div>

          {/* Allied Farming Bazar Card */}
          <div 
            onClick={() => navigate('/around/allied-bazar')}
            className="bg-gradient-to-br from-[#0b5e2c] to-[#094d24] rounded-lg p-4 mb-4 
                      shadow-md border-2 border-[#0b5e2c] cursor-pointer
                      hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-[48px]">🏪</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-[16px] mb-1">
                  {t('allied.title')}
                </h3>
                <p className="text-white/90 text-[12px] leading-relaxed">
                  {t('allied.subtitle')}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-white/80">
                  <span>🥚 Eggs</span>
                  <span>•</span>
                  <span>🐔 Poultry</span>
                  <span>•</span>
                  <span>🐟 Fish</span>
                  <span>•</span>
                  <span>🥛 Dairy</span>
                </div>
              </div>
              <div className="text-white text-[24px]">→</div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-lg p-8">
              <LoadingSpinner message={isSearching ? t('mandi.searching') : t('mandi.loading')} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-[20px]">ℹ️</span>
                <div className="flex-1">
                  <p className="text-amber-900 text-[14px] font-semibold mb-1">{error}</p>
                  <button
                    onClick={isSearching ? handleBackToFeed : fetchAllPrices}
                    className="mt-3 text-[13px] text-amber-900 font-semibold underline hover:text-amber-950"
                  >
                    {isSearching ? '← ' + t('mandi.backToFeed') : t('general.refresh')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* News Feed - Price Cards */}
          {!loading && prices.length > 0 && (
            <div className="space-y-4">
              {/* Live Badge */}
              <div className="flex items-center justify-between">
                <div className="text-[13px] text-gray-600 font-medium">
                  {isSearching 
                    ? t('mandi.searching') 
                    : t('mandi.latestUpdates')}
                </div>
                <div className="flex items-center gap-1 text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </div>
              </div>

              {/* Price Feed Cards */}
              {prices.map((price, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200
                            hover:shadow-md transition-shadow"
                >
                  {/* Card Image Header - Using placeholder farmer image */}
                  <div 
                    className="h-[120px] bg-gradient-to-br from-green-600 to-green-800 
                              flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    
                    {/* Content on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-white font-bold text-[18px] mb-1 drop-shadow-lg">
                            {price.commodity}
                            {price.variety && price.variety !== 'Other' && (
                              <span className="text-[13px] font-normal ml-2 opacity-90">
                                ({price.variety})
                              </span>
                            )}
                          </h3>
                          <div className="text-white/90 text-[12px] drop-shadow">
                            📍 {price.state || LOCATION.state}
                            {price.major_states && price.major_states.length > 0 && (
                              <span className="text-[10px] opacity-75 ml-1">
                                • {price.markets_count}+ markets
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-white/80 text-[11px] bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                          {formatDate(price.date)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Main Price with Trend */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[11px] text-gray-500 uppercase tracking-wide">
                          {t('mandi.todayRates')}
                        </div>
                        {/* Trend Indicator */}
                        {getTrendIcon(price.trend) && (
                          <div 
                            className={`flex items-center gap-1 px-2 py-1 rounded-full ${getTrendIcon(price.trend)!.bg}`}
                          >
                            <span className={`text-[16px] font-bold ${getTrendIcon(price.trend)!.color}`}>
                              {getTrendIcon(price.trend)!.icon}
                            </span>
                            <span className={`text-[11px] font-semibold ${getTrendIcon(price.trend)!.color}`}>
                              {getTrendIcon(price.trend)!.label}
                            </span>
                            {formatChange(price.change) && (
                              <span className={`text-[10px] font-medium ${getTrendIcon(price.trend)!.color}`}>
                                ({formatChange(price.change)})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[32px] font-bold text-[#0b5e2c] leading-none">
                          ₹{price.price_per_quintal.toLocaleString()}
                        </span>
                        <span className="text-[14px] text-gray-600">{t('mandi.perQuintal')}</span>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                        <div className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">
                          {t('mandi.minPrice')}
                        </div>
                        <div className="text-[18px] font-bold text-red-700">
                          ₹{price.min_price.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                        <div className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">
                          {t('mandi.maxPrice')}
                        </div>
                        <div className="text-[18px] font-bold text-green-700">
                          ₹{price.max_price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t">
                      <div>
                        {price.season && (
                          <span className="text-gray-700 font-medium">{price.season.split('(')[0].trim()}</span>
                        )}
                      </div>
                      <div>
                        {price.state || LOCATION.state}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Source Attribution */}
              <div className="text-center text-[11px] text-gray-500 py-4">
                <div>📊 {t('market.dataSource')}: AGMARKNET</div>
                <div className="mt-1">{t('market.poweredBy')}</div>
              </div>
            </div>
          )}

          {/* No Data */}
          {!loading && prices.length === 0 && !error && (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-gray-400 text-[48px] mb-3">🌾</div>
              <p className="text-gray-600 text-[14px] mb-2">
                {t('mandi.unavailable')}
              </p>
              <p className="text-gray-500 text-[12px]">
                for {LOCATION.name} right now
              </p>
              <button
                onClick={fetchAllPrices}
                className="mt-4 px-4 py-2 bg-[#0b5e2c] text-white rounded-lg text-[13px] font-semibold"
              >
                {t('general.refresh')}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
